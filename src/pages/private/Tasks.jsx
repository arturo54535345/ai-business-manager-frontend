// -------------------------------------------------------------------------
// 📂 ARCHIVO: src/pages/private/Tasks.jsx
// 📝 DESCRIPCIÓN: Panel de Control de misiones con coreografía de entrada.
// -------------------------------------------------------------------------
import { useState, useEffect } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const Tasks = () => {
  // 🧠 LÓGICA (INTACTA)
  const [tasks, setTasks] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [priorityFilter, setPriorityFilter] = useState(""); 
  const [categoryFilter, setCategoryFilter] = useState(""); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get(`/tasks?search=${searchTerm}&priority=${priorityFilter}&category=${categoryFilter}`);
        setTasks(res.data.tasks || res.data);
      } catch (error) {
        console.error("Error en el escaneo de objetivos");
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [searchTerm, priorityFilter, categoryFilter]);

  const checkUrgency = (dueDate) => {
    if (!dueDate) return false;
    const diffInHours = (new Date(dueDate) - new Date()) / (1000 * 60 * 60);
    return diffInHours < 48 && diffInHours > -24;
  };

  const toggleComplete = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "completed" ? "pending" : "completed";
      await api.put(`/tasks/${id}`, { status: newStatus });
      setTasks(tasks.map((t) => (t._id === id ? { ...t, status: newStatus } : t)));
      toast.success("Misión actualizada");
    } catch (error) { toast.error("Fallo al actualizar"); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Confirmar eliminación de registro?")) {
      try {
        await api.delete(`/tasks/${id}`);
        setTasks(tasks.filter((t) => t._id !== id));
        toast.success("Registro borrado");
      } catch (error) { toast.error("Error al borrar"); }
    }
  };

  if (loading) return <div className="p-20 text-center font-black text-cyber-blue animate-pulse tracking-[0.5em] uppercase text-[10px]">Sincronizando Objetivos...</div>;

  const pendingTasks = tasks.filter((t) => t.status !== "completed");

  return (
    <div className="space-y-16 reveal-premium">
      
      {/* --- CABECERA (Arquitectura de Poder) --- */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="w-8 h-[2px] bg-cyber-blue opacity-50"></div>
             <span className="text-[9px] font-black text-cyber-blue uppercase tracking-[0.4em]">Operations_Log</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none italic">
            Control <span className="text-cyber-blue">Misión</span>
          </h1>
          <p className="text-cyber-silver/40 font-medium italic text-lg max-w-xl">
            Protocolos activos y despliegue de objetivos operativos de alta prioridad.
          </p>
        </div>
        
        <div className="flex gap-4 w-full lg:w-auto">
          <button onClick={() => navigate("/tareas/completadas")} className="flex-1 lg:flex-none glass px-8 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest text-cyber-silver/60 hover:text-white transition-all duration-700">
             Historial
          </button>
          <button onClick={() => navigate("/tareas/nueva")} className="flex-1 lg:flex-none bg-cyber-blue text-black px-12 py-5 rounded-2xl font-black shadow-[0_20px_40px_-15px_rgba(0,209,255,0.4)] hover:scale-105 transition-all duration-700 text-[10px] uppercase tracking-[0.3em]">
            + Nuevo Objetivo
          </button>
        </div>
      </header>

      {/* --- TERMINAL DE FILTROS (Minimalismo Puro) --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-2 relative group">
          <input 
            type="text" 
            placeholder="Buscar por ID o título de misión..." 
            className="w-full glass bg-white/[0.02] p-6 pl-16 text-white outline-none focus:border-cyber-blue/30 transition-all duration-700 font-medium placeholder:text-white/10" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
          <span className="absolute left-7 top-1/2 -translate-y-1/2 opacity-20 text-xl group-focus-within:opacity-50 transition-opacity">🔍</span>
        </div>
        
        <select className="glass bg-white/[0.02] p-6 text-cyber-silver/60 font-black text-[9px] uppercase tracking-[0.3em] outline-none cursor-pointer focus:border-cyber-blue/30" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="">Categorías</option>
          <option value="Llamada">Llamada</option>
          <option value="Reunión">Reunión</option>
          <option value="Email">Email</option>
        </select>
        
        <select className="glass bg-white/[0.02] p-6 text-cyber-silver/60 font-black text-[9px] uppercase tracking-[0.3em] outline-none cursor-pointer focus:border-cyber-blue/30" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
          <option value="">Prioridad</option>
          <option value="high">Crítica</option>
          <option value="medium">Media</option>
          <option value="low">Rutina</option>
        </select>
      </div>

      {/* --- GRID DE MISIONES (Coreografía de entrada) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
        {pendingTasks.map((task, index) => {
          const isUrgent = checkUrgency(task.dueDate);
          return (
            <div
              key={task._id}
              // 👨‍🏫 Lógica Premium: Añadimos un retraso (delay) según la posición (index)
              // para que las tareas aparezcan una detrás de otra con elegancia.
              style={{ animationDelay: `${index * 0.15}s` }}
              className={`glass glass-hover p-12 flex flex-col min-h-[420px] relative overflow-hidden reveal-premium group ${
                isUrgent ? "border-red-500/20 shadow-[0_0_50px_rgba(239,68,68,0.05)]" : ""
              }`}
            >
              {/* Brillo ambiental para tareas urgentes */}
              {isUrgent && <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-500/5 blur-[100px] animate-pulse" />}

              {/* Header de la tarjeta */}
              <div className="flex justify-between items-start mb-10 z-10">
                <button 
                  onClick={() => toggleComplete(task._id, task.status)} 
                  className="w-14 h-14 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-cyber-blue hover:text-cyber-blue flex items-center justify-center text-xl transition-all duration-500 group-hover:bg-cyber-blue/5"
                >
                  ✓
                </button>
                <div className="flex flex-col items-end gap-4">
                  <span className={`text-[8px] font-black uppercase tracking-[0.4em] px-4 py-1.5 rounded-lg border ${
                    isUrgent ? "border-red-500/40 text-red-400 bg-red-500/5" : "border-white/5 text-cyber-silver/40"
                  }`}>
                    {isUrgent ? "Prioridad_Alfa" : (task.priority || "Estandar")}
                  </span>
                </div>
              </div>

              {/* Cuerpo de la misión */}
              <div className="cursor-pointer flex-grow z-10 group" onClick={() => navigate(`/tareas/${task._id}`)}>
                <p className="text-[9px] font-black uppercase text-cyber-blue/40 tracking-[0.3em] mb-4">
                  {task.category || "Operativo"}
                </p>
                <h3 className="text-4xl font-black text-white tracking-tighter mb-6 group-hover:text-cyber-blue transition-colors duration-700 italic">
                  {task.title}
                </h3>
                <p className="text-cyber-silver/40 text-sm font-medium leading-relaxed line-clamp-3 group-hover:text-cyber-silver/80 transition-colors duration-700">
                  {task.description}
                </p>
              </div>

              {/* Pie de tarjeta: Cronología */}
              <div className="mt-12 pt-8 border-t border-white/5 flex justify-between items-center z-10">
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Timeline_Due</span>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${isUrgent ? 'text-red-400' : 'text-cyber-blue/60'}`}>
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "Indefinido"}
                  </span>
                </div>
                <div className="flex gap-6 opacity-20 group-hover:opacity-100 transition-opacity duration-700">
                  <button onClick={(e) => {e.stopPropagation(); navigate(`/tareas/editar/${task._id}`)}} className="text-white hover:text-cyber-blue transition-colors text-xs font-black uppercase tracking-widest">Edit</button>
                  <button onClick={(e) => {e.stopPropagation(); handleDelete(task._id)}} className="text-white hover:text-red-500 transition-colors text-xs font-black uppercase tracking-widest">Drop</button>
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