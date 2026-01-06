import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(''); 
    const [priorityFilter, setPriorityFilter] = useState(''); 
    
    // 🟢 ESTADOS DE LA IA: Controlan el texto del consejo y la pantalla de carga
    const [aiAdvice, setAiAdvice] = useState(null); 
    const [isAiLoading, setIsAiLoading] = useState(false); 
    
    const navigate = useNavigate();

    // 🧠 Lógica de Urgencia: Marca tareas que vencen en menos de 48h
    const checkUrgency = (dueDate) => {
        if (!dueDate || dueDate === "") return false;
        const now = new Date();
        const taskDate = new Date(dueDate);
        if (isNaN(taskDate.getTime())) return false;
        const diffInHours = (taskDate - now) / (1000 * 60 * 60);
        return diffInHours < 48 && diffInHours > -24;
    }

    // 1. Carga inicial de tareas
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await api.get(`/tasks?search=${searchTerm}&priority=${priorityFilter}`);
                setTasks(res.data);
            } catch (error) {
                console.error("Error al traer tareas:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTasks();
    }, [searchTerm, priorityFilter]); 

    // 🟢 2. FUNCIÓN ASISTENTE IA: Pide el plan de acción a Groq
    const handleGetAIAdvice = async (taskId) => {
        setIsAiLoading(true); // Encendemos el cargando
        try {
            // Llamamos a la ruta del backend que usa Groq
            const res = await api.get(`/tasks/${taskId}/ai-advice`);
            setAiAdvice(res.data.advice); // Guardamos la respuesta
            toast.success("¡Estrategia lista Arturo! 🤖");
        } catch (error) {
            toast.error("La IA está descansando un momento.");
        } finally {
            setIsAiLoading(false); // Apagamos el cargando
        }
    };

    const pendingTasks = tasks.filter(t => t.status !== 'completed');

    const toggleComplete = async (id, currentStatus) => {
        try {
            const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
            await api.put(`/tasks/${id}`, { status: newStatus });
            setTasks(tasks.map(t => t._id === id ? { ...t, status: newStatus } : t));
        } catch (error) { toast.error("Error al actualizar"); }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Quieres eliminar esta tarea?')) {
            try {
                await api.delete(`/tasks/${id}`);
                setTasks(tasks.filter(t => t._id !== id));
                toast.success("Tarea eliminada");
            } catch (error) { toast.error("Error al borrar"); }
        }
    };

    if (loading) return <div className="p-20 text-center font-black text-gray-300 animate-pulse uppercase tracking-widest text-sm">Escaneando objetivos...</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto animate-fade-in space-y-10 relative">
            
            {/* CABECERA */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Mis Tareas</h1>
                    <p className="text-gray-500 font-medium text-lg">Control de objetivos con IA</p>
                </div>
                <button onClick={() => navigate('/tareas/nueva')} className="bg-brand text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-brand/20 hover:opacity-90 transition-all">
                    + Nueva Tarea
                </button>
            </div>

            {/* 🟢 MODAL IA: Muestra el plan generado */}
            {aiAdvice && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[50px] max-w-2xl w-full p-12 shadow-2xl relative animate-scale-up">
                        <button onClick={() => setAiAdvice(null)} className="absolute top-8 right-8 text-gray-400 hover:text-gray-900 text-2xl">✕</button>
                        <div className="flex items-center gap-3 mb-8">
                            <span className="text-2xl">✨</span>
                            <h2 className="text-3xl font-black text-gray-900">Plan Estratégico</h2>
                        </div>
                        <div className="bg-gray-50 p-8 rounded-[35px] border border-gray-100 max-h-[50vh] overflow-y-auto">
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line text-lg font-medium">{aiAdvice}</p>
                        </div>
                        <button onClick={() => setAiAdvice(null)} className="w-full mt-8 bg-gray-900 text-white py-5 rounded-[25px] font-black hover:bg-black transition-all">
                            ¡Entendido!
                        </button>
                    </div>
                </div>
            )}

            {/* 🟢 PANTALLA DE CARGA IA */}
            {isAiLoading && (
                <div className="fixed inset-0 bg-white/80 backdrop-blur-md z-[110] flex flex-col items-center justify-center">
                    <div className="w-20 h-20 border-8 border-brand border-t-transparent rounded-full animate-spin mb-6"></div>
                    <p className="font-black text-brand uppercase tracking-[0.3em] text-sm animate-pulse">Groq está analizando...</p>
                </div>
            )}

            {/* LISTADO */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pendingTasks.map((task) => {
                    const isUrgent = checkUrgency(task.dueDate);
                    return (
                        <div key={task._id} className={`group relative bg-white p-8 rounded-[45px] shadow-sm border transition-all duration-500 flex flex-col min-h-[350px] ${isUrgent ? 'border-urgent scale-[1.02]' : 'border-gray-100 hover:border-brand'}`}>
                            <div className="flex justify-between items-start mb-6">
                                <button onClick={() => toggleComplete(task._id, task.status)} className="w-10 h-10 rounded-xl border-2 border-gray-100 hover:border-green-500 hover:text-green-600 flex items-center justify-center font-bold text-xl transition-all">✓</button>
                                
                                {/* 🟢 Botón para pedir ayuda a Groq */}
                                <button onClick={() => handleGetAIAdvice(task._id)} className="bg-brand/10 text-brand px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand hover:text-white transition-all">
                                    ✨ Asistente IA
                                </button>
                            </div>
                            <h3 className="text-2xl font-black mb-3 text-gray-900">{task.title}</h3>
                            <p className="text-gray-400 font-medium text-sm line-clamp-3 flex-grow">{task.description}</p>
                            <div className="mt-auto pt-6 border-t border-gray-50 flex justify-between items-center">
                                <div className="text-[10px] font-black text-brand uppercase tracking-widest">
                                    📅 {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Sin fecha'}
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => navigate(`/tareas/editar/${task._id}`)} className="p-2 text-gray-300 hover:text-brand">✎</button>
                                    <button onClick={() => handleDelete(task._id)} className="p-2 text-gray-300 hover:text-red-500">🗑</button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Tasks;