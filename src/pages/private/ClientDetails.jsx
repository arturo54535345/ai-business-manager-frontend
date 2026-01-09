// -------------------------------------------------------------------------
// 📂 ARCHIVO: src/pages/private/ClientDetails.jsx
// 📝 DESCRIPCIÓN: Expediente detallado de activo con visualización táctica.
// -------------------------------------------------------------------------
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from '../../api/axios';
import { toast } from 'react-hot-toast';

const ClientDetails = () => {
    // 🧠 LÓGICA (INTACTA)
    const { id } = useParams(); 
    const navigate = useNavigate();
    const [data, setData] = useState(null); 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await api.get(`/clients/${id}`);
                setData(res.data);
            } catch (error) {
                toast.error("No se pudo cargar el expediente.");
                navigate('/clientes');
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id, navigate]);

    const handleDelete = async () => {
        if (window.confirm(`¿Confirmar eliminación definitiva de ${data.client.name}?`)) {
            try {
                await api.delete(`/clients/${id}`);
                toast.success("Registro de activo borrado");
                navigate('/clientes'); 
            } catch (error) {
                toast.error("Fallo en el protocolo de borrado.");
            }
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center font-black text-cyber-blue animate-pulse uppercase tracking-[0.5em] text-[10px]">
            Sincronizando Expediente de Activo...
        </div>
    );
    
    if (!data) return null;

    const { client, tasks } = data;

    return (
        <div className="space-y-12 reveal-premium pb-20 max-w-7xl mx-auto">
            
            {/* --- CABECERA TÁCTICA (Navegación y Alerta) --- */}
            <div className="flex justify-between items-center glass p-6 border-white/5">
                <button 
                    onClick={() => navigate('/clientes')}
                    className="text-cyber-silver/40 hover:text-cyber-blue font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-4 transition-all duration-500 group"
                >
                    <span className="group-hover:-translate-x-2 transition-transform duration-500">←</span> Retornar al Directorio
                </button>

                <button 
                    onClick={handleDelete}
                    className="bg-red-500/10 text-red-500 border border-red-500/20 px-6 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all duration-700"
                >
                    Eliminar Registro
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                
                {/* --- 🏠 COLUMNA IZQUIERDA: IDENTIDAD (El Núcleo) --- */}
                <div className="lg:col-span-1 space-y-10">
                    
                    {/* Tarjeta de Identidad Futurista */}
                    <div className="glass p-12 text-center relative overflow-hidden group animate-float-slow">
                        {/* Indicador de categoría neón */}
                        <div className={`absolute top-0 left-0 w-full h-[2px] ${
                            client.category === 'VIP' ? 'bg-cyber-purple shadow-[0_0_15px_#9D00FF]' : 'bg-cyber-blue opacity-30'
                        }`}></div>

                        <div className="w-24 h-24 bg-white/[0.03] border border-white/10 text-cyber-blue rounded-[30px] flex items-center justify-center text-4xl font-black mx-auto mb-8 group-hover:scale-105 transition-transform duration-1000">
                            {client.name.charAt(0)}
                        </div>
                        <h1 className="text-4xl font-black text-white tracking-tighter italic mb-2 leading-none">{client.name}</h1>
                        <p className="text-cyber-blue text-[10px] font-black uppercase tracking-[0.3em] mb-8">{client.companyName || 'Corporación_Independiente'}</p>
                        
                        <span className={`px-5 py-2 rounded-full text-[8px] font-black uppercase tracking-[0.3em] border ${
                            client.category === 'VIP' ? 'border-cyber-purple/40 text-cyber-purple bg-cyber-purple/5' : 'border-white/5 text-cyber-silver/40'
                        }`}>
                            Prioridad: {client.category}
                        </span>
                    </div>

                    {/* Datos de Comunicaciones */}
                    <div className="glass p-10 space-y-8">
                        <h3 className="font-black text-white/20 text-[8px] font-black uppercase tracking-[0.5em] mb-2">Terminal_Comms</h3>
                        <div className="space-y-6">
                            <div className="group">
                                <p className="text-[7px] font-black text-cyber-blue/40 uppercase tracking-widest mb-1">Enlace_Email</p>
                                <p className="text-sm font-bold text-cyber-silver/80 group-hover:text-white transition-colors truncate">{client.email}</p>
                            </div>
                            <div className="group">
                                <p className="text-[7px] font-black text-cyber-blue/40 uppercase tracking-widest mb-1">Enlace_Voz</p>
                                <p className="text-sm font-bold text-cyber-silver/80 group-hover:text-white transition-colors">{client.phone || 'ID_NULL'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Notas del Socio (IA Context) */}
                    <div className="glass p-10 border-cyber-purple/20 bg-cyber-purple/[0.02] relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 text-[7px] font-black text-cyber-purple uppercase tracking-[0.4em]">Neural_Note</div>
                        <h3 className="font-black text-cyber-purple mb-6 text-[8px] uppercase tracking-[0.5em]">Análisis_de_Socio</h3>
                        <p className="text-sm leading-relaxed text-cyber-silver/60 italic font-medium">
                            "{client.technicalSheet?.notes || 'No se han registrado observaciones estratégicas para este activo.'}"
                        </p>
                    </div>
                </div>

                {/* --- 📝 COLUMNA DERECHA: LOG DE OPERACIONES (Tareas) --- */}
                <div className="lg:col-span-2 space-y-10">
                    <div className="flex justify-between items-end px-4">
                        <div className="space-y-2">
                             <h2 className="text-4xl font-black text-white tracking-tighter italic">Misiones <span className="text-cyber-blue">Vinculadas</span></h2>
                             <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Registro de objetivos operativos</p>
                        </div>
                        <span className="glass bg-white/5 px-4 py-2 rounded-xl text-[9px] font-black text-cyber-blue border border-cyber-blue/20 uppercase">
                            {tasks.length} REGISTROS
                        </span>
                    </div>

                    <div className="space-y-6">
                        {tasks.length === 0 ? (
                            <div className="glass p-20 border-dashed border-white/5 text-center">
                                <p className="text-cyber-silver/20 text-[10px] font-black uppercase tracking-[0.4em] italic">No se han detectado misiones activas para este activo.</p>
                            </div>
                        ) : (
                            tasks.map((task, index) => (
                                <div 
                                    key={task._id} 
                                    onClick={() => navigate(`/tareas/${task._id}`)}
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                    className={`glass glass-hover p-8 flex flex-col md:flex-row justify-between items-center gap-8 reveal-premium group ${
                                        task.status === 'completed' ? 'opacity-30' : ''
                                    }`}
                                >
                                    <div className="flex items-center gap-8 w-full">
                                        {/* Estado Visual Táctico */}
                                        <div className="relative">
                                            <div className={`w-3 h-3 rounded-full ${
                                                task.status === 'completed' ? 'bg-green-500 shadow-[0_0_15px_#22C55E]' : 'bg-cyber-blue animate-pulse shadow-[0_0_15px_#00D1FF]'
                                            }`}></div>
                                        </div>

                                        <div className="space-y-2">
                                            <h4 className={`text-xl font-black tracking-tight group-hover:text-cyber-blue transition-colors duration-500 ${
                                                task.status === 'completed' ? 'line-through text-cyber-silver/40' : 'text-white'
                                            }`}>
                                                {task.title}
                                            </h4>
                                            <p className="text-[9px] font-black text-cyber-silver/20 uppercase tracking-widest">
                                                Cierre_Estimado: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'TBD'}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-6 w-full md:w-auto justify-end">
                                        <span className="text-[8px] font-black uppercase tracking-[0.3em] px-4 py-1.5 bg-white/[0.03] border border-white/5 text-cyber-silver/40 rounded-lg group-hover:border-cyber-blue/30 transition-colors">
                                            {task.category || 'General'}
                                        </span>
                                        <button className="text-[9px] font-black uppercase text-cyber-blue/60 hover:text-white tracking-widest transition-colors">
                                            Detalle
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientDetails;