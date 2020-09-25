<template>
    <div class="flight-data-context-menu">
        <VueContext ref="menu">
            <li :class="{'disabled': !isLive}">
                <a
                    href="#"
                    @click.prevent="isLive && flyToHere()"
                >
                    Fly to here
                </a>
            </li>
            <li :class="{'disabled': !isLive}">
                <a
                    href="#"
                    @click.prevent="isLive && changeAltitudeFlyToHere()"
                >
                    Change altitude and fly to here
                </a>
            </li>
        </VueContext>
    </div>
</template>

<script>
import { VueContext } from 'vue-context';
import API from '@/api';
import { swal } from '@/core/popups.js';
import { $number_input } from '@/core/popup_options.js';
import { MissionStatus } from '@/core/enums';


export default {
    name: 'MapContextMenu',
    components: { VueContext },
    data() {
        return {
            altitude: null,
            latitude: null,
            longitude: null,
        };
    },
    methods: {
        open(event) {
            this.$refs.menu.open(event.originalEvent);
            this.altitude = null;
            this.latitude = event.lngLat.lat;
            this.longitude = event.lngLat.lng;
        },
        flyToHere() {
            const data = {
                altitude: this.altitude,
                latitude: this.latitude,
                longitude: this.longitude,
            };

            this.$store.dispatch('setMissionStatus', MissionStatus.PAUSED);

            API.flyToHere(data).then((response) => {
                // response
            });
        },
        changeAltitudeFlyToHere() {
            swal.fire(
                $number_input({
                    title: 'Enter altitude',
                    inputValue: 10,
                }),
            ).then(({ value }) => {
                this.altitude = Number(value);
                this.flyToHere();
            });
        },
    },
    computed: {
        isLive() {
            return this.$store.state.general.isLive;
        },
    },
};
</script>
