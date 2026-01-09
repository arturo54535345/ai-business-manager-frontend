import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const PrivateLayout = () => {
    const { user, loading } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    if (loading) return null;
    if (!user) return <Navigate to="/login" />;

    return (
        <div className="min-h-screen flex relative overflow-hidden">
            
            {/* 🌫️ OVERLAY (Cierra el menú al pulsar fuera) */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 lg:hidden transition-all duration-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>
            )}

            {/* 🧭 SIDEBAR (Se esconde en pantallas < 1024px) */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 z-50 w-80 transition-all duration-700 ease-in-out transform
                ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            `}>
                <Navbar closeMenu={() => setIsMobileMenuOpen(false)} />
            </aside>

            {/* 📺 ÁREA DE CONTENIDO */}
            <main className="flex-1 flex flex-col min-w-0 h-screen relative">
                
                {/* 📱 HEADER MÓVIL (Solo se ve si el menú está cerrado) */}
                <header className="lg:hidden flex items-center justify-between p-6 glass m-4 mb-0 border-white/5 relative z-30">
                    <span className="text-white font-black italic tracking-tighter">AI.MANAGER</span>
                    <button 
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="w-10 h-10 flex flex-col items-center justify-center gap-1.5"
                    >
                        <div className="w-6 h-0.5 bg-cyber-blue shadow-[0_0_8px_#00D1FF]"></div>
                        <div className="w-6 h-0.5 bg-cyber-blue shadow-[0_0_8px_#00D1FF]"></div>
                    </button>
                </header>

                <div className="flex-grow overflow-y-auto p-6 md:p-12 lg:p-16">
                    <div className="max-w-[1400px] mx-auto">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PrivateLayout;