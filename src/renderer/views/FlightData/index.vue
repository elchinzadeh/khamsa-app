<template>
    <div class="flight-data">
        <Sidebar />
        <Map />
    </div>
</template>

<script>
import Sidebar from './Sidebar';
import Map from './Map';
import './style.scss';

export default {
    name: 'FlightData',
    components: {
        Sidebar,
        Map,
    },
};
</script>
