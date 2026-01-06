import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
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
                // 🟢 Truco para que Recharts no de error de tamaño al cargar
                setTimeout(() => setIsChartReady(true), 500);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 text-xs font-black text-gray-400 uppercase animate-pulse">Sincronizando...</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-12 animate-fade-in">
            <header className="space-y-8">
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">Panel de Control</h1>
                {/* 🟢 Muestra el consejo de IA que viene en stats.aiInsight */}
                {stats?.aiInsight && (
                    <div className="bg-gray-900 rounded-[50px] p-12 text-white shadow-2xl relative overflow-hidden border border-white/5">
                        <div className="absolute -top-32 -right-32 w-96 h-96 bg-brand opacity-20 blur-[130px]"></div>
                        <div className="relative z-10 space-y-6">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] bg-brand/20 text-brand px-5 py-2 rounded-full border border-brand/30">Groq Insight</span>
                            <p className="text-2xl md:text-3xl font-medium italic leading-relaxed text-gray-200">"{stats.aiInsight}"</p>
                        </div>
                    </div>
                )}
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* TARJETAS */}
                <div className="bg-white p-10 rounded-[45px] shadow-sm border border-gray-100">
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">Clientes</p>
                    <h3 className="text-6xl font-black text-gray-900">{stats?.clientSummary?.total || 0}</h3>
                </div>
                <div className="bg-white p-10 rounded-[45px] shadow-sm border border-gray-100">
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">Pendientes</p>
                    <h3 className="text-6xl font-black text-gray-900">{stats?.taskSummary?.pending || 0}</h3>
                </div>
                <div className="bg-white p-10 rounded-[45px] shadow-sm border border-gray-100">
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">Completadas</p>
                    <h3 className="text-6xl font-black text-gray-900">{stats?.taskSummary?.completed || 0}</h3>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="bg-white p-12 rounded-[55px] shadow-sm border border-gray-100 flex flex-col">
                    <h3 className="text-2xl font-black text-gray-900 mb-12">Tendencia</h3>
                    <div className="w-full h-[300px] mt-auto">
                        {isChartReady && (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats?.weeklyHistory || []}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 11, fontWeight: '800', fill: '#cbd5e1'}} dy={15} />
                                    <Tooltip contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)'}} />
                                    <Bar dataKey="acciones" fill="var(--brand)" radius={[14, 14, 14, 14]} barSize={35} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                <div className="bg-white p-12 rounded-[55px] shadow-sm border border-gray-100">
                    <h3 className="text-2xl font-black text-gray-900 mb-12">Actividad Reciente</h3>
                    <div className="space-y-3">
                        {stats?.recentActivity?.map((act, i) => (
                            <div key={i} className="flex items-center gap-6 p-6 hover:bg-gray-50 rounded-[30px] transition-all">
                                <div className={`w-3.5 h-3.5 rounded-full ${act.type === 'client' ? 'bg-brand' : 'bg-green-500'}`}></div>
                                <p className="text-base font-bold text-gray-700 flex-grow">{act.action}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;