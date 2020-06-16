<template>
    <div class="flight-plan">
        <FlightPlanMap @insertWaypoints="insertWaypoints" />
        <Info @insertWaypoints="insertWaypoints" />
    </div>
</template>

<script>
import axios from "axios";
import FlightPlanMap from "./Map";
import Info from "./Info";
import "./style.scss";

export default {
    name: "FlightPlan",
    components: {
        FlightPlanMap,
        Info,
    },
    methods: {
        insertWaypoints() {
            const data = this.points.map((point) => {
                return {
                    latitude: point.coordinates.latitude,
                    longitude: point.coordinates.longitude,
                    altitude: point.altitude,
                    action_type: point.command,
                };
            });

            axios
                .post(
                    "http://127.0.0.1:8000/insertWaypointsOrSomethingElse",
                    data
                )
                .then((response) => {
                    // response
                    console.log(response);
                });
        },
    },
    computed: {
        points() {
            return this.$store.state.flightPlan.points;
        },
    },
    watch: {
        points() {
            this.insertWaypoints();
        },
    },
};
</script>
