<template>
    <div class="header">
        <!-- Menu bar -->
        <div class="header__menu">
            <!-- Logo -->
            <img
                src="@/assets/logo.svg"
                class="header__menu--logo"
            />

            <!-- Menu list -->
            <ul class="header__menu--list">
                <li
                    v-for="item in page.list"
                    :key="item.key"
                    :class="{
                        'list-item': true,
                        'list-item--active': page.active === item.key,
                    }"
                    @click="changePage(item.key)"
                >
                    <img
                        :src="item.icon"
                        :alt="item.name"
                        class="list-item__icon"
                    />
                    <span>{{ item.name }}</span>
                </li>
            </ul>

            <div class="header__menu--dragable-area"></div>

            <!-- Control menu -->
            <ul class="header__events">
                <li
                    class="header__events--item"
                    @click="collapse"
                >
                    <img src="@/assets/frame/collapse.svg" />
                </li>
                <li
                    class="header__events--item"
                    @click="fullscreen"
                >
                    <img src="@/assets/frame/fullscreen.svg" />
                </li>
                <li
                    class="header__events--item"
                    @click="close"
                >
                    <img src="@/assets/frame/close.svg" />
                </li>
            </ul>
        </div>

        <!-- Toolbar -->
        <div class="header__toolbar">
            <!-- Toobar list -->
            <transition name="toolbar__menu">
                <div
                    class="toolbar__menu"
                    v-if="!expandSeachArea"
                >
                    <ul class="toolbar__menu__list">
                        <!-- Live / Stop -->
                        <li
                            class="list__item list__item--live"
                            :class="{
                                'list__item--flickering': isLive,
                            }"
                        >
                            <button
                                @click="starting"
                                class="item__default-content"
                            >
                                <span>Live</span>
                            </button>

                            <button
                                @click="stopping"
                                class="item__hover-content"
                            >
                                <span>Stop</span>
                            </button>
                        </li>

                        <!-- Mode -->
                        <li
                            class="list__item"
                            :class="{'list__item--deactive': !isLive}"
                        >
                            <MenuDropdown :disabled="!isLive">
                                Mode{{ flightMode ? ': ' + flightMode : '' }}
                                <template slot="list">
                                    <li
                                        v-for="mode in mode.list"
                                        :key="mode.key"
                                        @click="changeMode(mode.key)"
                                    >
                                        {{ mode.name }}
                                    </li>
                                </template>
                            </MenuDropdown>
                        </li>

                        <!-- Flight data items -->
                        <FlightData
                            v-if="page.active === 'flightData'"
                            @expandSeachArea="expandSeachArea = true"
                        />

                        <!-- Flight plan items -->
                        <FlightPlan v-if="page.active === 'flightPlan'" />
                    </ul>
                </div>
            </transition>

            <!-- Search bar -->
            <transition name="toolbar__search">
                <ul
                    class="toolbar__search"
                    v-if="expandSeachArea"
                >
                    <li>
                        <span>Date range:&nbsp;&nbsp;&nbsp;</span>
                        <date-range-picker
                            v-model="dateRange"
                            @toggle="isDatePickerToggled = $event"
                            :locale-data="{ firstDay: 1, format: 'DD-MM-YYYY' }"
                            class="custom-date-range-picker"
                            :auto-apply="true"
                            :update="dateRangeUpdated"
                        ></date-range-picker>
                    </li>
                    <li>
                        <button
                            class="confirm"
                            @click="search"
                        >
                            Search
                        </button>
                    </li>
                    <li>
                        <button
                            class="cancel"
                            @click="expandSeachArea = false"
                        >
                            Cancel
                        </button>
                    </li>
                </ul>
            </transition>
        </div>
    </div>
</template>

<script>
// Dependencies
import { remote } from 'electron';
import DateRangePicker from 'vue2-daterange-picker';
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css';
import moment from 'moment/src/moment.js';

// Utils
import API from '@/api';
import { WS_HOST } from '@/core/constants.js';
import { $exit } from '@/core/popup_options.js';
import { swal, toast, loading } from '@/core/popups.js';
import SocketFallback from '@/core/socket_fallback.js';

// Components
import { MenuDropdown } from '@/components';
import FlightData from './FlightData';
import FlightPlan from './FlightPlan';

// Styles
import './style.scss';

