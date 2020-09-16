<template>
    <button
        class="dropdown"
        @click="disabled || toggle "
    >
        <span class="dropdown__title">
            <slot />
        </span>
        <ul
            class="dropdown__list"
            :style="{ display: open ? 'block' : 'none' }"
        >
            <slot name="list" />
        </ul>
    </button>
</template>

<script>
export default {
    name: 'MenuDropdown',
    props: {
        disabled: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
    data() {
        return { open: false };
    },
    methods: {
        toggle() {
            this.open = !this.open;

            if (this.open) {
                document.addEventListener('click', this.clickEvent);
            } else {
                document.removeEventListener('click', this.clickEvent);
            }
        },
        clickEvent(event) {
            if (!this.$el.contains(event.target)) {
                this.toggle();
            }
        },
    },
};
</script>

<style lang="scss">
.dropdown {
    &:after {
        content: url(../../assets/icons/chevron.svg);
        width: 1rem;
        height: 1rem;
        line-height: 100%;
        margin-left: 0.6rem;
        margin-bottom: 0.2rem;
    }

    &__title {
        white-space: nowrap;
    }

    &__list {
        display: block;
        position: absolute;
        top: 100%;
        width: 100%;
        box-sizing: content-box;

        li {
            padding: 0 1rem;
            line-height: 2.4rem;
        }
    }
}
</style>
