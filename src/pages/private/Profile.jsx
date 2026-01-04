import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { toast } from "react-hot-toast";
import api from "../../api/axios";

const Profile = () => {
    const { user, setUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    
    // 1. ESTADO DEL FORMULARIO: Incluimos las nuevas preferencias
    const [formData, setFormData] = useState({
        name: user?.name || "",
        preferences: {
            aiTone: user?.preferences?.aiTone || "Socio",
            monthlyGoal: user?.preferences?.monthlyGoal || 10
        }
    });

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            // Enviamos todo el objeto al Backend para guardar nombre, tono y meta
            const res = await api.put('/auth/profile', formData);
            setUser(res.data); 
            setIsEditing(false);
            toast.success("¡Configuración guardada!", { icon: '⚙️' });
        } catch (error) {
            toast.error("No se pudo actualizar el perfil.");
        }
    };

    if (!user) return <p className="p-10 text-center">Cargando tu oficina...</p>;

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8">
            <header>
                <h1 className="text-4xl font-black text-gray-900">Centro de Control</h1>
                <p className="text-gray-500">Personaliza tu experiencia y define tus metas.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* --- COLUMNA IZQUIERDA: IDENTIDAD Y SALUD --- */}
                <div className="space-y-6">
                    {/* Tarjeta de Usuario */}
                    <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 text-center">
                        <div className="w-24 h-24 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-[32px] flex items-center justify-center text-4xl font-black mx-auto mb-4 shadow-xl shadow-blue-100">
                            {user.name.charAt(0)}
                        </div>
                        <h2 className="text-2xl font-black text-gray-900">{user.name}</h2>
                        <p className="text-gray-400 text-sm mb-6">{user.email}</p>
                        <button 
                            onClick={() => setIsEditing(!isEditing)}
                            className="bg-gray-100 text-gray-600 px-6 py-2 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all"
                        >
                            {isEditing ? "Cancelar" : "Editar Ajustes"}
                        </button>
                    </div>

                    {/* SEMÁFORO DE SALUD DEL NEGOCIO */}
                    <div className="bg-white p-6 rounded-[32px] border border-gray-100">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Estado del Negocio</h3>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="w-4 h-4 bg-green-500 rounded-full animate-ping absolute"></div>
                                <div className="w-4 h-4 bg-green-500 rounded-full relative"></div>
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">Rendimiento Óptimo</p>
                                <p className="text-xs text-gray-500">IA: "Arturo, vas por buen camino"</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- COLUMNA DERECHA: CONFIGURACIÓN Y METAS --- */}
                <div className="lg:col-span-2 space-y-6">
                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                        
                        {/* SECCIÓN: DATOS BÁSICOS */}
                        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                👤 Información de Cuenta
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-2">Nombre de Usuario</label>
                                    <input 
                                        type="text"
                                        disabled={!isEditing}
                                        className={`w-full px-4 py-3 rounded-xl border ${isEditing ? 'border-blue-200 bg-white' : 'border-transparent bg-gray-50 cursor-not-allowed'} outline-none transition-all`}
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-2">Email (No editable)</label>
                                    <input 
                                        type="text"
                                        disabled
                                        className="w-full px-4 py-3 rounded-xl border border-transparent bg-gray-50 text-gray-400"
                                        value={user.email}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* SECCIÓN: PERSONALIDAD IA Y OBJETIVOS */}
                        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                🤖 Configuración Estratégica
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Tono de la IA</label>
                                    <p className="text-xs text-gray-400 mb-3">¿Cómo quieres que te hable tu asistente?</p>
                                    <select 
                                        disabled={!isEditing}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 font-bold text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={formData.preferences.aiTone}
                                        onChange={(e) => setFormData({
                                            ...formData, 
                                            preferences: { ...formData.preferences, aiTone: e.target.value }
                                        })}
                                    >
                                        <option value="Socio">Socio Amigable</option>
                                        <option value="Coach">Coach Motivador</option>
                                        <option value="Analista">Analista Serio</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Meta Mensual (Tareas)</label>
                                    <p className="text-xs text-gray-400 mb-3">¿Cuántos objetivos quieres cumplir al mes?</p>
                                    <input 
                                        type="number"
                                        disabled={!isEditing}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 font-bold text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={formData.preferences.monthlyGoal}
                                        onChange={(e) => setFormData({
                                            ...formData, 
                                            preferences: { ...formData.preferences, monthlyGoal: e.target.value }
                                        })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* BOTÓN DE GUARDAR (Solo aparece al editar) */}
                        {isEditing && (
                            <button 
                                type="submit"
                                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-100"
                            >
                                Guardar Configuración Maestra
                            </button>
                        )}
                    </form>

                    {/* SECCIÓN DE LOGROS (Visual) */}
                    <div className="bg-gray-900 p-8 rounded-[40px] text-white overflow-hidden relative">
                        <h3 className="text-lg font-bold mb-6">Mis Logros y Medallas</h3>
                        <div className="grid grid-cols-4 gap-4">
                            <div className="flex flex-col items-center gap-2 opacity-100">
                                <span className="text-3xl">🏅</span>
                                <span className="text-[10px] font-black uppercase tracking-tighter">Primer Cliente</span>
                            </div>
                            <div className="flex flex-col items-center gap-2 opacity-30 grayscale">
                                <span className="text-3xl">🎯</span>
                                <span className="text-[10px] font-black uppercase tracking-tighter">Meta del Mes</span>
                            </div>
                            <div className="flex flex-col items-center gap-2 opacity-30 grayscale">
                                <span className="text-3xl">💎</span>
                                <span className="text-[10px] font-black uppercase tracking-tighter">Club VIP</span>
                            </div>
                            <div className="flex flex-col items-center gap-2 opacity-30 grayscale">
                                <span className="text-3xl">🚀</span>
                                <span className="text-[10px] font-black uppercase tracking-tighter">Nivel Pro</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;