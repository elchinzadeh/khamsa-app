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
        </VueContext>
    </div>
</template>

<script>
import { VueContext } from 'vue-context';
import API from '@/api';

export default {
    name: 'MapContextMenu',
    components: { VueContext },
    data() {
        return {
            latitude: null,
            longitude: null,
        };
    },
    methods: {
        open(event) {
            this.$refs.menu.open(event.originalEvent);
            this.latitude = event.lngLat.lat;
            this.longitude = event.lngLat.lng;
        },
        flyToHere() {
            const data = {
                latitude: this.latitude,
                longitude: this.longitude,
            };

            API.flyToHere(data).then((response) => {
                // response
                console.log(response);
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
