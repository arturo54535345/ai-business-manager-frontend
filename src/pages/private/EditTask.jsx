import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from '../../api/axios';
import { toast } from 'react-hot-toast';

const EditTask = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // 1. ESTADO INICIAL: Añadimos 'specifications'
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        specifications: '', // Nuevo campo para detalles extra
        priority: 'medium',
        dueDate: '',
        client: '',
    });
    
    const [clients, setClients] = useState([]); 
    const [loading, setLoading] = useState(true);

    // 2. CARGA DE DATOS: Buscamos la tarea y la lista de clientes al mismo tiempo
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [taskRes, clientesRes] = await Promise.all([
                    api.get(`/tasks/${id}`),
                    api.get('/clients')
                ]);

                const task = taskRes.data;
                
                // Rellenamos el formulario con lo que ya existe
                setFormData({
                    title: task.title,
                    description: task.description || '',
                    specifications: task.specifications || '', // Cargamos las especificaciones
                    priority: task.priority || 'medium',
                    dueDate: task.dueDate ? task.dueDate.split('T')[0] : '', // Limpiamos la fecha para el input
                    client: task.client?._id || task.client
                });

                setClients(clientesRes.data.clients || clientesRes.data || []);
            } catch (error) {
                console.error("Error al cargar datos de edición", error);
                toast.error("No se pudo encontrar la tarea.");
                navigate('/tareas');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, navigate]);

    // 3. ENVIAR CAMBIOS
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/tasks/${id}`, formData);
            
            toast.success('¡Tarea actualizada!', {
                icon: '📝',
                style: { borderRadius: '15px', background: '#333', color: '#fff' }
            });

            navigate('/tareas');
        } catch (error) {
            toast.error("Vaya, algo falló al guardar los cambios.");
        }
    };

    if (loading) return <p className="p-10 text-center font-bold text-gray-500">Cargando detalles de la tarea...</p>;

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Editar Tarea</h1>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 space-y-6">
                
                {/* TÍTULO */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">¿Qué hay que hacer?</label>
                    <input
                        type="text"
                        value={formData.title}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                </div>

                {/* ESPECIFICACIONES (El cuadro grande de detalles) */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Especificaciones Técnicas</label>
                    <textarea
                        value={formData.specifications}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all h-32"
                        placeholder="Detalla aquí los pasos o notas para la IA..."
                        onChange={(e) => setFormData({...formData, specifications: e.target.value})}
                    />
                </div>

                {/* CLIENTE */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Cliente Asociado</label>
                    <select 
                        value={formData.client}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
                        onChange={(e) => setFormData({...formData, client: e.target.value})}
                    >
                        <option value="">Selecciona un cliente</option>
                        {clients.map(c => (
                            <option key={c._id} value={c._id}>{c.name}</option>
                        ))}
                    </select>
                </div>

                {/* FILA DOBLE: Prioridad y Fecha */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Prioridad</label>
                        <select 
                            value={formData.priority}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
                            onChange={(e) => setFormData({...formData, priority: e.target.value})}
                        >
                            <option value="low">Baja</option>
                            <option value="medium">Media</option>
                            <option value="high">Alta</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha Límite</label>
                        <input
                            type="date"
                            value={formData.dueDate}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                        />
                    </div>
                </div>

                {/* BOTONES */}
                <div className="flex gap-4 pt-4">
                    <button 
                        type="button" 
                        onClick={() => navigate('/tareas')} 
                        className="flex-1 bg-gray-50 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all"
                    >
                        Cancelar
                    </button>
                    <button 
                        type="submit" 
                        className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
                    >
                        Guardar Cambios
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditTask;