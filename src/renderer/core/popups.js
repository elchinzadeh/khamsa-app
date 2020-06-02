import Swal from "sweetalert2";

export const swal = Swal.mixin({
    background: '#282828',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    allowOutsideClick: false
});

export const loading = Swal.mixin({
    title: 'Just a second',
    allowOutsideClick: false,
    background: '#282828'
});

export const toast = Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: false,
    timer: 5000
})