<template>
    <div>
        <svg class="progress-ring" :height="size" :width="size">
            <circle
                class="progress-ring__background"
                :stroke="backStrokeColor"
                :stroke-width="strokeWidth"
                fill="transparent"
                :r="radius"
                :cx="size / 2"
                :cy="size / 2"
            />
            <circle
                ref="circle"
                class="progress-ring__circle"
                :stroke="strokeColor"
                :stroke-width="strokeWidth"
                fill="transparent"
                :r="radius"
                :cx="size / 2"
                :cy="size / 2"
            />
            <text
                x="50%"
                y="50%"
                dominant-baseline="middle"
                text-anchor="middle"
                font-size="20px"
                font-weight="500"
                fill="#ffffff"
            >{{ percent }}%</text>
        </svg>
    </div>
</template>

<script>
import "./style.scss";

export default {
    name: "ProgressRing",
    props: {
        size: {
            required: false,
            type: Number,
            default: 120
        },
        strokeWidth: {
            required: false,
            type: Number,
            default: 4
        },
        strokeColor: {
            required: false,
            type: String,
            default: "#009900"
        },
        backStrokeColor: {
            required: false,
            type: String,
            default: "#3d3d3d"
        },
        percent: {
            required: true,
            type: Number
        }
    },
    mounted() {
        this.$refs.circle.style.strokeDasharray = `${this.circumference} ${this.circumference}`;
        this.$refs.circle.style.strokeDashoffset = this.circumference;

        this.setProgress(this.percent);
    },
    methods: {
        setProgress(percent) {
            const offset =
                this.circumference - (percent / 100) * this.circumference;
            this.$refs.circle.style.strokeDashoffset = offset;
        }
    },
    computed: {
        radius() {
            return this.size / 2 - this.strokeWidth;
        },
        circumference() {
            return this.radius * 2 * Math.PI;
        }
    },
    watch: {
        percent(value) {
            this.setProgress(value);
        }
    }
};
</script>