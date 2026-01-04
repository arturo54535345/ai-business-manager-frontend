import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { toast } from "react-hot-toast";
import api from "../../api/axios";

const Profile = () => {
    const { user, setUser } = useAuth();
    
    // --- ESTADOS DE CONTROL ---
    const [isEditing, setIsEditing] = useState(false); // Interruptor para editar perfil
    const [showPassForm, setShowPassForm] = useState(false); // Interruptor para ver formulario de clave
    
    // --- DATOS DEL PERFIL ---
    const [formData, setFormData] = useState({
        name: user?.name || "",
        preferences: {
            aiTone: user?.preferences?.aiTone || "Socio",
            monthlyGoal: user?.preferences?.monthlyGoal || 10,
            businessMotto: user?.preferences?.businessMotto || "",
            themeColor: user?.preferences?.themeColor || "blue" // Color de marca
        }
    });

    // --- DATOS DE SEGURIDAD ---
    const [passData, setPassData] = useState({ oldPassword: '', newPassword: '' });

    // 1. Lógica para guardar cambios de nombre y preferencias
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const res = await api.put('/auth/profile', formData);
            setUser(res.data); // Actualiza la memoria de la web al instante
            setIsEditing(false);
            toast.success("¡Configuración actualizada!", { icon: '🚀' });
        } catch (error) {
            toast.error("No se pudieron guardar los cambios.");
        }
    };

    // 2. Lógica para cambiar la contraseña
    const handleChangePassword = async (e) => {
        e.preventDefault();
        try {
            await api.put('/auth/change-password', passData);
            toast.success("Contraseña cambiada con éxito", { icon: '🔐' });
            setShowPassForm(false);
            setPassData({ oldPassword: '', newPassword: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || "Error al cambiar contraseña");
        }
    };

    // Diccionario de colores dinámicos (Clases de Tailwind)
    const colorThemes = {
        blue: "from-blue-600 to-indigo-600 shadow-blue-100",
        red: "from-red-600 to-rose-600 shadow-red-100",
        green: "from-green-600 to-emerald-600 shadow-green-100",
        purple: "from-purple-600 to-fuchsia-600 shadow-purple-100"
    };

    if (!user) return <p className="p-10 text-center font-bold text-gray-400">Abriendo expediente...</p>;

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8">
            
            {/* CABECERA DINÁMICA */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Mi Perfil Profesional</h1>
                    <p className="text-gray-500 italic text-lg">"{user.preferences?.businessMotto || 'Define tu visión de negocio...'}"</p>
                </div>
                <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className={`px-8 py-3 rounded-2xl font-bold transition-all shadow-lg ${
                        isEditing ? 'bg-red-50 text-red-600 shadow-none' : 'bg-white text-gray-900 border border-gray-100 hover:bg-gray-50'
                    }`}
                >
                    {isEditing ? "Cancelar" : "Personalizar Cuenta"}
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* COLUMNA IZQUIERDA: IDENTIDAD VISUAL */}
                <div className="space-y-6">
                    {/* Tarjeta de Avatar */}
                    <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 text-center relative overflow-hidden">
                        {/* Línea decorativa superior que cambia de color */}
                        <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${colorThemes[formData.preferences.themeColor]}`}></div>
                        
                        <div className={`w-28 h-28 bg-gradient-to-tr ${colorThemes[formData.preferences.themeColor]} text-white rounded-[38px] flex items-center justify-center text-5xl font-black mx-auto mb-6 shadow-2xl`}>
                            {user.name.charAt(0)}
                        </div>
                        <h2 className="text-2xl font-black text-gray-900">{user.name}</h2>
                        <p className="text-gray-400 text-sm mb-6">{user.email}</p>
                        
                        {/* Selector de Color (Solo visible al editar) */}
                        {isEditing && (
                            <div className="pt-4 border-t border-gray-50">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Color de Marca</p>
                                <div className="flex justify-center gap-3">
                                    {Object.keys(colorThemes).map(col => (
                                        <button 
                                            key={col}
                                            onClick={() => setFormData({...formData, preferences: {...formData.preferences, themeColor: col}})}
                                            className={`w-8 h-8 rounded-full border-4 transition-transform ${formData.preferences.themeColor === col ? 'border-gray-900 scale-125' : 'border-transparent'}`}
                                            style={{ backgroundColor: col }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* TARJETA DE SALUD IA */}
                    <div className="bg-gray-900 p-8 rounded-[40px] text-white shadow-xl relative overflow-hidden">
                        <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-4">Estado de la Estrategia</h3>
                        <p className="text-sm leading-relaxed mb-6 italic opacity-80">
                            "Arturo, hoy tu tono de asistente está en modo <span className="text-blue-400 font-bold">{user.preferences?.aiTone}</span>. Estoy listo para optimizar tus {user.preferences?.monthlyGoal} objetivos mensuales."
                        </p>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            <span className="text-[10px] font-bold text-blue-500 uppercase">Sistema IA Activo</span>
                        </div>
                    </div>
                </div>

                {/* COLUMNA DERECHA: CONFIGURACIÓN Y SEGURIDAD */}
                <div className="lg:col-span-2 space-y-6">
                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900 mb-8">Ajustes del Sistema</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* NOMBRE */}
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Nombre del Socio</label>
                                    <input 
                                        type="text"
                                        disabled={!isEditing}
                                        className={`w-full px-5 py-4 rounded-2xl border transition-all ${isEditing ? 'border-blue-100 bg-white shadow-inner' : 'border-transparent bg-gray-50'}`}
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    />
                                </div>

                                {/* LEMA */}
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Lema de Negocio</label>
                                    <input 
                                        type="text"
                                        disabled={!isEditing}
                                        className={`w-full px-5 py-4 rounded-2xl border transition-all ${isEditing ? 'border-blue-100 bg-white shadow-inner' : 'border-transparent bg-gray-50'}`}
                                        value={formData.preferences.businessMotto}
                                        onChange={(e) => setFormData({
                                            ...formData, 
                                            preferences: { ...formData.preferences, businessMotto: e.target.value }
                                        })}
                                    />
                                </div>

                                {/* TONO IA */}
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Personalidad del Asistente</label>
                                    <select 
                                        disabled={!isEditing}
                                        className="w-full px-5 py-4 rounded-2xl border border-transparent bg-gray-50 font-bold text-gray-700 outline-none"
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

                                {/* META MENSUAL */}
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Objetivo Mensual (Tareas)</label>
                                    <input 
                                        type="number"
                                        disabled={!isEditing}
                                        className="w-full px-5 py-4 rounded-2xl border border-transparent bg-gray-50 font-bold text-gray-700"
                                        value={formData.preferences.monthlyGoal}
                                        onChange={(e) => setFormData({
                                            ...formData, 
                                            preferences: { ...formData.preferences, monthlyGoal: e.target.value }
                                        })}
                                    />
                                </div>
                            </div>

                            {/* BOTÓN GUARDAR (Dinámico) */}
                            {isEditing && (
                                <button 
                                    type="submit"
                                    className={`w-full mt-10 text-white py-5 rounded-3xl font-black text-lg shadow-xl transition-all bg-gradient-to-r ${colorThemes[formData.preferences.themeColor]}`}
                                >
                                    Guardar Configuración Maestra
                                </button>
                            )}
                        </div>
                    </form>

                    {/* SECCIÓN DE SEGURIDAD (CONTRASENIA) */}
                    <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Seguridad</h3>
                            <button 
                                onClick={() => setShowPassForm(!showPassForm)}
                                className={`text-[10px] font-black uppercase px-4 py-2 rounded-xl transition-all ${showPassForm ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-400'}`}
                            >
                                {showPassForm ? "Cerrar" : "Cambiar Contraseña"}
                            </button>
                        </div>

                        {showPassForm && (
                            <form onSubmit={handleChangePassword} className="space-y-4 animate-fade-in">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input 
                                        type="password" 
                                        placeholder="Clave Actual"
                                        className="px-5 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-red-100"
                                        onChange={(e) => setPassData({...passData, oldPassword: e.target.value})}
                                        required
                                    />
                                    <input 
                                        type="password" 
                                        placeholder="Nueva Clave"
                                        className="px-5 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-red-100"
                                        onChange={(e) => setPassData({...passData, newPassword: e.target.value})}
                                        required
                                    />
                                </div>
                                <button type="submit" className="w-full bg-red-600 text-white py-4 rounded-2xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-100">
                                    Confirmar Nueva Seguridad
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