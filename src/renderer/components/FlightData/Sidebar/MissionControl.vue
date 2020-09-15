<template>
    <div class="sidebar__mission-control">
        <!-- All progress -->
        <ProgressBar :percent="70" />

        <!-- Actions -->
        <div class="actions">
            <Button @click="startMission">Start</Button>
            <Button @click="pauseMission">Pause</Button>
            <Button @click="abortMission">Abort</Button>
            <Button @click="continueMission">Continue</Button>
        </div>

        <!-- Current Progress -->
        <div class="mission-progress">
            <ProgressRing :strokeWidth="6" :percent="percent" />
        </div>
    </div>
</template>

<script>
import API from '@/api';
import { Button, ProgressBar, ProgressRing } from "@/components/common";

export default {
    name: "MissionControl",
    components: {
        Button,
        ProgressBar,
        ProgressRing
    },
    data() {
        return {
            percent: 0
        };
    },
    methods: {
        startMission(){
            API.startMission()
        },
        pauseMission(){
            API.pauseMission()
        },
        abortMission(){
            API.abortMission()
        },
        continueMission(){
            API.continueMission()
        },
    }
};
</script>