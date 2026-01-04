import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from '../../api/axios';
import { toast } from 'react-hot-toast';

const ClientDetails = () => {
    const { id } = useParams(); // Sacamos el ID del cliente de la URL
    const navigate = useNavigate();

    const [data, setData] = useState(null); // Aquí guardamos cliente + tareas
    const [loading, setLoading] = useState(true);

    // 1. BUSCAR INFORMACIÓN
    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await api.get(`/clients/${id}`);
                setData(res.data);
            } catch (error) {
                console.error("Error al buscar detalles", error);
                toast.error("No se pudo cargar el expediente.");
                navigate('/clientes');
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id, navigate]);

    // 2. FUNCIÓN PARA ELIMINAR (Papelera Roja)
    const handleDelete = async () => {
        if (window.confirm(`¿Seguro que quieres eliminar a ${data.client.name}? Esta acción no se puede deshacer.`)) {
            try {
                await api.delete(`/clients/${id}`);
                toast.success("Cliente eliminado correctamente");
                navigate('/clientes'); // Tras borrar, volvemos a la lista
            } catch (error) {
                toast.error("No se pudo eliminar el cliente.");
            }
        }
    };

    if (loading) return <div className="p-10 text-center font-bold text-gray-500">Cargando expediente...</div>;
    if (!data) return <div className="p-10 text-center">No se encontró la información.</div>;

    const { client, tasks } = data;

    return (
        <div className="p-8 max-w-6xl mx-auto">
            
            {/* CABECERA: Volver y Borrar */}
            <div className="flex justify-between items-center mb-8">
                <button 
                    onClick={() => navigate('/clientes')}
                    className="text-gray-500 hover:text-blue-600 flex items-center gap-2 font-medium transition-colors"
                >
                    ← Volver a Clientes
                </button>

                <button 
                    onClick={handleDelete}
                    className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl font-bold hover:bg-red-100 transition-all border border-red-100"
                    title="Eliminar este cliente"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Eliminar Cliente
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* COLUMNA IZQUIERDA: PERFIL E INFO BÁSICA */}
                <div className="lg:col-span-1 space-y-6">
                    
                    {/* Tarjeta de Identidad */}
                    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 text-center">
                        <div className="w-20 h-20 bg-blue-600 text-white rounded-3xl flex items-center justify-center text-3xl font-black mx-auto mb-4 shadow-lg shadow-blue-100">
                            {client.name.charAt(0)}
                        </div>
                        <h1 className="text-2xl font-black text-gray-900">{client.name}</h1>
                        <p className="text-blue-600 font-bold text-sm mb-4">{client.companyName || 'Empresa no registrada'}</p>
                        <span className="bg-gray-100 text-gray-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
                            {client.category}
                        </span>
                    </div>

                    {/* Tarjeta de Contacto */}
                    <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
                        <h3 className="font-black text-gray-400 mb-4 text-[10px] uppercase tracking-[0.2em]">Datos de Contacto</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="text-xl">📧</span>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Email</p>
                                    <p className="text-sm font-medium text-gray-700">{client.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xl">📞</span>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Teléfono</p>
                                    <p className="text-sm font-medium text-gray-700">{client.phone || 'No disponible'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tarjeta de Notas IA / Técnicas */}
                    <div className="bg-blue-900 p-6 rounded-[24px] shadow-xl text-white">
                        <h3 className="font-black text-blue-300 mb-4 text-[10px] uppercase tracking-[0.2em]">Expediente de Notas</h3>
                        <p className="text-sm leading-relaxed text-blue-50 italic">
                            "{client.technicalSheet?.notes || 'No hay comentarios técnicos para este cliente aún.'}"
                        </p>
                    </div>
                </div>

                {/* COLUMNA DERECHA: HISTORIAL DE TAREAS */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-black text-gray-900">Tareas Vinculadas</h2>
                        <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg text-xs font-bold">
                            Total: {tasks.length}
                        </span>
                    </div>

                    <div className="space-y-4">
                        {tasks.length === 0 ? (
                            <div className="bg-white p-12 rounded-[32px] border-2 border-dashed border-gray-100 text-center">
                                <p className="text-gray-400 font-medium italic">Este cliente no tiene tareas en curso.</p>
                            </div>
                        ) : (
                            tasks.map(task => (
                                <div key={task._id} className="bg-white p-6 rounded-2xl border border-gray-100 flex justify-between items-center shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-3 h-3 rounded-full ${task.status === 'completed' ? 'bg-green-500' : 'bg-yellow-400'}`}></div>
                                        <div>
                                            <h4 className={`font-bold text-gray-900 ${task.status === 'completed' ? 'line-through text-gray-400' : ''}`}>
                                                {task.title}
                                            </h4>
                                            <p className="text-xs text-gray-400">
                                                Límite: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Sin fecha'}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-lg ${
                                        task.status === 'completed' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-700'
                                    }`}>
                                        {task.status === 'completed' ? 'Hecho' : 'Pendiente'}
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