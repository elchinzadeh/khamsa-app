<template>
    <label class="checkbox">
        <span class="checkbox__label">{{ label }}</span>
        <input type="checkbox" v-model="model" />
        <span class="checkbox__mark" />
    </label>
</template>

<script>
import "./style.scss";

export default {
    name: "Checkbox",
    props: {
        value: {
            required: false,
            type: Boolean,
            default: false
        },
        label: {
            required: false,
            type: String,
            default: ""
        }
    },
    computed: {
        model: {
            get() {
                return this.value;
            },
            set(value) {
                this.$emit("input", value);
            }
        }
    }
};
</script>
