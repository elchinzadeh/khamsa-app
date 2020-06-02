<template>
    <div class="info scrollbar">
        <table class="points-table">
            <thead>
                <th>ID</th>
                <th>Command</th>
                <th>Delay</th>
                <th>Latitude</th>
                <th>Longitude</th>
                <th>Altitude</th>
                <th>Actions</th>
            </thead>
            <tbody>
                <!-- Waypoints -->
                <tr v-for="(point, index) in points" :key="index">
                    <td class="cell cell--text">
                        {{ index + 1 }}
                    </td>
                    <td class="cell">
                        <select
                            name="command"
                            :value="point.command"
                            @change="commandChange($event, index)"
                        >
                            <option
                                v-for="command in commands"
                                :key="command.key"
                                :value="command.key"
                                >{{ command.name }}</option
                            >
                        </select>
                        <!-- {{ point.command }} -->
                    </td>
                    <td class="cell">
                        <input
                            type="number"
                            name="delay"
                            :data-index="index"
                            :value="point.delay"
                            @change="inputChange"
                        />
                    </td>
                    <td class="cell">
                        <input
                            type="number"
                            step="any"
                            name="coordinates.latitude"
                            :data-index="index"
                            :value="point.coordinates.latitude.toFixed(15)"
                            @change="inputChange"
                        />
                    </td>
                    <td class="cell">
                        <input
                            type="number"
                            step="any"
                            name="coordinates.longitude"
                            :data-index="index"
                            :value="point.coordinates.longitude.toFixed(15)"
                            @change="inputChange"
                        />
                    </td>
                    <td class="cell">
                        <input
                            type="number"
                            name="altitude"
                            :data-index="index"
                            :value="point.altitude"
                            @change="inputChange"
                        />
                    </td>
                    <td class="cell">
                        <button class="btn" @click="deletePoint(index)">
                            <TrashIcon size="14" title="Delete" />
                        </button>
                    </td>
                </tr>

                <!-- Empty text -->
                <tr v-if="!points.length">
                    <td class="cell cell--text cell--empty" colspan="7">
                        There is no data to show. Click on the map to add
                        waypoints.
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import { TrashIcon } from "vue-feather-icons";

export default {
    name: "FlightPlanInfo",
    components: {
        TrashIcon,
    },
    data() {
        return {
            commands: [
                {
                    key: "waypoint",
                    name: "Waypoint",
                },
                {
                    key: "takeoff",
                    name: "Takeoff",
                },
                {
                    key: "land",
                    name: "Land",
                },
            ],
        };
    },
    methods: {
        commandChange(e, index) {
            const payload = {
                index,
                command: e.target.value,
            };
            this.$store.dispatch("updatePoint", payload);
        },
        inputChange(e) {
            const data = {};
            data.index = Number(e.target.dataset.index);

            if (e.target.name.includes("coordinates")) {
                const param = e.target.name.split(".")[1];
                data.coordinates = {};
                data.coordinates[param] = Number(e.target.value);
            } else {
                data[e.target.name] = Number(e.target.value);
            }

            this.$store.dispatch("updatePoint", data);
        },
        deletePoint(index) {
            this.$store.dispatch("deletePoint", index);
        },
    },
    computed: {
        points() {
            return this.$store.state.flightPlan.points;
        },
    },
};
</script>
