// src/api/axios.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api'
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['x-auth-token'] = token;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 🟢 NUEVO: Interceptor de respuesta (Si el servidor nos echa)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // 👨‍🏫 Si el servidor dice 401 (Llave caducada), limpiamos y vamos al login
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login'; 
        }
        return Promise.reject(error);
    }
);

export default api;