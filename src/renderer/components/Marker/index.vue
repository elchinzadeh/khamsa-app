<template>
    <div
        class="marker"
        @click="$emit('click', $event)"
        @dblclick="$emit('dblclick', $event)"
    >
        <svg
            height="35px"
            width="27px"
            viewBox="0 0 27 35"
        >
            <g fill-rule="nonzero">
                <g
                    v-if="shadow"
                    transform="translate(3.0, 29.0)"
                    fill="#000000"
                >
                    <ellipse
                        opacity="0.04"
                        cx="10.5"
                        cy="5.80029008"
                        rx="10.5"
                        ry="5.25002273"
                    />
                    <ellipse
                        opacity="0.04"
                        cx="10.5"
                        cy="5.80029008"
                        rx="10.5"
                        ry="5.25002273"
                    />
                    <ellipse
                        opacity="0.04"
                        cx="10.5"
                        cy="5.80029008"
                        rx="9.5"
                        ry="4.77275007"
                    />
                    <ellipse
                        opacity="0.04"
                        cx="10.5"
                        cy="5.80029008"
                        rx="8.5"
                        ry="4.29549936"
                    />
                    <ellipse
                        opacity="0.04"
                        cx="10.5"
                        cy="5.80029008"
                        rx="7.5"
                        ry="3.81822308"
                    />
                    <ellipse
                        opacity="0.04"
                        cx="10.5"
                        cy="5.80029008"
                        rx="6.5"
                        ry="3.34094679"
                    />
                    <ellipse
                        opacity="0.04"
                        cx="10.5"
                        cy="5.80029008"
                        rx="5.5"
                        ry="2.86367051"
                    />
                    <ellipse
                        opacity="0.04"
                        cx="10.5"
                        cy="5.80029008"
                        rx="4.5"
                        ry="2.38636864"
                    />
                </g>
                <g
                    :fill="markerColor"
                    :opacity="transparent ? opacity : 1"
                >
                    <path
                        d="M27,13.5 C27,19.074644 20.250001,27.000002 14.75,34.500002 C14.016665,35.500004 12.983335,35.500004 12.25,34.500002 C6.7499993,27.000002 0,19.222562 0,13.5 C0,6.0441559 6.0441559,0 13.5,0 C20.955844,0 27,6.0441559 27,13.5 Z"
                    />
                </g>
                <g
                    opacity="0.25"
                    fill="#000000"
                >
                    <path
                        d="M13.5,0 C6.0441559,0 0,6.0441559 0,13.5 C0,19.222562 6.7499993,27 12.25,34.5 C13,35.522727 14.016664,35.500004 14.75,34.5 C20.250001,27 27,19.074644 27,13.5 C27,6.0441559 20.955844,0 13.5,0 Z M13.5,1 C20.415404,1 26,6.584596 26,13.5 C26,15.898657 24.495584,19.181431 22.220703,22.738281 C19.945823,26.295132 16.705119,30.142167 13.943359,33.908203 C13.743445,34.180814 13.612715,34.322738 13.5,34.441406 C13.387285,34.322738 13.256555,34.180814 13.056641,33.908203 C10.284481,30.127985 7.4148684,26.314159 5.015625,22.773438 C2.6163816,19.232715 1,15.953538 1,13.5 C1,6.584596 6.584596,1 13.5,1 Z"
                    />
                </g>
                <g
                    transform="translate(6.0, 7.0)"
                    fill="#FFFFFF"
                />
                <g transform="translate(0, -3.0)">
                    <text
                        x="50%"
                        y="50%"
                        fill="white"
                        style="font-family: inherit; font-weight: 700;"
                        dominant-baseline="middle"
                        text-anchor="middle"
                    >
                        {{ text }}
                    </text>
                </g>
                <g
                    transform="translate(6, 6)"
                >
                    <slot name="icon"/>
                </g>
            </g>
        </svg>
    </div>
</template>

<script>
export default {
    name: 'CustomMarker',
    props: {
        text: {
            required: false,
            type: [
                String,
                Number,
            ],
            default: null,
        },
        color: {
            required: false,
            type: String,
        },
        transparent: {
            required: false,
            type: Boolean,
            default: false,
        },
        opacity: {
            required: false,
            type: Number,
            default: 0.5,
        },
        shadow: {
            required: false,
            type: Boolean,
            default: false,
        },
        type: {
            type: String,
            required: false,
            default: 'waypoint',
        },
    },
    data() {
        return {
            colors: {
                waypoint: 'blue',
                takeoff: 'green',
                land: 'purple',
            },
        };
    },
    computed: {
        markerColor() {
            if (this.color) {
                return this.color;
            } else if (this.type) {
                return this.colors[this.type];
            } else {
                return 'blue';
            }
        },
    },
};
</script>

<style lang="scss">
.marker {
    top: 6px;

    svg {
        transition: transform 0.1s ease-in-out;
        &:hover {
            transform: scale(1.1);
        }
    }
}
</style>
