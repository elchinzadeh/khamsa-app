<template>
    <div class="map">
        <MglMap
            :accessToken="mapToken"
            :mapStyle.sync="mapStyle"
            @load="mapIsLoaded"
            class="map"
        >
            <MglNavigationControl
                position="top-right"
                ref="navigation"
            />

            <!-- Marker -->
            <MglMarker
                v-for="(point, index) in points"
                :key="index"
                :coordinates="[point.coordinates.longitude, point.coordinates.latitude]"
                anchor="bottom"
                :draggable="false"
            >
                <template slot="marker">
                    <CustomMarker
                        :text="index + 1"
                        :type="point.command"
                        transparent
                    />
                </template>
            </MglMarker>

            <!-- Home Location Marker -->
            <MglMarker
                v-if="droneHomeLocation.length"
                :coordinates="droneHomeLocation"
                anchor="bottom"
                :draggable="false"
            >
                <template slot="marker">
                    <CustomMarker
                        color="black"
                        transparent
                    >
                        <template v-slot:icon>
                            <HomeIcon
                                size="16"
                                title="Home"
                                color="#fff"
                            />
                        </template>
                    </CustomMarker>
                </template>
            </MglMarker>
        </MglMap>

        <ContextMenu ref="context" />
    </div>
</template>

<script>
import Vue from 'vue';
import { MglMap, MglNavigationControl, MglMarker } from 'vue-mapbox';
import { $points_extrusion } from '@/core/layers.js';
import * as mapboxgl from 'mapbox-gl';
import { HomeIcon } from 'vue-feather-icons';
import {
    MAPBOX_TOKEN,
    MAPBOX_STYLE_MONOCHROME,
} from '@/core/constants.js';
import { Marker } from '@/components';
import ContextMenu from './ContextMenu/index.vue';
import ClearScreenControl from './Controls/ClearScreen';

import './style.scss';

export default {
    components: {
        MglMap,
        MglNavigationControl,
        MglMarker,
        CustomMarker: Marker,
        ContextMenu,
        HomeIcon,
    },
    data() {
        return {
            droneIconSource: require('../../../assets/icons/drone_azercosmos_w.png'),
            radius: 0.5,
            steps: 15,
            initialZoomLevel: 17,
            popup: new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false,
            }),
        };
    },
    created() {
        Vue.prototype.$flightDataMap = null;
    },
    mounted() {
        this.$store.dispatch('setMapInitialCoordinates');
    },
    methods: {
        mapIsLoaded(event) {
            this.$flightDataMap = event.map;
            this.$flightDataMap.loadImage(
                this.droneIconSource,
                (err, image) => {
                    this.$flightDataMap.addImage('drone', image);
                    this.$flightDataMap.addSource('drone', {
                        type: 'geojson',
                        data: this.dronePattern,
                    });
                    this.$flightDataMap.addLayer({
                        id: 'drone',
                        type: 'symbol',
                        source: 'drone',
                        layout: {
                            'icon-image': 'drone',
                            'icon-size': 0.25,
                            'icon-rotate': 0,
                        },
                    });
                },
            );

            this.$flightDataMap.dragRotate.disable();
            this.$flightDataMap.touchZoomRotate.disableRotation();

            this.$flightDataMap.addSource(this.dronePath.id, {
                type: 'geojson',
                data: this.dronePath,
            });
            this.$flightDataMap.addLayer($points_extrusion(this.dronePath.id));
            this.$flightDataMap.jumpTo({
                center: this.initialCoordinates,
                zoom: this.initialZoomLevel,
            });

            // Mouse enter
            this.$flightDataMap.on('mouseenter', 'points-extrusion', (event) => {
                this.$flightDataMap.getCanvas().style.cursor = 'pointer';
                const coordinates = event.lngLat.wrap();
                const description = this.prepareDescription(coordinates);

                this.popup
                    .setLngLat([
                        coordinates.lng,
                        coordinates.lat,
                    ])
                    .setHTML(description)
                    .addTo(this.$flightDataMap);
            });

            // Mouse leave
            this.$flightDataMap.on('mouseleave', 'points-extrusion', () => {
                this.$flightDataMap.getCanvas().style.cursor = '';
                this.popup.remove();
            });

            // Context menu
            this.$flightDataMap.on('contextmenu', this.handleContextMenu);

            console.clear();
            this.$Bus.$on('telemetry_data', (telemetry) => {
                const keys = Object.keys(telemetry);
                if (
                    !keys.includes('latitude_deg') &&
                    !keys.includes('longitude_deg')
                ) {
                    return;
                }

                const coordinates = [
                    telemetry.longitude_deg,
                    telemetry.latitude_deg,
                ];

                // Drone trajectory
                this.$store.dispatch('addDroneTrajectory', coordinates);

                // Drone path
                this.$flightDataMap
                    .getSource(this.dronePath.id)
                    .setData(this.dronePath);

                this.$flightDataMap
                    .getSource('drone')
                    .setData(this.dronePattern);

                // Drone rotation
                this.$flightDataMap.setLayoutProperty(
                    'drone',
                    'icon-rotate',
                    telemetry.yaw_deg + 90,
                );

                // Pan to drone
                this.$flightDataMap.panTo(coordinates);

                if (!this.droneInitialLocation) {
                    this.droneInitialLocation = coordinates;
                }

                // Drone's home location
                this.droneHomeLocation = [
                    telemetry.home_location_lon,
                    telemetry.home_location_lat,
                ];

                // Drone's current location
                this.droneCurrentLocation = coordinates;

                // Mission progress
                this.missionProgress = telemetry.mission_progress;

                // See what your brother will do
                // this.$forceUpdate();
            });

            // Custom map controls
            this.$flightDataMap.addControl(
                new ClearScreenControl(),
                'top-left',
            );
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
                this.$store.dispatch('setDroneInitialLocation', value);
            },
        },
        droneHomeLocation: {
            get() {
                return this.$store.state.flightData.droneHomeLocation;
            },
            set(value) {
                this.$store.dispatch('setDroneHomeLocation', value);
            },
        },
        droneCurrentLocation: {
            get() {
                return this.$store.state.flightData.droneCurrentLocation;
            },
            set(value) {
                this.$store.dispatch('setDroneCurrentLocation', value);
            },
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
        },
        missionProgress: {
            get() {
                return this.$store.state.mission.progress;
            },
            set(value) {
                this.$store.dispatch('setMissionProgress', value);
            },
        },
    },
    watch: {
        $route(to) {
            if (to.name === 'flightData') {
                this.$flightDataMap.resize();
            }
        },
    },
};
</script>
