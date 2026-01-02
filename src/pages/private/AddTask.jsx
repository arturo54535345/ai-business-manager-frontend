import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from '../../api/axios';
import { toast } from 'react-hot-toast'; // 1. Traemos la herramienta de notificaciones

const AddTask = () => {
    const navigate = useNavigate();
    
    // CAJAS DE MEMORIA
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        client: '',      // Añadimos el cliente
        priority: 'medium', // Añadimos prioridad por defecto
        dueDate: ''
    });
    const [clients, setClients] = useState([]); // Para guardar la lista de clientes
    const [loading, setLoading] = useState(false);

    // 2. LÓGICA: Al entrar, buscamos los clientes para que puedas elegir uno
    useEffect(() => {
        const fetchClients = async () => {
            try {
                const res = await api.get('/clients');
                // Guardamos solo el array de clientes que viene del motor
                setClients(res.data.clients || res.data); 
            } catch (error) {
                console.error("Error al traer clientes", error);
            }
        };
        fetchClients();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Verificamos que se haya elegido un cliente
        if (!formData.client) {
            return toast.error('Por favor, selecciona un cliente para esta tarea');
        }

        setLoading(true);
        try {
            await api.post('/tasks', formData);
            
            // 3. ÉXITO: Notificación elegante en lugar de alert
            toast.success('¡Tarea creada con éxito! A por ello Arturo', {
                icon: '🚀',
                style: { borderRadius: '15px', background: '#333', color: '#fff' }
            });

            navigate('/tareas');
        } catch (error) {
            console.error("Error al crear tarea:", error);
            // 4. ERROR: Notificación roja
            toast.error('Vaya, no se pudo guardar la tarea. Revisa la conexión.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Nueva Tarea</h1>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                {/* TÍTULO */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">¿Qué hay que hacer?</label>
                    <input
                        type="text"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        placeholder="Ej: Llamar a los nuevos clientes"
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                </div>

                {/* SELECCIÓN DE CLIENTE (Lógica necesaria para la IA) */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Asociar a un Cliente</label>
                    <select 
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        onChange={(e) => setFormData({...formData, client: e.target.value})}
                    >
                        <option value="">Selecciona quién es el cliente...</option>
                        {clients.map(c => (
                            <option key={c._id} value={c._id}>{c.name}</option>
                        ))}
                    </select>
                </div>

                {/* FECHA */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">¿Para cuándo?</label>
                    <input
                        type="date"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                    />
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        type="button"
                        onClick={() => navigate('/tareas')}
                        className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
                    >
                        {loading ? 'Guardando...' : 'Crear Tarea'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddTask;