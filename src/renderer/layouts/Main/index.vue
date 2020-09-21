<template>
    <fragment>
        <Header />
        <div
            class="layout"
            ref="layout"
        >
            <keep-alive>
                <router-view />
            </keep-alive>
        </div>
    </fragment>
</template>

<script>
import Header from './Header';

export default {
    name: 'Layout',
    components: { Header },
};
</script>

<style lang="scss">
@import "@/styles/layout";
</style>
