<template>
    <fragment>
        <li
            :class="{
                'list__item': true,
                'list__item--deactive': !missionUploded && !isLive
            }"
        >
            <button @click="isLive && startMission()">Start mission</button>
        </li>
    </fragment>
</template>

<script>
import API from '@/api';
import { toast } from '@/core/popups';
import { MissionStatus } from '@/core/enums';

export default {
    name: 'FlightPlanHeader',
    methods: {
        startMission() {
            // watch?v=ML1nMEcJdP0
            if (this.missionUploded) {
                API.startMission().then((response) => {
                    toast.fire({
                        type: 'success',
                        title: 'Mission started',
                    });
                    this.$store.dispatch('setMissionStatus', MissionStatus.STARTED);
                });
            }
        },

    },
    computed: {
        missionUploded() {
            return this.$store.state.mission.uploaded;
        },
        isLive() {
            return this.$store.state.general.isLive;
        },
    },
};
</script>
