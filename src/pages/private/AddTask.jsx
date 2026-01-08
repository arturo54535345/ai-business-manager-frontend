// -------------------------------------------------------------------------
// 🛠️ SECCIÓN 1: HERRAMIENTAS
// -------------------------------------------------------------------------
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { toast } from "react-hot-toast";

const AddTask = () => {
  const navigate = useNavigate();

  // -------------------------------------------------------------------------
  // 🧠 SECCIÓN 2: LA MEMORIA (Estado del formulario)
  // -------------------------------------------------------------------------
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    specifications: "",
    client: "",
    priority: "medium",
    category: "Otro",
    dueDate: "",
    // 🟢 NUEVOS CAMPOS: El dinero de la tarea
    budget: 0, // Lo que vas a cobrar por esto.
    cost: 0    // Lo que vas a gastar para hacer esto.
  });

  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);

  // 📡 MISIÓN: Traer los clientes al empezar
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await api.get("/clients");
        setClients(res.data.clients || res.data);
      } catch (error) {
        toast.error("Error al cargar clientes.");
      }
    };
    fetchClients();
  }, []);

  // 🚀 EL ENVÍO: Guardar la tarea en el servidor
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.client) return toast.error("Arturo, selecciona un cliente.");

    setLoading(true);
    try {
      // 👨‍🏫 Enviamos todo el sobre con los nuevos campos de dinero incluidos.
      await api.post("/tasks", formData);
      toast.success("¡Tarea y finanzas registradas!", { icon: "💰" });
      navigate("/tareas");
    } catch (error) {
      toast.error("Error al guardar. Revisa el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto animate-fade-in">
      <h1 className="text-3xl font-black text-gray-900 mb-6 tracking-tight">
        Nueva Tarea
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 space-y-6"
      >
        {/* --- DATOS BÁSICOS (Título y Desc) --- */}
        <div>
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">¿Qué hay que hacer?</label>
          <input
            type="text"
            required
            className="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:ring-4 focus:ring-blue-50 outline-none transition-all font-medium"
            placeholder="Ej: Organización de evento VIP"
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        {/* --- 🟢 SECCIÓN NUEVA: ECONOMÍA DE LA TAREA --- */}
        <div className="bg-gray-50 p-6 rounded-[30px] border border-gray-100 space-y-4">
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-4">💰 Inteligencia Financiera</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Campo Presupuesto */}
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">Presupuesto (Ingreso)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">€</span>
                <input
                  type="number"
                  className="w-full pl-10 pr-5 py-4 rounded-xl border border-white focus:ring-4 focus:ring-green-50 outline-none transition-all font-bold text-gray-700 shadow-sm"
                  placeholder="0.00"
                  // 👨‍🏫 Lógica: Convertimos el texto a número para que el servidor no se queje.
                  onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                />
              </div>
            </div>

            {/* Campo Coste */}
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">Coste (Gasto)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">€</span>
                <input
                  type="number"
                  className="w-full pl-10 pr-5 py-4 rounded-xl border border-white focus:ring-4 focus:ring-red-50 outline-none transition-all font-bold text-gray-700 shadow-sm"
                  placeholder="0.00"
                  onChange={(e) => setFormData({ ...formData, cost: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>
          <p className="text-[9px] text-gray-400 italic px-2">
            * El beneficio se calculará automáticamente en tu Dashboard al completar la tarea.
          </p>
        </div>

        {/* --- CLIENTE Y CATEGORÍA --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Cliente</label>
            <select
              required
              className="w-full px-5 py-4 rounded-2xl border border-gray-100 outline-none bg-white font-bold text-gray-700"
              onChange={(e) => setFormData({ ...formData, client: e.target.value })}
            >
              <option value="">Selecciona...</option>
              {clients.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Tipo de Tarea</label>
            <select
              className="w-full px-5 py-4 rounded-2xl border border-gray-100 outline-none bg-white font-bold text-gray-700"
              value={formData.category}
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
        </div>

        {/* --- PRIORIDAD Y FECHA --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Prioridad</label>
            <select
              className="w-full px-5 py-4 rounded-2xl border border-gray-100 outline-none bg-white font-bold text-gray-700"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            >
              <option value="low">🟢 Baja</option>
              <option value="medium">🟡 Media</option>
              <option value="high">🔴 Alta</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Fecha Límite</label>
            <input
              type="date"
              required
              className="w-full px-5 py-4 rounded-2xl border border-gray-100 outline-none font-bold text-gray-700"
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </div>
        </div>

        {/* BOTONES */}
        <div className="flex gap-4 pt-6">
          <button
            type="button"
            onClick={() => navigate("/tareas")}
            className="flex-1 bg-gray-50 text-gray-400 py-4 rounded-[20px] font-black hover:bg-gray-100 transition-all uppercase text-[10px] tracking-widest"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-4 rounded-[20px] font-black hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all uppercase text-[10px] tracking-widest disabled:opacity-50"
          >
            {loading ? "Guardando..." : "Crear Tarea"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTask;