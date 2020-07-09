<template>
    <label class="input">
        <span class="input__label">{{ label }}</span>
        <input :type="type" v-model="model" />
    </label>
</template>

<script>
import "./style.scss";

export default {
    name: "Input",
    props: {
        type: {
            required: false,
            type: String,
            default: "text",
            validator: function(value) {
                return ["text", "number"].indexOf(value) !== -1;
            }
        },
        label: {
            required: false,
            type: String
        },
        value: {
            required: false,
            type: [String, Number]
        }
    },
    computed: {
        model: {
            get() {
                return this.value;
            },
            set(value) {
                if (this.type === "number") {
                    value = Number(value);
                }
                value = this.$emit("input", value);
            }
        }
    }
};
</script>