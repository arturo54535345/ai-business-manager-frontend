// -------------------------------------------------------------------------
// 🛠️ SECCIÓN 1: HERRAMIENTAS Y MEMORIA
// -------------------------------------------------------------------------
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { toast } from "react-hot-toast";

const EditTask = () => {
  // Sacamos el ID de la URL (el "DNI" de la tarea que vamos a editar).
  const { id } = useParams();
  const navigate = useNavigate();

  // Nuestra "Caja de Memoria" actualizada con los campos de dinero.
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    specifications: "",
    priority: "medium",
    category: "Otro",
    dueDate: "",
    client: "",
    // 🟢 NUEVO: Dinero que recuperaremos del servidor
    budget: 0,
    cost: 0
  });

  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  // -------------------------------------------------------------------------
  // 📡 SECCIÓN 2: RECUPERAR EL PASADO (Traer los datos actuales)
  // -------------------------------------------------------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Pedimos la tarea y los clientes a la vez (como pedir dos pizzas).
        const [taskRes, clientesRes] = await Promise.all([
          api.get(`/tasks/${id}`),
          api.get("/clients"),
        ]);

        const task = taskRes.data;

        // Rellenamos el formulario con lo que ya estaba guardado en el servidor.
        setFormData({
          title: task.title || "",
          description: task.description || "",
          specifications: task.specifications || "",
          priority: task.priority || "medium",
          category: task.category || "Otro",
          dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
          client: task.client?._id || task.client || "",
          // 🟢 IMPORTANTE: Cargamos los valores de presupuesto y coste.
          budget: task.budget || 0,
          cost: task.cost || 0,
        });

        setClients(clientesRes.data.clients || clientesRes.data || []);
      } catch (error) {
        toast.error("No encontramos la tarea, Arturo.");
        navigate("/tareas");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  // -------------------------------------------------------------------------
  // 🚀 SECCIÓN 3: GUARDAR LOS CAMBIOS (handleSubmit)
  // -------------------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try {
      // 👨‍🏫 Enviamos el paquete 'formData' con los nuevos números al servidor.
      await api.put(`/tasks/${id}`, formData);
      toast.success("¡Tarea y finanzas actualizadas!", { icon: "📝" });
      navigate("/tareas"); 
    } catch (error) {
      toast.error("No se pudieron guardar los cambios.");
    }
  };

  if (loading) return <div className="p-20 text-center font-black text-gray-300 animate-pulse uppercase">Buscando detalles...</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto animate-fade-in">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Editar Tarea</h1>
        <p className="text-gray-500 font-medium">Ajusta los detalles técnicos o económicos</p>
      </header>

      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[45px] shadow-sm border border-gray-100 space-y-8">
        
        {/* TÍTULO */}
        <div>
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">¿Qué hay que hacer?</label>
          <input
            type="text"
            value={formData.title}
            required
            className="w-full px-6 py-4 rounded-2xl border border-gray-100 focus:ring-4 focus:ring-brand/10 outline-none transition-all bg-gray-50/50 font-bold"
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        {/* 🟢 SECCIÓN NUEVA: ECONOMÍA ACTUALIZABLE */}
        {/* 👨‍🏫 La ponemos en gris para que resalte y Arturo sepa que aquí se toca el dinero */}
        <div className="bg-gray-50 p-8 rounded-[35px] border border-gray-100 space-y-6">
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">💰 Ajuste de Cuentas</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Presupuesto */}
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">Presupuesto (€)</label>
              <input
                type="number"
                value={formData.budget} // Muestra lo que ya había guardado
                className="w-full px-5 py-4 rounded-xl border border-white focus:ring-4 focus:ring-green-50 outline-none font-bold text-gray-700 shadow-sm"
                // 👨‍🏫 Lógica: Convertimos a número para que el servidor pueda hacer sumas.
                onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
              />
            </div>

            {/* Coste */}
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">Coste (€)</label>
              <input
                type="number"
                value={formData.cost}
                className="w-full px-5 py-4 rounded-xl border border-white focus:ring-4 focus:ring-red-50 outline-none font-bold text-gray-700 shadow-sm"
                onChange={(e) => setFormData({ ...formData, cost: Number(e.target.value) })}
              />
            </div>
          </div>
        </div>

        {/* TIPO DE TAREA Y CLIENTE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Tipo</label>
            <select
              value={formData.category}
              className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-white font-bold text-gray-700"
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="Otro">Otro</option>
              <option value="Llamada">📞 Llamada</option>
              <option value="Reunión">🤝 Reunión</option>
              <option value="Email">📧 Email</option>
              <option value="Administración">📄 Administración</option>
              <option value="Catering">🍽️ Catering</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Cliente</label>
            <select
              value={formData.client}
              required
              className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-white font-bold text-gray-700"
              onChange={(e) => setFormData({ ...formData, client: e.target.value })}
            >
              <option value="">Selecciona un cliente</option>
              {clients.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* FECHA Y PRIORIDAD */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Prioridad</label>
            <select
              value={formData.priority}
              className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-white font-bold text-gray-700"
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            >
              <option value="low">🟢 Baja</option>
              <option value="medium">🟡 Media</option>
              <option value="high">🔴 Alta</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Vencimiento</label>
            <input
              type="date"
              value={formData.dueDate}
              required
              className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 font-bold"
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </div>
        </div>

        {/* BOTONES */}
        <div className="flex gap-4 pt-6">
          <button
            type="button"
            onClick={() => navigate("/tareas")}
            className="flex-1 bg-gray-50 text-gray-400 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-gray-100 transition-all"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 bg-brand text-white py-4 rounded-2xl font-black shadow-xl shadow-brand/20 hover:opacity-90 transition-all uppercase text-[10px] tracking-widest"
          >
            Actualizar Tarea
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTask;