import {useAuth} from '../../context/AuthContext';
import {useState, useEffect} from 'react';
import api from '../../api/axios';

const Dashboard = () =>{
    const {user, logout} = useAuth();
    const [stats, setStats] = useState({clients: 0, tasks: 0});


    //efecto que hace al pedir algo al pc nada mas entrar
    useEffect(()=>{
        const fetchDashboardData = async () =>{
            try{
                //aqui llamo al back para traer los datos reales
                console.log("Conectando con el PC para traer datos...");
            }catch(error){
                console.error("Error al pedir datos al PC", error);
            }
        };
        fetchDashboardData();
    }, []);

    return(
        <div className="p-8 bg-gray-50 min-h-screen">
            {/*cabecera*/}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Hola de nuevo, <span className="text-blue-600">{user?.username}</span>
                    </h1>
                    <p className="text-gray-500">Aqui tienes el resumen de tu negocio.</p>
                </div>
                <button
                onClick={logout}
                className="bg-white border border-red-200 text-red-600 px-4 py-2 rounded-xl hover:bg-red-50 transition-all font-medium"
                >
                    Cerrar Sesion
                </button>
            </div>
            {/*tarjeta de resumen*/}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <p className="text-sm font-medium text-gray-500 uppercase">{stats.clients}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border-gray-100 bg-gradient-to-br from-blue-600 to-indigo-700">
                    <p className="text-sm font-medium text-blue-100 uppercase">Estado de la IA</p>
                    <p className="text-xl font-bold text-white mt-2">Conectada y Lista</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;