<template>
    <!-- Point edit modal -->
    <Modal
        name="editPoint"
        title="Edit point"
        :width="300"
    >
        <div v-if="pointIndex != null">
            <!-- Latitude -->
            <Input
                type="number"
                label="Latitude"
                v-model="latitude"
            />
            <!-- Longitude -->
            <Input
                type="number"
                label="Longitude"
                v-model="longitude"
            />
            <!-- Altitude -->
            <Input
                type="number"
                label="Altitude"
                v-model="altitude"
            />
            <!-- Delay -->
            <Input
                type="number"
                label="Delay"
                v-model="delay"
            />
        </div>
    </Modal>
</template>

<script>
import { Modal, Input } from '@/components';

export default {
    name: 'EditPoint',
    components: {
        Modal,
        Input,
    },
    props: {
        pointIndex: {
            type: Number,
            required: false,
        },
    },
    computed: {
        latitude: {
            get() {
                return this.$store.state.flightPlan.points[this.pointIndex]
                    .coordinates.latitude;
            },
            set(value) {
                this.$store.dispatch('updatePoint', {
                    index: this.pointIndex,
                    coordinates: { latitude: value },
                });
            },
        },
        longitude: {
            get() {
                return this.$store.state.flightPlan.points[this.pointIndex]
                    .coordinates.longitude;
            },
            set(value) {
                this.$store.dispatch('updatePoint', {
                    index: this.pointIndex,
                    coordinates: { longitude: value },
                });
            },
        },
        altitude: {
            get() {
                return this.$store.state.flightPlan.points[this.pointIndex]
                    .altitude;
            },
            set(value) {
                this.$store.dispatch('updatePoint', {
                    index: this.pointIndex,
                    altitude: value,
                });
            },
        },
        delay: {
            get() {
                return this.$store.state.flightPlan.points[this.pointIndex]
                    .delay;
            },
            set(value) {
                this.$store.dispatch('updatePoint', {
                    index: this.pointIndex,
                    delay: value,
                });
            },
        },
    },
};
</script>
