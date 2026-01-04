import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/dashboard');
                setStats(res.data);
            } catch (error) {
                console.error("Error al pedir datos al Dashboard", error);
                // Si hay error, stats se queda en null, pero loading pasa a false
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    // 1. Si está cargando, mostramos el mensaje
    if (loading) return <div className="p-20 text-center font-bold text-gray-400">Preparando tu panel de control...</div>;

    // 2. SEGURIDAD EXTRA: Si no hay stats (por un error 500), mostramos un aviso en lugar de romper la web
    if (!stats) return <div className="p-20 text-center text-red-500 font-bold">Error de conexión con el servidor.</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
            <header>
                <h1 className="text-3xl font-black text-gray-900 mb-6 tracking-tight">Panel de Control</h1>
                
                {/* USAMOS EL SIGNO ?. PARA EVITAR ERRORES SI NO HAY DATOS */}
                {stats?.aiInsight && (
                    <div className="bg-gray-900 rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden border border-white/5">
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand opacity-20 blur-[100px]"></div>
                        
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-[10px] font-black uppercase tracking-widest bg-brand/20 text-brand px-3 py-1 rounded-full border border-brand/30">
                                    Resumen Estratégico
                                </span>
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            </div>
                            <p className="text-xl md:text-2xl font-medium italic leading-relaxed text-gray-100">
                                "{stats.aiInsight}"
                            </p>
                        </div>
                    </div>
                )}
            </header>

            {/* RESTO DEL CÓDIGO (He añadido ?. a todo para mayor seguridad) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-[35px] shadow-sm border border-gray-100 group hover:border-brand transition-all duration-500">
                    <div className="w-12 h-12 bg-brand/10 text-brand rounded-2xl flex items-center justify-center mb-4 text-xl font-bold transition-colors group-hover:bg-brand group-hover:text-white">
                        👤
                    </div>
                    <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">Clientes Activos</p>
                    <h3 className="text-4xl font-black text-gray-900">{stats?.clientSummary?.total || 0}</h3>
                </div>

                <div className="bg-white p-8 rounded-[35px] shadow-sm border border-gray-100 group hover:border-brand transition-all duration-500">
                    <div className="w-12 h-12 bg-brand/10 text-brand rounded-2xl flex items-center justify-center mb-4 text-xl font-bold transition-colors group-hover:bg-brand group-hover:text-white">
                        ⏳
                    </div>
                    <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">Tareas Pendientes</p>
                    <h3 className="text-4xl font-black text-gray-900">{stats?.taskSummary?.pending || 0}</h3>
                </div>

                <div className="bg-white p-8 rounded-[35px] shadow-sm border border-gray-100">
                    <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-4 text-xl font-bold">
                        ✅
                    </div>
                    <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">Completadas</p>
                    <h3 className="text-4xl font-black text-gray-900">{stats?.taskSummary?.completed || 0}</h3>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold mb-6">Tendencia Semanal</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats?.weeklyHistory || []}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 'bold'}} />
                                <Tooltip 
                                    cursor={{fill: '#f9fafb'}} 
                                    contentStyle={{borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                                />
                                <Bar dataKey="acciones" fill="var(--brand)" radius={[10, 10, 10, 10]} barSize={35} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold mb-6">Actividad Reciente</h3>
                    <div className="space-y-4">
                        {stats?.recentActivity?.map((act, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-colors group">
                                <div className={`w-2.5 h-2.5 rounded-full ${act.type === 'client' ? 'bg-brand' : 'bg-green-500'} shadow-sm shadow-brand/20`}></div>
                                <p className="text-sm font-medium text-gray-700 flex-grow">{act.action}</p>
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                                    {new Date(act.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;