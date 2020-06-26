<template>
    <div class="flight-data">
        <Sidebar />
        <Map />
    </div>
</template>

<script>
import Sidebar from "@/components/FlightData/Sidebar/Sidebar";
import Map from "@/components/FlightData/Map";
import "./style.scss";

export default {
    name: "FlightData",
    components: {
        Sidebar,
        Map,
    },
};
</script>
