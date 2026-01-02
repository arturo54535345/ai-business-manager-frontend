import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Conectamos con el cerebro
import {toast} from 'react-hot-toast';
const Navbar = () => {
    const { user, logout } = useAuth(); // Sacamos los datos y la función de salir
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(); 
        // Lógica: Avisamos al usuario antes de mandarlo fuera
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

          {/* 1. EL LOGO (Estilo Sole: Simple y elegante) */}
            <Link to="/" className="flex items-center space-x-2">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    AI Business
                </span>
            </Link>

          {/* 2. LOS LINKS (Aquí ocurre la magia) */}
            <div className="flex items-center space-x-4">
                <Link to="/nosotros" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Nosotros
                </Link>

            {/* si el usuario ya esta registrtado y logeado*/}
            {user ? (
            <>
                <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 font-medium">
                    Dashboard
                </Link>
                
                <Link to="/clientes" className="text-gray-600 hover:text-blue-600 font-medium">
                    Clientes
                </Link>

                <Link to="/tareas" className="text-gray-600 hover:text-blue-600 font-medium">
                    Tareas
                </Link>

                <Link to="/ia" className="text-gray-600 hover:text-blue-600 font-medium">
                    Consultora IA
                </Link>

                <button 
                  onClick={handleLogout}
                  className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-all text-sm font-semibold"
                >
                  Cerrar Sesión
                </button>
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              </>
            ) : (
              /* si el usuario no esta registrado*/
              <>
                <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium">
                  Entrar
                </Link>
                <Link 
                  to="/register" 
                  className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all font-semibold"
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