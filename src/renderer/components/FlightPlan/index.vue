<template>
    <div class="flight-plan">
        <FlightPlanMap @insertWaypoints="insertWaypoints" />
        <!-- <VueResizable fitParent :active="['t']" :minHeight="150" width="100%" @resize:move="onMove"> -->
        <Info @insertWaypoints="insertWaypoints" />
        <!-- </VueResizable> -->
    </div>
</template>

<script>
import axios from "axios";
// import VueResizable from "vue-resizable";

import FlightPlanMap from "./Map";
import Info from "./Info";
import "./style.scss";

export default {
    name: "FlightPlan",
    components: {
        FlightPlanMap,
        Info
        // VueResizable
    },
    created() {
        window.addEventListener("resize", () => {
            this.$forceUpdate();
        });
    },
    methods: {
        insertWaypoints() {
            const data = this.points.map(point => {
                return {
                    latitude: point.coordinates.latitude,
                    longitude: point.coordinates.longitude,
                    altitude: point.altitude,
                    action_type: point.command
                };
            });
        },
        onMove() {
            // console.log(this.$flightPlanMap);
        }
    },
    computed: {
        points() {
            return this.$store.state.flightPlan.points;
        }
    },
    watch: {
        points() {
            this.insertWaypoints();
        }
    }
};
</script>
