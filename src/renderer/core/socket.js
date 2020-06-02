import { $error, $connection_error } from "@/core/popup_options.js";
import { swal, toast, loading } from "@/core/popups.js";
import Bus from "@/core/events/bus.js";

class SocketService {
    constructor (baseUrl) {
        // this.hubConnection = new signalR.HubConnectionBuilder()
        //     .withUrl(`${baseUrl}/telemetry-hub`)
        //     .configureLogging(signalR.LogLevel.Information)
        //     .build();
    }

    connect () {
        // this.hubConnection.start().then(() => {
        //     this.invokeReading();
        // }).catch(() => {
        //     swal.fire($connection_error).then((result) => {
        //         if (result.value) {
        //             return this.connect();
        //         }
        //     })
        // });

        return this;
    }

    stop () {
        loading.fire();
        loading.showLoading();
        // this.hubConnection.invoke("StopReading");

        setTimeout(() => {
            // this.hubConnection.stop();

            loading.close();
        }, 500);

        // return toast.fire({
        //     type: 'warning',
        //     title: 'Connection is closed'
        // })
    }
}

export default SocketService;