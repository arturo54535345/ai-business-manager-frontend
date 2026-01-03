import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';
import api from '../../api/axios';

const Dashboard = () => {
    const { logout } = useAuth();
    
    // 1. EL ALMACÉN DE DATOS: Guardamos lo que nos envía el servidor.
    // Inicializamos con valores en 0 y listas vacías para que la web no falle al arrancar.
    const [data, setData] = useState({
        clientSummary: { total: 0, vips: 0, prospects: 0, active: 0 },
        taskSummary: { totalTasks: 0, pending: 0, completed: 0, highPriority: 0 },
        recentActivity: [],
        weeklyHistory: [] // Agregado para que el gráfico de barras tenga donde mirar
    });
    
    const [loading, setLoading] = useState(true);

    // 2. EL DISPARADOR: Nada más entrar, pedimos los datos al PC (servidor).
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await api.get('/dashboard');
                setData(res.data);
            } catch (error) {
                console.error("Error al pedir datos al Dashboard", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    // 3. CÁLCULOS MATEMÁTICOS: Para que las barras de progreso se muevan solas.
    const taskPercentage = data.taskSummary.totalTasks > 0 
        ? Math.round((data.taskSummary.completed / data.taskSummary.totalTasks) * 100) 
        : 0;

    // Si todavía estamos "pensando", mostramos un mensaje de espera.
    if (loading) return <div className="p-10 text-center font-bold text-gray-500">Cargando visualizaciones...</div>;

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            
            {/* CABECERA: Título y botón de salir */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Panel de <span className="text-blue-600">Control</span>
                    </h1>
                    <p className="text-gray-500">Visualiza el rendimiento de tu estrategia.</p>
                </div>
                <button 
                    onClick={logout} 
                    className="bg-white border border-red-200 text-red-600 px-4 py-2 rounded-xl hover:bg-red-50 font-medium transition-colors"
                >
                    Cerrar Sesión
                </button>
            </div>

            {/* ZONA DE GRÁFICOS PRINCIPALES */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                
                {/* A. RENDIMIENTO SEMANAL (Gráfico de barras interactivo) */}
                <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 lg:col-span-3">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">Rendimiento Semanal</h3>
                            <p className="text-sm text-gray-500">Visualiza tus picos de actividad</p>
                        </div>
                        <div className="flex gap-2 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                            <span>📈</span> TENDENCIA POSITIVA
                        </div>
                    </div>

                    {/* El esqueleto del gráfico */}
                    <div className="flex items-end justify-between h-48 gap-2 pt-4">
                        {data.weeklyHistory.map((item, index) => (
                            <div key={index} className="flex-1 flex flex-col items-center group relative">
                                {/* Tooltip: El mensaje negro que sale al pasar el ratón */}
                                <div className="invisible group-hover:visible absolute -top-10 bg-gray-900 text-white text-[10px] px-2 py-1 rounded-lg z-10">
                                    {item.acciones} acciones
                                </div>
                                
                                {/* La barra dinámica */}
                                <div 
                                    className="w-full bg-blue-100 rounded-t-xl group-hover:bg-blue-600 transition-all duration-500 ease-out relative"
                                    style={{ height: `${Math.max((item.acciones * 20), 5)}%` }}
                                >
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 rounded-full"></div>
                                </div>
                                <span className="text-[10px] font-bold text-gray-400 mt-3 uppercase">{item.day}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* B. PROGRESO DE OBJETIVOS (Tareas) */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 lg:col-span-2">
                    <div className="flex justify-between items-end mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Progreso de Objetivos</h3>
                            <p className="text-sm text-gray-500">Tareas completadas vs pendientes</p>
                        </div>
                        <span className="text-4xl font-black text-blue-600">{taskPercentage}%</span>
                    </div>

                    {/* Barra de progreso */}
                    <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden">
                        <div 
                            className="bg-blue-600 h-full transition-all duration-1000 ease-out"
                            style={{ width: `${taskPercentage}%` }}
                        ></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-8">
                        <div className="bg-gray-50 p-4 rounded-2xl">
                            <p className="text-xs text-gray-400 font-bold uppercase">Pendientes</p>
                            <p className="text-xl font-bold text-gray-800">{data.taskSummary.pending}</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-2xl">
                            <p className="text-xs text-green-400 font-bold uppercase">Completadas</p>
                            <p className="text-xl font-bold text-green-600">{data.taskSummary.completed}</p>
                        </div>
                    </div>
                </div>

                {/* C. DISTRIBUCIÓN DE CLIENTES */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Mis Clientes</h3>
                    <div className="space-y-5">
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="font-medium text-gray-600">Clientes VIP</span>
                                <span className="font-bold text-blue-600">{data.clientSummary.vips}</span>
                            </div>
                            <div className="w-full bg-gray-100 h-2 rounded-full">
                                <div 
                                    className="bg-orange-400 h-full rounded-full transition-all duration-700" 
                                    style={{ width: `${(data.clientSummary.vips / data.clientSummary.total) * 100 || 0}%` }}
                                ></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="font-medium text-gray-600">Activos</span>
                                <span className="font-bold text-gray-900">{data.clientSummary.active}</span>
                            </div>
                            <div className="w-full bg-gray-100 h-2 rounded-full">
                                <div 
                                    className="bg-blue-500 h-full rounded-full transition-all duration-700" 
                                    style={{ width: `${(data.clientSummary.active / data.clientSummary.total) * 100 || 0}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-gray-50 text-center">
                        <p className="text-sm text-gray-400">Total en cartera</p>
                        <p className="text-2xl font-black text-gray-900">{data.clientSummary.total}</p>
                    </div>
                </div>
            </div>

            {/* D. HISTORIAL DE ACTIVIDAD RECIENTE */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Historial de Actividad</h2>
                
                <div className="space-y-6">
                    {data.recentActivity.length === 0 ? (
                        <p className="text-gray-400 text-center py-4">No hay movimientos registrados todavía.</p>
                    ) : (
                        data.recentActivity.map((act) => (
                            <div key={act._id} className="flex items-start gap-4 group">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${
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