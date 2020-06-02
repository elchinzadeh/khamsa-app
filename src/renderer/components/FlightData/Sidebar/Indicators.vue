<template>
    <div class="sidebar__indicators">
        <span id="attitude"></span>
        <span id="heading"></span>
        <span id="variometer"></span>
        <span id="airspeed"></span>
        <span id="altimeter"></span>
    </div>
</template>

<script>
import "jquery-flight-indicators/js/jquery.flightindicators.min.js";
import { TELEMETRY_PACKET_PARAMETERS_COUNT } from "@/core/constants.js"

export default {
    mounted() {
        let attitude = $.flightIndicator("#attitude", "attitude", this.initPositions.attitude);
        let heading = $.flightIndicator("#heading", "heading", this.initPositions.heading);
        let variometer = $.flightIndicator("#variometer", "variometer", this.initPositions.variometer);
        let airspeed = $.flightIndicator("#airspeed", "airspeed", this.initPositions.airspeed);
        let altimeter = $.flightIndicator("#altimeter", "altimeter");

        this.$Bus.$on('telemetry_data', (telemetry) => {
            if (Object.keys(telemetry).length < TELEMETRY_PACKET_PARAMETERS_COUNT) {
                return
            }

            heading.setHeading(telemetry.yaw_deg);
            attitude.setRoll(telemetry.roll_deg)
            attitude.setPitch(telemetry.pitch_deg)
            airspeed.setAirSpeed(Math.abs(telemetry.velocity_east_m_s))
            variometer.setVario(Math.abs(telemetry.velocity_down_m_s))
            altimeter.setAltitude(telemetry.relative_altitude_m)
        })
    },
    data () {
        return {
            initPositions: {
                heading: {
                    heading: 0,
                    showBox: true
                },
                attitude: {
                    roll: 0,
                    pitch: 0,
                    size: 200,
                    showBox: true
                },
                variometer: {
                    vario: 0,
                    showBox: true
                },
                airSpeed: {
                    showBox: false
                }
            }
        }
    }
};
</script>

<style lang="scss">
@import "~jquery-flight-indicators/css/flightindicators.min.css";
</style>