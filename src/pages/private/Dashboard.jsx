import {useAuth} from '../../context/AuthContext';
import {useState, useEffect} from 'react';
import api from '../../api/axios';

const Dashboard = () =>{
    const {user, logout} = useAuth();
    const [data, setData] = useState({
        clientSummary: {total: 0, vips: 0, prospects:0},
        taskSummary: {totalTasks: 0, pending: 0, completed: 0, highPriority: 0},
        recentActivity: []//aqui van los ultimos movimientos
    })
    const [loading, setLoading]= useState(true);


    //efecto que hace al pedir algo al pc nada mas entrar
    useEffect(()=>{
        const fetchDashboardData = async () =>{
            try{
                const res = await api.get('/dashboard');
                setData(res.data);
            }catch(error){
                console.error("Error al pedir datos al Dashboard", error);
            }finally{
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);
    
    if(loading) return <div className="p-10 text-center font-bold">Cargando tu resumen...</div>;

    return(
        <div className="p-8 bg-gray-50 min-h-screen">
            {/* CABECERA */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Hola de nuevo, <span className="text-blue-600">{user?.name}</span>
                    </h1>
                    <p className="text-gray-500">Este es el estado actual de tu negocio hoy.</p>
                </div>
                <button
                    onClick={logout}
                    className="bg-white border border-red-200 text-red-600 px-4 py-2 rounded-xl hover:bg-red-50 transition-all font-medium"
                >
                    Cerrar Sesión
                </button>
            </div>

            {/* BLOQUE 1: TARJETAS DE RESUMEN (Stats) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Clientes Activos</p>
                    <p className="text-3xl font-black text-gray-900 mt-2">{data.clientSummary.total}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Tareas Pendientes</p>
                    <p className="text-3xl font-black text-orange-600 mt-2">{data.taskSummary.pending}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Urgencias (Alta Prioridad)</p>
                    <p className="text-3xl font-black text-red-600 mt-2">{data.taskSummary.highPriority}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-3xl shadow-lg">
                    <p className="text-blue-100 text-xs font-bold uppercase tracking-wider">Estado IA</p>
                    <p className="text-xl font-bold text-white mt-2">Lista para analizar</p>
                </div>
            </div>

            {/* BLOQUE 2: ÚLTIMOS MOVIMIENTOS (Activity) */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Actividad Reciente</h2>
                <div className="space-y-6">
                    {data.recentActivity.length === 0 ? (
                        <p className="text-gray-400 text-center py-4">No hay movimientos registrados todavía.</p>
                    ) : (
                        data.recentActivity.map((act) => (
                            <div key={act._id} className="flex items-start gap-4">
                                {/* Icono según tipo de actividad */}
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                    act.type === 'client' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
                                }`}>
                                    {act.type === 'client' ? '👤' : '✅'}
                                </div>
                                <div>
                                    <p className="text-gray-900 font-medium">{act.action}</p>
                                    <p className="text-gray-400 text-xs">
                                        {new Date(act.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;