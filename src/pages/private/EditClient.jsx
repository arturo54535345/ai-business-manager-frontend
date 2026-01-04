import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from '../../api/axios';
import { toast } from 'react-hot-toast';

const EditClient = () => {
    const { id } = useParams(); // Obtenemos el ID de la URL
    const navigate = useNavigate();

    // 1. ESTADO INICIAL: Incluimos todos los campos nuevos
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        companyName: '',
        phone: '',
        category: 'General',
        technicalSheet: { notes: '' }
    });
    
    const [loading, setLoading] = useState(true);

    // 2. CARGA DE DATOS: Traemos la info actual del cliente al cargar la página
    useEffect(() => {
        const fetchClient = async () => {
            try {
                const res = await api.get(`/clients/${id}`);
                
                // Mantenemos la estructura para no perder las notas anidadas
                setFormData({
                    ...res.data,
                    companyName: res.data.companyName || '',
                    phone: res.data.phone || '',
                    technicalSheet: {
                        notes: res.data.technicalSheet?.notes || ''
                    }
                });
            } catch (error) {
                console.error("Error al buscar cliente", error);
                toast.error("No se pudo encontrar el cliente.");
                navigate('/clientes');
            } finally {
                setLoading(false);
            }
        };
        fetchClient();
    }, [id, navigate]);

    // 3. GUARDAR CAMBIOS
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Enviamos el PUT con todos los datos actualizados
            await api.put(`/clients/${id}`, formData);
            
            toast.success('¡Cliente actualizado con éxito!', {
                style: { borderRadius: '15px', background: '#333', color: '#fff' }
            });

            navigate('/clientes'); 
        } catch (error) {
            toast.error("Error al guardar los cambios.");
        }
    };

    if (loading) return <p className="p-8 text-center font-bold text-gray-500">Cargando datos del cliente...</p>;

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Editar Cliente</h1>
            
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 space-y-6">
                
                {/* FILA: Nombre */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre Completo</label>
                    <input
                        type="text"
                        value={formData.name}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                </div>

                {/* FILA: Email */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Correo Electrónico</label>
                    <input
                        type="email"
                        value={formData.email}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                </div>

                {/* FILA DOBLE: Empresa y Teléfono */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Empresa</label>
                        <input
                            type="text"
                            value={formData.companyName}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Teléfono</label>
                        <input
                            type="tel"
                            value={formData.phone}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                    </div>
                </div>

                {/* FILA: Categoría */}
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

                {/* FILA: Notas Técnicas */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Notas del Cliente</label>
                    <textarea
                        value={formData.technicalSheet.notes}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all h-28"
                        onChange={(e) => setFormData({
                            ...formData, 
                            technicalSheet: { ...formData.technicalSheet, notes: e.target.value } 
                        })}
                    />
                </div>

                {/* BOTONES */}
                <div className="flex gap-4 pt-4">
                    <button
                        type="button"
                        onClick={() => navigate('/clientes')}
                        className="flex-1 bg-gray-50 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all"
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