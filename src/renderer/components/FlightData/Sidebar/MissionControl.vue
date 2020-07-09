<template>
    <div class="sidebar__mission-control">
        <!-- All progress -->
        <ProgressBar :percent="70" />

        <!-- Actions -->
        <div class="actions">
            <Button>Start</Button>
            <Button>Stop</Button>
            <Button>Pause</Button>
            <Button>Continue</Button>
        </div>

        <!-- Current Progress -->
        <div class="mission-progress">
            <ProgressRing :strokeWidth="6" :percent="percent" />
        </div>
    </div>
</template>

<script>
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
    }
};
</script>