<template>
    <div id="app">
        <Layout />
    </div>
</template>

<script>
import Layout from '@/layouts/Main';

import './globals.scss';
import './styles/reset.scss';
import './styles/general.scss';
import './styles/components/swal.scss';

export default {
    name: 'Khamsa',
    components: { Layout },
};
</script>
