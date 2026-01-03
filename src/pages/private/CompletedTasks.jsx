import { useState, useEffect } from "react";
import api from '../../api/axios';
import { useNavigate } from "react-router-dom";

const CompletedTasks = () =>{
    const [CompletedTasks, setCompletedTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(()=>{
        const fetchCompleted = async () =>{
            try{
                const res = await api.get('/tasks');
                const filtered = res.data.filter(t => t.status === 'completed');
                setCompletedTasks(filtered);
            }catch(error){
                console.error("Error al cargar el registro", error);
            }finally{
                setLoading(false);
            }
        };
        fetchCompleted();
    }, []);

    if(loading) return <p className="p-10 text-center">Cargando registro...</p>;

    return(
        <div className="p-8 max-w-5xl mx-auto">
            <header className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Registro de Tareas</h1>
                    <p className="text-gray-500">Historial de objetivos completados</p>
                </div>
                <button 
                    onClick={() => navigate('/tareas')}
                    className="bg-gray-100 text-gray-600 px-5 py-2 rounded-xl font-bold hover:bg-gray-200 transition-all"
                >
                    ← Volver a Tareas
                </button>
            </header>

            <div className="space-y-4">
                {completedTasks.length === 0 ? (
                    <div className="bg-white p-10 rounded-3xl border border-dashed border-gray-300 text-center text-gray-400">
                        Aún no has completado ninguna tarea. ¡A por ello!
                    </div>
                ) : (
                    completedTasks.map(task => (
                        <div key={task._id} className="bg-white p-6 rounded-2xl border border-gray-100 flex justify-between items-center opacity-75 shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
                                    ✓
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 line-through">{task.title}</h3>
                                    <p className="text-xs text-gray-400">Completada el: {new Date(task.updatedAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
export default CompletedTasks;