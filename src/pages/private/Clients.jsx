import { useState, useEffect} from 'react';
import api from '../../api/axios';
import { Navigate } from 'react-router-dom';

const Clients = () =>{
    //la caja donde guardo la lista que nos mandara el back
    const [client, setClient] = useState([]);
    const [loading, setLoading] = useState(true);

    //el que se encarga de vigilar los datos al back nada mas entrar
    useEffect(()=>{
        const getClients = async () =>{
            try{
                //llamamos a la ruta de los clientes del back
                const res = await api.get('/clients');
                setClient(res.data);//se guarda esa lista en la caja
            }catch(error){
                console.error("Error al traer clientes:", error);
            }finally{
                setLoading(false);//ya se termino de cargar
            }
        };
        getClients();
    }, []);
    const handleDelete = async (id, name) =>{
        if(window.confirm(`¿Seguro que quieres eliminar a ${name}?`)){
            try{
                await api.delete(`/clients/${id}`);
                setClient(client.filter(c => c._id !== id));
            }catch(error){
                alert("No se pudo eliminar el cliente. Revisa la conexion.");
            }
        }
    };
    return(
        <div className="p-8">
            {/*cabecera*/}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Mis Clientes</h1>
                    <p className="text-gray-500">Gestiona los contactos de tu negocio</p>
                </div>
                <button
                onClick={()=> Navigate('/clientes/nuevo')}
                className="bg-blue-600 text-white px-5 py-2 rounded-xl font-bold hover:bg-blue-700 transition-all">
                    + Nuevo Cliente
                </button>
            </div>
            {/*cuerpo*/}
            {loading ? (
                <p>Cargando clientes de la base de datos</p>
            ) : client.length === 0 ? (
                <div className="bg-white p-10 rounded-3xl border border-dashed border-gray-300 text-center">
                    <p className="text-gray-500">No hay clientes registrados todavia.</p>
                </div> 
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {client.map((client) =>(
                        <div key={client._id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                            <h3 className="text-xl font-bold text-gray-900">{client.name}</h3>
                            <p className="text-gray-500 text-sm">{client.email}</p>
                            <div className="mt-4 flex gap-2">
                                <span className="bg-blue-50 text-blue-600 text-xs px-3 py-1 rounded-full font-semibold">
                                    {client.category || 'General'}
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