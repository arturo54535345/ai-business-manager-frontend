import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import api from '../api/axios'; 
import { useState, useEffect } from 'react';

const Navbar = () => {
    const { user, logout, updateUser } = useAuth(); 
    const navigate = useNavigate();
    const location = useLocation();

    const [hasUrgency, setHasUrgency] = useState(false);

    useEffect(() => {
        const checkUrgentTasks = async () => {
            if (!user) return;
            try {
                const res = await api.get('/tasks');
                const tasks = res.data;
                const now = new Date();
                const urgentLimit = 48 * 60 * 60 * 1000; 

                const isThereUrgency = tasks.some(task => {
                    if (task.status === 'completed' || !task.dueDate) return false;
                    const diff = new Date(task.dueDate) - now;
                    return diff > -24 * 60 * 60 * 1000 && diff < urgentLimit;
                });

                setHasUrgency(isThereUrgency);

                // 🟢 TRUCO PRO: Cambia el nombre de la pestaña si hay algo urgente
                // Aparecerá como "(!) AI Business" en lugar de solo "AI Business"
                document.title = isThereUrgency ? "(!) AI Business Manager" : "AI Business Manager";

            } catch (error) {
                console.error("Error al escanear urgencias");
            }
        };
        checkUrgentTasks();
    }, [user, location.pathname]);

    // ... (handleLogout y toggleDarkMode se mantienen igual)
    const handleLogout = () => { logout(); toast.success('Sesión cerrada.'); navigate('/'); };

    const toggleDarkMode = async () => {
        try {
            const newStatus = !user.preferences.darkMode;
            const res = await api.put('/auth/profile', {
                name: user.name,
                preferences: { ...user.preferences, darkMode: newStatus }
            });
            updateUser(res.data);
            toast.success(newStatus ? 'Modo Oscuro 🌙' : 'Modo Claro ☀️');
        } catch (error) { toast.error("Error"); }
    };

    return (
        <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link to="/" className="text-2xl font-black text-brand tracking-tighter">AI Business</Link>

                    <div className="flex items-center space-x-6">
                        {user ? (
                            <>
                                <button onClick={toggleDarkMode} className="p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all text-xl">
                                    {user.preferences?.darkMode ? '☀️' : '🌙'}
                                </button>

                                <Link to="/dashboard" className="text-gray-500 hover:text-brand font-medium text-sm">Dashboard</Link>
                                <Link to="/clientes" className="text-gray-500 hover:text-brand font-medium text-sm">Clientes</Link>
                                
                                {/* 🟢 CORRECCIÓN: Ahora el enlace de Tareas tiene el punto de aviso */}
                                <Link to="/tareas" className="text-gray-500 hover:text-brand font-medium text-sm flex items-center gap-2 relative">
                                    <span>Tareas</span>
                                    {hasUrgency && (
                                        <span className="flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                        </span>
                                    )}
                                </Link>

                                <Link to="/ia" className="text-gray-500 hover:text-brand font-medium text-sm">Consultora IA</Link>

                                <button onClick={handleLogout} className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-xs font-bold transition-all">Salir</button>
                                <Link to="/perfil" className="w-9 h-9 bg-brand text-white rounded-xl flex items-center justify-center font-black shadow-lg hover:scale-110 transition-all">
                                    {user.name?.charAt(0).toUpperCase()}
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-500 font-medium text-sm">Entrar</Link>
                                <Link to="/register" className="bg-brand text-white px-6 py-2.5 rounded-xl font-bold text-sm">Pruébalo Gratis</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;