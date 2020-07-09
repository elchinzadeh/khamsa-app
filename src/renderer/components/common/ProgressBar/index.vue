<template>
    <div class="progress-bar">
        <div class="progress-bar__progress" :style="`width: ${percent}%`" />
    </div>
</template>

<script>
import "./style.scss";

export default {
    name: "ProgressBar",
    props: {
        percent: {
            required: true,
            type: Number
        }
    }
};
</script>