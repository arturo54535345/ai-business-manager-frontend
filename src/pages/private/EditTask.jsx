import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from '../../api/axios';
import { toast } from 'react-hot-toast';

const EditTask = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        specifications: '',
        priority: 'medium',
        dueDate: '',
        client: '',
    });
    
    const [clients, setClients] = useState([]); 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Pedimos la tarea y los clientes a la vez (más rápido)
                const [taskRes, clientesRes] = await Promise.all([
                    api.get(`/tasks/${id}`),
                    api.get('/clients')
                ]);

                const task = taskRes.data;
                
                setFormData({
                    title: task.title || '',
                    description: task.description || '',
                    specifications: task.specifications || '',
                    priority: task.priority || 'medium',
                    // Limpiamos la fecha para que el input tipo 'date' la entienda
                    dueDate: task.dueDate ? task.dueDate.split('T')[0] : '', 
                    // Guardamos solo el ID del cliente
                    client: task.client?._id || task.client || ''
                });

                setClients(clientesRes.data.clients || clientesRes.data || []);
            } catch (error) {
                console.error("Error al cargar datos de edición", error);
                toast.error("No se encontró la tarea o no tienes permiso.");
                navigate('/tareas');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Enviamos los cambios al servidor
            await api.put(`/tasks/${id}`, formData);
            
            toast.success('¡Tarea actualizada correctamente!', {
                icon: '📝',
                style: { borderRadius: '20px', background: '#333', color: '#fff' }
            });

            navigate('/tareas');
        } catch (error) {
            toast.error("No se pudieron guardar los cambios.");
        }
    };

    if (loading) return <div className="p-20 text-center font-black text-gray-300 animate-pulse uppercase tracking-widest">Recuperando detalles...</div>;

    return (
        <div className="p-8 max-w-2xl mx-auto animate-fade-in">
            <header className="mb-8">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Editar Tarea</h1>
                <p className="text-gray-500 font-medium">Modifica los detalles del objetivo</p>
            </header>

            <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[45px] shadow-sm border border-gray-100 space-y-8">
                
                {/* TÍTULO */}
                <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Título de la tarea</label>
                    <input
                        type="text"
                        value={formData.title}
                        required
                        className="w-full px-6 py-4 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-brand outline-none transition-all bg-gray-50/50 font-bold"
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                </div>

                {/* ESPECIFICACIONES */}
                <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Especificaciones para la IA</label>
                    <textarea
                        value={formData.specifications}
                        className="w-full px-6 py-4 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-brand outline-none transition-all bg-gray-50/50 h-32 font-medium"
                        placeholder="Instrucciones detalladas..."
                        onChange={(e) => setFormData({...formData, specifications: e.target.value})}
                    />
                </div>

                {/* CLIENTE ASOCIADO */}
                <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Cliente</label>
                    <select 
                        value={formData.client}
                        required
                        className="w-full px-6 py-4 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-brand outline-none transition-all bg-white font-bold text-gray-700 cursor-pointer"
                        onChange={(e) => setFormData({...formData, client: e.target.value})}
                    >
                        <option value="">Selecciona un cliente</option>
                        {clients.map(c => (
                            <option key={c._id} value={c._id}>{c.name}</option>
                        ))}
                    </select>
                </div>

                {/* PRIORIDAD Y FECHA */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Prioridad</label>
                        <select 
                            value={formData.priority}
                            className="w-full px-6 py-4 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-brand outline-none transition-all bg-white font-bold text-gray-700 cursor-pointer"
                            onChange={(e) => setFormData({...formData, priority: e.target.value})}
                        >
                            <option value="low">🟢 Baja</option>
                            <option value="medium">🟡 Media</option>
                            <option value="high">🔴 Alta</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Fecha Límite</label>
                        <input
                            type="date"
                            value={formData.dueDate}
                            required
                            className="w-full px-6 py-4 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-brand outline-none transition-all bg-gray-50/50 font-bold"
                            onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                        />
                    </div>
                </div>

                {/* BOTONES DE ACCIÓN */}
                <div className="flex gap-4 pt-6">
                    <button 
                        type="button" 
                        onClick={() => navigate('/tareas')} 
                        className="flex-1 bg-white text-gray-500 py-4 rounded-2xl font-bold hover:bg-gray-50 border border-gray-100 transition-all"
                    >
                        Descartar
                    </button>
                    <button 
                        type="submit" 
                        className="flex-1 bg-brand text-white py-4 rounded-2xl font-black shadow-xl shadow-brand/20 hover:opacity-90 transition-all"
                    >
                        Guardar Cambios
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditTask;