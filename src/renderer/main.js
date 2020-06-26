import Vue from "vue";
window.$ = window.jQuery = require("jquery");
import axios from "axios";
import VueFuse from "vue-fuse";
import App from "./App";
import router from "./router";
import store from "./store";
import Bus from "@/core/events/bus.js";
// import { $host } from "@/core/constants.js";
// import { swal } from "@/core/popups.js";
import "sweetalert2/dist/sweetalert2.min.css";
import "animate.css/animate.min.css";
import VTooltip from "v-tooltip";
import Fragment from "vue-fragment";

Vue.use(VueFuse);
Vue.use(VTooltip);
Vue.use(Fragment.Plugin);

if (!process.env.IS_WEB) Vue.use(require("vue-electron"));

// axios.defaults.adapter = require("axios/lib/adapters/http");
// axios.defaults.baseURL = `${$host}`;

// axios.interceptors.response.use(
//     function(response) {
//         return response;
//     },
//     function(error) {
//         if (!error.response) {
//             return swal.fire($connection_error).then((res) => {
//                 if (res.value) {
//                     return axios.request(error.config);
//                 }

//                 return Promise.reject(error);
//             });
//         }

//         if (error.response) {
//             return swal
//                 .fire($exception_message(error.response.data.error))
//                 .then((res) => {
//                     return Promise.reject(error);
//                 });
//         }

//         return Promise.reject(error);
//     }
// );

// Vue.http = Vue.prototype.$http = axios;

Vue.prototype.$Bus = Bus;

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
    components: { App },
    router,
    store,
    template: "<App/>",
}).$mount("#app");
