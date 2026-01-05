import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    // 🟢 NUEVO: Esta variable controla si el gráfico tiene permiso para aparecer
    const [isChartReady, setIsChartReady] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/dashboard');
                setStats(res.data);
            } catch (error) {
                console.error("Error al pedir datos al Dashboard", error);
            } finally {
                setLoading(false);
                // 🟢 TRUCO MAESTRO: Esperamos 500ms después de que carguen los datos
                // para que el gráfico aparezca cuando todo el diseño esté quieto.
                setTimeout(() => {
                    setIsChartReady(true);
                }, 500);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
                <p className="font-black text-gray-400 uppercase tracking-widest text-xs animate-pulse">
                    Sincronizando datos...
                </p>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="p-20 text-center">
                <div className="bg-red-50 text-red-600 p-10 rounded-[40px] inline-block border border-red-100 shadow-xl">
                    <p className="font-black text-2xl mb-2">Error de Sincronización</p>
                    <p className="opacity-70 font-medium">Revisa tu conexión a internet.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-12 animate-fade-in">
            
            {/* CABECERA IA (Igual que antes) */}
            <header className="space-y-8">
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">Panel de Control</h1>
                {stats?.aiInsight && (
                    <div className="bg-gray-900 rounded-[50px] p-12 text-white shadow-2xl relative overflow-hidden border border-white/5">
                        <div className="absolute -top-32 -right-32 w-96 h-96 bg-brand opacity-20 blur-[130px]"></div>
                        <div className="relative z-10 space-y-6">
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] bg-brand/20 text-brand px-5 py-2 rounded-full border border-brand/30">IA Insight</span>
                                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(34,197,94,1)]"></div>
                            </div>
                            <p className="text-2xl md:text-3xl font-medium italic leading-relaxed text-gray-200">"{stats.aiInsight}"</p>
                        </div>
                    </div>
                )}
            </header>

            {/* TARJETAS DE MÉTRICAS (Igual que antes) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-10 rounded-[45px] shadow-sm border border-gray-100 group hover:shadow-2xl hover:shadow-brand/5 transition-all">
                    <div className="w-16 h-16 bg-brand/10 text-brand rounded-[22px] flex items-center justify-center mb-8 text-3xl transition-all group-hover:bg-brand group-hover:text-white">👤</div>
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">Clientes Activos</p>
                    <h3 className="text-6xl font-black text-gray-900">{stats?.clientSummary?.total || 0}</h3>
                </div>
                <div className="bg-white p-10 rounded-[45px] shadow-sm border border-gray-100 group hover:shadow-2xl hover:shadow-brand/5 transition-all">
                    <div className="w-16 h-16 bg-brand/10 text-brand rounded-[22px] flex items-center justify-center mb-8 text-3xl transition-all group-hover:bg-brand group-hover:text-white">⏳</div>
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">Pendientes</p>
                    <h3 className="text-6xl font-black text-gray-900">{stats?.taskSummary?.pending || 0}</h3>
                </div>
                <div className="bg-white p-10 rounded-[45px] shadow-sm border border-gray-100 group hover:shadow-2xl hover:shadow-green-500/5 transition-all">
                    <div className="w-16 h-16 bg-green-50 text-green-600 rounded-[22px] flex items-center justify-center mb-8 text-3xl transition-all group-hover:bg-green-600 group-hover:text-white">✅</div>
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">Logrados</p>
                    <h3 className="text-6xl font-black text-gray-900">{stats?.taskSummary?.completed || 0}</h3>
                </div>
            </div>

            {/* GRÁFICO Y ACTIVIDAD */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="bg-white p-12 rounded-[55px] shadow-sm border border-gray-100 flex flex-col">
                    <div className="flex justify-between items-center mb-12">
                        <h3 className="text-2xl font-black text-gray-900">Tendencia</h3>
                        <span className="text-[10px] font-black bg-gray-50 px-4 py-1.5 rounded-full text-gray-400 uppercase tracking-widest">7 Días</span>
                    </div>
                    
                    {/* CONTENEDOR CON MIN-HEIGHT PARA RESERVAR EL ESPACIO */}
                    <div className="w-full mt-auto" style={{ minHeight: '300px' }}>
                        {/* 🟢 LA MAGIA: Solo dibujamos el ResponsiveContainer si isChartReady es true */}
                        {isChartReady && (
                            <ResponsiveContainer width="99%" aspect={2}>
                                <BarChart data={stats?.weeklyHistory || []} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 11, fontWeight: '800', fill: '#cbd5e1'}} dy={15} />
                                    <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', padding: '20px'}} />
                                    <Bar dataKey="acciones" fill="var(--brand)" radius={[14, 14, 14, 14]} barSize={35} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                        {!isChartReady && (
                            <div className="h-full w-full flex items-center justify-center text-gray-300 font-bold uppercase text-[10px] tracking-widest animate-pulse">
                                Preparando gráfico...
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white p-12 rounded-[55px] shadow-sm border border-gray-100">
                    <h3 className="text-2xl font-black text-gray-900 mb-12">Actividad</h3>
                    <div className="space-y-3">
                        {stats?.recentActivity?.map((act, i) => (
                            <div key={i} className="flex items-center gap-6 p-6 hover:bg-gray-50 rounded-[30px] transition-all duration-300 group border border-transparent hover:border-gray-100">
                                <div className={`w-3.5 h-3.5 rounded-full shrink-0 ${act.type === 'client' ? 'bg-brand' : 'bg-green-500'}`}></div>
                                <p className="text-base font-bold text-gray-700 flex-grow group-hover:translate-x-1 transition-transform">{act.action}</p>
                                <span className="text-[10px] text-gray-400 font-black uppercase tracking-tighter shrink-0">{new Date(act.createdAt).toLocaleDateString()}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;