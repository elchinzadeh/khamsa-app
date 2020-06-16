<template>
    <fragment>
        <li class="toolbar__menu__list__item">
            <button @click="arm">
                <span>Arm</span>
            </button>
        </li>
        <li class="toolbar__menu__list__item">
            <button @click="disarm">
                <span>Disarm</span>
            </button>
        </li>
        <li class="toolbar__menu__list__item">
            <button @click="takeoff">
                <span>Takeoff</span>
            </button>
        </li>
        <li class="toolbar__menu__list__item">
            <button @click="archive">Archive</button>
        </li>
    </fragment>
</template>

<script>
import axios from "axios";

export default {
    name: "FlightDataHeader",
    methods: {
        arm() {
            axios
                .get("http://172.16.40.96:8000/arm")
                .then((response) => {
                    console.log("Armed");
                })
                .catch((error) => {
                    console.log("Arming failed", error);
                });
        },
        disarm() {
            axios
                .get("http://172.16.40.96:8000/disarm")
                .then((response) => {
                    console.log("Disarmed");
                })
                .catch((error) => {
                    console.log("Disarming failed", error);
                });
        },
        takeoff() {
            axios
                .get("http://172.16.40.96:8000/takeoff")
                .then((response) => {
                    console.log("Takeoff");
                })
                .catch((error) => {
                    console.log("Takeoff failed", error);
                });
        },
        archive() {
            console.log("expandSeachArea");
            this.$emit("expandSeachArea");
        },
    },
};
</script>
