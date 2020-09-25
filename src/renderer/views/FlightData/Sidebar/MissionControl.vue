<template>
    <div class="sidebar__mission-control">
        <!-- All progress -->
        <ProgressBar :percent="missionProgress" />

        <!-- Actions -->
        <div class="actions">
            <Button
                @click="startMission"
                :disabled="!startButtonActivated"
            >
                {{ startButtonText }}
            </Button>
            <Button
                @click="pauseMission"
                :disabled="!pauseButtonActivated"
            >
                Pause
            </Button>
            <Button
                @click="abortMission"
                :disabled="!abortButtonActivated"
            >
                Abort
            </Button>
            <Button
                @click="continueMission"
                :disabled="!continueButtonActivated"
            >
                Continue
            </Button>
        </div>

        <!-- Current Progress -->
        <div class="mission-progress">
            <ProgressRing
                :strokeWidth="6"
                :percent="missionProgress"
                :text="missionStatus === MissionStatus.COMPLETED ? 'Completed' : null"
            />
        </div>
    </div>
</template>

<script>
import API from '@/api';
import { Button, ProgressBar, ProgressRing } from '@/components';
import { MissionStatus } from '@/core/enums';

export default {
    name: 'MissionControl',
    components: {
        Button,
        ProgressBar,
        ProgressRing,
    },
    data() {
        return {
            percent: 0,
            MissionStatus,
        };
    },
    methods: {
        startMission() {
            API.startMission().then(() => {
                this.missionStatus = MissionStatus.STARTED;
            });
        },
        pauseMission() {
            API.pauseMission().then(() => {
                this.missionStatus = MissionStatus.PAUSED;
            });
        },
        abortMission() {
            API.abortMission().then(() => {
                this.missionStatus = MissionStatus.ABORTED;
            });
        },
        continueMission() {
            API.continueMission().then(() => {
                this.missionStatus = MissionStatus.STARTED;
            });
        },
    },
    computed: {
        isLive() {
            return this.$store.state.general.isLive;
        },
        missionProgress() {
            return Number(this.$store.state.mission.progress.toFixed(0));
        },
        missionUploaded() {
            return this.$store.state.mission.uploaded;
        },
        missionStatus: {
            get() {
                return this.$store.state.mission.status;
            },
            set(value) {
                this.$store.dispatch('setMissionStatus', value);
            },
        },
        startButtonActivated() {
            return this.isLive && this.missionUploaded && [
                MissionStatus.UPLOADED,
                MissionStatus.STARTED,
                MissionStatus.PAUSED,
                MissionStatus.COMPLETED,
            ].includes(this.missionStatus);
        },
        pauseButtonActivated() {
            return this.isLive && this.missionUploaded && [MissionStatus.STARTED].includes(this.missionStatus);
        },
        abortButtonActivated() {
            return this.isLive && this.missionUploaded && [
                MissionStatus.UPLOADED,
                MissionStatus.STARTED,
                MissionStatus.PAUSED,
                MissionStatus.COMPLETED,
            ].includes(this.missionStatus);
        },
        continueButtonActivated() {
            return this.isLive && this.missionUploaded && [MissionStatus.PAUSED].includes(this.missionStatus);
        },
        startButtonText() {
            if ([
                MissionStatus.STARTED,
                MissionStatus.PAUSED,
                MissionStatus.COMPLETED,
            ].includes(this.missionStatus)) {
                return 'Restart';
            } else {
                return 'Start';
            }
        },
    },
};
</script>
