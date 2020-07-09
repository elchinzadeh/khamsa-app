import axios from "axios";
import { $connection_error, $exception_message } from "@/core/popup_options.js";
import { HTTP_HOST } from "@/core/constants.js";
import { swal } from "@/core/popups.js";

console.log({ HTTP_HOST });

const api = axios.create({
	baseURL: HTTP_HOST,
	timeout: 10000,
});

api.interceptors.response.use(
	function (response) {
		return response;
	},
	function (error) {
		if (!error.response) {
			return swal.fire($connection_error).then((res) => {
				if (res.value) {
					return axios.request(error.config);
				}

				return Promise.reject(error);
			});
		}

		if (error.response) {
			return swal
				.fire($exception_message(error.response.data.error))
				.then((res) => {
					return Promise.reject(error);
				});
		}

		return Promise.reject(error);
	}
);

export default api;
