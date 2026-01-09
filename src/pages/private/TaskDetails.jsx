// -------------------------------------------------------------------------
// 📂 ARCHIVO: src/pages/private/TaskDetails.jsx
// 📝 DESCRIPCIÓN: Vista detallada de objetivo con estética de informe táctico.
// -------------------------------------------------------------------------
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { toast } from "react-hot-toast";

const TaskDetails = () => {
  // 🧠 LÓGICA (INTACTA)
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiAdvice, setAiAdvice] = useState(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await api.get(`/tasks/${id}`);
        setTask(res.data);
      } catch (error) {
        toast.error("Tarea no encontrada");
        navigate("/tareas");
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id, navigate]);

  const getAIHelp = async () => {
    setIsAiLoading(true);
    try {
      const res = await api.get(`/tasks/${id}/ai-advice`);
      setAiAdvice(res.data.advice);
      toast.success("¡Estrategia lista!");
    } catch (error) {
      toast.error("La IA no pudo responder.");
    } finally {
      setIsAiLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center font-black text-cyber-blue animate-pulse uppercase tracking-[0.5em] text-[10px]">
        Sincronizando Archivos del Objetivo...
      </div>
    );
  if (!task) return null;

  return (
    // 🌌 ESCENARIO DE DETALLE
    <div className="space-y-12 reveal-premium max-w-6xl mx-auto pb-20">
      
      {/* --- CABECERA DE OPERACIONES (Navegación) --- */}
      <div className="flex justify-between items-center glass p-6 border-white/5">
        <button
          onClick={() => navigate(-1)}
          className="text-cyber-silver/40 hover:text-cyber-blue font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-4 transition-all duration-500 group"
        >
          <span className="group-hover:-translate-x-2 transition-transform duration-500">←</span> Volver al Listado
        </button>
        <button
          onClick={() => navigate(`/tareas/editar/${task._id}`)}
          className="glass bg-white/5 text-white px-8 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-cyber-blue hover:text-black transition-all duration-700"
        >
          Modificar Protocolo
        </button>
      </div>

      {/* --- EL NÚCLEO DEL INFORME (Ficha de Cristal) --- */}
      <div className="glass border-white/5 overflow-hidden">
        
        {/* 🏷️ Encabezado de Misión */}
        <div className="p-12 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-10 bg-white/[0.01]">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
               <div className="w-6 h-[1px] bg-cyber-blue"></div>
               <span className="text-[8px] font-black text-cyber-blue uppercase tracking-[0.4em]">Ref_ID: {task._id}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none italic">
              {task.title}
            </h1>
          </div>
          
          <div className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl ${
              task.status === "completed"
                ? "bg-green-500/10 text-green-400 border border-green-500/20"
                : "bg-cyber-blue/10 text-cyber-blue border border-cyber-blue/20"
            }`}>
            {task.status === "completed" ? "✓ Objetivo Finalizado" : "● Misión en Curso"}
          </div>
        </div>

        {/* 📊 MATRIZ DE DATOS (Grilla Técnica) */}
        <div className="p-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 bg-white/[0.01]">
          {[
            { label: "Asociado a", val: task.client?.name || "Sin Asignar", color: "text-white" },
            { label: "Prioridad", val: task.priority?.toUpperCase(), color: task.priority === "high" ? "text-red-500" : "text-cyber-blue" },
            { label: "Sector", val: task.category || "General", color: "text-white" },
            { label: "Cierre Estimado", val: task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "TBD", color: "text-white" }
          ].map((item, i) => (
            <div key={i} className="space-y-3">
              <p className="text-[8px] font-black text-cyber-silver/30 uppercase tracking-[0.4em]">{item.label}</p>
              <p className={`text-xl font-black tracking-tight ${item.color}`}>{item.val}</p>
            </div>
          ))}
        </div>

        {/* 📝 BLOQUES DE CONTENIDO (Descripción y Notas) */}
        <div className="p-12 grid grid-cols-1 lg:grid-cols-2 gap-12 border-t border-white/5">
          <div className="space-y-6">
            <h4 className="text-[9px] font-black text-cyber-blue uppercase tracking-[0.4em]">Descripción Operativa</h4>
            <div className="p-8 bg-white/[0.02] rounded-[30px] border border-white/5 min-h-[180px]">
              <p className="text-cyber-silver/70 text-base leading-relaxed font-medium">
                {task.description || "Sin descripción de entrada."}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-[9px] font-black text-cyber-purple uppercase tracking-[0.4em]">Especificaciones</h4>
            <div className="p-8 bg-white/[0.02] rounded-[30px] border border-white/5 min-h-[180px]">
              <p className="text-cyber-silver/70 text-base leading-relaxed font-medium whitespace-pre-line">
                {task.specifications || "No se han registrado variables técnicas adicionales."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- MÓDULO NEURAL (IA Estratégica) --- */}
      <div className="glass p-12 md:p-16 border-cyber-purple/20 bg-cyber-purple/[0.02] relative overflow-hidden group">
        {/* Luz ambiental púrpura */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyber-purple/10 blur-[130px] animate-pulse"></div>

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 mb-12">
            <div>
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-cyber-purple border border-cyber-purple/30 px-5 py-2 rounded-full">
                Neural_Core_Consultant
              </span>
              <h3 className="text-4xl font-black text-white mt-6 tracking-tighter italic">Plan de Ejecución IA</h3>
            </div>

            {!aiAdvice && !isAiLoading && (
              <button
                onClick={getAIHelp}
                className="bg-cyber-purple text-white px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-[0_20px_40px_-10px_rgba(157,0,255,0.4)] hover:scale-105 transition-all duration-700"
              >
                Generar Estrategia
              </button>
            )}
          </div>

          <div className="bg-black/40 p-10 rounded-[40px] border border-white/5 backdrop-blur-md">
            {isAiLoading ? (
              <div className="flex items-center gap-6 py-4">
                <div className="w-6 h-6 border-2 border-cyber-purple border-t-transparent rounded-full animate-spin"></div>
                <p className="font-black text-cyber-purple text-[9px] uppercase tracking-[0.4em] animate-pulse">
                  Procesando variables del mercado...
                </p>
              </div>
            ) : aiAdvice ? (
              <div className="reveal-premium">
                <p className="text-cyber-silver text-lg leading-relaxed italic font-medium">
                  "{aiAdvice}"
                </p>
              </div>
            ) : (
              <p className="text-cyber-silver/30 text-[10px] font-black uppercase tracking-[0.2em] italic py-4">
                Arturo, solicita una hoja de ruta estratégica para optimizar la resolución de este objetivo.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;