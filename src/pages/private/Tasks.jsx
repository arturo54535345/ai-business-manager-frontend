import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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

    const handleDelete = async (id) => {
        if (window.confirm('¿Quieres eliminar esta tarea?')) {
            try {
                await api.delete(`/tasks/${id}`);
                setTasks(tasks.filter(t => t._id !== id));
            } catch (error) {
                alert("Error al borrar la tarea");
            }
        }
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Mis Tareas</h1>
                    <p className="text-gray-500">Organiza tu día a día</p>
                </div>
                <button 
                    onClick={() => navigate('/tareas/nueva')}
                    className="bg-indigo-600 text-white px-5 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                >
                    + Nueva Tarea
                </button>
            </div>

            {loading ? (
                <p>Cargando tus tareas...</p>
            ) : tasks.length === 0 ? (
                <div className="bg-white p-10 rounded-3xl border border-dashed border-gray-300 text-center">
                    <p className="text-gray-500">No tienes tareas pendientes. ¡Buen trabajo!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {tasks.map((task) => (
                        <div key={task._id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex justify-between items-start">
                            <div>
                                <h3 className={`text-xl font-bold ${task.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                                    {task.title}
                                </h3>
                                <p className="text-gray-500 mt-1">{task.description}</p>
                                {task.dueDate && (
                                    <p className="text-xs font-semibold text-indigo-600 mt-3 uppercase tracking-wider">
                                        📅 Fecha: {new Date(task.dueDate).toLocaleDateString()}
                                    </p>
                                )}
                            </div>
                            
                            <button 
                                onClick={() => handleDelete(task._id)}
                                className="text-gray-300 hover:text-red-500 transition-colors p-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Tasks;