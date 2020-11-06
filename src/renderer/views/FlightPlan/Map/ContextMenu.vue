<template>
    <div>
        <VueContext ref="menu">
            <li>
                <a
                    href="#"
                    @click="addPoint('waypoint')"
                >
                    Waypoint
                </a>
                <a
                    href="#"
                    @click="addPoint('land')"
                >
                    Land
                </a>
                <a
                    href="#"
                    @click="addPoint('takeoff')"
                >
                    Takeoff
                </a>
                <a
                    href="#"
                    v-if="markerIndex !== null"
                    @click="deletePoint"
                >
                    Delete
                </a>
                <a
                    href="#"
                    @click="clearMission"
                >
                    Clear mission
                </a>
            </li>
        </VueContext>
    </div>
</template>

<script>
import { VueContext } from 'vue-context';
import { swal, toast } from '@/core/popups.js';
import { $number_input } from '@/core/popup_options.js';
import '@/styles/components/contextMenu.scss';

export default {
    name: 'MapContextMenu',
    components: { VueContext },
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
            const [
                isMarker,
                markerIndex,
            ] = this.detectMarker(
                originalEvent.path,
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

            if (this.points.length === 0) {
                this.openAltitudePopup();
            } else {
                payload.altitude = this.points[this.points.length - 1].altitude;
            }

            this.$store.dispatch('addPoint', payload);
        },
        deletePoint() {
            this.$store.dispatch('deletePoint', this.markerIndex);
        },
        clearMission() {
            this.$store.dispatch('deleteAllPoints');
            toast.fire({
                type: 'success',
                title: 'Mission cleared',
            });
        },
        detectMarker(elements) {
            let isMarker = false;
            let index = null;

            for (const element of elements) {
                isMarker = Object.values(element.classList).includes('marker');

                if (isMarker) {
                    index = element.dataset.index;
                }

                if (element.nodeName === 'HTML' || isMarker) {
                    break;
                }
            }

            return [
                isMarker,
                Number(index),
            ];
        },
        openAltitudePopup() {
            swal.fire(
                $number_input({
                    title: 'Enter altitude',
                    inputValue: 10,
                }),
            ).then(({ value }) => {
                this.updatePoint(0, { altitude: value });
            });
        },
        updatePoint(index, values) {
            const data = {
                index: 0,
                ...values,
            };
            this.$store.dispatch('updatePoint', data);
        },
    },
    computed: {
        points() {
            return this.$store.state.flightPlan.points;
        },
    },
};
</script>
