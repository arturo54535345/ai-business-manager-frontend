// -------------------------------------------------------------------------
// 📂 ARCHIVO: src/pages/private/AddTask.jsx
// 📝 DESCRIPCIÓN: Consola de despliegue de nuevos objetivos operativos.
// -------------------------------------------------------------------------
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { toast } from "react-hot-toast";

const AddTask = () => {
  const navigate = useNavigate();

  // 🧠 MEMORIA (INTACTA)
  const [formData, setFormData] = useState({
    title: "", description: "", specifications: "", client: "",
    priority: "medium", category: "Otro", dueDate: "",
    budget: 0, cost: 0
  });

  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);

  // 📡 CARGA DE ACTIVOS
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await api.get("/clients");
        setClients(res.data.clients || res.data);
      } catch (error) {
        toast.error("Error en el enlace de red.");
      }
    };
    fetchClients();
  }, []);

  // 🚀 PROTOCOLO DE ENVÍO
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.client) return toast.error("Arturo, asigna un activo (cliente).");

    setLoading(true);
    try {
      await api.post("/tasks", formData);
      toast.success("Misión inyectada al sistema", {
        style: { background: '#030303', color: '#00D1FF', border: '1px solid rgba(0,209,255,0.1)' }
      });
      navigate("/tareas");
    } catch (error) {
      toast.error("Fallo en la escritura de datos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // 🌌 ESCENARIO DE CREACIÓN
    <div className="max-w-4xl mx-auto space-y-12 reveal-premium pb-20">
      
      {/* --- CABECERA TÉCNICA --- */}
      <header className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-[2px] bg-cyber-blue opacity-50"></div>
          <span className="text-[9px] font-black text-cyber-blue uppercase tracking-[0.4em]">New_Mission_Protocol</span>
        </div>
        <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter italic">
          Nueva <span className="text-cyber-blue">Tarea</span>
        </h1>
        <p className="text-cyber-silver/40 font-medium italic text-lg max-w-xl">
          Configura los parámetros tácticos y financieros del nuevo objetivo operativo.
        </p>
      </header>

      {/* --- CONSOLA DE DATOS (Panel de Cristal) --- */}
      <form onSubmit={handleSubmit} className="glass p-12 md:p-16 border-white/5 space-y-12">
        
        {/* IDENTIFICADOR DE MISIÓN */}
        <div className="group">
          <label className="block text-[8px] font-black text-white/20 uppercase mb-4 ml-1 tracking-[0.4em] group-focus-within:text-cyber-blue transition-colors duration-500">
            Título_de_la_Operación
          </label>
          <input
            type="text"
            required
            placeholder="Ej: Protocolo de Expansión VIP..."
            className="w-full bg-white/[0.02] border border-white/5 p-6 rounded-2xl text-white outline-none focus:border-cyber-blue/30 focus:bg-white/[0.05] transition-all duration-700 font-bold text-xl placeholder:text-white/5"
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        {/* 💰 MÓDULO DE INTELIGENCIA FINANCIERA
            Lógica: Usamos un fondo levemente azulado para indicar que aquí se mueve dinero. */}
        <div className="glass bg-cyber-blue/[0.01] p-10 border-cyber-blue/10 rounded-[40px] space-y-10 relative overflow-hidden">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 bg-cyber-blue rounded-full animate-ping"></div>
             <p className="text-[9px] font-black text-cyber-blue uppercase tracking-[0.3em]">Cálculo_Financiero_Proyectado</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Presupuesto */}
            <div className="space-y-3">
              <label className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em] ml-2">Presupuesto_In (Recibo)</label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full bg-black/40 border border-white/5 p-5 rounded-2xl text-white outline-none focus:border-cyber-blue/40 font-black text-2xl tracking-tighter transition-all"
                  onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-cyber-blue/20">€</span>
              </div>
            </div>

            {/* Coste */}
            <div className="space-y-3">
              <label className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em] ml-2">Coste_Out (Inversión)</label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full bg-black/40 border border-white/5 p-5 rounded-2xl text-white outline-none focus:border-red-500/40 font-black text-2xl tracking-tighter transition-all"
                  onChange={(e) => setFormData({ ...formData, cost: Number(e.target.value) })}
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-red-500/20">€</span>
              </div>
            </div>
          </div>
          <p className="text-[8px] text-cyber-silver/20 uppercase tracking-widest italic px-2">
            * El margen neto se sincronizará automáticamente en el centro financiero.
          </p>
        </div>

        {/* ASIGNACIÓN Y SECTOR */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-3">
            <label className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em] ml-2">Activo_Asociado (Cliente)</label>
            <select
              required
              className="w-full bg-white/[0.02] border border-white/5 p-6 rounded-2xl text-white font-bold outline-none cursor-pointer focus:border-cyber-blue/30 transition-all duration-700"
              onChange={(e) => setFormData({ ...formData, client: e.target.value })}
            >
              <option value="">Seleccionar_ID_Cliente</option>
              {clients.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            <label className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em] ml-2">Tipo_de_Operación</label>
            <select
              className="w-full bg-white/[0.02] border border-white/5 p-6 rounded-2xl text-white font-bold outline-none cursor-pointer focus:border-cyber-blue/30 transition-all duration-700"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="Otro">General</option>
              <option value="Llamada">Llamada</option>
              <option value="Reunión">Reunión</option>
              <option value="Email">Email</option>
              <option value="Catering">Catering</option>
            </select>
          </div>
        </div>

        {/* PRIORIDAD Y TIEMPO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-3">
            <label className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em] ml-2">Nivel_de_Urgencia</label>
            <select
              className="w-full bg-white/[0.02] border border-white/5 p-6 rounded-2xl text-white font-bold outline-none cursor-pointer focus:border-cyber-blue/30 transition-all duration-700"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            >
              <option value="low">Prioridad Baja</option>
              <option value="medium">Media (Estandar)</option>
              <option value="high">Crítica (Prioridad Alfa)</option>
            </select>
          </div>
          <div className="space-y-3">
            <label className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em] ml-2">Timeline_Due_Date</label>
            <input
              type="date"
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
            Abortar_Protocolo
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-cyber-blue text-black py-6 rounded-2xl font-black uppercase text-[10px] tracking-[0.4em] shadow-[0_20px_40px_-10px_rgba(0,209,255,0.4)] hover:scale-[1.02] transition-all duration-700"
          >
            {loading ? "Sincronizando..." : "Ejecutar_Despliegue"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTask;