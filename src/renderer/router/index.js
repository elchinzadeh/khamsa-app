import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: { name: 'flightData' },
        },
        {
            path: '/flight-data',
            name: 'flightData',
            component: require('@/views/FlightData').default,
        },
        {
            path: '/flight-plan',
            name: 'flightPlan',
            component: require('@/views/FlightPlan').default,
        },
    ],
});
