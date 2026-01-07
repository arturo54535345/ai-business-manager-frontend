import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { toast } from "react-hot-toast";

const AddTask = () => {
  const navigate = useNavigate();

  // 1. CAJA DE MEMORIA (Estado)
  // Incluimos 'specifications' para los detalles extra que pidió el usuario
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    specifications: "", // Nuevo campo para detalles técnicos
    client: "",
    priority: "medium",
    category: "Otro",
    dueDate: "",
  });

  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);

  // 2. CARGA DE DATOS: Buscamos los clientes al abrir la página
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await api.get("/clients");
        // Guardamos la lista de clientes que viene del motor
        setClients(res.data.clients || res.data);
      } catch (error) {
        console.error("Error al traer clientes", error);
      }
    };
    fetchClients();
  }, []);

  // 3. ENVÍO DEL FORMULARIO
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación: No dejamos crear tareas sin un cliente asociado
    if (!formData.client) {
      return toast.error("Por favor, selecciona un cliente para esta tarea");
    }

    setLoading(true);
    try {
      await api.post("/tasks", formData);

      toast.success("¡Tarea creada con éxito! A por ello Arturo", {
        icon: "🚀",
        style: { borderRadius: "15px", background: "#333", color: "#fff" },
      });

      navigate("/tareas");
    } catch (error) {
      console.error("Error al crear tarea:", error);
      toast.error("Vaya, no se pudo guardar la tarea. Revisa la conexión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Nueva Tarea</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6"
      >
        {/* FILA 1: Título de la tarea */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            ¿Qué hay que hacer?
          </label>
          <input
            type="text"
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            placeholder="Ej: Llamar a los nuevos clientes"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
        </div>

        {/* FILA 2: Especificaciones (Detalles técnicos) */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Especificaciones o detalles extra
          </label>
          <textarea
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all h-32"
            placeholder="Escribe aquí los pasos a seguir o detalles técnicos de la tarea..."
            onChange={(e) =>
              setFormData({ ...formData, specifications: e.target.value })
            }
          />
        </div>

        {/* FILA 3: Cliente y Prioridad (En dos columnas para ahorrar espacio) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Asociar a un Cliente
            </label>
            <select
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              onChange={(e) =>
                setFormData({ ...formData, client: e.target.value })
              }
            >
              <option value="">Selecciona un cliente...</option>
              {clients.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Prioridad
            </label>
            <select
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={formData.priority}
              onChange={(e) =>
                setFormData({ ...formData, priority: e.target.value })
              }
            >
              <option value="low">Baja</option>
              <option value="medium">Media</option>
              <option value="high">Alta</option>
            </select>
          </div>
        </div>

        {/* Fila: Selector de categoria*/}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Tipo de Tarea
          </label>
          <select
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option value="Otro">Otro</option>
            <option value="Llamada"> Llamada</option>
            <option value="Reunión"> Reunión</option>
            <option value="Email"> Email</option>
            <option value="Administración"> Administración</option>
            <option value="Catering"> Catering</option>
          </select>
        </div>

        {/* FILA 4: Fecha de vencimiento */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            ¿Para cuándo?
          </label>
          <input
            type="date"
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            onChange={(e) =>
              setFormData({ ...formData, dueDate: e.target.value })
            }
          />
        </div>

        {/* BOTONES DE ACCIÓN */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate("/tareas")}
            className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
          >
            {loading ? "Guardando..." : "Crear Tarea"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTask;
