<template>
    <fragment>
        <li class="list__item" v-if="!armStatus">
            <button @click="arm">
                <span>Arm</span>
            </button>
        </li>
        <li class="list__item" v-else>
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
import { swal } from "@/core/popups.js";
import { $number_input } from "@/core/popup_options.js";

export default {
    name: "FlightDataHeader",
    data() {
        return {
            armStatus: false
        };
    },
    methods: {
        arm() {
            API.arm()
                .then(response => {
                    console.log("Armed");
                })
                .catch(error => {
                    console.log("Arming failed", error);
                });
        },
        disarm() {
            API.disarm()
                .then(response => {
                    console.log("Disarmed");
                })
                .catch(error => {
                    console.log("Disarming failed", error);
                });
        },
        takeoff() {
            swal.fire(
                $number_input({
                    title: "Enter altitude",
                    inputValue: 10
                })
            ).then(({ value }) => {
                const body = {
                    altitude: Number(value)
                }

                API.takeoff(body)
                    .then(response => {
                        console.log("Takeoff");
                    })
                    .catch(error => {
                        console.log("Takeoff failed", error);
                    });
            });
        },
        archive() {
            console.log("expandSeachArea");
            this.$emit("expandSeachArea");
        }
    },
    mounted() {
        this.$Bus.$on("telemetry_data", telemetry => {
            this.armStatus = telemetry.arm_status;
            console.log(telemetry)
        });
    }
};
</script>
