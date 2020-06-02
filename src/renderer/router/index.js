import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: "/",
            redirect: { name: "flightData" },
        },
        {
            path: "/flight-data",
            name: "flightData",
            component: require("@/components/FlightData").default,
        },
        {
            path: "/flight-plan",
            name: "flightPlan",
            component: require("@/components/FlightPlan").default,
        },
    ],
});
