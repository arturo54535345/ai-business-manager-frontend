//vamos a crear el portero el cual preguntara al AuthContext 
import {Navigate, Outlet} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';//le pedimos ayuda al cerebro

const ProtectedRoute = () => {
    const {user, loading} = useAuth();//extraemos la info del cerebro 

    //si el cerebro aun piensa saldra esto 
    if(loading){
        return <div className="flex justify-center items-center h-screen">Cargando...</div>;
    };

    //si no hay usuario (nadie ha iniciado sesion)
    if(!user){
        //le mandariamos directamente a la pagina de login
        return <Nevigate to="/login" replace />;
    }

    //si todo esta bien lo dejo pasat a la pagina que ese cliente queria ver 
    return <Outlet />;
};

export default ProtectedRoute;