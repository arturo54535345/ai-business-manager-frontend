// -------------------------------------------------------------------------
// 📂 ARCHIVO: src/pages/private/CompletedTasks.jsx
// 📝 DESCRIPCIÓN: Archivo histórico de misiones cumplidas. Estética técnica.
// -------------------------------------------------------------------------
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from '../../api/axios';

const CompletedTasks = () => {
    // 🧠 LÓGICA (INTACTA)
    const [completedTasks, setCompletedTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCompleted = async () => {
            try {
                const res = await api.get('/tasks');
                const filtered = res.data.filter(t => t.status === 'completed');
                setCompletedTasks(filtered);
            } catch (error) {
                console.error("Error al cargar el registro", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCompleted();
    }, []);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center font-black text-cyber-blue animate-pulse uppercase tracking-[0.5em] text-[10px]">
            Accediendo a Archivos Históricos...
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto space-y-16 reveal-premium pb-20">
            
            {/* --- CABECERA (Archivo de Misiones) --- */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-[2px] bg-green-500 opacity-50"></div>
                        <span className="text-[9px] font-black text-green-500 uppercase tracking-[0.4em]">Success_Missions_Log</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none italic">
                        Archivo <span className="text-green-500">Misión</span>
                    </h1>
                    <p className="text-cyber-silver/40 font-medium italic text-lg">Historial de protocolos ejecutados con éxito.</p>
                </div>

                <button 
                    onClick={() => navigate('/tareas')}
                    className="glass bg-white/[0.03] text-cyber-silver/60 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:text-white hover:bg-white/[0.08] transition-all duration-700"
                >
                    ← Volver a Operaciones
                </button>
            </header>

            {/* --- LISTADO DE ARCHIVOS (Efecto Cascada) --- */}
            <div className="space-y-6">
                {completedTasks.length === 0 ? (
                    <div className="glass p-20 border-dashed border-white/5 text-center flex flex-col items-center gap-6">
                        <div className="w-16 h-16 rounded-full border border-white/5 flex items-center justify-center opacity-20">
                            <span className="text-2xl text-white">0</span>
                        </div>
                        <p className="text-cyber-silver/20 text-[10px] font-black uppercase tracking-[0.3em]">No hay registros en el archivo histórico.</p>
                    </div>
                ) : (
                    completedTasks.map((task, index) => (
                        <div 
                            key={task._id} 
                            // 👨‍🏫 Lógica de Retraso: Las tareas aparecen una tras otra.
                            style={{ animationDelay: `${index * 0.1}s` }}
                            className="glass p-8 md:p-10 border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 reveal-premium group hover:bg-white/[0.02] transition-all duration-700"
                        >
                            <div className="flex items-center gap-8 w-full">
                                {/* Check de Éxito con Brillo */}
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-2xl border border-green-500/20 bg-green-500/5 flex items-center justify-center text-green-500 font-black group-hover:shadow-[0_0_20px_rgba(34,197,94,0.2)] transition-all duration-700">
                                        ✓
                                    </div>
                                    <div className="absolute -inset-1 bg-green-500/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                </div>

                                <div className="space-y-2">
                                    {/* Título Tachado pero Elegante */}
                                    <h3 className="text-2xl font-black text-white/40 line-through tracking-tighter group-hover:text-white/60 transition-colors duration-700 italic">
                                        {task.title}
                                    </h3>
                                    <div className="flex items-center gap-4">
                                        <span className="text-[8px] font-black text-cyber-silver/20 uppercase tracking-[0.3em]">Completado_en</span>
                                        <span className="text-[10px] font-bold text-green-500/50 uppercase tracking-widest">
                                            {new Date(task.updatedAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Detalle secundario del Cliente */}
                            <div className="w-full md:w-auto text-right">
                                <span className="text-[9px] font-black text-white/10 uppercase tracking-[0.4em] block mb-1">Activo_Asociado</span>
                                <span className="text-xs font-bold text-cyber-silver/40 uppercase tracking-widest whitespace-nowrap">
                                    {task.client?.name || 'Sistema General'}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CompletedTasks;