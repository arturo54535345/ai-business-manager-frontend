// -------------------------------------------------------------------------
// 📂 ARCHIVO: src/pages/private/Profile.jsx
// 📝 DESCRIPCIÓN: Centro de Identidad Neural con acabados de alta ingeniería.
// -------------------------------------------------------------------------
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { toast } from "react-hot-toast";
import api from "../../api/axios";

const Profile = () => {
    // 🧠 LÓGICA (INTACTA)
    const { user, updateUser } = useAuth(); 
    const [isEditing, setIsEditing] = useState(false); 
    const [showPassForm, setShowPassForm] = useState(false); 
    
    const [formData, setFormData] = useState({
        name: user?.name || "",
        preferences: {
            aiTone: user?.preferences?.aiTone || "Socio",
            monthlyGoal: user?.preferences?.monthlyGoal || 10,
            businessMotto: user?.preferences?.businessMotto || "",
            themeColor: user?.preferences?.themeColor || "blue"
        }
    });

    const [passData, setPassData] = useState({ oldPassword: '', newPassword: '' });

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const res = await api.put('/auth/profile', formData);
            updateUser(res.data);
            setIsEditing(false);
            toast.success("Sincronización de perfil completa");
        } catch (error) {
            toast.error("Error al actualizar el registro.");
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        try {
            await api.put('/auth/change-password', passData);
            toast.success("Código de acceso actualizado");
            setShowPassForm(false);
            setPassData({ oldPassword: '', newPassword: '' });
        } catch (error) {
            toast.error("Fallo en la actualización de seguridad");
        }
    };

    // Diccionario de Neones con sombras de profundidad
    const colorThemes = {
        blue: "bg-cyber-blue shadow-[0_0_40px_rgba(0,209,255,0.2)]",
        red: "bg-red-500 shadow-[0_0_40px_rgba(239,68,68,0.2)]",
        green: "bg-green-500 shadow-[0_0_40px_rgba(34,197,94,0.2)]",
        purple: "bg-cyber-purple shadow-[0_0_40px_rgba(157,0,255,0.2)]"
    };

    if (!user) return <div className="p-20 text-center font-black text-cyber-blue animate-pulse uppercase tracking-[0.5em] text-[10px]">Accediendo a la Base de Datos...</div>;

    return (
        <div className="space-y-16 reveal-premium pb-20">
            
            {/* --- CABECERA (Identidad Neural) --- */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-[2px] bg-cyber-blue opacity-50"></div>
                        <span className="text-[9px] font-black text-cyber-blue uppercase tracking-[0.4em]">User_Profile_Manifest</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none italic">
                        Expediente <span className="text-cyber-blue">ID</span>
                    </h1>
                    <p className="text-cyber-silver/40 font-medium italic text-lg">
                        "{formData.preferences.businessMotto || 'Operando sin mantra corporativo...'}"
                    </p>
                </div>
                
                <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className={`px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all duration-700 ${
                        isEditing 
                        ? 'bg-red-500/10 text-red-500 border border-red-500/20' 
                        : 'glass bg-white/[0.03] text-white hover:bg-white/[0.08]'
                    }`}
                >
                    {isEditing ? "Abortar Edición" : "Modificar Parámetros"}
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                
                {/* --- COLUMNA 1: EL NÚCLEO (Avatar Flotante) --- */}
                <div className="space-y-10">
                    <div className="glass p-12 text-center relative overflow-hidden group animate-float-slow">
                        {/* Indicador de color de marca (Luz superior) */}
                        <div className={`absolute top-0 left-0 w-full h-[2px] transition-all duration-1000 ${colorThemes[formData.preferences.themeColor]}`}></div>
                        
                        <div className={`w-32 h-32 ${colorThemes[formData.preferences.themeColor]} text-black rounded-[40px] flex items-center justify-center text-5xl font-black mx-auto mb-10 transition-all duration-1000 group-hover:scale-105`}>
                            {user.name.charAt(0)}
                        </div>
                        
                        <h2 className="text-4xl font-black text-white tracking-tighter italic mb-2">{user.name}</h2>
                        <p className="text-cyber-silver/30 text-[9px] font-black uppercase tracking-[0.4em] mb-10">{user.email}</p>
                        
                        {/* Selector de color (Tecnología de Interfaz) */}
                        {isEditing && (
                            <div className="pt-10 border-t border-white/5 reveal-premium">
                                <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em] mb-6">Color_System_Theme</p>
                                <div className="flex justify-center gap-5">
                                    {['blue', 'red', 'green', 'purple'].map(col => (
                                        <button 
                                            key={col}
                                            onClick={() => setFormData({...formData, preferences: {...formData.preferences, themeColor: col}})}
                                            className={`w-7 h-7 rounded-xl border-2 transition-all duration-500 ${formData.preferences.themeColor === col ? 'border-white scale-125 shadow-lg' : 'border-transparent opacity-30 hover:opacity-100 hover:scale-110'}`}
                                            style={{ backgroundColor: col === 'blue' ? '#00D1FF' : col === 'purple' ? '#9D00FF' : col }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Nota de la IA */}
                    <div className="glass p-10 border-l-2 border-l-cyber-purple bg-cyber-purple/[0.02]">
                        <h3 className="text-[8px] font-black text-cyber-purple uppercase tracking-[0.5em] mb-6">Status_Neural_Advice</h3>
                        <p className="text-sm leading-relaxed italic text-cyber-silver/60 font-medium">
                            "Arturo, el sistema está operando en modo <span className="text-cyber-purple font-black">{formData.preferences.aiTone}</span>. Tu rendimiento proyectado es de {formData.preferences.monthlyGoal} misiones mensuales."
                        </p>
                    </div>
                </div>

                {/* --- COLUMNA 2 Y 3: PANEL DE CONTROL --- */}
                <div className="lg:col-span-2 space-y-10">
                    <form onSubmit={handleUpdateProfile} className="glass p-12 border-white/5 space-y-12">
                        <div className="flex items-center gap-4 mb-4">
                            <span className="w-2 h-2 bg-cyber-blue rounded-full animate-pulse"></span>
                            <h3 className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Core_Configuration</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {[
                                { label: "Alias_Operador", val: formData.name, key: 'name', type: 'text' },
                                { label: "Mantra_Corporativo", val: formData.preferences.businessMotto, key: 'motto', type: 'text' },
                                { label: "Meta_Mensual", val: formData.preferences.monthlyGoal, key: 'goal', type: 'number' }
                            ].map((input) => (
                                <div key={input.label} className="group">
                                    <label className="text-[8px] font-black text-white/20 uppercase mb-4 block tracking-[0.4em] group-focus-within:text-cyber-blue transition-colors duration-500">{input.label}</label>
                                    <input 
                                        type={input.type}
                                        disabled={!isEditing}
                                        className="w-full bg-white/[0.02] border border-white/5 p-5 rounded-2xl text-white outline-none focus:border-cyber-blue/30 focus:bg-white/[0.04] transition-all duration-700 font-medium disabled:opacity-40"
                                        value={input.val}
                                        onChange={(e) => {
                                            if(input.key === 'name') setFormData({...formData, name: e.target.value});
                                            else if(input.key === 'motto') setFormData({...formData, preferences: {...formData.preferences, businessMotto: e.target.value}});
                                            else setFormData({...formData, preferences: {...formData.preferences, monthlyGoal: Number(e.target.value)}});
                                        }}
                                    />
                                </div>
                            ))}

                            <div>
                                <label className="text-[8px] font-black text-white/20 uppercase mb-4 block tracking-[0.4em]">IA_Voice_Protocol</label>
                                <select 
                                    disabled={!isEditing}
                                    className="w-full bg-white/[0.02] border border-white/5 p-5 rounded-2xl text-white font-bold outline-none cursor-pointer focus:border-cyber-blue/30 disabled:opacity-40"
                                    value={formData.preferences.aiTone}
                                    onChange={(e) => setFormData({...formData, preferences: { ...formData.preferences, aiTone: e.target.value }})}
                                >
                                    <option value="Socio">Socio Proactivo</option>
                                    <option value="Coach">Coach de Élite</option>
                                    <option value="Analista">Analista Frío</option>
                                </select>
                            </div>
                        </div>

                        {isEditing && (
                            <button 
                                type="submit" 
                                className="w-full bg-cyber-blue text-black py-6 rounded-2xl font-black uppercase text-[11px] tracking-[0.4em] shadow-[0_20px_40px_-10px_rgba(0,209,255,0.4)] hover:scale-[1.01] transition-all duration-700"
                            >
                                Sincronizar Cambios
                            </button>
                        )}
                    </form>

                    {/* SECCIÓN DE SEGURIDAD (Cifrado) */}
                    <div className="glass p-12 border-red-500/10 bg-red-500/[0.01]">
                        <div className="flex justify-between items-center mb-12">
                            <h3 className="text-[10px] font-black text-red-500/60 uppercase tracking-[0.4em]">Security_Layer</h3>
                            <button 
                                onClick={() => setShowPassForm(!showPassForm)}
                                className={`text-[9px] font-black uppercase px-6 py-2.5 rounded-xl transition-all duration-700 ${showPassForm ? 'bg-red-500 text-white' : 'glass bg-white/5 text-cyber-silver/40 hover:text-white'}`}
                            >
                                {showPassForm ? "Cerrar Panel" : "Modificar Clave"}
                            </button>
                        </div>

                        {showPassForm && (
                            <form onSubmit={handleChangePassword} className="space-y-8 reveal-premium">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <input 
                                        type="password" 
                                        placeholder="CÓDIGO ACTUAL"
                                        className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl text-white outline-none focus:border-red-500/40 transition-all duration-700"
                                        onChange={(e) => setPassData({...passData, oldPassword: e.target.value})}
                                        required
                                    />
                                    <input 
                                        type="password" 
                                        placeholder="NUEVO CÓDIGO"
                                        className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl text-white outline-none focus:border-red-500/40 transition-all duration-700"
                                        onChange={(e) => setPassData({...passData, newPassword: e.target.value})}
                                        required
                                    />
                                </div>
                                <button type="submit" className="w-full bg-red-500 text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] shadow-[0_15px_30px_-10px_rgba(239,68,68,0.4)]">
                                    Ejecutar Actualización de Cifrado
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;