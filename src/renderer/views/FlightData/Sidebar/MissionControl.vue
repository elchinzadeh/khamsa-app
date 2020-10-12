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
                :text="shownStatus"
            />
        </div>
    </div>
</template>

<script>
import API from '@/api';
import { Button, ProgressBar, ProgressRing } from '@/components';
import { MissionStatus } from '@/core/enums';
import { toast } from '@/core/popups.js';

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
            shownStatus: '',
            shownStatusTimeout: null,
        };
    },
    methods: {
        startMission() {
            API.startMission().then(() => {
                this.missionStatus = MissionStatus.STARTED;
                toast.fire({
                    type: 'success',
                    title: 'Mission started',
                });
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
                this.missionStatus = MissionStatus.CONTINUED;
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
                MissionStatus.CONTINUED,
                MissionStatus.COMPLETED,
            ].includes(this.missionStatus);
        },
        pauseButtonActivated() {
            return this.isLive && this.missionUploaded && [
                MissionStatus.STARTED,
                MissionStatus.CONTINUED,
            ].includes(this.missionStatus);
        },
        abortButtonActivated() {
            return this.isLive && this.missionUploaded && [
                MissionStatus.UPLOADED,
                MissionStatus.STARTED,
                MissionStatus.PAUSED,
                MissionStatus.CONTINUED,
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
                MissionStatus.CONTINUED,
                MissionStatus.COMPLETED,
            ].includes(this.missionStatus)) {
                return 'Restart';
            } else {
                return 'Start';
            }
        },
    },
    watch: {
        missionStatus(status) {
            clearTimeout(this.shownStatusTimeout);

            if (status === MissionStatus.NOT_UPLOADED) {
                this.shownStatus = '';
            }
            if (status === MissionStatus.UPLOADED) {
                this.shownStatus = 'Uploaded';
            }
            if (status === MissionStatus.STARTED) {
                this.shownStatus = 'Started';
                this.shownStatusTimeout = setTimeout(() => {
                    this.shownStatus = 'In Progress';
                }, 2000);
            }
            if (status === MissionStatus.PAUSED) {
                this.shownStatus = 'Paused';
            }
            if (status === MissionStatus.CONTINUED) {
                this.shownStatus = 'Continued';
                this.shownStatusTimeout = setTimeout(() => {
                    this.shownStatus = 'In Progress';
                }, 2000);
            }
            if (status === MissionStatus.ABORTED) {
                this.shownStatus = 'Aborted';
                this.shownStatusTimeout = setTimeout(() => {
                    this.shownStatus = '';
                }, 5000);
            }
            if (status === MissionStatus.COMPLETED) {
                this.shownStatus = 'Completed';
            }
        },
    },
};
</script>
