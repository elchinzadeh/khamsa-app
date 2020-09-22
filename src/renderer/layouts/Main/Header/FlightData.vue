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
            :class="{'list__item--deactive': !isLive}"
            v-else
        >
            <button @click="isLive && disarm()">
                <span>Disarm</span>
            </button>
        </li>
        <li
            class="list__item"
            :class="{'list__item--deactive': !isLive}"
            v-if="!armStatus"
        >
            <button @click="isLive && takeoff()">
                <span>Takeoff</span>
            </button>
        </li>
        <li
            class="list__item"
            :class="{'list__item--deactive': !isLive}"
            v-if="armStatus"
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

export default {
    name: 'FlightDataHeader',
    data() {
        return { armStatus: false };
    },
    methods: {
        arm() {
            API.arm()
                .then((response) => {
                    console.log('Armed');
                })
                .catch((error) => {
                    console.log('Arming failed', error);
                });
        },
        disarm() {
            API.disarm()
                .then((response) => {
                    console.log('Disarmed');
                })
                .catch((error) => {
                    console.log('Disarming failed', error);
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
                        console.log('Takeoff');
                    })
                    .catch((error) => {
                        console.log('Takeoff failed', error);
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
        });
    },
    computed: {
        isLive() {
            return this.$store.state.general.isLive;
        },
    },
};
</script>
