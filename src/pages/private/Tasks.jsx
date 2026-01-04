import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Tasks = () => {
    // 1. ESTADOS (Nuestras cajas de memoria)
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(''); // Para buscar por título
    const [priorityFilter, setPriorityFilter] = useState(''); // Para filtrar por color/importancia
    
    const navigate = useNavigate();

    // 2. LÓGICA DE CARGA E INTELIGENCIA DE FILTRADO
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                // Enviamos los filtros al servidor (Backend) a través de la URL
                const res = await api.get(`/tasks?search=${searchTerm}&priority=${priorityFilter}`);
                setTasks(res.data);
            } catch (error) {
                console.error("Error al traer tareas:", error);
            } finally {
                setLoading(false);
            }
        };
        
        // Se activa cada vez que escribes en el buscador o cambias la prioridad
        fetchTasks();
    }, [searchTerm, priorityFilter]); 

    // 3. SEPARACIÓN LÓGICA: Para saber qué botones mostrar
    const pendingTasks = tasks.filter(t => t.status !== 'completed');
    const hasHistory = tasks.some(t => t.status === 'completed');

    // 4. FUNCIONES DE ACCIÓN
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

    if (loading) return <p className="p-10 text-center font-bold text-gray-400">Organizando tus pendientes...</p>;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            
            {/* CABECERA INTELIGENTE */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900">Mis Tareas</h1>
                    <p className="text-gray-500">Gestiona tus objetivos y prioridades</p>
                </div>
                
                <div className="flex items-center gap-4">
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

            {/* --- SECCIÓN DE BÚSQUEDA Y FILTROS --- */}
            <div className="flex flex-col md:flex-row gap-4 mb-10">
                {/* BUSCADOR POR NOMBRE */}
                <div className="flex-grow relative">
                    <input 
                        type="text"
                        placeholder="Buscar tarea por título..."
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <span className="absolute left-4 top-4 text-xl">🔍</span>
                </div>

                {/* FILTRO POR PRIORIDAD */}
                <select 
                    className="px-6 py-4 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm bg-white font-bold text-gray-600 cursor-pointer"
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                >
                    <option value="">Todas las Prioridades</option>
                    <option value="high">🔴 Alta</option>
                    <option value="medium">🟡 Media</option>
                    <option value="low">🟢 Baja</option>
                </select>
            </div>

            {/* LISTADO DE TAREAS PENDIENTES */}
            {pendingTasks.length === 0 ? (
                <div className="bg-white p-16 rounded-[40px] border-2 border-dashed border-gray-100 text-center">
                    <p className="text-gray-400 text-xl font-medium">No se encontraron tareas con estos filtros. ¡Relájate! ☕</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {pendingTasks.map((task) => (
                        <div 
                            key={task._id} 
                            className="group relative bg-white p-7 rounded-[32px] shadow-sm border border-gray-100 hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-50 transition-all duration-300"
                        >
                            {/* BOTONES SUPERIORES (Completar, Editar, Borrar) */}
                            <div className="flex justify-between items-start mb-4">
                                <button 
                                    onClick={() => toggleComplete(task._id, task.status)}
                                    className="w-8 h-8 rounded-full border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all flex items-center justify-center text-transparent hover:text-green-600 font-bold"
                                    title="Marcar como completada"
                                >
                                    ✓
                                </button>
                                
                                <div className="flex gap-1">
                                    <button 
                                        onClick={() => navigate(`/tareas/editar/${task._id}`)}
                                        className="p-2 text-gray-300 hover:text-blue-600 transition-colors"
                                        title="Editar detalles"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                        </svg>
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(task._id)}
                                        className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                                        title="Eliminar permanentemente"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* CONTENIDO PRINCIPAL */}
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{task.title}</h3>
                            <p className="text-gray-500 text-sm line-clamp-2 mb-4">{task.description}</p>
                            
                            <div className="flex items-center justify-between mt-auto">
                                {task.dueDate && (
                                    <div className="flex items-center gap-2 text-blue-600 font-bold text-[10px] uppercase tracking-widest">
                                        <span>📅</span> {new Date(task.dueDate).toLocaleDateString()}
                                    </div>
                                )}
                                <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-md ${
                                    task.priority === 'high' ? 'bg-red-50 text-red-600' :
                                    task.priority === 'medium' ? 'bg-yellow-50 text-yellow-700' :
                                    'bg-green-50 text-green-600'
                                }`}>
                                    {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Media' : 'Baja'}
                                </span>
                            </div>

                            {/* --- EFECTO HOVER: TARJETA DE DETALLES PROFESIONAL --- */}
                            <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 absolute z-20 -bottom-2 translate-y-full left-0 right-0 bg-gray-900 text-white p-6 rounded-[24px] shadow-2xl transition-all duration-300 transform scale-95 group-hover:scale-100">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-[10px] bg-blue-600 px-2 py-0.5 rounded-full font-black uppercase">Ficha Técnica IA</span>
                                    <span className="text-blue-300 text-[10px] font-bold">{task.client?.name || 'Sin cliente'}</span>
                                </div>
                                <p className="text-xs leading-relaxed text-gray-300 italic mb-4">
                                    "{task.specifications || 'No hay especificaciones adicionales para esta tarea.'}"
                                </p>
                                <div className="pt-3 border-t border-gray-800 text-[9px] text-gray-500 flex justify-between uppercase font-bold tracking-tighter">
                                    <span>Sistema: AI-MANAGER-V1</span>
                                    <span>ID: {task._id.slice(-6)}</span>
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