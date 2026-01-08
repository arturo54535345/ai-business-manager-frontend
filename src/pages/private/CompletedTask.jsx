import { useState, useEffect } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const CompletedTasks = () => {
  // -------------------------------------------------------------------------
  // 🧠 SECCIÓN 1: ESTADOS (Nuestras cajas de memoria)
  // -------------------------------------------------------------------------
  const [tasks, setTasks] = useState([]); // La lista original de tareas terminadas.
  const [loading, setLoading] = useState(true); // Para el mensaje de "Cargando...".
  
  // 🟢 NUEVO: Estado para la lupa
  const [searchTerm, setSearchTerm] = useState(""); // Aquí guardamos lo que Arturo escribe para buscar.

  const navigate = useNavigate();

  // -------------------------------------------------------------------------
  // 📡 SECCIÓN 2: CARGA INICIAL (Traer los datos)
  // -------------------------------------------------------------------------
  useEffect(() => {
    const fetchCompleted = async () => {
      try {
        const res = await api.get("/tasks");
        // Filtramos para quedarnos solo con las completadas
        const completed = res.data.filter((t) => t.status === "completed");
        setTasks(completed);
      } catch (error) {
        toast.error("No pudimos abrir el historial.");
      } finally {
        setLoading(false);
      }
    };
    fetchCompleted();
  }, []);

  // -------------------------------------------------------------------------
  // 🔄 SECCIÓN 3: REACTIVAR (Sacar del archivo)
  // -------------------------------------------------------------------------
  const reactivateTask = async (id) => {
    try {
      await api.put(`/tasks/${id}`, { status: "pending" });
      setTasks(tasks.filter((t) => t._id !== id));
      toast.success("Tarea devuelta a la lista activa 🔄");
    } catch (error) {
      toast.error("Error al reabrir");
    }
  };

  // -------------------------------------------------------------------------
  // 🔍 SECCIÓN 4: EL DOBLE COLADOR (Filtrado en tiempo real)
  // -------------------------------------------------------------------------
  // 👨‍🏫 Lógica del Profe: Creamos una lista nueva basada en la original
  // pero que solo incluye las que coincidan con lo que Arturo ha escrito.
  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-20 text-center animate-pulse font-black text-gray-300">Abriendo Archivos...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto animate-fade-in space-y-10">
      
      {/* --- CABECERA --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Historial de Logros</h1>
          <p className="text-gray-500 font-medium">Busca y repasa tus éxitos pasados</p>
        </div>
        <button
          onClick={() => navigate("/tareas")}
          className="bg-white text-gray-900 border border-gray-100 px-8 py-4 rounded-2xl font-black shadow-sm hover:bg-gray-50 transition-all"
        >
          ← Volver a Pendientes
        </button>
      </div>

      {/* --- 🔍 NUEVA BARRA DE BÚSQUEDA --- */}
      <div className="relative group">
        <input
          type="text"
          placeholder="Buscar un logro por su nombre..."
          className="w-full p-5 pl-14 rounded-3xl border border-gray-100 outline-none focus:ring-4 focus:ring-brand/5 focus:border-brand shadow-sm transition-all text-lg font-medium"
          value={searchTerm}
          // 👨‍🏫 Cada vez que escribes, actualizamos la "caja" searchTerm
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* Icono de Lupa decorativo */}
        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl grayscale group-focus-within:grayscale-0 transition-all">
          🔎
        </span>
      </div>

      {/* --- LISTADO --- */}
      {filteredTasks.length === 0 ? (
        <div className="bg-white p-20 rounded-[50px] border-2 border-dashed border-gray-100 text-center">
          <p className="text-gray-400 text-xl font-medium italic">
            {searchTerm ? "No hay logros que coincidan con tu búsqueda." : "Aún no hay tareas en el archivo."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTasks.map((task) => (
            <div
              key={task._id}
              className="bg-white p-8 rounded-[45px] border border-gray-50 opacity-80 hover:opacity-100 grayscale-[0.5] hover:grayscale-0 transition-all duration-500 flex flex-col min-h-[300px] shadow-sm hover:shadow-xl hover:shadow-brand/5"
            >
              <div className="flex justify-between items-start mb-6">
                <span className="bg-green-50 text-green-600 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-green-100">
                  ✓ Logrado
                </span>
                <button
                  onClick={() => reactivateTask(task._id)}
                  className="text-gray-300 hover:text-brand text-xs font-bold"
                >
                  Reabrir 🔄
                </button>
              </div>

              <div className="cursor-pointer flex-grow" onClick={() => navigate(`/tareas/${task._id}`)}>
                <h3 className="text-2xl font-black mb-3 text-gray-400 line-through">
                  {task.title}
                </h3>
                <p className="text-gray-400 text-sm line-clamp-2">
                  {task.description}
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-50 text-[10px] font-black text-gray-300 uppercase">
                Finalizado: {new Date(task.updatedAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompletedTasks;