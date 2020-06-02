<template>
    <div class="flight-plan">
        <FlightPlanMap />
        <Info />
    </div>
</template>

<script>
import FlightPlanMap from "./Map";
import Info from "./Info";
import "./style.scss";

export default {
    name: "FlightPlan",
    components: {
        FlightPlanMap,
        Info,
    },
};
</script>
