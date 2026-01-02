import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';
import api from '../../api/axios';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [data, setData] = useState({
        clientSummary: { total: 0, vips: 0, prospects: 0, active: 0 },
        taskSummary: { totalTasks: 0, pending: 0, completed: 0, highPriority: 0 },
        recentActivity: []
    });
    const [loading, setLoading] = useState(true);

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

    // --- LA LÓGICA DE LOS GRÁFICOS ---
    // Calculamos el porcentaje de tareas completadas para la barra visual
    const taskPercentage = data.taskSummary.totalTasks > 0 
        ? Math.round((data.taskSummary.completed / data.taskSummary.totalTasks) * 100) 
        : 0;

    if (loading) return <div className="p-10 text-center font-bold">Cargando visualizaciones...</div>;

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            {/* CABECERA (Se mantiene igual) */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Panel de <span className="text-blue-600">Control</span>
                    </h1>
                    <p className="text-gray-500">Visualiza el rendimiento de tu estrategia.</p>
                </div>
                <button onClick={logout} className="bg-white border border-red-200 text-red-600 px-4 py-2 rounded-xl hover:bg-red-50 font-medium">
                    Cerrar Sesión
                </button>
            </div>

            {/* ZONA DE GRÁFICOS Y ESTADÍSTICAS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                
                {/* 1. GRÁFICO DE PROGRESO DE TAREAS */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 lg:col-span-2">
                    <div className="flex justify-between items-end mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Progreso de Objetivos</h3>
                            <p className="text-sm text-gray-500">Tareas completadas vs pendientes</p>
                        </div>
                        <span className="text-4xl font-black text-blue-600">{taskPercentage}%</span>
                    </div>

                    {/* Barra de progreso gris (fondo) */}
                    <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden">
                        {/* Barra azul (progreso real) */}
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

                {/* 2. DISTRIBUCIÓN DE CLIENTES */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Mis Clientes</h3>
                    <div className="space-y-5">
                        {/* Barra VIP */}
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="font-medium text-gray-600">Clientes VIP</span>
                                <span className="font-bold text-blue-600">{data.clientSummary.vips}</span>
                            </div>
                            <div className="w-full bg-gray-100 h-2 rounded-full">
                                <div className="bg-orange-400 h-full rounded-full" style={{ width: `${(data.clientSummary.vips / data.clientSummary.total) * 100 || 0}%` }}></div>
                            </div>
                        </div>
                        {/* Barra Activos */}
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="font-medium text-gray-600">Activos</span>
                                <span className="font-bold text-gray-900">{data.clientSummary.active}</span>
                            </div>
                            <div className="w-full bg-gray-100 h-2 rounded-full">
                                <div className="bg-blue-500 h-full rounded-full" style={{ width: `${(data.clientSummary.active / data.clientSummary.total) * 100 || 0}%` }}></div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-gray-50 text-center">
                        <p className="text-sm text-gray-400">Total en cartera</p>
                        <p className="text-2xl font-black text-gray-900">{data.clientSummary.total}</p>
                    </div>
                </div>
            </div>

            {/* BLOQUE DE ACTIVIDAD RECIENTE (Se mantiene igual que el paso 26) */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Historial de Actividad</h2>
                {/* ... (código de recentActivity.map del paso anterior) ... */}
            </div>
        </div>
    );
};

export default Dashboard;