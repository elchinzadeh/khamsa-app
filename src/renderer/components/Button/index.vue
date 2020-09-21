<template>
    <button
        class="button"
        :class="{'button--disabled': disabled}"
        @click="!disabled && onClick($event)"
        :disabled="disabled"
    >
        <slot />
    </button>
</template>

<script>
import './style.scss';

export default {
    name: 'Button',
    props: {
        disabled: {
            required: true,
            type: Boolean,
            default: false,
        },
    },
    methods: {
        onClick(e) {
            this.$emit('click', e);
        },
    },
};
</script>
