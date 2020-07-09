<template>
    <transition name="fade">
        <div
            :id="name"
            class="moodal moodal--overlay"
            v-show="visible"
            v-if="isMounted"
            @click.self="hide"
        >
            <div class="moodal__content" :style="contentStyle">
                <div class="moodal__header">
                    <div class="header__title">{{ title }}</div>
                    <div class="header__close">
                        <!-- <i class="fas fa-times" @click="hide" /> -->
                        <svg
                            aria-hidden="true"
                            focusable="false"
                            data-prefix="fas"
                            data-icon="times"
                            role="img"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 352 512"
                            width="12px"
                            height="100%"
                            class="svg-inline--fa fa-times fa-w-11 fa-lg"
                            @click="hide"
                        >
                            <path
                                fill="currentColor"
                                width="100%"
                                height="100%"
                                d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"
                            />
                        </svg>
                    </div>
                </div>
                <div class="moodal__body custom-scrollbar">
                    <slot />
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
/**
 * # How to use #
 *
 * <Modal
 *      name="🐮"
 *      :title="'Moodal'"
 *      :width="400"
 *      :height="100"
 *      :minWidth="200"
 *      :minHeight="100"
 *      :maxWidth="1920"
 *      :maxheight="1080"
 *      v-on:beforeOpen=""
 *      v-on:beforeClose=""
 *      v-on:beforeShow=""
 *      v-on:beforeHide=""
 *      v-on:afterOpen=""
 *      v-on:afterClose=""
 *      v-on:afterShow=""
 *      v-on:afterHide=""
 * >
 *     Hey I am Moodal
 * </Modal>
 *
 * $moodal.🐮.open()  - Mount to the DOM
 * $moodal.🐮.close() - Unmount from the DOM
 * $moodal.🐮.show()  - Show
 * $moodal.🐮.hide()  - Hide
 */
import Vue from "vue";
import "./style.scss";

export default {
    name: "Moodal",
    props: {
        name: {
            type: String
        },
        height: {
            type: [Number, String]
        },
        width: {
            type: [Number, String]
        },
        minHeight: {
            type: Number,
            default: 100
        },
        minWidth: {
            type: Number,
            default: 200
        },
        maxHeight: {
            type: Number,
            default: window.innerHeight
        },
        maxWidth: {
            type: Number,
            default: window.innerWidth
        },
        title: {
            type: String,
            default: ""
        },
        mounted: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            isMounted: this.mounted,
            visible: false
        };
    },
    computed: {
        contentStyle() {
            let style = [];
            if (this.width) {
                let width = "";
                if (typeof this.width === "number") {
                    width = this.width + "px";
                } else if (typeof this.width === "string") {
                    width = this.width;
                }
                style.push(`width: ${width};`);
            }
            if (this.height) {
                let height = "";
                if (typeof this.height === "number") {
                    height = this.height + "px";
                } else if (typeof this.height === "string") {
                    height = this.height;
                }
                style.push(`height: ${height};`);
            }
            if (this.minWidth) {
                style.push(`min-width: ${this.minWidth}px;`);
            }
            if (this.minHeight) {
                style.push(`min-height: ${this.minHeight}px;`);
            }
            if (this.maxWidth) {
                style.push(`max-width: ${this.maxWidth}px;`);
            }
            if (this.maxHeight) {
                style.push(
                    `max-height: ${this.maxHeight < window.innerHeight}px;`
                );
            }
            return style.join(" ");
        }
    },
    methods: {
        // Mount to the DOM
        open() {
            this.$emit("beforeOpen");
            this.isMounted = true;
            this.show();
            this.$emit("afterOpen");
        },
        // Unmount from the DOM
        close() {
            this.$emit("beforeClose");
            this.isMounted = false;
            this.hide();
            this.$emit("afterClose");
        },
        // Show
        show() {
            this.$emit("beforeShow");
            this.visible = true;
            this.$emit("afterShow");
        },
        // Hide
        hide() {
            this.$emit("beforeHide");
            this.visible = false;
            this.$emit("afterHide");
        }
    },
    created() {
        if (!this.$moodal) {
            Vue.prototype.$moodal = {};
        }
        this.$moodal[this.name] = this;
    }
};
</script>