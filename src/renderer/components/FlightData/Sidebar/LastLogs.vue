<template>
    <div class="sidebar__last-logs">
        <ul>
            <li>
                <span>Latitude:</span>
                <span>{{ telemetry.latitude }}</span>
            </li>
            <li>
                <span>Longitude:</span>
                <span>{{ telemetry.longitude }}</span>
            </li>
            <li>
                <span>Pitch:</span>
                <span>{{ telemetry.pitch }}</span>
            </li>
            <li>
                <span>Roll:</span>
                <span>{{ telemetry.roll }}</span>
            </li>

            <li>
                <span>Altitude:</span>
                <span>{{ telemetry.altitude }}</span>
            </li>

            <li>
                <span>Vertical speed:</span>
                <span>{{ telemetry.verticalSpeed }}</span>
            </li>

            <li>
                <span>Air speed:</span>
                <span>{{ telemetry.airSpeed }}</span>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    props: {
        telemetry: {
            required: true,
            type: Object,
        },
    },
};
</script>
