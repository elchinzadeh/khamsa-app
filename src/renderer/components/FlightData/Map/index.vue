<template>
    <div class="map">
        <MglMap :accessToken="mapToken" :mapStyle.sync="mapStyle" @load="mapIsLoaded" class="map">
            <MglNavigationControl position="top-right" ref="navigation" />

            <!-- Marker -->
            <MglMarker
                v-for="(point, index) in points"
                :key="index"
                :coordinates="[point.coordinates.longitude, point.coordinates.latitude]"
                color="blue"
                anchor="bottom"
                :draggable="false"
            >
                <template slot="marker">
                    <CustomMarker :text="index + 1" transparent />
                </template>
            </MglMarker>
        </MglMap>

        <ContextMenu ref="context" />
    </div>
</template>

<script>
import Vue from "vue";
import Mapbox from "mapbox-gl";
import { MglMap, MglNavigationControl, MglMarker } from "vue-mapbox";
import { $buildings, $points_extrusion, $drone } from "@/core/layers.js";
import * as turf from "@turf/turf";
import * as mapboxgl from "mapbox-gl";
import { swal } from "@/core/popups.js";
import { $empty_result } from "@/core/popup_options.js";
import {
    MAPBOX_TOKEN,
    MAPBOX_STYLE_MONOCHROME,
    MAPBOX_STYLE_SATELLITE
} from "@/core/constants.js";
import Marker from "@/components/common/Marker";
import ContextMenu from "@/components/FlightData/Map/ContextMenu";
import ClearScreenControl from "@/components/FlightData/Map/Controls/ClearScreen";

import "./style.scss";

export default {
    components: {
        MglMap,
        MglNavigationControl,
        MglMarker,
        CustomMarker: Marker,
        ContextMenu
    },
    data() {
        return {
            droneIconSource: require("../../../assets/icons/drone_azercosmos_w.png"),
            radius: 0.5,
            steps: 15,
            initialZoomLevel: 17,
            popup: new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false
            })
        };
    },
    created() {
        Vue.prototype.$map = null;
    },
    mounted() {
        this.$store.dispatch("setMapInitialCoordinates");
    },
    methods: {
        mapIsLoaded(event) {
            this.$map = event.map;
            this.$map.loadImage(this.droneIconSource, (err, image) => {
                this.$map.addImage("drone", image);
                this.$map.addSource("drone", {
                    type: "geojson",
                    data: this.dronePattern
                });
                this.$map.addLayer({
                    id: "drone",
                    type: "symbol",
                    source: "drone",
                    layout: {
                        "icon-image": "drone",
                        "icon-size": 0.25,
                        "icon-rotate": 0
                    }
                });
            });

            this.$map.dragRotate.disable();
            this.$map.touchZoomRotate.disableRotation();

            this.$map.addSource(this.dronePath.id, {
                type: "geojson",
                data: this.dronePath
            });
            this.$map.addLayer($points_extrusion(this.dronePath.id));
            this.$map.jumpTo({
                center: this.initialCoordinates,
                zoom: this.initialZoomLevel
            });

            // Mouse enter
            this.$map.on("mouseenter", "points-extrusion", event => {
                this.$map.getCanvas().style.cursor = "pointer";
                let coordinates = event.lngLat.wrap();
                let description = this.prepareDescription(coordinates);

                this.popup
                    .setLngLat([coordinates.lng, coordinates.lat])
                    .setHTML(description)
                    .addTo(this.$map);
            });

            // Mouse leave
            this.$map.on("mouseleave", "points-extrusion", () => {
                this.$map.getCanvas().style.cursor = "";
                this.popup.remove();
            });

            // Context menu
            this.$map.on("contextmenu", this.handleContextMenu);

            this.$Bus.$on("telemetry_data", telemetry => {
                let keys = Object.keys(telemetry);
                if (
                    !keys.includes("latitude_deg") &&
                    !keys.includes("longitude_deg")
                ) {
                    return;
                }

                let coordinates = [
                    telemetry.longitude_deg,
                    telemetry.latitude_deg
                ];

                // Drone trajectory
                this.$store.dispatch("addDroneTrajectory", coordinates);

                // Drone path
                this.$map.getSource(this.dronePath.id).setData(this.dronePath);

                this.$map.getSource("drone").setData(this.dronePattern);

                // Drone rotation
                this.$map.setLayoutProperty(
                    "drone",
                    "icon-rotate",
                    telemetry.yaw_deg + 90
                );

                // Pan to drone
                this.$map.panTo(coordinates);

                if (!this.droneInitialLocation) {
                    this.droneInitialLocation = coordinates;
                }

                // See what your brother will do
                // this.$forceUpdate();
            });

            // Custom map controls
            this.$map.addControl(new ClearScreenControl(), "top-left");
        },
        prepareDescription(coordinates) {
            return `
                <p>Longitude: <strong>${coordinates.lng}</strong><p>
                <p>Latitude: <strong>${coordinates.lat}</strong><p>
            `;
        },
        handleContextMenu(event) {
            this.$refs.context.open(event);
        }
    },
    computed: {
        mapToken() {
            return MAPBOX_TOKEN;
        },
        mapStyle() {
            return MAPBOX_STYLE_MONOCHROME;
        },
        droneInitialLocation: {
            get() {
                return this.$store.state.flightData.droneInitialLocation;
            },
            set(value) {
                this.$store.dispatch("setDroneInitialLocation", value);
            }
        },
        points() {
            return this.$store.state.flightPlan.points;
        },
        dronePath() {
            return this.$store.state.flightData.dronePath;
        },
        dronePattern() {
            return this.$store.state.flightData.dronePattern;
        },
        initialCoordinates() {
            return this.$store.state.flightData.initialCoordinates;
        }
    }
};
</script>
