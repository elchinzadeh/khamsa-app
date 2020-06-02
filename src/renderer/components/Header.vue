<template>
    <header class="header">
        <!-- Menu bar -->
        <div class="header__menu">
            <!-- Logo -->
            <img src="@/assets/logo.svg" class="header__menu--logo" />

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
                    <span>
                        {{ item.name }}
                    </span>
                </li>
            </ul>

            <!-- Control menu -->
            <ul class="header__events">
                <li class="header__events--item" @click="collapse">
                    <img src="@/assets/frame/collapse.svg" />
                </li>
                <li class="header__events--item" @click="fullscreen">
                    <img src="@/assets/frame/fullscreen.svg" />
                </li>
                <li class="header__events--item" @click="close">
                    <img src="@/assets/frame/close.svg" />
                </li>
            </ul>
        </div>

        <!-- Toolbar -->
        <div class="header__toolbar">
            <!-- Toobar list -->
            <div
                class="toolbar__menu"
                :style="{
                    transform: expandSeachArea ? 'scale(.8)' : 'scale(1)',
                }"
            >
                <ul class="toolbar__menu--list">
                    <li class="toolbar__menu--list--item">
                        <button @click="starting">
                            <span>Live</span>
                        </button>
                    </li>
                    <li class="toolbar__menu--list--item">
                        <button @click="stopping">
                            <span>Stop</span>
                        </button>
                    </li>
                    <li class="toolbar__menu--list--item">
                        <button @click="arm">
                            <span>Arm</span>
                        </button>
                    </li>
                    <li class="toolbar__menu--list--item">
                        <button @click="disarm">
                            <span>Disarm</span>
                        </button>
                    </li>
                    <li class="toolbar__menu--list--item">
                        <MenuDropdown>
                            Mode: {{ activeModeName }}
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
                    <li class="toolbar__menu--list--item">
                        <button @click="expandSeachArea = true">Archive</button>
                    </li>
                </ul>
            </div>

            <!-- Search bar -->
            <ul
                class="toolbar__search"
                :style="{
                    transform: expandSeachArea
                        ? 'translateY(100%)'
                        : 'translateY(0)',
                }"
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
                    >
                    </date-range-picker>
                </li>
                <li>
                    <button class="confirm" @click="search">Search</button>
                </li>
                <li>
                    <button class="cancel" @click="expandSeachArea = false">
                        Cancel
                    </button>
                </li>
            </ul>
        </div>
    </header>
</template>

<script>
import { remote } from "electron";
import { $exit, $error } from "@/core/popup_options.js";
import { swal, toast, loading } from "@/core/popups.js";
import SocketService from "@/core/socket.js";
import SocketFallback from "@/core/socket_fallback.js";
import { $host } from "@/core/constants.js";
import DateRangePicker from "vue2-daterange-picker";
import "vue2-daterange-picker/dist/vue2-daterange-picker.css";
import moment from "moment/src/moment.js";
import axios from "axios";
import MenuDropdown from "./common/MenuDropdown";

export default {
    components: {
        DateRangePicker,
        MenuDropdown,
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
                        key: "guided",
                        name: "Guided",
                    },
                    {
                        key: "auto",
                        name: "Auto",
                    },
                    {
                        key: "stabilize",
                        name: "Stabilize",
                    },
                    {
                        key: "land",
                        name: "Land",
                    },
                ],
                selected: "auto",
            },
            page: {
                list: [
                    {
                        key: "flightData",
                        name: "Flight data",
                        icon: require("../assets/icons/compass.svg"),
                    },
                    {
                        key: "flightPlan",
                        name: "Flight plan",
                        icon: require("../assets/icons/earth.svg"),
                    },
                ],
                active: "flightData",
            },
        };
    },
    mounted() {
        this.page.active = this.$route.name;
    },
    methods: {
        starting() {
            if (this.telemetrySocket.OPEN != null) {
                return toast.fire({
                    type: "warning",
                    title: "Socket already connected",
                });
            }

            loading.fire();
            loading.showLoading();
            this.telemetrySocket = new WebSocket(
                "ws://127.0.0.1:8000/telemetry"
            );

            let intervalCallsCount = 0;
            let intervalId = setInterval(() => {
                intervalCallsCount++;
                if (intervalCallsCount > 5) {
                    loading.close();
                    toast.fire({
                        type: "error",
                        title: "Can not connect with the server",
                    });
                    this.telemetrySocket.close();
                    this.telemetrySocket = new SocketFallback();
                    clearInterval(intervalId);
                }

                if (this.telemetrySocket.OPEN == 1) {
                    loading.close();
                    toast.fire({
                        type: "success",
                        title: "Connected",
                    });
                    clearInterval(intervalId);
                }
            }, 300);

            this.telemetrySocket.onmessage = (event) => {
                let parsedData = JSON.parse(event.data);
                this.$Bus.$emit("telemetry_data", parsedData);
            };
        },
        stopping() {
            if (this.telemetrySocket.OPEN == 1) {
                this.telemetrySocket.close();
                this.telemetrySocket = new SocketFallback();
                return toast.fire({
                    type: "success",
                    title: "Socket connection successfully closed",
                });
            }

            return toast.fire({
                type: "warning",
                title: "There is not an existing connection",
            });
        },
        arm() {
            axios
                .get("http://localhost:8000/arm")
                .then((response) => {
                    console.log("Armed");
                })
                .catch((error) => {
                    console.log("Arming failed", error);
                });
        },
        disarm() {
            axios
                .get("http://localhost:8000/disarm")
                .then((response) => {
                    console.log("Disarmed");
                })
                .catch((error) => {
                    console.log("Disarming failed", error);
                });
        },
        collapse() {
            let window = remote.getCurrentWindow();
            window.minimize();
        },
        fullscreen() {
            let window = remote.getCurrentWindow();
            if (!window.isMaximized()) {
                window.maximize();
            } else {
                window.unmaximize();
            }
        },
        close() {
            let window = remote.getCurrentWindow();
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
            // API call
            this.mode.selected = key;
            console.log({ key });
        },
        changePage(key) {
            if (this.$route.name !== key) {
                this.page.active = key;
                this.$router.push({
                    name: key,
                });
            }
        },
    },
    computed: {
        activeModeName() {
            return this.mode.list.find((x) => x.key === this.mode.selected)
                .name;
        },
    },
};
</script>

<style lang="scss">
@import "@/styles/components/header.scss";

.custom-date-range-picker {
    color: #000;

    & .reportrange-text {
        padding: 0.5rem 2rem;
        background-color: #595959;
        border: none;
        outline: none;
        color: #fff;
        border-radius: 3px;
    }

    & .daterangepicker {
        transform: translate(-30%) !important;

        &.openscenter:before,
        &.openscenter:after {
            left: -40% !important;
        }
    }
}
</style>
