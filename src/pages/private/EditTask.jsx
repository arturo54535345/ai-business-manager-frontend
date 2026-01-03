import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from '../../api/axios';

const EditTask = () =>{
    const {id} = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title:'',
        description:'',
        priority:'',
        dueDate:'',
        client:'',
    });
    const [clients, setClients] = useState([]);//para el despliegue de clientes
    const [loading, setLoading] = useState(true);

    useEffect(()=> {
        const fetchData = async () =>{
            try{
                //cuando entro busca la tarea actual y la lista de clientes
                const [taskRes, clientesRes] = await Promise.all([
                    api.get(`/tasks/${id}`),
                    api.get('/clients')
                ]);
                //rellenamos el formulario con lo que ya existe en la base de datos 
                const task = taskRes.data;
                setFormData({
                    title: task.title,
                    description: task.description || '',
                    priority: task.priority,
                    dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',//limpio la fecha
                    client: task.client?._id || task.client
                });
                setClients(clientesRes.data.clients || clientesRes.data || []);
            }catch(error){
                console.error("Error al editar", error);
                navigate('/tareas');
            }finally{
                setLoading(false);
            }
        };
        fetchData();
    }, [id, navigate]);

    const handleSubmit = async (e) =>{
        e.preventDefault();
        try{
            //sobre escribo los cambios nuevos a los antiguos
            await api.put(`/tasks/${id}`, formData);
            navigate('/tareas');
        }catch(error){
            alert("No se pudieron guardar los cambios");
        }
    };

    if(loading) return<p className="p-8 text-center">Cargando tarea...</p>;

    return(
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Editar Tarea</h1>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-5">
                {/* TÍTULO */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Título</label>
                    <input
                        type="text"
                        value={formData.title}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                </div>

                {/* CLIENTE */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Cliente</label>
                    <select 
                        value={formData.client}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        onChange={(e) => setFormData({...formData, client: e.target.value})}
                    >
                        {clients.map(c => (
                            <option key={c._id} value={c._id}>{c.name}</option>
                        ))}
                    </select>
                </div>

                {/* PRIORIDAD */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Prioridad</label>
                    <select 
                        value={formData.priority}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    >
                        <option value="low">Baja</option>
                        <option value="medium">Media</option>
                        <option value="high">Alta</option>
                    </select>
                </div>

                <div className="flex gap-4 pt-4">
                    <button type="button" onClick={() => navigate('/tareas')} className="flex-1 bg-gray-100 py-3 rounded-xl font-bold">Cancelar</button>
                    <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all">
                        Guardar Cambios
                    </button>
                </div>
            </form>
        </div>
    );
};
export default EditTask;