// -------------------------------------------------------------------------
// 📂 ARCHIVO: src/components/Navbar.jsx
// 📝 DESCRIPCIÓN: Panel de navegación lateral con estética de puente de mando.
// -------------------------------------------------------------------------
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = ({ closeMenu }) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  // 👨‍🏫 Lógica Premium: Usamos prefijos numéricos para un look más técnico/militar.
  const links = [
    { id: "01", name: "Dashboard", path: "/dashboard", short: "DB" },
    { id: "02", name: "Clientes", path: "/clientes", short: "CL" },
    { id: "03", name: "Objetivos", path: "/tareas", short: "OBJ" },
    { id: "04", name: "Finanzas", path: "/finanzas", short: "FIN" },
    { id: "05", name: "Consultora IA", path: "/ia", short: "AI" },
  ];

  return (
    <div className="h-full glass border-r border-white/5 flex flex-col p-8 reveal-premium">
      
      {/* 🚀 LOGO SUPERIOR (Branding de Alta Tecnología) */}
      <div className="mb-16">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="w-12 h-12 bg-cyber-blue text-black rounded-2xl flex items-center justify-center shadow-[0_0_25px_rgba(0,209,255,0.4)] group-hover:scale-105 transition-all duration-700">
             <span className="font-black text-2xl italic">A</span>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-white italic leading-none">AI.MANAGER</h1>
            <p className="text-[7px] text-cyber-blue font-black uppercase tracking-[0.5em] mt-1">Neural_Core_V4</p>
          </div>
        </div>
      </div>

      {/* 🔗 NAVEGACIÓN CENTRAL (Módulos Operativos) */}
      <nav className="flex-grow space-y-4">
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              onClick={closeMenu}
              className={`
                relative flex items-center gap-5 px-6 py-4 rounded-2xl transition-all duration-700 group
                ${isActive 
                  ? "bg-white/[0.03] text-white border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.02)]" 
                  : "text-cyber-silver/30 hover:text-white hover:bg-white/[0.02]"}
              `}
            >
              {/* Indicador de sección activa (Línea lateral neón) */}
              {isActive && (
                <div className="absolute left-0 w-1 h-6 bg-cyber-blue rounded-r-full shadow-[0_0_15px_#00D1FF]"></div>
              )}

              {/* Sigla técnica en lugar de emoji */}
              <span className={`text-[9px] font-black w-8 transition-colors duration-700 ${isActive ? 'text-cyber-blue' : 'text-white/10 group-hover:text-cyber-blue/40'}`}>
                {link.short}
              </span>

              <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                {link.name}
              </span>

              {/* Número de serie discreto */}
              <span className="ml-auto text-[7px] font-black opacity-10 group-hover:opacity-30 transition-opacity">
                {link.id}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* 👤 SECCIÓN INFERIOR (Identidad y Seguridad) */}
      <div className="mt-auto pt-10 border-t border-white/5 space-y-8">
        <Link 
            to="/perfil" 
            onClick={closeMenu}
            className="flex items-center gap-5 group p-2 rounded-2xl hover:bg-white/[0.02] transition-all duration-700"
        >
            <div className="relative">
                <div className="w-11 h-11 rounded-2xl border border-white/10 p-1 group-hover:border-cyber-blue transition-all duration-700 overflow-hidden">
                    <div className="w-full h-full bg-cyber-blue/10 rounded-xl flex items-center justify-center text-cyber-blue font-black text-lg italic">
                        {user?.name?.charAt(0)}
                    </div>
                </div>
                {/* Punto de estado online */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyber-blue rounded-full border-4 border-cyber-black animate-pulse"></div>
            </div>
            
            <div className="flex flex-col">
                <span className="text-[10px] font-black text-white uppercase tracking-widest">{user?.name}</span>
                <span className="text-[7px] text-cyber-blue font-black uppercase tracking-[0.3em] opacity-40 group-hover:opacity-100 transition-opacity">Config_User</span>
            </div>
        </Link>

        <button 
            onClick={logout}
            className="w-full py-4 rounded-xl border border-red-500/10 text-red-500/40 text-[9px] font-black uppercase tracking-[0.3em] hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 transition-all duration-700"
        >
            Desconectar_Sistema
        </button>
      </div>
    </div>
  );
};

export default Navbar;