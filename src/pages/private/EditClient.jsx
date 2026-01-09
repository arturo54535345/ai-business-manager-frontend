// -------------------------------------------------------------------------
// 📂 ARCHIVO: src/pages/private/EditClient.jsx
// 📝 DESCRIPCIÓN: Interfaz de recalibración de activos (clientes) de alta gama.
// -------------------------------------------------------------------------
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from '../../api/axios';
import { toast } from 'react-hot-toast';

const EditClient = () => {
    // 🧠 LÓGICA (INTACTA)
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        companyName: '',
        phone: '',
        category: 'General',
        technicalSheet: { notes: '' }
    });
    
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClient = async () => {
            try {
                const res = await api.get(`/clients/${id}`);
                setFormData({
                    ...res.data,
                    companyName: res.data.companyName || '',
                    phone: res.data.phone || '',
                    technicalSheet: {
                        notes: res.data.technicalSheet?.notes || ''
                    }
                });
            } catch (error) {
                toast.error("No se pudo encontrar el cliente.");
                navigate('/clientes');
            } finally {
                setLoading(false);
            }
        };
        fetchClient();
    }, [id, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/clients/${id}`, formData);
            toast.success('Expediente de activo actualizado', {
                style: { background: '#030303', color: '#00D1FF', border: '1px solid rgba(0,209,255,0.2)' }
            });
            navigate('/clientes'); 
        } catch (error) {
            toast.error("Error al guardar los cambios.");
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center font-black text-cyber-blue animate-pulse uppercase tracking-[0.5em] text-[10px]">
            Accediendo a Archivos Confidenciales...
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-12 reveal-premium pb-20">
            
            {/* --- CABECERA (Identidad del Activo) --- */}
            <header className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-[2px] bg-cyber-blue opacity-50"></div>
                    <span className="text-[9px] font-black text-cyber-blue uppercase tracking-[0.4em]">Asset_Recalibration_File</span>
                </div>
                <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none italic">
                    Editar <span className="text-cyber-blue">Cliente</span>
                </h1>
                <p className="text-cyber-silver/40 font-medium italic text-lg">Modifica los parámetros de contacto y nivel de prioridad del activo.</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-10">
                
                {/* 📋 BLOQUE 1: IDENTIFICACIÓN PRINCIPAL */}
                <div className="glass p-12 border-white/5 space-y-10">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="w-2 h-2 bg-cyber-blue rounded-full animate-pulse"></span>
                        <h3 className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Identificación_Primaria</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="group">
                            <label className="block text-[8px] font-black text-white/20 uppercase mb-4 ml-1 tracking-[0.4em] group-focus-within:text-cyber-blue transition-colors duration-500">
                                Nombre_Legal
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                required
                                className="w-full bg-white/[0.02] border border-white/5 p-5 rounded-2xl text-white outline-none focus:border-cyber-blue/30 focus:bg-white/[0.04] transition-all duration-700 font-bold"
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                            />
                        </div>

                        <div className="group">
                            <label className="block text-[8px] font-black text-white/20 uppercase mb-4 ml-1 tracking-[0.4em] group-focus-within:text-cyber-blue transition-colors duration-500">
                                Enlace_Email
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                required
                                className="w-full bg-white/[0.02] border border-white/5 p-5 rounded-2xl text-white outline-none focus:border-cyber-blue/30 focus:bg-white/[0.04] transition-all duration-700 font-bold"
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="group">
                            <label className="block text-[8px] font-black text-white/20 uppercase mb-4 ml-1 tracking-[0.4em]">Corporación_ID</label>
                            <input
                                type="text"
                                value={formData.companyName}
                                className="w-full bg-white/[0.02] border border-white/5 p-5 rounded-2xl text-white outline-none focus:border-cyber-blue/30 focus:bg-white/[0.04] transition-all duration-700 font-bold"
                                onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                            />
                        </div>
                        <div className="group">
                            <label className="block text-[8px] font-black text-white/20 uppercase mb-4 ml-1 tracking-[0.4em]">Terminal_Telefónica</label>
                            <input
                                type="tel"
                                value={formData.phone}
                                className="w-full bg-white/[0.02] border border-white/5 p-5 rounded-2xl text-white outline-none focus:border-cyber-blue/30 focus:bg-white/[0.04] transition-all duration-700 font-bold"
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            />
                        </div>
                    </div>
                </div>

                {/* 🏷️ BLOQUE 2: CATEGORIZACIÓN Y NOTAS */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-1 glass p-10 border-white/5 space-y-8">
                        <div className="space-y-4">
                            <label className="block text-[8px] font-black text-cyber-blue uppercase tracking-[0.4em] mb-4">Nivel_Prioridad</label>
                            <select 
                                value={formData.category}
                                className="w-full bg-white/[0.02] border border-white/5 p-5 rounded-2xl text-white font-bold outline-none cursor-pointer focus:border-cyber-blue/30 transition-all duration-700"
                                onChange={(e) => setFormData({...formData, category: e.target.value})}
                            >
                                <option value="General">General</option>
                                <option value="VIP">Prioridad VIP</option>
                                <option value="Potencial">Lead Potencial</option>
                            </select>
                        </div>
                        
                        <div className={`p-6 rounded-2xl border transition-all duration-1000 ${
                            formData.category === 'VIP' ? 'bg-cyber-purple/5 border-cyber-purple/20' : 'bg-white/[0.01] border-white/5'
                        }`}>
                            <p className="text-[9px] font-black text-cyber-silver/40 uppercase tracking-widest leading-relaxed">
                                {formData.category === 'VIP' 
                                    ? "ESTADO CRÍTICO: Este activo requiere atención preferente del sistema." 
                                    : "ESTADO ESTÁNDAR: Protocolo de seguimiento regular activado."}
                            </p>
                        </div>
                    </div>

                    <div className="lg:col-span-2 glass p-10 border-white/5">
                        <label className="block text-[8px] font-black text-cyber-purple uppercase tracking-[0.4em] mb-6 ml-1">Notas_Técnicas_Informe</label>
                        <textarea
                            value={formData.technicalSheet.notes}
                            className="w-full bg-white/[0.02] border border-white/5 p-8 rounded-[30px] text-cyber-silver/80 outline-none focus:border-cyber-purple/30 focus:bg-white/[0.04] transition-all duration-700 h-44 font-medium leading-relaxed resize-none"
                            onChange={(e) => setFormData({
                                ...formData, 
                                technicalSheet: { ...formData.technicalSheet, notes: e.target.value } 
                            })}
                        />
                    </div>
                </div>

                {/* 🚀 ACCIONES FINALES */}
                <div className="flex flex-col md:flex-row gap-6 pt-10">
                    <button
                        type="button"
                        onClick={() => navigate('/clientes')}
                        className="flex-1 glass bg-white/[0.03] text-cyber-silver/40 py-6 rounded-2xl font-black uppercase text-[10px] tracking-[0.4em] hover:text-white transition-all duration-700"
                    >
                        Abortar_Edición
                    </button>
                    <button
                        type="submit"
                        className="flex-1 bg-cyber-blue text-black py-6 rounded-2xl font-black uppercase text-[10px] tracking-[0.4em] shadow-[0_20px_40px_-10px_rgba(0,209,255,0.4)] hover:scale-[1.02] transition-all duration-700"
                    >
                        Guardar_Recalibración
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditClient;