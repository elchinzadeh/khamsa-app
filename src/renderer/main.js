import Vue from "vue";
window.$ = window.jQuery = require("jquery");
import axios from "axios";
import VueFuse from "vue-fuse";
import App from "./App";
import router from "./router";
import store from "./store";
import Bus from "@/core/events/bus.js";
import "sweetalert2/dist/sweetalert2.min.css";
import "animate.css/animate.min.css";
import VTooltip from "v-tooltip";
import Fragment from "vue-fragment";

Vue.use(VueFuse);
Vue.use(VTooltip);
Vue.use(Fragment.Plugin);

if (!process.env.IS_WEB) Vue.use(require("vue-electron"));

Vue.prototype.$Bus = Bus;

// let globalData = new Vue({
//     data: {
//         $flightPlanMap: null,
//     }
// });

// Vue.mixin({
//     computed: {
//         $flightPlanMap: {
//             get() { return globalData.$data.$flightPlanMap },
//             set(value) {
//                 console.log(value)
//                 globalData.$data.$flightPlanMap = value;
//             }
//         }
//     }
// })

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
    components: { App },
    router,
    store,
    template: "<App/>",
}).$mount("#app");
