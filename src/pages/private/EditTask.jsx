import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { toast } from "react-hot-toast";

const EditTask = () => {
  // -------------------------------------------------------------------------
  // 🧠 SECCIÓN 1: HERRAMIENTAS Y MEMORIA
  // -------------------------------------------------------------------------

  // useParams es como un GPS: saca el ID de la tarea de la dirección de la web.
  const { id } = useParams();
  const navigate = useNavigate();

  // Nuestra "Caja de Memoria" para el formulario.
  // 🟢 ¡NUEVO!: Hemos añadido 'category' para que la web sepa qué tipo de tarea es.
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    specifications: "",
    priority: "medium",
    category: "Otro", // Valor inicial por defecto
    dueDate: "",
    client: "",
  });

  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  // -------------------------------------------------------------------------
  // 📡 SECCIÓN 2: RECUPERAR EL PASADO (useEffect)
  // -------------------------------------------------------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 👨‍🏫 TRUCO DE PROFE: Promise.all es como pedir dos pizzas a la vez.
        // Pedimos los datos de la tarea y la lista de clientes al mismo tiempo.
        const [taskRes, clientesRes] = await Promise.all([
          api.get(`/tasks/${id}`),
          api.get("/clients"),
        ]);

        const task = taskRes.data;

        // Rellenamos el formulario con lo que ya había en la base de datos
        setFormData({
          title: task.title || "",
          description: task.description || "",
          specifications: task.specifications || "",
          priority: task.priority || "medium",
          // 🟢 ¡CLAVE!: Recuperamos la categoría que guardamos antes.
          category: task.category || "Otro",
          // Limpiamos la fecha para que el calendario de la web la entienda
          dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
          client: task.client?._id || task.client || "",
        });

        setClients(clientesRes.data.clients || clientesRes.data || []);
      } catch (error) {
        console.error("Error al cargar datos", error);
        toast.error("No encontramos esa tarea, Arturo.");
        navigate("/tareas");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  // -------------------------------------------------------------------------
  // 🚀 SECCIÓN 3: GUARDAR EL FUTURO (handleSubmit)
  // -------------------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que la página se vuelva loca y se refresque
    try {
      // Enviamos el paquete actualizado al servidor
      await api.put(`/tasks/${id}`, formData);

      toast.success("¡Tarea actualizada!", { icon: "📝" });
      navigate("/tareas"); // Volvemos a la lista
    } catch (error) {
      toast.error("No se pudieron guardar los cambios.");
    }
  };

  // Si la web está buscando los datos, mostramos este mensaje
  if (loading)
    return (
      <div className="p-20 text-center font-black text-gray-300 animate-pulse uppercase">
        Buscando detalles...
      </div>
    );

  return (
    <div className="p-8 max-w-2xl mx-auto animate-fade-in">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
          Editar Tarea
        </h1>
        <p className="text-gray-500 font-medium">
          Corrige o mejora los detalles de tu objetivo
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-[45px] shadow-sm border border-gray-100 space-y-8"
      >
        {/* TÍTULO */}
        <div>
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">
            ¿Qué hay que hacer?
          </label>
          <input
            type="text"
            value={formData.title}
            required
            className="w-full px-6 py-4 rounded-2xl border border-gray-100 focus:ring-4 focus:ring-brand/10 outline-none transition-all bg-gray-50/50 font-bold"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
        </div>

        {/* ESPECIFICACIONES (Para tu Socio IA) */}
        <div>
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">
            Especificaciones Técnicas
          </label>
          <textarea
            value={formData.specifications}
            className="w-full px-6 py-4 rounded-2xl border border-gray-100 focus:ring-4 focus:ring-brand/10 outline-none transition-all bg-gray-50/50 h-32 font-medium"
            onChange={(e) =>
              setFormData({ ...formData, specifications: e.target.value })
            }
          />
        </div>

        {/* 🟢 TIPO DE TAREA (Categoría) */}
        {/* 👨‍🏫 Aquí es donde Arturo elige si la tarea ha cambiado de tipo */}
        <div>
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">
            Tipo de Tarea
          </label>
          <select
            value={formData.category}
            className="w-full px-6 py-4 rounded-2xl border border-gray-100 focus:ring-4 focus:ring-brand/10 outline-none transition-all bg-white font-bold text-gray-700 cursor-pointer"
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option value="Otro">Otro</option>
            <option value="Llamada">📞 Llamada</option>
            <option value="Reunión">🤝 Reunión</option>
            <option value="Email">📧 Email</option>
            <option value="Administración">📄 Administración</option>
            <option value="Catering">🍽️ Catering</option>
          </select>
        </div>

        {/* CLIENTE */}
        <div>
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">
            Cliente Asociado
          </label>
          <select
            value={formData.client}
            required
            className="w-full px-6 py-4 rounded-2xl border border-gray-100 focus:ring-4 focus:ring-brand/10 outline-none transition-all bg-white font-bold text-gray-700 cursor-pointer"
            onChange={(e) =>
              setFormData({ ...formData, client: e.target.value })
            }
          >
            <option value="">Selecciona un cliente</option>
            {clients.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* PRIORIDAD Y FECHA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">
              Prioridad
            </label>
            <select
              value={formData.priority}
              className="w-full px-6 py-4 rounded-2xl border border-gray-100 focus:ring-4 focus:ring-brand/10 outline-none transition-all bg-white font-bold text-gray-700 cursor-pointer"
              onChange={(e) =>
                setFormData({ ...formData, priority: e.target.value })
              }
            >
              <option value="low">🟢 Baja</option>
              <option value="medium">🟡 Media</option>
              <option value="high">🔴 Alta</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">
              Fecha Límite
            </label>
            <input
              type="date"
              value={formData.dueDate}
              required
              className="w-full px-6 py-4 rounded-2xl border border-gray-100 focus:ring-4 focus:ring-brand/10 outline-none transition-all bg-gray-50/50 font-bold"
              onChange={(e) =>
                setFormData({ ...formData, dueDate: e.target.value })
              }
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
            Descartar
          </button>
          <button
            type="submit"
            className="flex-1 bg-brand text-white py-4 rounded-2xl font-black shadow-xl shadow-brand/20 hover:opacity-90 transition-all uppercase text-[10px] tracking-widest"
          >
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTask;
