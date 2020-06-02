<template>
    <div class="sidebar scrollbar">
        <app-toolbar
            @last-logs-pressed="isLastLogsShown = !isLastLogsShown"
            @indicators-pressed="isIndicatorsShown = !isIndicatorsShown"
        ></app-toolbar>
        <app-last-logs
            v-bind="{ telemetry }"
            v-show="isLastLogsShown"
        ></app-last-logs>
        <app-indicators v-show="isIndicatorsShown"></app-indicators>
    </div>
</template>

<script>
import Toolbar from "@/components/FlightData/Sidebar/Toolbar";
import LastLogs from "@/components/FlightData/Sidebar/LastLogs";
import Indicators from "@/components/FlightData/Sidebar/Indicators";
import { TELEMETRY_PACKET_PARAMETERS_COUNT } from "@/core/constants.js";
import "./style.scss";

export default {
    components: {
        appToolbar: Toolbar,
        appLastLogs: LastLogs,
        appIndicators: Indicators,
    },
    data() {
        return {
            telemetry: {
                pitch: 0,
                roll: 0,
                latitude: 0,
                longitude: 0,
                altitude: 0,
                verticalSpeed: 0,
                airSpeed: 0,
            },
            isLastLogsShown: true,
            isIndicatorsShown: true,
            acceleration: {
                x: 0,
                y: 0,
                z: 0,
                time: 0,
            },
        };
    },
    mounted() {
        this.$Bus.$on("telemetry_data", (telemetry) => {
            if (
                Object.keys(telemetry).length <
                TELEMETRY_PACKET_PARAMETERS_COUNT
            ) {
                return;
            }

            this.telemetry = {
                pitch: telemetry.pitch_deg.toFixed(8),
                roll: telemetry.roll_deg.toFixed(8),
                latitude: telemetry.latitude_deg.toFixed(8),
                longitude: telemetry.longitude_deg.toFixed(8),
                altitude: telemetry.relative_altitude_m.toFixed(8),
                verticalSpeed: Math.abs(telemetry.velocity_down_m_s).toFixed(8),
                airSpeed: Math.abs(telemetry.velocity_east_m_s).toFixed(8),
            };
        });
    },
};
</script>
