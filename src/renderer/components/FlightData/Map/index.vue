<template>
    <div class="map">
        <MglMap
            :accessToken="mapToken"
            :mapStyle.sync="mapStyle"
            @load="mapIsLoaded"
            class="map"
        >
            <MglNavigationControl position="top-right" />
        </MglMap>
        <ContextMenu ref="context" @panToDrone="panToDrone" />
    </div>
</template>

<script>
import Vue from "vue";
import Mapbox from "mapbox-gl";
import { MglMap, MglNavigationControl } from "vue-mapbox";
import { $buildings, $points_extrusion, $drone } from "@/core/layers.js";
import * as turf from "@turf/turf";
import * as mapboxgl from "mapbox-gl";
import { swal } from "@/core/popups.js";
import { $empty_result } from "@/core/popup_options.js";
import { MAPBOX_TOKEN, MAPBOX_STYLE_MONOCHROME, MAPBOX_STYLE_SATELLITE } from "@/core/constants.js";
import ContextMenu from "@/components/FlightData/Map/ContextMenu";

import "./style.scss";

export default {
    components: {
        MglMap,
        MglNavigationControl,
        ContextMenu,
    },
    created() {
        Vue.prototype.$map = null;
    },
    data() {
        return {
            droneIconSource: require("../../../assets/icons/drone_azercosmos.png"),
            featureCollection: {
                id: "live-data",
                type: "FeatureCollection",
                features: [
                    {
                        type: "Feature",
                        geometry: {
                            type: "LineString",
                            coordinates: [],
                        },
                    },
                ],
            },
            dronePattern: {
                geometry: {
                    type: "Point",
                    coordinates: [this.initialCoordinates],
                },
                type: "Feature",
                properties: {},
            },
            radius: 0.5,
            steps: 15,
            initialCoordinates: [49.83846502960421, 40.34346368003392],
            initialZoomLevel: 17,
            popup: new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false,
            }),
        };
    },
    methods: {
        mapIsLoaded(event) {
            this.$map = event.map;
            this.$map.loadImage(this.droneIconSource, (err, image) => {
                this.$map.addImage("drone", image);
                this.$map.addSource("drone", {
                    type: "geojson",
                    data: this.dronePattern,
                });
                this.$map.addLayer({
                    id: "drone",
                    type: "symbol",
                    source: "drone",
                    layout: {
                        "icon-image": "drone",
                        "icon-size": 0.25,
                        "icon-rotate": 0
                    },
                });
            });

            this.$map.dragRotate.disable();
            this.$map.touchZoomRotate.disableRotation();

            this.$map.addSource(this.featureCollection.id, {
                type: "geojson",
                data: this.featureCollection,
            });
            this.$map.addLayer($points_extrusion(this.featureCollection.id));
            this.$map.jumpTo({
                center: this.initialCoordinates,
                zoom: this.initialZoomLevel,
            });

            // Mouse enter
            this.$map.on("mouseenter", "points-extrusion", (event) => {
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

            this.$Bus.$on("telemetry_data", (telemetry) => {
                let keys = Object.keys(telemetry);
                if (
                    !keys.includes("latitude_deg") &&
                    !keys.includes("longitude_deg")
                ) {
                    return;
                }

                let coordinates = [
                    telemetry.longitude_deg,
                    telemetry.latitude_deg,
                ];

                // Drone trajectory
                this.featureCollection.features[0].geometry.coordinates.push(
                    coordinates
                );

                // Drone Location
                this.dronePattern.geometry.coordinates = coordinates;

                this.$map
                    .getSource(this.featureCollection.id)
                    .setData(this.featureCollection);

                this.$map.getSource("drone").setData(this.dronePattern);

                // Drone rotation
                this.$map.setLayoutProperty('drone', 'icon-rotate', telemetry.yaw_deg + 90)

                this.$map.panTo(coordinates);

                // See what your brother will do
                this.$forceUpdate();
            });
        },
        prepareDescription(coordinates) {
            return `
                <p>Longitude: <strong>${coordinates.lng}</strong><p>
                <p>Latitude: <strong>${coordinates.lat}</strong><p>
            `;
        },
        handleContextMenu(event) {
            this.$refs.context.open(event);
        },
        panToDrone() {
            // this.$map.panTo(this.dronePattern.geometry.coordinates);
        },
    },
    computed: {
        mapToken() {
            return MAPBOX_TOKEN;
        },
        mapStyle() {
            return MAPBOX_STYLE_MONOCHROME;
        },
    },
};
</script>
