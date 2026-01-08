// -------------------------------------------------------------------------
// 🛠️ HERRAMIENTAS: Importamos las piezas necesarias para que la web funcione.
// -------------------------------------------------------------------------
import { useState, useEffect } from "react"; // Las "pizarras" (estados) y el "vigilante" (efectos).
import api from "../../api/axios"; // El mensajero que lleva y trae datos del servidor.
import { useNavigate } from "react-router-dom"; // El mando a distancia para viajar entre páginas.
import { toast } from "react-hot-toast"; // Los avisos flotantes de éxito o error.

const Tasks = () => {
  // -------------------------------------------------------------------------
  // 🧠 SECCIÓN 1: ESTADOS (Nuestras cajas de memoria temporal)
  // -------------------------------------------------------------------------
  const [tasks, setTasks] = useState([]); // Aquí guardamos la lista de tareas que el servidor nos dé.
  const [loading, setLoading] = useState(true); // El interruptor para mostrar "Cargando..." al entrar.
  const [searchTerm, setSearchTerm] = useState(""); // Lo que Arturo escribe en la lupa de buscar.
  const [priorityFilter, setPriorityFilter] = useState(""); // Filtro para ver solo tareas de cierta importancia.
  const [categoryFilter, setCategoryFilter] = useState(""); // Filtro para ver solo tareas de un tipo (Llamada, etc).

  const [aiAdvice, setAiAdvice] = useState(null); // Aquí guardamos el consejo estratégico de la IA.
  const [isAiLoading, setIsAiLoading] = useState(false); // Indica si la IA está "trabajando" en ese momento.

  const navigate = useNavigate(); // Activamos el mando a distancia para navegar.

  // -------------------------------------------------------------------------
  // 📥 SECCIÓN 2: EXPORTACIÓN (Convertir tus tareas en un archivo Excel/CSV)
  // -------------------------------------------------------------------------
  const exportTasksToCSV = () => {
    // Si no hay tareas en pantalla, no tiene sentido exportar nada.
    if (tasks.length === 0) return toast.error("No hay nada que exportar.");
    
    // Ponemos los títulos de las columnas arriba.
    const headers = ["Título", "Cliente", "Categoría", "Prioridad", "Estado", "Vencimiento"];
    
    // Transformamos cada tarea en una fila de texto separada por comas.
    const rows = tasks.map((t) => [
      `"${t.title}"`,
      `"${t.client?.name || "Sin asignar"}"`,
      `"${t.category || "General"}"`,
      `"${t.priority}"`,
      `"${t.status}"`,
      `"${t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "Sin fecha"}"`,
    ]);

    // Unimos todo el texto y creamos el archivo para descargarlo.
    const csvContent = [headers.join(","), ...rows.map(row => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Tareas_Arturo_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    toast.success("Excel generado correctamente");
  };

  // -------------------------------------------------------------------------
  // 🕒 SECCIÓN 3: LÓGICA DE URGENCIA (Detectar si algo vence pronto)
  // -------------------------------------------------------------------------
  const checkUrgency = (dueDate) => {
    if (!dueDate) return false;
    // Calculamos la diferencia entre hoy y la fecha de entrega en horas.
    const diffInHours = (new Date(dueDate) - new Date()) / (1000 * 60 * 60);
    // Si quedan menos de 48 horas, el sistema lo marcará como URGENTE.
    return diffInHours < 48 && diffInHours > -24;
  };

  // -------------------------------------------------------------------------
  // 📡 SECCIÓN 4: EL VIGILANTE (Traer los datos del servidor)
  // -------------------------------------------------------------------------
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // Pedimos al servidor las tareas aplicando los filtros de búsqueda que Arturo haya puesto.
        const res = await api.get(`/tasks?search=${searchTerm}&priority=${priorityFilter}&category=${categoryFilter}`);
        // Guardamos las tareas recibidas en nuestra caja de memoria.
        setTasks(res.data.tasks || res.data);
      } catch (error) {
        console.error("Error al traer tareas:", error);
      } finally {
        setLoading(false); // Quitamos el mensaje de "Cargando".
      }
    };
    fetchTasks();
    // 👨‍🏫 Lógica: Esta función se dispara sola cada vez que escribes algo en el buscador o cambias un filtro.
  }, [searchTerm, priorityFilter, categoryFilter]);

  // -------------------------------------------------------------------------
  // 🎨 SECCIÓN 5: PALETA DE COLORES (Colores automáticos por tipo de tarea)
  // -------------------------------------------------------------------------
  const categoryColors = {
    Llamada: "bg-blue-100 text-blue-600 border-blue-200",
    Reunión: "bg-purple-100 text-purple-600 border-purple-200",
    Email: "bg-orange-100 text-orange-600 border-orange-200",
    Administración: "bg-gray-100 text-gray-600 border-gray-200",
    Catering: "bg-green-100 text-green-600 border-green-200",
    Otro: "bg-slate-50 text-slate-400 border-slate-100",
  };

  // -------------------------------------------------------------------------
  // 🤖 SECCIÓN 6: ACCIONES (Completar, Borrar y Consultar IA)
  // -------------------------------------------------------------------------
  const handleGetAIAdvice = async (taskId) => {
    setIsAiLoading(true); // Mostramos que la IA está pensando.
    try {
      const res = await api.get(`/tasks/${taskId}/ai-advice`);
      setAiAdvice(res.data.advice); // Guardamos el consejo recibido.
      toast.success("¡Estrategia lista! 🤖");
    } catch (error) { toast.error("IA ocupada."); } finally { setIsAiLoading(false); }
  };

  const toggleComplete = async (id, currentStatus) => {
    try {
      // Si estaba pendiente, pasa a completada. Si estaba completada, pasa a pendiente.
      const newStatus = currentStatus === "completed" ? "pending" : "completed";
      await api.put(`/tasks/${id}`, { status: newStatus });
      // Actualizamos la lista en pantalla sin tener que recargar la página.
      setTasks(tasks.map((t) => (t._id === id ? { ...t, status: newStatus } : t)));
      toast.success("Estado actualizado");
    } catch (error) { toast.error("Error al actualizar"); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar tarea definitivamente?")) {
      try {
        await api.delete(`/tasks/${id}`);
        // Quitamos la tarea de la pantalla al instante.
        setTasks(tasks.filter((t) => t._id !== id));
        toast.success("Tarea borrada");
      } catch (error) { toast.error("Error al borrar"); }
    }
  };

  // Si aún no han llegado los datos, mostramos este aviso con un "latido" visual.
  if (loading) return <div className="p-20 text-center animate-pulse font-black text-gray-300 uppercase">Sincronizando...</div>;

  // 👨‍🏫 Lógica: Solo queremos ver en esta lista las tareas que NO han terminado.
  const pendingTasks = tasks.filter((t) => t.status !== "completed");

  return (
    <div className="p-8 max-w-7xl mx-auto animate-fade-in space-y-10 relative">
      
      {/* --- CABECERA: Título y Botonera --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Mis Tareas</h1>
          <p className="text-gray-500 font-medium text-lg">Control inteligente de objetivos</p>
        </div>
        
        {/* GRUPO DE BOTONES DE ACCIÓN */}
        <div className="flex flex-wrap gap-3">
          
          {/* 📁 BOTÓN HISTORIAL (LO NUEVO): Nos lleva al archivador de tareas completadas */}
          <button
            onClick={() => navigate("/tareas/completadas")}
            className="bg-gray-50 text-gray-500 px-6 py-4 rounded-2xl font-bold border border-gray-100 hover:bg-gray-100 transition-all flex items-center gap-2"
            title="Ver tareas ya finalizadas"
          >
            <span className="text-lg">📁</span>
            <span>Historial</span>
          </button>

          {/* BOTÓN EXPORTAR: Descarga el Excel */}
          <button onClick={exportTasksToCSV} className="bg-white text-gray-600 px-6 py-4 rounded-2xl font-bold border border-gray-100 shadow-sm hover:bg-gray-50 transition-all flex items-center gap-2">
            <span>📥</span> Exportar
          </button>
          
          {/* BOTÓN NUEVA TAREA: Abre el formulario de creación */}
          <button onClick={() => navigate("/tareas/nueva")} className="bg-brand text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-brand/20 hover:opacity-90 transition-all">
            + Nueva Tarea
          </button>
        </div>
      </div>

      {/* --- FILTROS: Los coladores para buscar rápido --- */}
      <div className="flex flex-col md:flex-row gap-4 mb-10">
        <input 
          type="text" 
          placeholder="🔍 Buscar tarea..." 
          className="flex-grow p-4 rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-brand shadow-sm transition-all" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
        
        <select className="p-4 rounded-2xl border border-gray-100 font-bold text-gray-600 bg-white cursor-pointer" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="">Todas las Categorías</option>
          <option value="Llamada">📞 Llamada</option>
          <option value="Reunión">🤝 Reunión</option>
          <option value="Email">📧 Email</option>
          <option value="Catering">🍽️ Catering</option>
          <option value="Administración">📄 Administración</option>
        </select>
        
        <select className="p-4 rounded-2xl border border-gray-100 font-bold text-gray-600 bg-white cursor-pointer" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
          <option value="">Prioridades</option>
          <option value="high">🔴 Alta</option>
          <option value="medium">🟡 Media</option>
          <option value="low">🟢 Baja</option>
        </select>
      </div>

      {/* --- LISTADO DE TAREAS (Tarjetas) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {pendingTasks.map((task) => {
          const isUrgent = checkUrgency(task.dueDate);
          return (
            <div
              key={task._id}
              // DISEÑO: Cambia de borde y sombra al pasar el ratón (igual que clientes)
              className={`group relative bg-white p-8 rounded-[45px] shadow-sm border transition-all duration-500 flex flex-col min-h-[350px] hover:border-brand hover:shadow-2xl hover:shadow-brand/10 ${
                isUrgent ? "border-red-200 scale-[1.02] bg-red-50/10" : "border-gray-100"
              }`}
            >
              {/* Parte superior: Check de completar e IA */}
              <div className="flex justify-between items-start mb-6">
                <button onClick={() => toggleComplete(task._id, task.status)} className="w-10 h-10 rounded-xl border-2 border-gray-100 hover:border-green-500 hover:bg-green-50 font-bold text-xl transition-all">✓</button>
                <div className="flex flex-col items-end gap-2">
                  <button onClick={() => handleGetAIAdvice(task._id)} className="bg-brand/10 text-brand px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand hover:text-white transition-all">✨ IA Advice</button>
                  {isUrgent && <span className="bg-red-500 text-white text-[9px] font-black px-3 py-1 rounded-lg animate-bounce shadow-lg shadow-red-200 uppercase">⚠️ Urgente</span>}
                </div>
              </div>

              {/* ZONA CLICABLE (Cuerpo de la tarea) */}
              <div 
                className="cursor-pointer flex-grow" 
                onClick={() => navigate(`/tareas/${task._id}`)} // Nos lleva a la FICHA TÉCNICA
                title="Ver ficha técnica completa"
              >
                <div className="mb-2">
                  <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-lg border ${categoryColors[task.category] || categoryColors.Otro}`}>
                     {task.category || "General"}
                  </span>
                </div>

                <h3 className="text-2xl font-black mb-3 text-gray-900 group-hover:text-brand transition-colors">
                  {task.title}
                </h3>
                <p className="text-gray-400 text-sm line-clamp-3">
                  {task.description}
                </p>
              </div>

              {/* Pie de tarjeta: Fecha y botones de gestión rápida */}
              <div className="mt-6 pt-6 border-t border-gray-50 flex justify-between items-center">
                <div className="text-[10px] font-black text-brand uppercase tracking-widest">
                  📅 {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "Sin fecha"}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => navigate(`/tareas/editar/${task._id}`)} className="p-2 text-gray-300 hover:text-brand transition-colors" title="Editar">✎</button>
                  <button onClick={() => handleDelete(task._id)} className="p-2 text-gray-300 hover:text-red-500 transition-colors" title="Eliminar">🗑</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Tasks;