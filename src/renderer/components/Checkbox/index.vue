<template>
    <label
        class="checkbox"
        :class="{'checkbox--disabled': disabled}"
    >
        <span class="checkbox__label">{{ label }}</span>
        <input
            type="checkbox"
            v-model="model"
            :disabled="disabled"
        />
        <span class="checkbox__mark" />
    </label>
</template>

<script>
import './style.scss';

export default {
    name: 'Checkbox',
    props: {
        value: {
            required: false,
            type: Boolean,
            default: false,
        },
        label: {
            required: false,
            type: String,
            default: '',
        },
        disabled: {
            required: false,
            type: Boolean,
            default: false,
        },
    },
    computed: {
        model: {
            get() {
                return this.value;
            },
            set(value) {
                this.$emit('input', value);
            },
        },
    },
};
</script>
