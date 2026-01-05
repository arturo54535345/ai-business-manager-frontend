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

    // 🟢 EL DETECTIVE DE URGENCIA
    const checkUrgency = (dueDate) => {
        if (!dueDate || dueDate === "") return false;

        const now = new Date();
        const taskDate = new Date(dueDate);

        if (isNaN(taskDate.getTime())) return false;

        // CORRECCIÓN: 1000 milisegundos = 1 segundo. Tú tenías 100.
        const diffInHours = (taskDate - now) / (1000 * 60 * 60);

        // Regla: Urgente si falta menos de 2 días y no ha pasado más de 1 día de la fecha
        return diffInHours < 48 && diffInHours > -24;
    };

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

    // Función para borrar (Recuperada)
    const handleDelete = async (id) => {
        if (window.confirm('¿Quieres eliminar esta tarea?')) {
            try {
                await api.delete(`/tasks/${id}`);
                setTasks(tasks.filter(t => t._id !== id));
                toast.success("Tarea eliminada");
            } catch (error) { toast.error("Error al borrar"); }
        }
    };

    const toggleComplete = async (id, currentStatus) => {
        try {
            const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
            await api.put(`/tasks/${id}`, { status: newStatus });
            setTasks(tasks.map(t => t._id === id ? { ...t, status: newStatus } : t));
            if (newStatus === 'completed') toast.success("¡Objetivo cumplido! 🚀");
        } catch (error) { toast.error("Error al actualizar"); }
    };

    if (loading) return <div className="p-20 text-center font-black text-gray-300 animate-pulse uppercase tracking-widest">Analizando prioridades...</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto animate-fade-in space-y-10">
            
            {/* 1. CABECERA */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Mis Tareas</h1>
                    <p className="text-gray-500 font-medium text-lg">Control de objetivos en tiempo real</p>
                </div>
                <div className="flex gap-3">
                    {hasHistory && (
                        <button onClick={() => navigate('/tareas/completadas')} className="bg-white text-gray-600 px-6 py-4 rounded-2xl font-bold border border-gray-100 shadow-sm hover:bg-gray-50 transition-all">
                            Historial ✅
                        </button>
                    )}
                    <button onClick={() => navigate('/tareas/nueva')} className="bg-brand text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-brand/20 hover:opacity-90 transition-all">
                        + Nueva Tarea
                    </button>
                </div>
            </div>

            {/* 2. BARRA DE BÚSQUEDA Y FILTROS (Recuperada) */}
            <div className="flex flex-col md:flex-row gap-4 mb-10">
                <div className="flex-grow relative">
                    <input 
                        type="text"
                        placeholder="Buscar tarea..."
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-brand outline-none bg-white shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <span className="absolute left-4 top-4.5 text-xl opacity-40">🔍</span>
                </div>
                <select 
                    className="px-6 py-4 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-brand outline-none bg-white font-bold text-gray-600 cursor-pointer shadow-sm"
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                >
                    <option value="">Todas las Prioridades</option>
                    <option value="high">🔴 Alta</option>
                    <option value="medium">🟡 Media</option>
                    <option value="low">🟢 Baja</option>
                </select>
            </div>

            {/* 3. LISTADO DE TAREAS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pendingTasks.map((task) => {
                    const isUrgent = checkUrgency(task.dueDate);

                    return (
                        <div 
                            key={task._id} 
                            className={`group relative bg-white p-8 rounded-[45px] shadow-sm border transition-all duration-500 flex flex-col min-h-[350px] 
                                ${isUrgent ? 'border-urgent scale-[1.02]' : 'border-gray-100 hover:border-brand'}
                            `}
                        >
                            {/* Icono Alerta */}
                            {isUrgent && (
                                <div className="absolute -top-4 -left-4 bg-red-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg animate-bounce z-10 text-xl border-4 border-white">
                                    ⚠️
                                </div>
                            )}

                            <div className="flex justify-between items-start mb-6">
                                <button 
                                    onClick={() => toggleComplete(task._id, task.status)}
                                    className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center font-bold text-xl transition-all
                                        ${isUrgent ? 'border-red-200 text-red-600 bg-red-50 hover:bg-red-600 hover:text-white' : 'border-gray-100 hover:border-green-500 hover:text-green-600'}
                                    `}
                                >
                                    ✓
                                </button>
                                
                                {/* Botones Editar/Borrar */}
                                <div className="flex gap-1">
                                    <button onClick={() => navigate(`/tareas/editar/${task._id}`)} className="p-2 text-gray-300 hover:text-brand transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                        </svg>
                                    </button>
                                    <button onClick={() => handleDelete(task._id)} className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <h3 className={`text-2xl font-black mb-3 transition-colors ${isUrgent ? 'text-red-600' : 'text-gray-900 group-hover:text-brand'}`}>
                                {task.title}
                            </h3>
                            <p className="text-gray-400 font-medium text-sm line-clamp-3 mb-8 flex-grow">{task.description}</p>
                            
                            <div className={`flex items-center justify-between pt-6 border-t ${isUrgent ? 'border-red-100' : 'border-gray-50'}`}>
                                <div className={`flex items-center gap-2 font-black text-[10px] uppercase tracking-widest ${isUrgent ? 'text-red-600 animate-pulse' : 'text-brand'}`}>
                                    <span>📅</span> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Sin fecha'}
                                    {isUrgent && <span className="ml-2 bg-red-600 text-white px-2 py-0.5 rounded shadow-sm">¡Prioridad!</span>}
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