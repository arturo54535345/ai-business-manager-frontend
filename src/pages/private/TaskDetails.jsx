import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { toast } from "react-hot-toast";

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiAdvice, setAiAdvice] = useState(null);
  const [isAiLoading, setAiLoading] = useState(false);

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
      <div className="p-20 text-center font-black text-gray-300 animate-pulse uppercase">
        Cargando...
      </div>
    );
  if (!task) return null;

  return (
    <div className="p-8 max-w-5xl mx-auto animate-fade-in space-y-8">
      {/* --- CABECERA DE ACCIONES --- */}
      <div className="flex justify-between items-center bg-white p-6 rounded-[30px] shadow-sm border border-gray-100">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-brand font-black text-xs uppercase tracking-widest flex items-center gap-2"
        >
          ← Volver
        </button>
        <div className="flex gap-4">
          <button
            onClick={() => navigate(`/tareas/editar/${task._id}`)}
            className="bg-gray-100 text-gray-600 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all"
          >
            ✎ Modificar Datos
          </button>
        </div>
      </div>

      {/* --- CUERPO PRINCIPAL: LA FICHA TÉCNICA --- */}
      <div className="bg-white rounded-[50px] shadow-sm border border-gray-100 overflow-hidden">
        {/* 🏷️ Encabezado con Título y Estado */}
        <div className="p-10 border-b border-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gray-50/30">
          <div>
            <h1 className="text-4xl font-black text-gray-900 leading-tight mb-2">
              {task.title}
            </h1>
            <p className="text-gray-400 font-medium">
              Referencia de sistema:{" "}
              <span className="font-mono text-xs">{task._id}</span>
            </p>
          </div>
          <div
            className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-sm ${
              task.status === "completed"
                ? "bg-green-500 text-white"
                : "bg-yellow-400 text-white"
            }`}
          >
            {task.status === "completed"
              ? "✓ Objetivo Cumplido"
              : " En Proceso"}
          </div>
        </div>

        {/* 📊 SECCIÓN DE PARÁMETROS (Grilla de datos) */}
        <div className="p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Parámetro: Cliente */}
          <div className="space-y-1">
            <p className="text-[10px] font-black text-brand uppercase tracking-widest">
              Asociado a:
            </p>
            <p className="text-lg font-black text-gray-800">
              {task.client?.name || "Cliente Particular"}
            </p>
          </div>

          {/* Parámetro: Prioridad */}
          <div className="space-y-1">
            <p className="text-[10px] font-black text-brand uppercase tracking-widest">
              Prioridad:
            </p>
            <p
              className={`text-lg font-black ${
                task.priority === "high"
                  ? "text-red-500"
                  : task.priority === "medium"
                  ? "text-yellow-600"
                  : "text-green-500"
              }`}
            >
              {task.priority === "high"
                ? " ALTA"
                : task.priority === "medium"
                ? " MEDIA"
                : " BAJA"}
            </p>
          </div>

          {/* Parámetro: Categoría */}
          <div className="space-y-1">
            <p className="text-[10px] font-black text-brand uppercase tracking-widest">
              Tipo de Tarea:
            </p>
            <p className="text-lg font-black text-gray-800">
              {task.category || "General"}
            </p>
          </div>

          {/* Parámetro: Fecha Límite */}
          <div className="space-y-1">
            <p className="text-[10px] font-black text-brand uppercase tracking-widest">
              Fecha de Cierre:
            </p>
            <p className="text-lg font-black text-gray-800">
              {" "}
              {task.dueDate
                ? new Date(task.dueDate).toLocaleDateString()
                : "Sin definir"}
            </p>
          </div>
        </div>

        {/* 📝 SECCIÓN DE CONTENIDO (Descripción y Notas) */}
        <div className="p-10 grid grid-cols-1 lg:grid-cols-2 gap-10 border-t border-gray-50">
          <div>
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">
              Descripción del Objetivo
            </h4>
            <div className="p-8 bg-gray-50/50 rounded-[35px] border border-gray-100 min-h-[150px]">
              <p className="text-gray-600 font-medium leading-relaxed">
                {task.description ||
                  "No se han añadido descripciones a este objetivo."}
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">
              Especificaciones Técnicas
            </h4>
            <div className="p-8 bg-gray-50/50 rounded-[35px] border border-gray-100 min-h-[150px]">
              <p className="text-gray-600 text-sm whitespace-pre-line leading-relaxed font-medium">
                {task.specifications ||
                  "Sin especificaciones técnicas registradas."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- SECCIÓN ESTRATÉGICA (Inteligencia Artificial) --- */}
      <div className="bg-gray-900 p-12 rounded-[55px] shadow-2xl relative overflow-hidden text-white border border-white/5">
        {/* Efecto de luz decorativo */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand opacity-10 blur-[130px]"></div>

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] bg-brand/20 text-brand px-5 py-2 rounded-full border border-brand/30">
                Motor Estratégico IA
              </span>
              <h3 className="text-3xl font-black mt-4">Plan de Ejecución</h3>
            </div>

            {!aiAdvice && !isAiLoading && (
              <button
                onClick={getAIHelp}
                className="bg-brand text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand/20"
              >
                Pide una estrategia
              </button>
            )}
          </div>

          <div className="bg-white/5 p-8 rounded-[40px] border border-white/10">
            {isAiLoading ? (
              <div className="flex items-center gap-4 py-6">
                <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
                <p className="font-black text-brand text-xs uppercase tracking-[0.3em] animate-pulse">
                  Groq está procesando la información...
                </p>
              </div>
            ) : aiAdvice ? (
              <p className="text-gray-300 text-lg leading-relaxed italic whitespace-pre-line font-medium">
                "{aiAdvice}"
              </p>
            ) : (
              <p className="text-gray-500 text-sm italic py-4">
                Arturo, solicita un plan estratégico para optimizar este
                objetivo.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
