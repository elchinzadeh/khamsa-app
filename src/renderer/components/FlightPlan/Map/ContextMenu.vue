<template>
    <div>
        <VueContext ref="menu">
            <li>
                <a href="#" @click="addPoint('waypoint')">
                    Waypoint
                </a>
                <a href="#" @click="addPoint('land')">
                    Land
                </a>
                <a href="#" @click="addPoint('takeoff')">
                    Takeoff
                </a>
                <a href="#" v-if="markerIndex !== null" @click="deletePoint">
                    Delete
                </a>
                <a href="#" @click="clearMission">
                    Clear mission
                </a>
            </li>
        </VueContext>
    </div>
</template>

<script>
import { VueContext } from "vue-context";
import axios from "axios";
import "@/styles/components/contextMenu.scss";

export default {
    name: "MapContextMenu",
    components: {
        VueContext,
    },
    data() {
        return {
            latitude: null,
            longitude: null,
            markerIndex: null,
        };
    },
    methods: {
        open({ lngLat, originalEvent }) {
            this.$refs.menu.open(originalEvent);
            this.latitude = lngLat.lat;
            this.longitude = lngLat.lng;

            // If clicked on marker
            this.markerIndex = null;
            const [isMarker, markerIndex] = this.detectMarker(
                originalEvent.path
            );

            if (isMarker) {
                this.markerIndex = markerIndex;
            }
        },
        addPoint(type) {
            const payload = {
                command: type,
                coordinates: {
                    latitude: this.latitude,
                    longitude: this.longitude,
                },
            };
            this.$store.dispatch("addPoint", payload);
        },
        deletePoint() {
            this.$store.dispatch("deletePoint", this.markerIndex);
        },
        clearMission() {
            this.$store.dispatch("deleteAllPoints");
        },
        detectMarker(elements) {
            let isMarker = false;
            let index = null;

            for (const element of elements) {
                isMarker = Object.values(element.classList).includes("marker");

                if (isMarker) {
                    index = element.dataset.index;
                }

                if (element.nodeName === "HTML" || isMarker) {
                    break;
                }
            }

            return [isMarker, Number(index)];
        },
    },
};
</script>
