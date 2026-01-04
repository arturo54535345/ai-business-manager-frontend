import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { toast } from "react-hot-toast";
import api from "../../api/axios";

const Profile = () => {
    // 1. HERRAMIENTAS: Ahora pedimos 'updateUser' en lugar de 'setUser'
    // 'updateUser' es la función que actualiza la memoria de la web y el bolsillo del navegador a la vez.
    const { user, updateUser } = useAuth(); 
    
    // --- ESTADOS (Memorias temporales de la página) ---
    const [isEditing, setIsEditing] = useState(false); // ¿Estamos en modo edición?
    const [showPassForm, setShowPassForm] = useState(false); // ¿Mostramos el cambio de clave?
    
    // Datos del formulario de perfil (Nombre y Preferencias)
    const [formData, setFormData] = useState({
        name: user?.name || "",
        preferences: {
            aiTone: user?.preferences?.aiTone || "Socio",
            monthlyGoal: user?.preferences?.monthlyGoal || 10,
            businessMotto: user?.preferences?.businessMotto || "",
            themeColor: user?.preferences?.themeColor || "blue"
        }
    });

    // Datos para el cambio de contraseña
    const [passData, setPassData] = useState({ oldPassword: '', newPassword: '' });

    // --- FUNCIONES (Las acciones que Arturo puede hacer) ---

    // 1. Guardar cambios del perfil (Nombre, Tono IA, Meta, Color)
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            // Enviamos los datos al servidor para que los guarde en la base de datos
            const res = await api.put('/auth/profile', formData);
            
            // CORRECCIÓN CLAVE: Usamos 'updateUser' con los datos que nos devuelve el servidor.
            // Esto hace que el color y el nombre cambien en toda la web al instante.
            updateUser(res.data); 
            
            setIsEditing(false);
            toast.success("¡Perfil actualizado con éxito!", { icon: '✅' });
        } catch (error) {
            toast.error("Error al guardar los cambios.");
        }
    };

    // 2. Cambiar la contraseña de forma segura
    const handleChangePassword = async (e) => {
        e.preventDefault();
        try {
            await api.put('/auth/change-password', passData);
            toast.success("Contraseña actualizada", { icon: '🔐' });
            setShowPassForm(false);
            setPassData({ oldPassword: '', newPassword: '' }); // Limpiamos las cajas de texto
        } catch (error) {
            toast.error(error.response?.data?.message || "Error al cambiar clave");
        }
    };

    // Diccionario de colores para el avatar y los botones (Tailwind)
    const colorThemes = {
        blue: "from-blue-600 to-indigo-600 shadow-blue-100",
        red: "from-red-600 to-rose-600 shadow-red-100",
        green: "from-green-600 to-emerald-600 shadow-green-100",
        purple: "from-purple-600 to-fuchsia-600 shadow-purple-100"
    };

    if (!user) return <div className="p-10 text-center font-bold">Cargando expediente...</div>;

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8 animate-fade-in">
            
            {/* CABECERA: Lema y Botón Editar */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Mi Perfil Profesional</h1>
                    <p className="text-gray-500 italic text-lg">"{user.preferences?.businessMotto || 'Define tu visión de negocio...'}"</p>
                </div>
                <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className={`px-8 py-3 rounded-2xl font-bold transition-all shadow-lg ${
                        isEditing ? 'bg-red-50 text-red-600' : 'bg-white text-gray-900 border border-gray-100 hover:bg-gray-50'
                    }`}
                >
                    {isEditing ? "Cancelar Cambios" : "Personalizar Perfil"}
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* --- COLUMNA IZQUIERDA: IDENTIDAD VISUAL --- */}
                <div className="space-y-6">
                    <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 text-center relative overflow-hidden">
                        {/* Línea decorativa que usa el color que estamos eligiendo ahora mismo */}
                        <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${colorThemes[formData.preferences.themeColor]}`}></div>
                        
                        {/* Avatar circular con la inicial del nombre */}
                        <div className={`w-28 h-28 bg-gradient-to-tr ${colorThemes[formData.preferences.themeColor]} text-white rounded-[38px] flex items-center justify-center text-5xl font-black mx-auto mb-6 shadow-2xl`}>
                            {user.name.charAt(0)}
                        </div>
                        <h2 className="text-2xl font-black text-gray-900">{user.name}</h2>
                        <p className="text-gray-400 text-sm mb-6">{user.email}</p>
                        
                        {/* SELECTOR DE COLOR: Solo aparece si pulsamos "Personalizar Perfil" */}
                        {isEditing && (
                            <div className="pt-4 border-t border-gray-50">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Color de Marca</p>
                                <div className="flex justify-center gap-4">
                                    {['blue', 'red', 'green', 'purple'].map(col => (
                                        <button 
                                            key={col}
                                            onClick={() => setFormData({...formData, preferences: {...formData.preferences, themeColor: col}})}
                                            className={`w-8 h-8 rounded-full border-4 transition-all ${formData.preferences.themeColor === col ? 'border-gray-900 scale-125' : 'border-transparent'}`}
                                            style={{ backgroundColor: col }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* TARJETA DE ESTADO DE IA */}
                    <div className="bg-gray-900 p-8 rounded-[40px] text-white shadow-xl relative overflow-hidden">
                        <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4">Estrategia IA</h3>
                        <p className="text-sm leading-relaxed mb-6 italic opacity-80">
                            "Arturo, hoy estoy operando en modo <span className="text-blue-400 font-bold">{user.preferences?.aiTone}</span> para ayudarte a conseguir tus {user.preferences?.monthlyGoal} objetivos."
                        </p>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-blue-500 uppercase">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            Sistema Conectado
                        </div>
                    </div>
                </div>

                {/* --- COLUMNA DERECHA: AJUSTES Y SEGURIDAD --- */}
                <div className="lg:col-span-2 space-y-6">
                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900 mb-8">Ajustes del Sistema</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* NOMBRE DEL USUARIO */}
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block">Nombre del Socio</label>
                                    <input 
                                        type="text"
                                        disabled={!isEditing}
                                        className={`w-full px-5 py-4 rounded-2xl border transition-all ${isEditing ? 'border-blue-100 bg-white' : 'border-transparent bg-gray-50'}`}
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    />
                                </div>

                                {/* LEMA DE NEGOCIO */}
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block">Lema de Marca</label>
                                    <input 
                                        type="text"
                                        disabled={!isEditing}
                                        className={`w-full px-5 py-4 rounded-2xl border transition-all ${isEditing ? 'border-blue-100 bg-white' : 'border-transparent bg-gray-50'}`}
                                        value={formData.preferences.businessMotto}
                                        onChange={(e) => setFormData({
                                            ...formData, 
                                            preferences: { ...formData.preferences, businessMotto: e.target.value }
                                        })}
                                    />
                                </div>

                                {/* TONO DE LA IA */}
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block">Voz del Asistente</label>
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

                                {/* OBJETIVO MENSUAL */}
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block">Meta Mensual (Tareas)</label>
                                    <input 
                                        type="number"
                                        disabled={!isEditing}
                                        className="w-full px-5 py-4 rounded-2xl border border-transparent bg-gray-50 font-bold"
                                        value={formData.preferences.monthlyGoal}
                                        onChange={(e) => setFormData({
                                            ...formData, 
                                            preferences: { ...formData.preferences, monthlyGoal: e.target.value }
                                        })}
                                    />
                                </div>
                            </div>

                            {/* BOTÓN DE GUARDADO DINÁMICO */}
                            {isEditing && (
                                <button 
                                    type="submit" 
                                    className={`w-full mt-10 text-white py-5 rounded-3xl font-black text-lg shadow-xl transition-all bg-gradient-to-r ${colorThemes[formData.preferences.themeColor]}`}
                                >
                                    Guardar Cambios en la Cuenta
                                </button>
                            )}
                        </div>
                    </form>

                    {/* SECCIÓN DE SEGURIDAD (CONTRASEÑA) */}
                    <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Seguridad</h3>
                            <button 
                                onClick={() => setShowPassForm(!showPassForm)}
                                className={`text-[10px] font-black uppercase px-4 py-2 rounded-xl transition-all ${showPassForm ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-500'}`}
                            >
                                {showPassForm ? "Cerrar" : "Cambiar Contraseña"}
                            </button>
                        </div>

                        {showPassForm && (
                            <form onSubmit={handleChangePassword} className="space-y-4 animate-fade-in">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input 
                                        type="password" 
                                        placeholder="Tu clave actual"
                                        className="px-5 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-red-100"
                                        onChange={(e) => setPassData({...passData, oldPassword: e.target.value})}
                                        required
                                    />
                                    <input 
                                        type="password" 
                                        placeholder="Nueva clave"
                                        className="px-5 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-red-100"
                                        onChange={(e) => setPassData({...passData, newPassword: e.target.value})}
                                        required
                                    />
                                </div>
                                <button type="submit" className="w-full bg-red-600 text-white py-4 rounded-2xl font-bold hover:bg-red-700 transition-all">
                                    Confirmar Nueva Contraseña
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