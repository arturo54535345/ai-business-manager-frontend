import { useState, useEffect } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  const [aiAdvice, setAiAdvice] = useState(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const navigate = useNavigate();

  // Función para exportar a Excel
  const exportTasksToCSV = () => {
    if (tasks.length === 0) return toast.error("No hay tareas para exportar.");
    const headers = ["Título", "Cliente", "Prioridad", "Estado", "Fecha Límite"];
    const rows = tasks.map((t) => [
      `"${t.title}"`,
      `"${t.client?.name || "Sin cliente"}"`,
      `"${t.priority}"`,
      `"${t.status}"`,
      `"${t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "Sin fecha"}"`,
    ]);
    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Tareas_Arturo_${new Date().toISOString().split("T")[0]}.csv`);
    link.click();
    toast.success("Listado de tareas descargado");
  };

  const checkUrgency = (dueDate) => {
    if (!dueDate || dueDate === "") return false;
    const now = new Date();
    const taskDate = new Date(dueDate);
    if (isNaN(taskDate.getTime())) return false;
    const diffInHours = (taskDate - now) / (1000 * 60 * 60);
    return diffInHours < 48 && diffInHours > -24;
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get(`/tasks?search=${searchTerm}&priority=${priorityFilter}`);
        setTasks(res.data);
      } catch (error) {
        console.error("Error al traer tareas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [searchTerm, priorityFilter]);

  const handleGetAIAdvice = async (taskId) => {
    setIsAiLoading(true);
    try {
      const res = await api.get(`/tasks/${taskId}/ai-advice`);
      setAiAdvice(res.data.advice);
      toast.success("¡Estrategia lista Arturo! 🤖");
    } catch (error) {
      toast.error("La IA está descansando un momento.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const pendingTasks = tasks.filter((t) => t.status !== "completed");

  const toggleComplete = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "completed" ? "pending" : "completed";
      await api.put(`/tasks/${id}`, { status: newStatus });
      setTasks(tasks.map((t) => (t._id === id ? { ...t, status: newStatus } : t)));
      toast.success(newStatus === "completed" ? "¡Tarea terminada!" : "Tarea reabierta");
    } catch (error) {
      toast.error("Error al actualizar");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Quieres eliminar esta tarea?")) {
      try {
        await api.delete(`/tasks/${id}`);
        setTasks(tasks.filter((t) => t._id !== id));
        toast.success("Tarea eliminada");
      } catch (error) {
        toast.error("Error al borrar");
      }
    }
  };

  if (loading) return <div className="p-20 text-center font-black text-gray-300 animate-pulse uppercase text-sm">Escaneando...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto animate-fade-in space-y-10 relative">
      {/* CABECERA (Se mantiene igual) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Mis Tareas</h1>
          <p className="text-gray-500 font-medium text-lg">Control de objetivos con IA</p>
        </div>
        <div className="flex gap-3">
          <button onClick={exportTasksToCSV} className="bg-white text-gray-600 px-6 py-4 rounded-2xl font-bold border border-gray-100 shadow-sm hover:bg-gray-50 transition-all flex items-center gap-2">
            <span>📥</span> Exportar
          </button>
          <button onClick={() => navigate("/tareas/nueva")} className="bg-brand text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-brand/20 hover:opacity-90 transition-all">
            + Nueva Tarea
          </button>
        </div>
      </div>

      {/* MODAL Y CARGA IA (Se mantienen igual) */}
      {aiAdvice && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl animate-fade-in relative">
            <button onClick={() => setAiAdvice(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-xl">✕</button>
            <div className="text-center mb-6">
              <span className="text-4xl">🤖</span>
              <h3 className="text-2xl font-black text-gray-900 mt-4">Estrategia IA</h3>
            </div>
            <div className="text-gray-600 leading-relaxed mb-8 bg-gray-50 p-6 rounded-2xl max-h-[60vh] overflow-y-auto">
              {aiAdvice}
            </div>
            <button onClick={() => setAiAdvice(null)} className="w-full bg-brand text-white py-3 rounded-xl font-bold hover:opacity-90 transition-all">¡Entendido!</button>
          </div>
        </div>
      )}

      {isAiLoading && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-brand mb-4"></div>
          <p className="text-brand font-bold animate-pulse uppercase tracking-widest">Generando estrategia...</p>
        </div>
      )}

      {/* 🟢 LISTADO DE TAREAS: Aquí es donde ocurre el cambio */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {pendingTasks.map((task) => {
          const isUrgent = checkUrgency(task.dueDate);
          return (
            <div key={task._id} className={`group relative bg-white p-8 rounded-[45px] shadow-sm border transition-all duration-500 flex flex-col min-h-[350px] ${isUrgent ? "border-urgent scale-[1.02]" : "border-gray-100 hover:border-brand"}`}>
              
              <div className="flex justify-between items-start mb-6">
                <button onClick={() => toggleComplete(task._id, task.status)} className="w-10 h-10 rounded-xl border-2 border-gray-100 hover:border-green-500 hover:text-green-600 flex items-center justify-center font-bold text-xl transition-all">✓</button>

                <div className="flex flex-col items-end gap-2">
                  <button onClick={() => handleGetAIAdvice(task._id)} className="bg-brand/10 text-brand px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand hover:text-white transition-all">✨ Asistente IA</button>
                  {isUrgent && <span className="bg-red-500 text-white text-[9px] font-black px-3 py-1 rounded-lg animate-bounce shadow-lg shadow-red-200 uppercase tracking-tighter">⚠️ Urgente</span>}
                </div>
              </div>

              {/* 👨‍🏫 PROFE: Aquí insertamos la etiqueta de Categoría. 
                  La ponemos justo debajo de los botones de arriba y antes del título. */}
              <div className="mb-2">
                <span className="text-[9px] font-black uppercase px-3 py-1 bg-gray-100 text-gray-400 rounded-lg tracking-[0.1em] border border-gray-50">
                   🏷️ {task.category || 'General'}
                </span>
              </div>

              <h3 className="text-2xl font-black mb-3 text-gray-900">{task.title}</h3>
              <p className="text-gray-400 font-medium text-sm line-clamp-3 flex-grow">{task.description}</p>

              {/* PIE DE TARJETA (Se mantiene igual) */}
              <div className="mt-auto pt-6 border-t border-gray-50 flex justify-between items-center">
                <div className="text-[10px] font-black text-brand uppercase tracking-widest">
                  📅 {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "Sin fecha"}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => navigate(`/tareas/editar/${task._id}`)} className="p-2 text-gray-300 hover:text-brand transition-colors">✎</button>
                  <button onClick={() => handleDelete(task._id)} className="p-2 text-gray-300 hover:text-red-500 transition-colors">🗑</button>
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