import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const MainLayout = () => {
    const { user } = useAuth(); // Miramos el cerebro para saber el color

    // Buscamos qué clase de tema aplicar según el perfil
    const themeClass = user?.preferences?.themeColor ? `theme-${user.preferences.themeColor}` : 'theme-blue';

    return (
        // Aplicamos la clase del tema aquí arriba para que afecte a todo lo de dentro
        <div className={`min-h-screen bg-gray-50 flex flex-col ${themeClass}`}>
            <Navbar /> 
            <main className="flex-grow">
                {/* Aquí dentro es donde se cargan Dashboard, Clientes, etc. */}
                <Outlet />
            </main>
            <footer className="bg-white border-t p-4 text-center text-gray-400 text-sm">
                <p>© 2025 AI Business Manager - Arturo Edition</p>
            </footer>
        </div>
    );
};

export default MainLayout;