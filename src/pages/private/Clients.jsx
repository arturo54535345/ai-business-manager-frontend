// -------------------------------------------------------------------------
// 📂 ARCHIVO: src/pages/private/Clients.jsx
// 📝 DESCRIPCIÓN: Directorio de activos con estética de base de datos táctica.
// -------------------------------------------------------------------------
import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom'; 
import { toast } from 'react-hot-toast';

const Clients = () => {
    // 🧠 LÓGICA (INTACTA)
    const [client, setClient] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(''); 
    const [categoryFilter, setCategoryFilter] = useState(''); 
    
    const navigate = useNavigate();

    useEffect(() => {
        const getClients = async () => {
            try {
                const res = await api.get(`/clients?search=${searchTerm}&category=${categoryFilter}`);
                setClient(res.data.clients || res.data);
            } catch (error) {
                console.error("Error en el sistema de archivos de clientes");
            } finally {
                setLoading(false);
            }
        };
        getClients();
    }, [searchTerm, categoryFilter]); 

    const exportToCSV = () => {
        if (client.length === 0) return toast.error("No hay registros para exportar.");
        const headers = ["Nombre", "Email", "Telefono", "Categoria", "Tareas"];
        const rows = client.map(c => [`"${c.name}"`,`"${c.email}"`,`"${c.phone}"`,`"${c.category}"`,`"${c.taskCount}"`]);
        const csvContent = [headers.join(","), ...rows.map(row => row.join(","))].join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `Reporte_Activos_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        toast.success("Protocolo de exportación completo");
    };

    return (
        <div className="space-y-16 reveal-premium pb-20">
            
            {/* --- CABECERA (Arquitectura de Conexiones) --- */}
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-[2px] bg-cyber-blue opacity-50"></div>
                        <span className="text-[9px] font-black text-cyber-blue uppercase tracking-[0.4em]">Asset_Network_Directory</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none italic">
                        Base <span className="text-cyber-blue">Activos</span>
                    </h1>
                    <p className="text-cyber-silver/40 font-medium italic text-lg max-w-xl">
                        Directorio de activos y conexiones estratégicas sincronizadas en tiempo real.
                    </p>
                </div>
                
                <div className="flex gap-4 w-full lg:w-auto">
                    <button onClick={exportToCSV} className="flex-1 lg:flex-none glass px-8 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest text-cyber-silver/60 hover:text-white transition-all duration-700">
                        📥 Exportar Data
                    </button>
                    <button onClick={() => navigate('/clientes/nuevo')} className="flex-1 lg:flex-none bg-cyber-blue text-black px-12 py-5 rounded-2xl font-black shadow-[0_20px_40px_-15px_rgba(0,209,255,0.4)] hover:scale-105 transition-all duration-700 text-[10px] uppercase tracking-[0.3em]">
                        + Nuevo Registro
                    </button>
                </div>
            </header>

            {/* --- TERMINAL DE BÚSQUEDA (Minimalismo Técnico) --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 relative group">
                    <input 
                        type="text"
                        placeholder="Escanear identidad en la red..."
                        className="w-full glass bg-white/[0.02] p-6 pl-16 text-white outline-none focus:border-cyber-blue/30 transition-all duration-700 font-medium placeholder:text-white/10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <span className="absolute left-7 top-1/2 -translate-y-1/2 opacity-20 text-xl group-focus-within:opacity-50 transition-opacity">🔍</span>
                </div>

                <select 
                    className="glass bg-white/[0.02] p-6 text-cyber-silver/60 font-black text-[9px] uppercase tracking-[0.3em] outline-none cursor-pointer focus:border-cyber-blue/30"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                >
                    <option value="">Filtro_Categoría</option>
                    <option value="VIP">💎 Sector_VIP</option>
                    <option value="Potencial">⚡ Lead_Potencial</option>
                    <option value="General">📂 Registro_General</option>
                </select>
            </div>

            {/* --- LISTADO DE PANELES (Coreografía Cascada) --- */}
            {loading ? (
                <div className="py-40 text-center font-black text-cyber-blue animate-pulse tracking-[0.6em] text-[10px] uppercase">Sincronizando Archivos...</div>
            ) : client.length === 0 ? (
                <div className="glass p-32 text-center border-dashed border-white/5">
                    <p className="text-cyber-silver/20 text-[10px] font-black uppercase tracking-[0.4em] italic">No se han detectado registros en este sector de la red.</p>
                </div> 
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                    {client.map((c, index) => (
                        <div 
                            key={c._id} 
                            onClick={() => navigate(`/clientes/${c._id}`)}
                            // 👨‍🏫 Lógica Premium: Retraso de aparición una por una.
                            style={{ animationDelay: `${index * 0.1}s` }}
                            className="glass glass-hover p-12 cursor-pointer group relative overflow-hidden reveal-premium"
                        >
                            {/* Indicador de Tareas (Burbuja neón técnica) */}
                            {c.taskCount > 0 && (
                                <div className="absolute top-8 right-8 bg-cyber-purple/10 text-cyber-purple border border-cyber-purple/20 text-[8px] font-black px-4 py-2 rounded-xl shadow-[0_0_20px_rgba(157,0,255,0.1)] animate-pulse uppercase tracking-[0.2em]">
                                    {c.taskCount} Objetivos_Activos
                                </div>
                            )}

                            {/* Avatar Futurista (El núcleo del activo) */}
                            <div className="w-20 h-20 rounded-[30px] bg-white/[0.03] border border-white/10 flex items-center justify-center text-4xl font-black text-cyber-blue group-hover:bg-cyber-blue group-hover:text-black transition-all duration-700 mb-10 shadow-xl">
                                {c.name.charAt(0)}
                            </div>

                            <div className="space-y-2 mb-10">
                                <h3 className="text-4xl font-black text-white tracking-tighter group-hover:text-cyber-blue transition-colors duration-700 italic leading-none">
                                    {c.name}
                                </h3>
                                <p className="text-cyber-silver/30 text-[10px] font-black uppercase tracking-[0.3em]">
                                    {c.email || 'Identidad_No_Verificada'}
                                </p>
                            </div>

                            <div className="flex items-center justify-between pt-8 border-t border-white/5">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[7px] font-black text-white/10 uppercase tracking-[0.4em]">Categoría</span>
                                    <span className={`text-[9px] font-black uppercase tracking-widest ${
                                        c.category === 'VIP' ? 'text-cyber-purple' : 'text-cyber-silver/40'
                                    }`}>
                                        {c.category || 'General'}
                                    </span>
                                </div>
                                
                                <div className="text-right">
                                    <span className="text-[7px] font-black text-white/10 uppercase tracking-[0.4em] block mb-1">Terminal_ID</span>
                                    <span className="text-[10px] text-white/20 font-black tracking-widest">
                                        {c.phone ? `+${c.phone.slice(-4)}` : 'NULL'}
                                    </span>
                                </div>
                            </div>

                            {/* Detalle de lujo: barra de progreso decorativa en el hover */}
                            <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-cyber-blue group-hover:w-full transition-all duration-1000"></div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Clients;