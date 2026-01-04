import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(''); 
    const [priorityFilter, setPriorityFilter] = useState(''); 
    
    const navigate = useNavigate();

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

    if (loading) return <p className="p-10 text-center font-bold text-gray-400 animate-pulse uppercase tracking-widest">Organizando tus pendientes...</p>;

    return (
        <div className="p-8 max-w-7xl mx-auto animate-fade-in">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Mis Tareas</h1>
                    <p className="text-gray-500 font-medium">Gestiona tus objetivos y prioridades</p>
                </div>
                
                <div className="flex items-center gap-4">
                    {hasHistory && (
                        <button 
                            onClick={() => navigate('/tareas/completadas')}
                            className="bg-white text-gray-600 px-6 py-3 rounded-2xl font-bold hover:bg-gray-50 transition-all border border-gray-100 shadow-sm"
                        >
                            Ver Registro ✅
                        </button>
                    )}
                    {/* NOTA: bg-brand para color dinámico y shadow-brand/20 para brillo suave */}
                    <button 
                        onClick={() => navigate('/tareas/nueva')}
                        className="bg-brand text-white px-6 py-3 rounded-2xl font-black shadow-xl shadow-brand/20 hover:opacity-90 transition-all"
                    >
                        + Nueva Tarea
                    </button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-10">
                <div className="flex-grow relative">
                    {/* NOTA: focus:ring-brand para que el borde brille con tu color */}
                    <input 
                        type="text"
                        placeholder="Buscar tarea por título..."
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-brand outline-none shadow-sm transition-all bg-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <span className="absolute left-4 top-4.5 text-xl opacity-40">🔍</span>
                </div>

                <select 
                    className="px-6 py-4 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-brand outline-none shadow-sm bg-white font-bold text-gray-600 cursor-pointer"
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                >
                    <option value="">Todas las Prioridades</option>
                    <option value="high">🔴 Alta</option>
                    <option value="medium">🟡 Media</option>
                    <option value="low">🟢 Baja</option>
                </select>
            </div>

            {pendingTasks.length === 0 ? (
                <div className="bg-white p-16 rounded-[40px] border-2 border-dashed border-gray-100 text-center">
                    <p className="text-gray-400 text-xl font-medium">No se encontraron tareas. ¡Relájate! ☕</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {pendingTasks.map((task) => (
                        /* NOTA: hover:border-brand y sombra dinámica */
                        <div 
                            key={task._id} 
                            className="group relative bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 hover:border-brand hover:shadow-2xl hover:shadow-brand/10 transition-all duration-500 flex flex-col min-h-[300px]"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <button 
                                    onClick={() => toggleComplete(task._id, task.status)}
                                    className="w-9 h-9 rounded-xl border-2 border-gray-100 hover:border-green-500 hover:bg-green-50 transition-all flex items-center justify-center text-transparent hover:text-green-600 font-bold text-xl"
                                    title="Completar"
                                >
                                    ✓
                                </button>
                                
                                <div className="flex gap-1">
                                    {/* NOTA: Color de marca al pasar el ratón */}
                                    <button 
                                        onClick={() => navigate(`/tareas/editar/${task._id}`)}
                                        className="p-2 text-gray-300 hover:text-brand transition-colors"
                                        title="Editar"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                        </svg>
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(task._id)}
                                        className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                                        title="Eliminar"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-2xl font-black text-gray-900 mb-3 group-hover:text-brand transition-colors">{task.title}</h3>
                            <p className="text-gray-400 font-medium text-sm line-clamp-3 mb-6 flex-grow">{task.description}</p>
                            
                            <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                                {task.dueDate && (
                                    <div className="flex items-center gap-2 text-brand font-black text-[10px] uppercase tracking-widest">
                                        <span>📅</span> {new Date(task.dueDate).toLocaleDateString()}
                                    </div>
                                )}
                                <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full tracking-wider ${
                                    task.priority === 'high' ? 'bg-red-50 text-red-600' :
                                    task.priority === 'medium' ? 'bg-yellow-50 text-yellow-700' :
                                    'bg-green-50 text-green-600'
                                }`}>
                                    {task.priority === 'high' ? 'Prioridad Alta' : task.priority === 'medium' ? 'Prioridad Media' : 'Prioridad Baja'}
                                </span>
                            </div>

                            <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 absolute z-20 -bottom-4 translate-y-full left-0 right-0 bg-gray-900 text-white p-8 rounded-[40px] shadow-2xl transition-all duration-500 transform scale-95 group-hover:scale-100 border border-white/5">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-[10px] bg-brand/20 text-brand px-3 py-1 rounded-full font-black uppercase border border-brand/30 tracking-widest">IA Insight</span>
                                    <span className="text-gray-400 text-[10px] font-bold uppercase">{task.client?.name || 'Gestión Libre'}</span>
                                </div>
                                <p className="text-sm leading-relaxed text-gray-300 italic mb-6">
                                    "{task.specifications || 'Optimizando flujo de trabajo para este objetivo específico.'}"
                                </p>
                                <div className="pt-4 border-t border-white/10 text-[9px] text-gray-500 flex justify-between uppercase font-bold tracking-widest">
                                    <span>Status: Active</span>
                                    <span>Ref: {task._id.slice(-6)}</span>
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