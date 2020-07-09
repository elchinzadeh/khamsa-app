<template>
    <button class="button" @click="onClick">
        <slot />
    </button>
</template>

<script>
import "./style.scss";

export default {
    name: "Button",
    methods: {
        onClick(e) {
            this.$emit("click", e);
        }
    }
};
</script>