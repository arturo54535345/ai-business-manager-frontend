import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios'; 
import { toast } from 'react-hot-toast';

const AddClient = () => {
    // 1. CAJA DE MEMORIA (Estado)
    // Añadimos companyName, phone y el objeto technicalSheet para las notas
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        companyName: '',
        phone: '',
        category: 'General',
        technicalSheet: {
            notes: ''
        }
    });
    
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // 2. FUNCIÓN DE ENVÍO
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/clients', formData);
            
            toast.success('¡Cliente guardado correctamente!', {
                duration: 4000,
                style: { borderRadius: '15px', background: '#333', color: '#fff' }
            });
            
            navigate('/clientes');
        } catch (error) {
            toast.error('No se pudo guardar. Revisa la conexión.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Añadir Nuevo Cliente</h1>
            
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                
                {/* FILA 1: Nombre */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre Completo</label>
                    <input
                        type="text"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        placeholder="Ej: Juan Pérez"
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                </div>

                {/* FILA 2: Email */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Correo Electrónico</label>
                    <input
                        type="email"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        placeholder="juan@empresa.com"
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                </div>

                {/* FILA 3: Empresa y Teléfono (En dos columnas) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Empresa (Opcional)</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            placeholder="Ej: Tech Solutions"
                            onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Teléfono (Opcional)</label>
                        <input
                            type="tel"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            placeholder="+34 600 000 000"
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                    </div>
                </div>

                {/* FILA 4: Categoría */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Categoría</label>
                    <select 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                    >
                        <option value="General">General</option>
                        <option value="VIP">VIP</option>
                        <option value="Potencial">Potencial</option>
                    </select>
                </div>

                {/* FILA 5: Notas (Comentarios) */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Notas sobre el cliente</label>
                    <textarea
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all h-24"
                        placeholder="Escribe aquí datos importantes para que la IA los analice..."
                        onChange={(e) => setFormData({
                            ...formData, 
                            technicalSheet: { ...formData.technicalSheet, notes: e.target.value } 
                        })}
                    />
                </div>

                {/* BOTONES DE ACCIÓN */}
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
                        disabled={loading}
                        className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
                    >
                        {loading ? 'Guardando...' : 'Guardar Cliente'}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default AddClient;