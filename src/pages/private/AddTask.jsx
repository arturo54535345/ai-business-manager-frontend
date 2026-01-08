// -------------------------------------------------------------------------
// 🛠️ SECCIÓN 1: IMPORTACIONES (Nuestras herramientas de trabajo)
// -------------------------------------------------------------------------
import { useState, useEffect } from "react"; // 'useState' para recordar datos y 'useEffect' para tareas automáticas.
import { useNavigate } from "react-router-dom"; // El mando a distancia para movernos entre páginas.
import api from "../../api/axios"; // Nuestro mensajero especial que sabe llegar al servidor.
import { toast } from "react-hot-toast"; // La herramienta para sacar mensajes bonitos (globos de texto).

const AddTask = () => {
  // 🧭 useNavigate lo guardamos en una constante para usarlo fácilmente.
  const navigate = useNavigate();

  // -------------------------------------------------------------------------
  // 🧠 SECCIÓN 2: ESTADOS (Nuestras pizarras de memoria)
  // -------------------------------------------------------------------------

  // 1. LA CAJA DEL FORMULARIO: Aquí guardamos todo lo que escribes.
  // Es como un borrador de papel que se va rellenando.
  const [formData, setFormData] = useState({
    title: "",           // El nombre de la tarea.
    description: "",     // Una explicación general de qué hay que hacer.
    specifications: "",  // Detalles más técnicos o pasos a seguir.
    client: "",          // El ID del cliente al que pertenece esta tarea.
    priority: "medium",  // Nivel de importancia (por defecto es Media).
    category: "Otro",    // El tipo de tarea (Llamada, Email, etc.).
    dueDate: "",         // La fecha en la que debe estar terminada.
  });

  // 2. LA LISTA DE CLIENTES: Un espacio vacío para guardar los nombres de tus clientes.
  const [clients, setClients] = useState([]); 

  // 3. EL INTERRUPTOR DE CARGA: Para saber si estamos enviando datos y bloquear botones.
  const [loading, setLoading] = useState(false);

  // -------------------------------------------------------------------------
  // 📡 SECCIÓN 3: LA MISIÓN AUTOMÁTICA (useEffect)
  // -------------------------------------------------------------------------
  
  // Esta misión se activa SOLA en cuanto Arturo entra en la página.
  useEffect(() => {
    const fetchClients = async () => {
      try {
        // Le pedimos al servidor la lista de clientes.
        const res = await api.get("/clients");
        // Guardamos los clientes recibidos en nuestra pizarra (setClients).
        // Usamos || res.data por si el servidor manda la lista dentro de una caja llamada 'clients'.
        setClients(res.data.clients || res.data);
      } catch (error) {
        console.error("Error al traer clientes", error);
        toast.error("No pudimos cargar tus clientes. Revisa tu conexión.");
      }
    };
    fetchClients();
  }, []); // [] significa: "Hazlo solo una vez al abrir la página".

  // -------------------------------------------------------------------------
  // 🚀 SECCIÓN 4: EL ENVÍO (handleSubmit)
  // -------------------------------------------------------------------------

  // Esta función se activa cuando Arturo pulsa el botón "Crear Tarea".
  const handleSubmit = async (e) => {
    e.preventDefault(); // Detiene el comportamiento antiguo de internet de recargar la página.

    // 🕵️ Lógica de Seguridad: Si no elegiste cliente, te avisamos y paramos aquí.
    if (!formData.client) {
      return toast.error("Arturo, selecciona un cliente para esta tarea");
    }

    // Encendemos el interruptor de "ocupado" (Sincronizando...).
    setLoading(true);

    try {
      // 👨‍🏫 Enviamos el "sobre" (formData) al servidor.
      // Esta es la línea donde puede fallar si el servidor no acepta algún campo (Error 500).
      await api.post("/tasks", formData);

      // Si todo sale bien, lanzamos un cohete de éxito.
      toast.success("¡Tarea creada con éxito!", { icon: "🚀" });

      // Volvemos automáticamente a la lista de tareas.
      navigate("/tareas"); 
    } catch (error) {
      // Si el servidor falla (Error 500), caemos aquí.
      console.error("Error al crear tarea:", error);
      toast.error("Vaya, el servidor ha tenido un problema. Revisa los campos.");
    } finally {
      // Pase lo que pase (éxito o error), apagamos el interruptor de carga.
      setLoading(false);
    }
  };

  // -------------------------------------------------------------------------
  // 🖼️ SECCIÓN 5: EL DISEÑO (Lo que Arturo ve en pantalla)
  // -------------------------------------------------------------------------
  return (
    <div className="p-8 max-w-2xl mx-auto animate-fade-in">
      {/* Título de la página */}
      <h1 className="text-3xl font-black text-gray-900 mb-6 tracking-tight">
        Nueva Tarea
      </h1>

      {/* El formulario donde Arturo escribe */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 space-y-6"
      >
        {/* CAMPO: TÍTULO */}
        <div>
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
            ¿Qué hay que hacer?
          </label>
          <input
            type="text"
            required
            className="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:ring-4 focus:ring-blue-50 outline-none transition-all font-medium"
            placeholder="Ej: Llamar a los nuevos clientes"
            // 👨‍🏫 Lógica: Cuando escribas, actualizamos solo el 'title' en la memoria.
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        {/* CAMPO: DESCRIPCIÓN (AÑADIDO NUEVO) */}
        <div>
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
            Descripción General
          </label>
          <textarea
            className="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:ring-4 focus:ring-blue-50 outline-none transition-all h-24 font-medium"
            placeholder="Explica brevemente de qué trata esta tarea..."
            // 👨‍🏫 Lógica: Guardamos lo que escribas en 'description'.
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        {/* CAMPO: ESPECIFICACIONES TÉCNICAS */}
        <div>
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
            Pasos o Detalles Extra
          </label>
          <textarea
            className="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:ring-4 focus:ring-blue-50 outline-none transition-all h-32 font-medium"
            placeholder="Escribe los pasos técnicos o detalles para tu Socio IA..."
            onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
          />
        </div>

        {/* REJILLA: CLIENTE Y PRIORIDAD */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Selector de Cliente */}
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
              ¿Para qué cliente?
            </label>
            <select
              required
              className="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:ring-4 focus:ring-blue-50 outline-none transition-all bg-white font-bold text-gray-700"
              onChange={(e) => setFormData({ ...formData, client: e.target.value })}
            >
              <option value="">Selecciona...</option>
              {/* Recorremos la lista de clientes que trajimos al principio */}
              {clients.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Selector de Prioridad */}
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
              Prioridad
            </label>
            <select
              className="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:ring-4 focus:ring-blue-50 outline-none transition-all bg-white font-bold text-gray-700"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            >
              <option value="low">🟢 Baja</option>
              <option value="medium">🟡 Media</option>
              <option value="high">🔴 Alta</option>
            </select>
          </div>
        </div>

        {/* CAMPO: CATEGORÍA (Novedad) */}
        <div>
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
            Tipo de Tarea
          </label>
          <select
            className="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:ring-4 focus:ring-blue-50 outline-none transition-all bg-white font-bold text-gray-700"
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

        {/* CAMPO: FECHA LÍMITE */}
        <div>
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
            Fecha Límite (¿Para cuándo?)
          </label>
          <input
            type="date"
            required
            className="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:ring-4 focus:ring-blue-50 outline-none transition-all font-bold text-gray-700"
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          />
        </div>

        {/* SECCIÓN DE BOTONES */}
        <div className="flex gap-4 pt-6">
          <button
            type="button"
            onClick={() => navigate("/tareas")} // Te saca de aquí sin guardar nada.
            className="flex-1 bg-gray-50 text-gray-400 py-4 rounded-[20px] font-black hover:bg-gray-100 transition-all uppercase text-[10px] tracking-widest"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading} // Si estamos cargando, el botón se apaga para que no hagas clic dos veces.
            className="flex-1 bg-blue-600 text-white py-4 rounded-[20px] font-black hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all uppercase text-[10px] tracking-widest disabled:opacity-50"
          >
            {loading ? "Sincronizando..." : "Crear Tarea"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTask;