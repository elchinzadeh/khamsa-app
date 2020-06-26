<template>
	<div class="map">
		<MglMap :accessToken="mapToken" :mapStyle="mapStyle" @load="onMapLoaded">
			<!-- Navigation Control -->
			<MglNavigationControl position="top-right" />

			<!-- Marker -->
			<MglMarker
				v-for="(point, index) in points"
				:key="index"
				:coordinates="[point.coordinates.longitude, point.coordinates.latitude]"
				color="blue"
				anchor="bottom"
				draggable
				@dragend="pointDragged({ ...$event }, index)"
			>
				<template slot="marker">
					<CustomMarker
						:text="index + 1"
						:data-index="index"
						@click="pointClicked($event, index)"
					/>
				</template>
			</MglMarker>

			<!-- GeoJSON Layer -->
			<MglGeojsonLayer
				:sourceId="geoJsonSource.data.id"
				:source="geoJsonSource"
				layerId="somethingSomething"
				:layer="geoJsonLayer"
			/>
		</MglMap>

		<!-- Context menu -->
		<ContextMenu ref="context" />
	</div>
</template>

<script>
import Vue from "vue";
import * as mapboxgl from "mapbox-gl";
import {
	MglMap,
	MglNavigationControl,
	MglMarker,
	MglGeojsonLayer,
} from "vue-mapbox";
import axios from "axios";
import { MAPBOX_TOKEN, MAPBOX_STYLE_MONOCHROME } from "@/core/constants.js";
import Marker from "@/components/common/Marker";
import ContextMenu from "./ContextMenu";

export default {
	name: "FlightPlanMap",
	components: {
		MglMap,
		MglNavigationControl,
		MglMarker,
		MglGeojsonLayer,
		CustomMarker: Marker,
		ContextMenu,
	},
	created() {
		Vue.prototype.$flightPlanMap = null;
	},
	methods: {
		onMapLoaded(event) {
			this.$flightPlanMap = event.map;

			// Add point
			this.$flightPlanMap.on("click", this.addPoint);

			// Context menu
			this.$flightPlanMap.on("contextmenu", this.handleContextMenu);
		},
		addPoint({ lngLat }) {
			this.$store.dispatch("addPoint", {
				coordinates: { longitude: lngLat.lng, latitude: lngLat.lat },
			});
		},
		pointDragged({ marker }, index) {
			const payload = {
				index,
				coordinates: {
					longitude: marker._lngLat.lng,
					latitude: marker._lngLat.lat,
				},
			};

			this.$store.dispatch("updatePoint", payload);
		},
		pointClicked(e, pointIndex) {
			e.stopPropagation();
			this.$store.dispatch("selectPoint", pointIndex);
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
		points: {
			get() {
				return this.$store.state.flightPlan.points;
			},
			set(payload) {
				return this.$store.dispatch.addPoint(payload);
			},
		},
		geoJsonSource() {
			return this.$store.state.flightPlan.dronePath.geoJsonSource;
		},
		geoJsonLayer() {
			return this.$store.state.flightPlan.dronePath.geoJsonLayer;
		},
		droneInitialLocation() {
			return this.$store.state.flightData.droneInitialLocation;
		},
	},
	watch: {
		points(points) {
			const coordinates = this.points.map(({ coordinates }) => {
				return [coordinates.longitude, coordinates.latitude];
			});
			this.$store.dispatch("setDronePathCoordinates", coordinates);
		},
		droneInitialLocation(coordinates) {
			this.$flightPlanMap.panTo(coordinates);
		},
	},
};
</script>
