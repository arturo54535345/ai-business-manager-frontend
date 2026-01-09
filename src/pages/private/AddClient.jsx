// -------------------------------------------------------------------------
// 📂 ARCHIVO: src/pages/private/AddClient.jsx
// 📝 DESCRIPCIÓN: Registro de activos con integración financiera directa.
// -------------------------------------------------------------------------
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios'; 
import { toast } from 'react-hot-toast';

const AddClient = () => {
    // 🧠 MEMORIA ACTUALIZADA (Añadimos budget y cost)
    const [formData, setFormData] = useState({
        name: '', 
        email: '', 
        companyName: '', 
        phone: '', 
        category: 'General',
        // 🟢 NUEVO: Parámetros económicos iniciales
        budget: 0,
        cost: 0,
        technicalSheet: { notes: '' }
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // 👨‍🏫 Enviamos el paquete completo con los datos de dinero al servidor
            await api.post('/clients', formData);
            toast.success('Activo y capital registrados', {
                style: { background: '#030303', color: '#00D1FF', border: '1px solid rgba(0,209,255,0.2)' }
            });
            navigate('/clientes');
        } catch (error) { 
            toast.error('Fallo en la sincronización del activo.'); 
        } finally { 
            setLoading(false); 
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12 reveal-premium pb-20">
            
            {/* --- CABECERA (Identidad de Registro) --- */}
            <header className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-[2px] bg-cyber-blue opacity-50"></div>
                    <span className="text-[9px] font-black text-cyber-blue uppercase tracking-[0.4em]">New_Asset_Registration</span>
                </div>
                <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter italic">
                    Nuevo <span className="text-cyber-blue">Cliente</span>
                </h1>
                <p className="text-cyber-silver/40 font-medium italic text-lg max-w-xl">
                    Inicia el protocolo de alta para nuevos socios estratégicos y flujos de capital.
                </p>
            </header>

            <form onSubmit={handleSubmit} className="glass p-12 border-white/5 space-y-12">
                
                {/* 📋 BLOQUE 1: IDENTIFICACIÓN */}
                <div className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="group">
                            <label className="block text-[8px] font-black text-white/20 uppercase mb-4 tracking-[0.4em] ml-1">Nombre_Legal</label>
                            <input 
                                type="text" 
                                required 
                                placeholder="Ej: Operador Alfa" 
                                className="w-full bg-white/[0.02] border border-white/5 p-5 rounded-2xl text-white outline-none focus:border-cyber-blue/30 transition-all font-bold" 
                                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                            />
                        </div>
                        <div className="group">
                            <label className="block text-[8px] font-black text-white/20 uppercase mb-4 tracking-[0.4em] ml-1">Enlace_Comunicación</label>
                            <input 
                                type="email" 
                                required 
                                placeholder="identidad@red.com" 
                                className="w-full bg-white/[0.02] border border-white/5 p-5 rounded-2xl text-white outline-none focus:border-cyber-blue/30 transition-all font-bold" 
                                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="group">
                            <label className="block text-[8px] font-black text-white/20 uppercase mb-4 tracking-[0.4em] ml-1">Corporación_ID</label>
                            <input 
                                type="text" 
                                className="w-full bg-white/[0.02] border border-white/5 p-5 rounded-2xl text-white outline-none focus:border-cyber-blue/30 transition-all font-medium" 
                                onChange={(e) => setFormData({...formData, companyName: e.target.value})} 
                            />
                        </div>
                        <div className="group">
                            <label className="block text-[8px] font-black text-white/20 uppercase mb-4 tracking-[0.4em] ml-1">Nivel_Prioridad</label>
                            <select 
                                className="w-full bg-white/[0.02] border border-white/5 p-5 rounded-2xl text-white font-bold outline-none cursor-pointer focus:border-cyber-blue/30 transition-all" 
                                onChange={(e) => setFormData({...formData, category: e.target.value})}
                            >
                                <option value="General">Registro_General</option>
                                <option value="VIP">Prioridad_VIP</option>
                                <option value="Potencial">Lead_Potencial</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* 💰 BLOQUE 2: INTELIGENCIA FINANCIERA (La nueva sección)
                    Lógica: Usamos un panel diferenciado para marcar la importancia del dinero. */}
                <div className="glass bg-cyber-blue/[0.01] p-10 border-cyber-blue/10 rounded-[40px] space-y-10 relative overflow-hidden">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-cyber-blue rounded-full animate-ping"></div>
                        <p className="text-[9px] font-black text-cyber-blue uppercase tracking-[0.3em]">Capital_Inicial_Vincualdo</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-3">
                            <label className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em] ml-2">Presupuesto_In</label>
                            <div className="relative">
                                <input 
                                    type="number" 
                                    placeholder="0.00" 
                                    className="w-full bg-black/40 border border-white/5 p-5 rounded-2xl text-white outline-none focus:border-cyber-blue/40 font-black text-2xl tracking-tighter transition-all" 
                                    onChange={(e) => setFormData({...formData, budget: Number(e.target.value)})} 
                                />
                                <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-cyber-blue/20">€</span>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em] ml-2">Coste_Operativo</label>
                            <div className="relative">
                                <input 
                                    type="number" 
                                    placeholder="0.00" 
                                    className="w-full bg-black/40 border border-white/5 p-5 rounded-2xl text-white outline-none focus:border-red-500/40 font-black text-2xl tracking-tighter transition-all" 
                                    onChange={(e) => setFormData({...formData, cost: Number(e.target.value)})} 
                                />
                                <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-red-500/20">€</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 🚀 ACCIÓN FINAL */}
                <button 
                    type="submit" 
                    disabled={loading} 
                    className="w-full bg-cyber-blue text-black py-6 rounded-3xl font-black uppercase text-[11px] tracking-[0.4em] shadow-[0_20px_40px_-10px_rgba(0,209,255,0.4)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-700"
                >
                    {loading ? 'Sincronizando...' : 'Ejecutar Registro de Activo'}
                </button>
            </form>
        </div>
    );
};

export default AddClient;