import { useState, useEffect } from 'react';
import api from '../../api/axios';
// 1. CORRECCIÓN: Usamos useNavigate (herramienta) en lugar de Navigate (componente)
import { useNavigate } from 'react-router-dom'; 

const Clients = () => {
    const [client, setClient] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // 2. ACTIVAMOS el mando a distancia para movernos de página
    const navigate = useNavigate(); 

    useEffect(() => {
        const getClients = async () => {
            try {
                const res = await api.get('/clients');
                setClient(res.data);
            } catch (error) {
                console.error("Error al traer clientes:", error);
            } finally {
                setLoading(false);
            }
        };
        getClients();
    }, []);

    const handleDelete = async (id, name) => {
        if (window.confirm(`¿Seguro que quieres eliminar a ${name}?`)) {
            try {
                await api.delete(`/clients/${id}`);
                setClient(client.filter(c => c._id !== id));
            } catch (error) {
                alert("No se pudo eliminar el cliente. Revisa la conexión.");
            }
        }
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Mis Clientes</h1>
                    <p className="text-gray-500">Gestiona los contactos de tu negocio</p>
                </div>
                <button
                // 3. CORRECCIÓN: Ahora usamos el navigate correctamente (en minúscula)
                onClick={() => navigate('/clientes/nuevo')}
                className="bg-blue-600 text-white px-5 py-2 rounded-xl font-bold hover:bg-blue-700 transition-all">
                    + Nuevo Cliente
                </button>
            </div>

            {loading ? (
                <p>Cargando clientes de la base de datos...</p>
            ) : client.length === 0 ? (
                <div className="bg-white p-10 rounded-3xl border border-dashed border-gray-300 text-center">
                    <p className="text-gray-500">No hay clientes registrados todavía.</p>
                </div> 
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {client.map((c) => (
                        /* Añadimos 'relative' a la tarjeta para poder posicionar los botones arriba a la derecha */
                        <div key={c._id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all relative">
                            
                            {/* --- AQUÍ ESTÁN LOS BOTONES QUE NO VEÍAS --- */}
                            <div className="absolute top-4 right-4 flex gap-2">
                                {/* BOTÓN EDITAR (Lápiz) */}
                                <button 
                                    onClick={() => navigate(`/clientes/editar/${c._id}`)}
                                    className="text-gray-400 hover:text-blue-600 transition-colors"
                                    title="Editar cliente"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                </button>

                                {/* BOTÓN BORRAR (Papelera) */}
                                <button 
                                    onClick={() => handleDelete(c._id, c.name)}
                                    className="text-gray-400 hover:text-red-600 transition-colors"
                                    title="Eliminar cliente"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                            {/* --- FIN DE LOS BOTONES --- */}

                            <h3 className="text-xl font-bold text-gray-900">{c.name}</h3>
                            <p className="text-gray-500 text-sm">{c.email}</p>
                            <div className="mt-4 flex gap-2">
                                <span className="bg-blue-50 text-blue-600 text-xs px-3 py-1 rounded-full font-semibold">
                                    {c.category || 'General'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
export default Clients;