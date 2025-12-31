import {createContext, useState, useEffect, useContext} from 'react';
import api from '../api/axios';// trearemos el axios el que maneja la conexion con el backend

//esto es la creacion de la nube
const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    //creo dos cajas
    const [user, setUser] = useState(null);//aqui guardo el nombre/email del usuario
    const [loading, setLoading] = useState(true);// sirve para saber si estoy pensando al arrancar

    //vigilante de la sesion osea el useEffect
    useEffect(() => {
        const checkLogin = async () => {
            const token = localStorage.getItem('token');
            if(token){
                //si hay un token recuperamos los datos del usuatio con el localStorage
                const saveUser = JSON.parse(localStorage.getItem('user'));
                setUser(savedUser);
            }
            setLoading(false); // una vez cargado dejamos de cargar
        };
        checkLogin();
    }, []);
    const register = async (name, email, password) => {
        //llamamos al back y le digo que cree este nuevo usuario
        const res = await api.post('/auth/register', {name, email, password});

        //la gente al registrarse el back vuelve a enviar el token para que entren directamente
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));

        //meto los datos en la nube
        setUser(res.data.user);
    }
    //funcion  para entrar osea el Login
    const login = async (email, password) => {
        //con esto llamamos al pc
        const res = await api.post('/auth/login', {email, password});
        
        //guardamos la llave osea el token y el usuario en el bolsillo del navegador
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));

        //Meto los datos en la nube asi toda la web lo ve
        setUser(res.data.user);
    };

    //funcion para salir osea el Logout
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);//limpiamos la nube
    };

    //reparto la info a todas las paginas osea el ({children})
    return(
        <AuthContext.Provider value={{user, login, logout, register, loading}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);