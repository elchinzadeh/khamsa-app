<template>
    <div class="sidebar__toolbar">
        <button @click="$emit('last-logs-pressed')">
            <img src="@/assets/icons/data-logs.svg">
        </button>
        <button @click="$emit('indicators-pressed')">
            <img src="@/assets/icons/gauges.svg">
        </button>
    </div>
</template>