import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const MainLayout = () => {
  const { user } = useAuth(); // Miramos el cerebro para saber tus preferencias

  useEffect(() => {
    // si el navegador no soporta avisos y el usuario no ha permmitido los avisos de mi web
    if ("Notification" in window && Notification.permission !== "granted") {
      //lo pregunto de forma educada
      Notification.requestPermission();
    }
  }, []);

  // 1. Buscamos qué clase de tema aplicar (Azul, Rojo, Verde o Púrpura)
  const themeClass = user?.preferences?.themeColor
    ? `theme-${user.preferences.themeColor}`
    : "theme-blue";

  // 2. 🟢 LÓGICA DEL MODO OSCURO:
  // Si en tu perfil dice que darkMode es true, la variable será 'dark'. Si no, estará vacía.
  const darkModeClass = user?.preferences?.darkMode ? "dark" : "";

  return (
    // 🟢 CLAVE: Aquí aplicamos tanto el tema de color como la clase 'dark'
    // El div principal ahora tiene el poder de cambiar toda la web
    <div
      className={`min-h-screen bg-gray-50 flex flex-col transition-colors duration-500 ${themeClass} ${darkModeClass}`}
    >
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <footer className="bg-white border-t p-4 text-center text-gray-400 text-sm transition-colors duration-500">
        <p>© 2025 AI Business Manager - Arturo Edition</p>
      </footer>
    </div>
  );
};

export default MainLayout;
