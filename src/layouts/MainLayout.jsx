import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const MainLayout = () => {
  // 🧠 LÓGICA: El "interruptor" del menú (abierto/cerrado)
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex relative">
      
      {/* 🌑 OVERLAY (Capa de desenfoque)
          Lógica: Si el menú está abierto en el móvil, oscurecemos el fondo. 
          Al hacer click en lo oscuro, el menú se cierra automáticamente. */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-all duration-500"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}

      {/* 🚥 EL SIDEBAR (Tu Navbar Premium)
          Lógica: 
          1. 'fixed': En móvil flota sobre el contenido.
          2. '-translate-x-full': Escondido a la izquierda por defecto.
          3. 'lg:translate-x-0': En pantallas grandes siempre está visible.
          4. 'z-50': Siempre por encima de todo. */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 transition-transform duration-500 ease-in-out transform
        ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        <Navbar closeMenu={() => setIsMenuOpen(false)} />
      </aside>

      {/* 🖥️ ÁREA DE CONTENIDO PRINCIPAL */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* 📱 TOPBAR MÓVIL (Solo se ve en pantallas pequeñas)
            Lógica: Aquí es donde vive el botón de hamburguesa. */}
        <header className="lg:hidden flex items-center justify-between p-6 glass m-4 mb-0 border-white/5">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-cyber-blue rounded-lg flex items-center justify-center font-black text-black italic">A</div>
              <span className="font-black text-white text-xs tracking-tighter">AI.MANAGER</span>
           </div>
           
           <button 
             onClick={() => setIsMenuOpen(true)}
             className="w-10 h-10 flex flex-col items-center justify-center gap-1.5"
           >
              <div className="w-6 h-0.5 bg-cyber-blue"></div>
              <div className="w-6 h-0.5 bg-cyber-blue"></div>
              <div className="w-6 h-0.5 bg-cyber-blue"></div>
           </button>
        </header>

        {/* 📄 LAS PÁGINAS (Dashboard, Clientes, etc.) */}
        <div className="p-6 md:p-12 overflow-y-auto h-screen">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;