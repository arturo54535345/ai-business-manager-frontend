import {createContext, useState, useEffect, useContext} from 'react';
import api from '../api/axios'; // El mensajero que habla con el Backend

// 1. CREACIÓN DE LA NUBE: Definimos el espacio donde vivirá la información
const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    // 2. LAS CAJAS DE MEMORIA (Estados)
    const [user, setUser] = useState(null); // Aquí guardamos los datos del usuario logueado
    const [loading, setLoading] = useState(true); // Para saber si la web está cargando al inicio

    // --- NUEVA FUNCIÓN: ACTUALIZADOR MAESTRO ---
    // Esta función permite cambiar los datos del usuario (como el color o el nombre) 
    // y que se guarden para siempre en el navegador.
    const updateUser = (userData) => {
        setUser(userData); // Cambiamos los datos en la memoria de React
        localStorage.setItem('user', JSON.stringify(userData)); // Los guardamos en el "bolsillo" del navegador
    };

    // 3. VIGILANTE DE LA SESIÓN: Revisa si ya tenías la sesión abierta al entrar
    useEffect(() => {
        const checkLogin = async () => {
            const token = localStorage.getItem('token');
            if(token){
                // Si hay una llave (token), recuperamos los datos guardados
                const saveUser = JSON.parse(localStorage.getItem('user'));
                setUser(saveUser);
            }
            setLoading(false); // La web ya ha terminado de "pensar"
        };
        checkLogin();
    }, []);

    // 4. FUNCIÓN DE REGISTRO: Para crear cuentas nuevas
    const register = async (name, email, password) => {
        const res = await api.post('/auth/register', {name, email, password});

        // Guardamos la llave y el usuario que nos devuelve el Backend
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));

        setUser(res.data.user);
    }

    // 5. FUNCIÓN DE LOGIN: Para entrar en la oficina
    const login = async (email, password) => {
        const res = await api.post('/auth/login', {email, password});
        
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));

        setUser(res.data.user);
    };

    // 6. FUNCIÓN DE LOGOUT: Para salir y limpiar todo
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null); // Vaciamos la nube
    };

    // 7. REPARTO DE INFORMACIÓN: Entregamos las herramientas a todas las páginas
    return(
        // CORRECCIÓN: Ahora incluimos 'updateUser' en el paquete que repartimos
        <AuthContext.Provider value={{user, login, logout, register, updateUser, loading}}>
            {children}
        </AuthContext.Provider>
    );
};

// 8. ACCESO DIRECTO: Para que las páginas usen la nube fácilmente
export const useAuth = () => useContext(AuthContext);