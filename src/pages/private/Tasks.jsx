import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // 1. CARGA DE DATOS
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await api.get('/tasks');
                setTasks(res.data);
            } catch (error) {
                console.error("Error al traer tareas:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTasks();
    }, []);

    // 2. LÓGICA DE FILTRADO: Solo mostramos las pendientes en esta pantalla
    const pendingTasks = tasks.filter(t => t.status !== 'completed');
    const hasHistory = tasks.some(t => t.status === 'completed');

    const handleDelete = async (id) => {
        if (window.confirm('¿Quieres eliminar esta tarea?')) {
            try {
                await api.delete(`/tasks/${id}`);
                setTasks(tasks.filter(t => t._id !== id));
                toast.success("Tarea eliminada correctamente");
            } catch (error) {
                toast.error("Error al borrar la tarea");
            }
        }
    };

    const toggleComplete = async (id, currentStatus) => {
        try {
            const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
            await api.put(`/tasks/${id}`, { status: newStatus });
            setTasks(tasks.map(t => t._id === id ? { ...t, status: newStatus } : t));
            
            if (newStatus === 'completed') {
                toast.success("¡Tarea completada! Enviada al registro.");
            }
        } catch (error) {
            toast.error("No se pudo actualizar la tarea");
        }
    };

    if (loading) return <p className="p-10 text-center font-bold">Cargando tus tareas...</p>;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* CABECERA INTELIGENTE */}
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900">Mis Tareas</h1>
                    <p className="text-gray-500">Gestiona tus objetivos pendientes</p>
                </div>
                
                <div className="flex items-center gap-4">
                    {/* El botón de registro solo sale si hay algo que ver */}
                    {hasHistory && (
                        <button 
                            onClick={() => navigate('/tareas/completadas')}
                            className="bg-gray-100 text-gray-600 px-6 py-3 rounded-2xl font-bold hover:bg-gray-200 transition-all border border-gray-200"
                        >
                            Ver Registro ✅
                        </button>
                    )}

                    <button 
                        onClick={() => navigate('/tareas/nueva')}
                        className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all"
                    >
                        + Nueva Tarea
                    </button>
                </div>
            </div>

            {/* LISTADO DE TAREAS PENDIENTES */}
            {pendingTasks.length === 0 ? (
                <div className="bg-white p-16 rounded-[40px] border-2 border-dashed border-gray-100 text-center">
                    <p className="text-gray-400 text-xl font-medium">No tienes tareas pendientes. ¡Día libre! ☕</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {pendingTasks.map((task) => (
                        <div 
                            key={task._id} 
                            className="group relative bg-white p-7 rounded-[32px] shadow-sm border border-gray-100 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-50 transition-all duration-300"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <button 
                                    onClick={() => toggleComplete(task._id, task.status)}
                                    className="w-7 h-7 rounded-full border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all flex items-center justify-center text-transparent hover:text-green-600"
                                >
                                    ✓
                                </button>
                                
                                <div className="flex gap-1">
                                    <button 
                                        onClick={() => navigate(`/tareas/editar/${task._id}`)}
                                        className="p-2 text-gray-300 hover:text-blue-600 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                        </svg>
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(task._id)}
                                        className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-2">{task.title}</h3>
                            <p className="text-gray-500 text-sm line-clamp-2">{task.description}</p>
                            
                            {task.dueDate && (
                                <div className="mt-6 flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest">
                                    <span>📅</span> {new Date(task.dueDate).toLocaleDateString()}
                                </div>
                            )}

                            {/* --- EFECTO HOVER: TARJETA DE DETALLES --- */}
                            <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 absolute z-20 -bottom-2 translate-y-full left-0 right-0 bg-gray-900 text-white p-6 rounded-3xl shadow-2xl transition-all duration-300 transform scale-95 group-hover:scale-100">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-[10px] bg-blue-600 px-2 py-0.5 rounded-full font-black uppercase">Expediente IA</span>
                                    <span className="text-gray-400 text-[10px]">{task.client?.name || 'Sin cliente'}</span>
                                </div>
                                <p className="text-xs leading-relaxed text-gray-300 italic">
                                    "{task.specifications || 'No hay especificaciones adicionales para esta tarea.'}"
                                </p>
                                <div className="mt-4 pt-3 border-t border-gray-800 flex justify-between items-center text-[10px]">
                                    <span className="text-gray-500">Prioridad: {task.priority}</span>
                                    <span className="text-blue-400">ID: {task._id.slice(-5)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Tasks;