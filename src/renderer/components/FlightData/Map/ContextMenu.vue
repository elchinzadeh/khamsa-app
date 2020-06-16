<template>
    <div>
        <VueContext ref="menu">
            <li>
                <a href="#" @click.prevent="flyToHere">
                    Fly to here
                </a>
            </li>
        </VueContext>
    </div>
</template>

<script>
import { VueContext } from "vue-context";
import axios from "axios";

export default {
    name: "MapContextMenu",
    components: {
        VueContext,
    },
    data() {
        return {
            latitude: null,
            longitude: null,
        };
    },
    methods: {
        flyToHere() {
            const data = {
                latitude: this.latitude,
                longitude: this.longitude,
            };

            axios
                .post("http://172.16.40.96:8000/flyToHere", data)
                .then((response) => {
                    // response
                    console.log(response);
                });
        },
        open(event) {
            this.$refs.menu.open(event.originalEvent);
            this.latitude = event.lngLat.lat;
            this.longitude = event.lngLat.lng;
        },
    },
};
</script>
