import axios from 'axios';

// Creamos una instancia personalizada de Axios
const api = axios.create({
    baseURL: 'http://localhost:3000/api'
});

// --- LÓGICA DEL MENSAJERO (INTERCEPTOR) ---
// Este código se ejecuta SIEMPRE antes de que salga una petición al servidor
api.interceptors.request.use(
    (config) => {
        // 1. Buscamos la llave (token) en el "bolsillo" del navegador
        const token = localStorage.getItem('token');
        
        // 2. Si la llave existe, la pegamos en la cabecera del sobre
        if (token) {
            config.headers['x-auth-token'] = token;
        }
        
        // 3. Enviamos el sobre
        return config;
    },
    (error) => {
        // Si hay un error antes de enviar, lo devolvemos
        return Promise.reject(error);
    }
);

export default api;