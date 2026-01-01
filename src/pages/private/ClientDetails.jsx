import { useEffect, useState } from "react";
import {useParams, useNavigate} from "react-router-dom";
import api from '../../api/axios';


const ClientDetails = () =>{
    const {id} = useParams();//sacamos el id del cliente de la url
    const navigate = useNavigate();

    const [data, setData] = useState(null);//aqui guardamos cliente + tareas
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const fetchDetails = async () =>{
            try{
                //pedimos las tareas al backend
                const res = await api.get(`/clients/${id}`);
                setData(res.data);
            }catch(error){
                console.error("Error al buscar detalles", error);
                navigate('/clientes');
            }finally{
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id, navigate]);

    if (loading) return <div className="p-10 text-center">Cargando expediente...</div>;
    if (!data) return <div className="p-10 text-center">No se encontro la informacion.</div>;

    const {client, tasks} = data; //separamos al cliente de sus tareas 

    return(
        <div className="p-8 max-w-5xl mx-auto">
            {/* CABECERA CON BOTÓN VOLVER */}
            <button 
                onClick={() => navigate('/clientes')}
                className="text-gray-500 hover:text-blue-600 mb-4 flex items-center gap-2 font-medium"
            >
                ← Volver a Clientes
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* COLUMNA IZQUIERDA: INFORMACIÓN DEL CLIENTE */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-3xl font-bold mb-4">
                            {client.name.charAt(0)}
                        </div>
                        <h1 className="text-2xl font-extrabold text-gray-900">{client.name}</h1>
                        <p className="text-gray-500 mb-4">{client.email}</p>
                        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase">
                            {client.category}
                        </span>
                    </div>

                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Datos Técnicos</h3>
                        <div className="space-y-3">
                            <p className="text-sm text-gray-600"><strong>Industria:</strong> {client.technicalSheet?.industry || 'No definida'}</p>
                            <p className="text-sm text-gray-600"><strong>Contacto:</strong> {client.technicalSheet?.contactPerson || 'No definido'}</p>
                        </div>
                    </div>
                </div>

                {/* COLUMNA DERECHA: TAREAS ASOCIADAS */}
                <div className="lg:col-span-2">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Tareas de este Cliente</h2>
                    <div className="space-y-4">
                        {tasks.length === 0 ? (
                            <p className="text-gray-400 bg-gray-50 p-6 rounded-2xl text-center border border-dashed border-gray-200">
                                Este cliente no tiene tareas asignadas.
                            </p>
                        ) : (
                            tasks.map(task => (
                                <div key={task._id} className="bg-white p-5 rounded-2xl border border-gray-100 flex justify-between items-center shadow-sm">
                                    <div>
                                        <h4 className="font-bold text-gray-900">{task.title}</h4>
                                        <p className="text-sm text-gray-500">{task.description || 'Sin descripción'}</p>
                                    </div>
                                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${task.completed ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                                        {task.completed ? 'Completada' : 'Pendiente'}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ClientDetails;