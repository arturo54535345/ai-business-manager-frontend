import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); 

    if (token) {
        // CAMBIO CLAVE: El nombre debe ser 'x-auth-token'
        // para que coincida con lo que pide tu auth.middleware.js
        config.headers['x-auth-token'] = token; 
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;