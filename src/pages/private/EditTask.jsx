// -------------------------------------------------------------------------
// 📂 ARCHIVO: src/pages/private/EditTask.jsx
// 📝 DESCRIPCIÓN: Panel de recalibración de objetivos y finanzas.
// -------------------------------------------------------------------------
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { toast } from "react-hot-toast";

const EditTask = () => {
  // 🧠 LÓGICA (INTACTA)
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    specifications: "",
    priority: "medium",
    category: "Otro",
    dueDate: "",
    client: "",
    budget: 0,
    cost: 0
  });

  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [taskRes, clientesRes] = await Promise.all([
          api.get(`/tasks/${id}`),
          api.get("/clients"),
        ]);

        const task = taskRes.data;

        setFormData({
          title: task.title || "",
          description: task.description || "",
          specifications: task.specifications || "",
          priority: task.priority || "medium",
          category: task.category || "Otro",
          dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
          client: task.client?._id || task.client || "",
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

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try {
      await api.put(`/tasks/${id}`, formData);
      toast.success("Misión recalibrada correctamente", { 
        style: { background: '#030303', color: '#00D1FF', border: '1px solid rgba(0,209,255,0.2)' } 
      });
      navigate("/tareas"); 
    } catch (error) {
      toast.error("Fallo en la escritura de datos.");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center font-black text-cyber-blue animate-pulse uppercase tracking-[0.5em] text-[10px]">
      Accediendo al Núcleo de la Misión...
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-12 reveal-premium pb-20">
      
      {/* --- CABECERA (Status de Edición) --- */}
      <header className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-[2px] bg-cyber-blue opacity-50"></div>
          <span className="text-[9px] font-black text-cyber-blue uppercase tracking-[0.4em]">Mission_Recalibration_Protocol</span>
        </div>
        <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none italic">
          Editar <span className="text-cyber-blue">Tarea</span>
        </h1>
        <p className="text-cyber-silver/40 font-medium italic text-lg">Ajusta los parámetros operativos y financieros del objetivo.</p>
      </header>

      {/* --- FORMULARIO DE ALTA PRECISIÓN --- */}
      <form onSubmit={handleSubmit} className="glass p-12 md:p-16 border-white/5 space-y-12">
        
        {/* TÍTULO DE MISIÓN */}
        <div className="group">
          <label className="block text-[9px] font-black text-cyber-silver/40 uppercase tracking-[0.4em] mb-4 ml-1 group-focus-within:text-cyber-blue transition-colors duration-500">
            Identificador_Título
          </label>
          <input
            type="text"
            value={formData.title}
            required
            className="w-full bg-white/[0.02] border border-white/5 p-6 rounded-2xl text-white outline-none focus:border-cyber-blue/30 focus:bg-white/[0.05] transition-all duration-700 font-bold text-xl"
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        {/* 💰 MÓDULO ECONÓMICO (La Joya de la Corona) 
            Lógica: Usamos un fondo ligeramente diferente para resaltar que aquí se maneja dinero. */}
        <div className="glass bg-cyber-blue/[0.02] p-10 border-cyber-blue/10 rounded-[40px] space-y-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
             <span className="text-6xl font-black italic">EUR</span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-cyber-blue rounded-full animate-ping"></div>
            <p className="text-[10px] font-black text-cyber-blue uppercase tracking-[0.3em]">Módulo_Financiero_V4</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Presupuesto */}
            <div className="group">
              <label className="block text-[8px] font-black text-white/20 uppercase mb-3 ml-1 tracking-[0.4em]">Presupuesto_Planificado</label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.budget}
                  className="w-full bg-black/40 border border-white/5 p-5 rounded-2xl text-white outline-none focus:border-cyber-blue/40 font-black text-2xl tracking-tighter transition-all duration-500"
                  onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-cyber-blue/20">€</span>
              </div>
            </div>

            {/* Coste */}
            <div className="group">
              <label className="block text-[8px] font-black text-white/20 uppercase mb-3 ml-1 tracking-[0.4em]">Coste_Ejecutado</label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.cost}
                  className="w-full bg-black/40 border border-white/5 p-5 rounded-2xl text-white outline-none focus:border-red-500/40 font-black text-2xl tracking-tighter transition-all duration-500"
                  onChange={(e) => setFormData({ ...formData, cost: Number(e.target.value) })}
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-red-500/20">€</span>
              </div>
            </div>
          </div>
        </div>

        {/* PARÁMETROS DE CLASIFICACIÓN */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="group">
            <label className="block text-[9px] font-black text-cyber-silver/40 uppercase tracking-[0.4em] mb-4 ml-1">Sector_Categoría</label>
            <select
              value={formData.category}
              className="w-full bg-white/[0.02] border border-white/5 p-6 rounded-2xl text-white font-bold outline-none cursor-pointer focus:border-cyber-blue/30 transition-all duration-700"
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="Otro">Otro</option>
              <option value="Llamada">Llamada</option>
              <option value="Reunión">Reunión</option>
              <option value="Email">Email</option>
              <option value="Catering">Catering</option>
            </select>
          </div>

          <div className="group">
            <label className="block text-[9px] font-black text-cyber-silver/40 uppercase tracking-[0.4em] mb-4 ml-1">Asignación_Cliente</label>
            <select
              value={formData.client}
              required
              className="w-full bg-white/[0.02] border border-white/5 p-6 rounded-2xl text-white font-bold outline-none cursor-pointer focus:border-cyber-blue/30 transition-all duration-700"
              onChange={(e) => setFormData({ ...formData, client: e.target.value })}
            >
              <option value="">Selecciona un cliente</option>
              {clients.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* TIEMPO Y PRIORIDAD */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="group">
            <label className="block text-[9px] font-black text-cyber-silver/40 uppercase tracking-[0.4em] mb-4 ml-1">Nivel_Prioridad</label>
            <select
              value={formData.priority}
              className="w-full bg-white/[0.02] border border-white/5 p-6 rounded-2xl text-white font-bold outline-none cursor-pointer focus:border-cyber-blue/30 transition-all duration-700"
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            >
              <option value="low">Baja Prioridad</option>
              <option value="medium">Media (Estandar)</option>
              <option value="high">Alta (Crítica)</option>
            </select>
          </div>

          <div className="group">
            <label className="block text-[9px] font-black text-cyber-silver/40 uppercase tracking-[0.4em] mb-4 ml-1">Timeline_Due_Date</label>
            <input
              type="date"
              value={formData.dueDate}
              required
              className="w-full bg-white/[0.02] border border-white/5 p-6 rounded-2xl text-white font-bold outline-none focus:border-cyber-blue/30 transition-all duration-700"
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </div>
        </div>

        {/* BOTONES DE ACCIÓN FINAL */}
        <div className="flex flex-col md:flex-row gap-6 pt-10">
          <button
            type="button"
            onClick={() => navigate("/tareas")}
            className="flex-1 glass bg-white/[0.03] text-cyber-silver/40 py-6 rounded-2xl font-black uppercase text-[10px] tracking-[0.4em] hover:text-white transition-all duration-700"
          >
            Abortar_Cambios
          </button>
          <button
            type="submit"
            className="flex-1 bg-cyber-blue text-black py-6 rounded-2xl font-black uppercase text-[10px] tracking-[0.4em] shadow-[0_20px_40px_-10px_rgba(0,209,255,0.4)] hover:scale-[1.02] transition-all duration-700"
          >
            Ejecutar_Actualización
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTask;