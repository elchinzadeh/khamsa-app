<template>
    <fragment>
        <li
            class="list__item"
            :class="{'list__item--deactive': !isLive}"
            v-if="!armStatus"
        >
            <button @click="isLive && arm()">
                <span>Arm</span>
            </button>
        </li>
        <li
            class="list__item"
            :class="{'list__item--deactive': !disarmIsActive}"
            v-else
        >
            <button @click="disarmIsActive && disarm()">
                <span>Disarm</span>
            </button>
        </li>
        <li
            class="list__item"
            :class="{'list__item--deactive': !isLive}"
            v-if="!showChangeAltitude"
        >
            <button @click="isLive && takeoff()">
                <span>Takeoff</span>
            </button>
        </li>
        <li
            class="list__item"
            :class="{'list__item--deactive': !isLive}"
            v-if="showChangeAltitude"
        >
            <button @click="isLive && changeAltitude()">
                <span>Change altitude</span>
            </button>
        </li>
        <li
            class="list__item"
        >
            <button @click="archive">Archive</button>
        </li>
    </fragment>
</template>

<script>
import API from '@/api';
import { swal } from '@/core/popups.js';
import { $number_input } from '@/core/popup_options.js';
import { toast } from '@/core/popups.js';

export default {
    name: 'FlightDataHeader',
    data() {
        return {
            armStatus: false,
            altitude: 0,
        };
    },
    methods: {
        arm() {
            API.arm()
                .then((response) => {
                    toast.fire({
                        type: 'success',
                        title: 'Armed',
                    });
                })
                .catch((error) => {
                    toast.fire({
                        type: 'error',
                        title: 'Arming failed',
                    });
                });
        },
        disarm() {
            API.disarm()
                .then((response) => {
                    toast.fire({
                        type: 'success',
                        title: 'Disarmed',
                    });
                })
                .catch((error) => {
                    toast.fire({
                        type: 'error',
                        title: 'Disarming failed',
                    });
                });
        },
        takeoff() {
            swal.fire(
                $number_input({
                    title: 'Enter altitude',
                    inputValue: 10,
                }),
            ).then(({ value }) => {
                const body = { altitude: Number(value) };

                API.takeoff(body)
                    .then((response) => {
                        toast.fire({
                            type: 'success',
                            title: 'Takeoff',
                        });
                    })
                    .catch((error) => {
                        toast.fire({
                            type: 'error',
                            title: 'Takeoff failed',
                        });
                    });
            });
        },
        changeAltitude() {
            swal.fire(
                $number_input({
                    title: 'Enter altitude',
                    inputValue: 10,
                }),
            ).then(({ value }) => {
                const data = { altitude: value };
                API.changeAltitude(data);
            });
        },
        archive() {
            this.$emit('expandSeachArea');
        },
    },
    mounted() {
        this.$Bus.$on('telemetry_data', (telemetry) => {
            this.armStatus = telemetry.arm_status;
            this.altitude = telemetry.relative_altitude_m;
        });
    },
    computed: {
        isLive() {
            return this.$store.state.general.isLive;
        },
        showChangeAltitude() {
            return Math.round(this.altitude) > 0 && this.armStatus;
        },
        disarmIsActive() {
            return Math.round(this.altitude) <= 0 && this.armStatus && this.isLive;
        },
    },
};
</script>
