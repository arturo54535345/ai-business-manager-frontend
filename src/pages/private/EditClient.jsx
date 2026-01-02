import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from '../../api/axios';
import { toast } from 'react-hot-toast'; // 1. Importamos la herramienta de notificaciones

const EditClient = () => {
    const { id } = useParams(); // Sacamos el ID del cliente de la URL
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        category: 'General'
    });
    const [loading, setLoading] = useState(true);

    // 2. BUSCAR DATOS: Al entrar, traemos la información actual del cliente
    useEffect(() => {
        const fetchClient = async () => {
            try {
                const res = await api.get(`/clients/${id}`);
                setFormData(res.data); // Rellenamos el formulario con los datos reales
            } catch (error) {
                console.error("No se encontró el cliente", error);
                // Notificación de error si el ID no existe o falla la red
                toast.error("Hubo un problema al buscar este cliente.");
                navigate('/clientes');
            } finally {
                setLoading(false);
            }
        };
        fetchClient();
    }, [id, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // 3. ENVIAR CAMBIOS: Usamos PUT para actualizar al cliente en el PC
            await api.put(`/clients/${id}`, formData);
            
            // Notificación de éxito elegante
            toast.success('¡Cambios guardados correctamente!', {
                style: { borderRadius: '15px', background: '#333', color: '#fff' }
            });

            navigate('/clientes'); // Volvemos a la lista de clientes
        } catch (error) {
            // Notificación si algo falla al guardar
            toast.error("Error al actualizar el cliente. Revisa la conexión.");
        }
    };

    if (loading) return <p className="p-8 text-center font-bold">Buscando los datos del cliente...</p>;

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Editar Cliente</h1>
            
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                {/* NOMBRE */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre</label>
                    <input
                        type="text"
                        value={formData.name}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                </div>

                {/* EMAIL */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <input
                        type="email"
                        value={formData.email}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                </div>

                {/* CATEGORÍA */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Categoría</label>
                    <select 
                        value={formData.category}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                    >
                        <option value="General">General</option>
                        <option value="VIP">VIP</option>
                        <option value="Potencial">Potencial</option>
                    </select>
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        type="button"
                        onClick={() => navigate('/clientes')}
                        className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 shadow-lg shadow-green-200 transition-all"
                    >
                        Guardar Cambios
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditClient;