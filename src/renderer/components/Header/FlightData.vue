<template>
    <fragment>
        <li class="list__item">
            <button @click="arm">
                <span>Arm</span>
            </button>
        </li>
        <li class="list__item">
            <button @click="disarm">
                <span>Disarm</span>
            </button>
        </li>
        <li class="list__item">
            <button @click="takeoff">
                <span>Takeoff</span>
            </button>
        </li>
        <li class="list__item">
            <button @click="archive">Archive</button>
        </li>
    </fragment>
</template>

<script>
import API from "@/api";

export default {
    name: "FlightDataHeader",
    methods: {
        arm() {
            API.arm()
                .then((response) => {
                    console.log("Armed");
                })
                .catch((error) => {
                    console.log("Arming failed", error);
                });
        },
        disarm() {
            API.disarm()
                .then((response) => {
                    console.log("Disarmed");
                })
                .catch((error) => {
                    console.log("Disarming failed", error);
                });
        },
        takeoff() {
            API.takeoff()
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
