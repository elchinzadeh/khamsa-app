<template>
    <div class="sidebar__indicators">
        <HUD
            :hudData="hudData"
        />
        <span id="heading"></span>
        <span id="altimeter"></span>
        <span id="airspeed"></span>
        <span id="variometer"></span>
    </div>
</template>

<script>
import 'jquery-flight-indicators/js/jquery.flightindicators.min.js';
import HUD from './HUD';

export default {
    components: { HUD },
    data() {
        return {
            initPositions: {
                heading: {
                    heading: 0,
                    showBox: true,
                },
                attitude: {
                    roll: 0,
                    pitch: 0,
                    size: 200,
                    showBox: true,
                },
                variometer: {
                    vario: 0,
                    showBox: true,
                },
                airSpeed: { showBox: false },
            },
            hudData: {
                yaw: 0,
                pitch: 0,
                roll: 0,
                airSpeed: 0,
                verticalSpeed: 0,
                altitude: 0,
            },
        };
    },
    mounted() {
        // const attitude = $.flightIndicator(
        //     '#attitude',
        //     'attitude',
        //     this.initPositions.attitude,
        // );
        const heading = $.flightIndicator(
            '#heading',
            'heading',
            this.initPositions.heading,
        );
        const variometer = $.flightIndicator(
            '#variometer',
            'variometer',
            this.initPositions.variometer,
        );
        const airspeed = $.flightIndicator(
            '#airspeed',
            'airspeed',
            this.initPositions.airspeed,
        );
        const altimeter = $.flightIndicator('#altimeter', 'altimeter');

        this.$Bus.$on(
            'telemetry_data',
            ({
                pitch_deg = 0,
                roll_deg = 0,
                yaw_deg = 0,
                relative_altitude_m = 0,
                velocity_down_m_s = 0,
                velocity_east_m_s = 0,
            }) => {
                // if (Object.keys(telemetry).length < TELEMETRY_PACKET_PARAMETERS_COUNT) {
                //     return
                // }

                heading.setHeading(yaw_deg);
                // attitude.setRoll(roll_deg);
                // attitude.setPitch(pitch_deg);
                airspeed.setAirSpeed(Math.abs(velocity_east_m_s));
                variometer.setVario(Math.abs(velocity_down_m_s));
                altimeter.setAltitude(relative_altitude_m * 10);

                this.hudData.yaw = yaw_deg;
                this.hudData.pitch = pitch_deg;
                this.hudData.roll = roll_deg;
                this.hudData.airSpeed = Math.abs(velocity_east_m_s).toFixed(2);
                this.hudData.verticalSpeed = Math.abs(velocity_down_m_s).toFixed(2);
                this.hudData.altitude = relative_altitude_m.toFixed(2);
            },
        );
    },
};
</script>

<style lang="scss">
@import "~jquery-flight-indicators/css/flightindicators.min.css";
</style>
