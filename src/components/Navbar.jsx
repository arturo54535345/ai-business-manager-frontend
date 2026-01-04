import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Conectamos con el cerebro
import { toast } from 'react-hot-toast';

const Navbar = () => {
    const { user, logout } = useAuth(); // Sacamos los datos y la función de salir
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(); // Limpiamos la nube y el bolsillo del navegador
        toast.success('Sesión cerrada. ¡Vuelve pronto Arturo!', {
            icon: '👋',
            style: { borderRadius: '15px', background: '#333', color: '#fff' }
        });
        navigate('/'); 
    };

    return (
        <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">

                    {/* 1. EL LOGO (Ahora dinámico) */}
                    <Link to="/" className="flex items-center space-x-2">
                        {/* Usamos text-brand para que el logo brille con tu color elegido */}
                        <span className="text-2xl font-black text-brand tracking-tighter">
                            AI Business
                        </span>
                    </Link>

                    {/* 2. LOS ENLACES Y BOTONES */}
                    <div className="flex items-center space-x-6">
                        <Link to="/nosotros" className="text-gray-500 hover:text-brand transition-colors text-sm font-medium">
                            Nosotros
                        </Link>

                        {/* SI EL USUARIO ESTÁ LOGUEADO */}
                        {user ? (
                            <>
                                <Link to="/perfil" className="text-gray-500 hover:text-brand font-medium transition-colors text-sm">
                                    Mi Perfil
                                </Link>
                                <Link to="/dashboard" className="text-gray-500 hover:text-brand font-medium text-sm">
                                    Dashboard
                                </Link>
                                <Link to="/clientes" className="text-gray-500 hover:text-brand font-medium text-sm">
                                    Clientes
                                </Link>
                                <Link to="/tareas" className="text-gray-500 hover:text-brand font-medium text-sm">
                                    Tareas
                                </Link>
                                <Link to="/ia" className="text-gray-500 hover:text-brand font-medium text-sm">
                                    Consultora IA
                                </Link>

                                <button 
                                    onClick={handleLogout}
                                    className="bg-red-50 text-red-600 px-4 py-2 rounded-xl hover:bg-red-100 transition-all text-xs font-bold"
                                >
                                    Cerrar Sesión
                                </button>

                                {/* AVATAR DINÁMICO: También cambia de fondo */}
                                <div className="w-9 h-9 bg-brand text-white rounded-xl flex items-center justify-center font-black shadow-lg shadow-brand/20">
                                    {user.name?.charAt(0).toUpperCase()}
                                </div>
                            </>
                        ) : (
                            /* SI EL USUARIO ES UN VISITANTE */
                            <>
                                <Link to="/login" className="text-gray-500 hover:text-brand font-medium text-sm">
                                    Entrar
                                </Link>
                                <Link 
                                    to="/register" 
                                    className="bg-brand text-white px-6 py-2.5 rounded-xl hover:opacity-90 shadow-xl shadow-brand/20 transition-all font-bold text-sm"
                                >
                                    Pruébalo Gratis
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;