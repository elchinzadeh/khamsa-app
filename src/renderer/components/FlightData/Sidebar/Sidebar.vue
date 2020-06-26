<template>
    <div class="sidebar scrollbar">
        <Toolbar
            @last-logs-pressed="isLastLogsShown = !isLastLogsShown"
            @indicators-pressed="isIndicatorsShown = !isIndicatorsShown"
        />
        <LastLogs :telemetry="telemetry" v-show="isLastLogsShown" />
        <Indicators v-show="isIndicatorsShown" />
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
        Toolbar,
        LastLogs,
        Indicators,
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
            isLastLogsShown: false,
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
        this.$Bus.$on(
            "telemetry_data",
            ({
                pitch_deg = 0,
                roll_deg = 0,
                latitude_deg = 0,
                longitude_deg = 0,
                relative_altitude_m = 0,
                velocity_down_m_s = 0,
                velocity_east_m_s = 0,
            }) => {
                /* I don't know why this exists */
                // if (
                //     Object.keys(telemetry).length <
                //     TELEMETRY_PACKET_PARAMETERS_COUNT
                // ) {
                //     return;
                // }

                this.telemetry = {
                    pitch: pitch_deg ? pitch_deg.toFixed(8) : 0,
                    roll: roll_deg ? roll_deg.toFixed(8) : 0,
                    latitude: latitude_deg ? latitude_deg.toFixed(8) : 0,
                    longitude: longitude_deg ? longitude_deg.toFixed(8) : 0,
                    altitude: relative_altitude_m
                        ? relative_altitude_m.toFixed(8)
                        : 0,
                    verticalSpeed: velocity_down_m_s
                        ? Math.abs(velocity_down_m_s).toFixed(8)
                        : 0,
                    airSpeed: velocity_east_m_s
                        ? Math.abs(velocity_east_m_s).toFixed(8)
                        : 0,
                };
            }
        );
    },
};
</script>
