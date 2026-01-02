import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios'; // El mensajero que habla con el PC
import {toast} from 'react-hot-toast';

const AddClient = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        category: 'General'
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Enviamos los datos al PC de tu hermano
            await api.post('/clients', formData);
            //saldra un toast si todo sale bien 
            toast.success('¡Cliente guardado correctamente!',{
                duration:4000,
                style: {borderRadius: '15px', background: '#333', color: '#fff'}
            });
            // Si sale bien, volvemos a la lista de clientes
            navigate('/clientes');
        } catch (error) {
            toast.error('No se pudo guardar. Revisa la conexion.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Añadir Nuevo Cliente</h1>
            
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
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