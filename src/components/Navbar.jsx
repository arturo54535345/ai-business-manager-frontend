import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import api from "../api/axios";
import { useState, useEffect } from "react";

const Navbar = () => {
  // 🧠 1. LAS HERRAMIENTAS (Hooks y Contexto)
  // Sacamos los datos del usuario y funciones de cerrar sesión y actualizar perfil del "cerebro" central (AuthContext).
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate(); // El mando a distancia para viajar entre páginas.
  const location = useLocation(); // El radar que nos dice en qué página estamos ahora mismo.

  // 📦 2. LA PIZARRA DE URGENCIA
  // Un interruptor que se pone en 'true' (encendido) si hay tareas que venzan pronto.
  const [hasUrgency, setHasUrgency] = useState(false);

  // 📡 3. EL VIGILANTE DE TAREAS (useEffect)
  // Este código corre cada vez que entras a la web o cambias de sección.
  useEffect(() => {
    const checkUrgentTasks = async () => {
      // 🕵️ Seguridad: Si no hay usuario, no preguntamos nada al servidor.
      if (!user) return;

      try {
        const res = await api.get("/tasks");

        // 👨‍🏫 TRUCO DE PROFE: Nos aseguramos de tener una lista real (Array).
        // Si el servidor nos manda una caja con tareas, la abrimos. Si no, usamos una lista vacía [].
        const tasks = Array.isArray(res.data) ? res.data : res.data.tasks || [];

        const now = new Date();
        const urgentLimit = 48 * 60 * 60 * 1000; // El límite de 48 horas en milisegundos.
        let isThereUrgency = false; // Empezamos asumiendo que no hay nada urgente.

        // Solo trabajamos si realmente hay tareas en la lista.
        if (tasks.length > 0) {
          // Buscamos si "alguna" (some) cumple las condiciones de urgencia.
          const isThereUrgency = tasks.some((task) => {
            if (task.status === "completed" || !task.dueDate) return false;
            const diff = new Date(task.dueDate) - now;
            // Urgente si vence en menos de 48h y no lleva más de 24h de retraso.
            return diff > -24 * 60 * 60 * 1000 && diff < urgentLimit;
          });

          // 🔔 NOTIFICACIÓN DE ESCRITORIO
          // Solo si hay urgencia y si Arturo nos dio permiso en el navegador.
          if (isThereUrgency && Notification.permission === "granted") {
            new Notification("Tienes una tarea urgente", {
              body: "Arturo, tienes objetivos que vencen pronto. ¡Échales un ojo!",
              icon: "/logo192.png", // La imagen que sale en el aviso.
            });
          }
          // Actualizamos nuestro interruptor visual.
          setHasUrgency(isThereUrgency);
        }

        // 🟢 TRUCO PRO: Cambiamos el nombre de la pestaña del navegador.
        // Verás un (!) al lado del nombre si tienes fuegos que apagar.
        document.title = isThereUrgency
          ? "(!) AI Business Manager"
          : "AI Business Manager";
      } catch (error) {
        // Si algo falla (como que no haya internet), lo anotamos en la consola para saberlo.
        console.error("Aviso: No se pudieron escanear urgencias en el menú.");
      }
    };

    checkUrgentTasks();
  }, [user, location.pathname]); // Se activa al cambiar de usuario o de página.

  // 🚪 4. CERRAR SESIÓN
  const handleLogout = () => {
    logout();
    toast.success("Sesión cerrada. ¡Vuelve pronto!");
    navigate("/");
  };

  // 🌙 5. MODO OSCURO (Guardado en tu perfil)
  const toggleDarkMode = async () => {
    try {
      const newStatus = !user.preferences.darkMode;
      // Le decimos al servidor que Arturo ha cambiado de idea sobre el color.
      const res = await api.put("/auth/profile", {
        name: user.name,
        preferences: { ...user.preferences, darkMode: newStatus },
      });
      // Actualizamos la web al instante con la respuesta del servidor.
      updateUser(res.data);
      toast.success(newStatus ? "Modo Oscuro 🌙" : "Modo Claro ☀️");
    } catch (error) {
      toast.error("Vaya, no se pudo cambiar el tema.");
    }
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* LOGO: Te lleva al inicio */}
          <Link
            to="/"
            className="text-2xl font-black text-brand tracking-tighter"
          >
            AI Business
          </Link>

          <div className="flex items-center space-x-6">
            {user ? (
              <>
                {/* BOTÓN SOL/LUNA */}
                <button
                  onClick={toggleDarkMode}
                  className="p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all text-xl"
                  title="Cambiar luz"
                >
                  {user.preferences?.darkMode ? "☀️" : "🌙"}
                </button>

                {/* ENLACES DE SECCIÓN */}
                <Link
                  to="/dashboard"
                  className="text-gray-500 hover:text-brand font-medium text-sm"
                >
                  Dashboard
                </Link>
                <Link
                  to="/clientes"
                  className="text-gray-500 hover:text-brand font-medium text-sm"
                >
                  Clientes
                </Link>

                {/* TAREAS CON PUNTO DE AVISO */}
                <Link
                  to="/tareas"
                  className="text-gray-500 hover:text-brand font-medium text-sm flex items-center gap-2 relative"
                >
                  <span>Tareas</span>
                  {/* Si el vigilante detectó urgencia, pintamos el punto rojo parpadeante */}
                  {hasUrgency && (
                    <span className="flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                  )}
                </Link>

                <Link
                  to="/ia"
                  className="text-gray-500 hover:text-brand font-medium text-sm"
                >
                  Consultora IA
                </Link>

                {/* BOTÓN SALIR */}
                <button
                  onClick={handleLogout}
                  className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-xs font-bold transition-all hover:bg-red-100"
                >
                  Salir
                </button>

                {/* AVATAR: Tu inicial con enlace a tu perfil */}
                <Link
                  to="/perfil"
                  className="w-9 h-9 bg-brand text-white rounded-xl flex items-center justify-center font-black shadow-lg hover:scale-110 transition-all"
                >
                  {user.name?.charAt(0).toUpperCase()}
                </Link>
              </>
            ) : (
              <>
                {/* Botones para invitados */}
                <Link to="/login" className="text-gray-500 font-medium text-sm">
                  Entrar
                </Link>
                <Link
                  to="/register"
                  className="bg-brand text-white px-6 py-2.5 rounded-xl font-bold text-sm"
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
