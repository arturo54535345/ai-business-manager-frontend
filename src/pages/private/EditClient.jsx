import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from '../../api/axios';

const EditClient = () =>{
    const {id} = useParams();//saco por asi decirlo el dni del cliente de la url
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name:'',
        email:'',
        category:'General'
    });
    const [loading, setLoading] = useState(true);

    //nada mas entrar buscamos al cliente y traemos sus datos
    useEffect(()=>{
        const fetchClient = async () =>{
            try{
                const res = await api.get(`/clients/${id}`);
                setFormData(res.data);//pongo sus datos en el formulario 
            }catch(error){
                console.error("No se encontro el cliente", error);
                alert("Hubo un problema al buscar este cliente.");
                navigate('/clientes');
            }finally{
                setLoading(false);
            }
        };
        fetchClient();
    }, [id, navigate]);

    const handleSubmit = async (e) =>{
        e.preventDefault();
        try{
            //uso el put para que se guarde los cambios 
            await api.put(`/clients/${id}`, formData);
            navigate('/clients');
        }catch(error){
            alert("Error al actualizar el cliente");
        }
    };
    if(loading) return <p className="p-8">Buscando los datos del cliente...</p>;

    return(
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Editar Cliente</h1>
            
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre</label>
                    <input
                        type="text"
                        value={formData.name} // Aquí ya sale el nombre que tenía antes
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                </div>

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