export default {
    components: {
        DateRangePicker,
        MenuDropdown,
        FlightData,
        FlightPlan,
    },
    data() {
        return {
            telemetrySocket: new SocketFallback(),
            expandSeachArea: false,
            dateRange: {
                startDate: moment()
                    .seconds(0)
                    .milliseconds(0)
                    .toISOString(),
                endDate: moment()
                    .seconds(0)
                    .milliseconds(0)
                    .toISOString(),
            },
            isDatePickerToggled: false,
            mode: {
                list: [
                    {
                        key: 'GUIDED',
                        name: 'Guided',
                    },
                    {
                        key: 'AUTO',
                        name: 'Auto',
                    },
                    {
                        key: 'STABILIZE',
                        name: 'Stabilize',
                    },
                    {
                        key: 'LAND',
                        name: 'Land',
                    },
                ],
            },
            page: {
                list: [
                    {
                        key: 'flightData',
                        name: 'Flight data',
                        icon: require('../../../assets/icons/compass.svg'),
                    },
                    {
                        key: 'flightPlan',
                        name: 'Flight plan',
                        icon: require('../../../assets/icons/earth.svg'),
                    },
                ],
                active: 'flightData',
            },
        };
    },
    mounted() {
        this.page.active = this.$route.name;
        this.$Bus.$on('telemetry_data', (telemetry) => {
            this.flightMode = telemetry.flight_mode;
        });
    },
    methods: {
        starting() {
            if (this.telemetrySocket.OPEN != null) {
                return toast.fire({
                    type: 'warning',
                    title: 'Socket already connected',
                });
            }

            loading.fire();
            loading.showLoading();

            // Reset initial coordinates of drone
            this.$store.dispatch('setDroneInitialLocation', null);

            this.telemetrySocket = new WebSocket(`${WS_HOST}/telemetry`);
            // console.log(`${WS_HOST}/telemetry`);

            let intervalCallsCount = 0;
            const intervalId = setInterval(() => {
                intervalCallsCount++;
                if (intervalCallsCount > 5) {
                    loading.close();
                    toast.fire({
                        type: 'error',
                        title: 'Can not connect with the server',
                    });
                    this.telemetrySocket.close();
                    this.telemetrySocket = new SocketFallback();
                    clearInterval(intervalId);
                    this.isLive = false;
                }

                if (this.telemetrySocket.OPEN == 1) {
                    loading.close();
                    toast.fire({
                        type: 'success',
                        title: 'Connected',
                    });
                    clearInterval(intervalId);
                    this.isLive = true;
                }
            }, 300);

            this.telemetrySocket.onmessage = (event) => {
                const parsedData = JSON.parse(event.data);
                // console.log({ parsedData });
                this.$Bus.$emit('telemetry_data', parsedData);
            };
        },
        stopping() {
            if (this.telemetrySocket.OPEN == 1) {
                this.telemetrySocket.close();
                this.telemetrySocket = new SocketFallback();
                this.isLive = false;
                return toast.fire({
                    type: 'success',
                    title: 'Socket connection successfully closed',
                });
            }

            return toast.fire({
                type: 'warning',
                title: 'There is not an existing connection',
            });
        },
        collapse() {
            const window = remote.getCurrentWindow();
            window.minimize();
        },
        fullscreen() {
            const window = remote.getCurrentWindow();
            if (!window.isMaximized()) {
                window.maximize();
            } else {
                window.unmaximize();
            }
        },
        close() {
            const window = remote.getCurrentWindow();
            swal.fire($exit).then((result) => {
                if (result.value) {
                    window.close();
                }
            });
        },
        dateRangeUpdated(range) {
            this.dateRange.startDate = moment(range.startDate).toISOString();
            this.dateRange.endDate = moment(range.endDate).toISOString();
        },
        search() {
            // this.$http.get('/search', {
            //     params: { ...this.dateRange }
            // }).then(res => {
            //     this.$Bus.$emit("QUERIED_TELEMETRY", res.data)
            // });
        },
        changeMode(key) {
            const body = { mode: key };
            API.setMode(body);
        },
        changePage(key) {
            if (this.$route.name !== key) {
                this.page.active = key;
                this.$router.push({ name: key });
            }
        },
    },
    computed: {
        activeModeName() {
            return this.mode.list.find((x) => x.key === this.mode.selected).name;
        },
        isLive: {
            get() {
                return this.$store.state.general.isLive;
            },
            set(value) {
                this.$store.dispatch('setIsLive', value);
            },
        },
        flightMode: {
            get() {
                return this.$store.state.flightData.flightMode;
            },
            set(value) {
                if (this.flightMode !== value) {
                    this.$store.dispatch('setFlightMode', value);
                }
            },
        },
    },
};
</script>
