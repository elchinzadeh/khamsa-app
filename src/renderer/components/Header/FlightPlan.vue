<template>
    <fragment>
        <li
            :class="{
            'list__item': true,
            'list__item--deactive': !missionUploded
            }"
        >
            <button @click="startMission">Start mission</button>
        </li>
    </fragment>
</template>

<script>
import API from "@/api";
import { toast } from "@/core/popups";

export default {
    name: "FlightPlanHeader",
    methods: {
        startMission() {
            // watch?v=ML1nMEcJdP0
            if (this.missionUploded) {
                API.startMission().then(response => {
                    toast.fire({
                        type: "success",
                        title: "Mission started"
                    });
                });
            }
        }
    },
    computed: {
        missionUploded() {
            return this.$store.state.flightPlan.missionUploaded;
        }
    }
};
</script>
