//axios es como le mensajero el que une el back con el front

import axios from "axios";

//configuramos
const api = axios.create({
    baseURL: '',
});

//asistente de los correo por asi decirlo es un interceptor
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');//revisamos si tenemos la llave osea el token guardado

    if(token){
        config.headers.Authorization = `Bearer ${token}`;// si hay llave se la pegaremos al mensaje para el Backend
    }
    return config;
}, (error) =>{
    return Promise.reject(error)    
});

export default api;