<template>
    <fragment>
        <Header />
        <div class="layout">
            <router-view />
        </div>
    </fragment>
</template>

<script>
import Header from "@/components/Header";
import { loading } from "@/core/popups.js";

export default {
    name: "Layout",
    components: {
        Header,
    },
};
</script>

<style lang="scss">
@import "@/styles/layout";
</style>
