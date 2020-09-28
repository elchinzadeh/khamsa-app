<template>
    <div class="info scrollbar">
        <!-- Action bar -->
        <div class="action-bar">
            <div class="action-bar__left">
                <Checkbox
                    v-model="returnToLaunch"
                    label="Return to launch"
                    :disabled="!isLive"
                />
            </div>
            <div class="action-bar__right">
                <Button
                    @click="uploadMission"
                    :disabled="!isLive"
                >
                    Upload mission
                </Button>
            </div>
        </div>

        <!-- Table -->
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
                <tr
                    v-for="(point, index) in points"
                    :key="index"
                    :class="{ 'row--selected': index === selectedPointIndex }"
                >
                    <td class="cell cell--text">{{ index + 1 }}</td>
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
                            >
                                {{ command.name }}
                            </option>
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
                        <button
                            class="btn"
                            @click="deletePoint(index)"
                        >
                            <TrashIcon
                                size="14"
                                title="Delete"
                            />
                        </button>
                    </td>
                </tr>

                <!-- Empty text -->
                <tr v-if="!points.length">
                    <td
                        class="cell cell--text cell--empty"
                        colspan="7"
                    >
                        There is no data to show. Click on the map to add
                        waypoints.
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import { TrashIcon } from 'vue-feather-icons';
import API from '@/api';
import { toast } from '@/core/popups';
import { Button, Checkbox } from '@/components';
import { MissionStatus } from '@/core/enums';

export default {
    name: 'FlightPlanInfo',
    components: {
        TrashIcon,
        Button,
        Checkbox,
    },
    data() {
        return {
            commands: [
                {
                    key: 'waypoint',
                    name: 'Waypoint',
                },
                {
                    key: 'takeoff',
                    name: 'Takeoff',
                },
                {
                    key: 'land',
                    name: 'Land',
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
            this.$store.dispatch('updatePoint', payload);
            this.$emit('insertWaypoints');
        },
        inputChange(e) {
            const data = {};
            data.index = Number(e.target.dataset.index);

            if (e.target.name.includes('coordinates')) {
                const param = e.target.name.split('.')[1];
                data.coordinates = {};
                data.coordinates[param] = Number(e.target.value);
            } else {
                data[e.target.name] = Number(e.target.value);
            }

            this.$store.dispatch('updatePoint', data);
            this.$emit('insertWaypoints');
        },
        deletePoint(index) {
            this.$store.dispatch('deletePoint', index);
        },
        uploadMission() {
            const body = {
                points: this.points,
                rtl: this.returnToLaunch,
            };
            // deezer.com/en/track/883649052

            API.uploadMission(body).then((response) => {
                this.$store.dispatch('setMissionUploaded', true);
                this.$store.dispatch('setMissionStatus', MissionStatus.UPLOADED);
                toast.fire({
                    type: 'success',
                    title: 'Mission uploaded',
                });
            });
        },
    },
    computed: {
        points() {
            return this.$store.state.flightPlan.points;
        },
        selectedPointIndex() {
            return this.$store.state.flightPlan.selectedPointIndex;
        },
        returnToLaunch: {
            get() {
                return this.$store.state.flightPlan.returnToLaunch;
            },
            set(value) {
                this.$store.dispatch('setReturnToLaunch', value);
            },
        },
        isLive() {
            return this.$store.state.general.isLive;
        },
    },
};
</script>
