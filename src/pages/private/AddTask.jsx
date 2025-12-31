import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from '../../api/axios';

const AddTask = () =>{
    const [formData, setFormData] = useState({
        title:'',
        description: '',
        dueDate:''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) =>{
        e.preventDefault();
        setLoading(true);
        try{
            await api.post('/tasks', formData);
            navigate('/tareas');
        }catch(error){
            console.error("Error al crear tarea:", error);
            alert("No se pudo guardar la tarea. Revisa la conexion.");
        }finally{
            setLoading(false);
        }
    };
    return(
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Nueva Tarea</h1>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">¿Que hay que hacer?</label>
                    <input
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="Ej: Llamar a los nuevos clientes"
                    onChange={(e)=> setFormData({...formData, title: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Detalles (Opcional)</label>
                    <textarea
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-32"
                        placeholder="Escribe aquí los detalles importantes..."
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">¿Para cuándo?</label>
                    <input
                        type="date"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
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
                        className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all"
                    >
                        {loading ? 'Guardando...' : 'Crear Tarea'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddTask;