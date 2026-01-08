import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from '../../api/axios';
import { toast } from 'react-hot-toast';

const ClientDetails = () => {
    // -------------------------------------------------------------------------
    // 🧠 SECCIÓN 1: HERRAMIENTAS Y MEMORIA
    // -------------------------------------------------------------------------
    
    // 👨‍🏫 useParams es como un radar: busca en la barra de direcciones el ID del cliente.
    const { id } = useParams(); 
    
    // 👨‍🏫 useNavigate es nuestro mando a distancia para saltar entre páginas.
    const navigate = useNavigate();

    // 👨‍🏫 Aquí guardamos toda la información del cliente y sus tareas.
    const [data, setData] = useState(null); 
    
    // 👨‍🏫 El interruptor que muestra "Cargando..." mientras buscamos en los archivos.
    const [loading, setLoading] = useState(true);

    // -------------------------------------------------------------------------
    // 📡 SECCIÓN 2: BUSCAR EL EXPEDIENTE (useEffect)
    // -------------------------------------------------------------------------
    useEffect(() => {
        const fetchDetails = async () => {
            try {
                // Le pedimos al servidor el expediente completo usando el ID del radar.
                const res = await api.get(`/clients/${id}`);
                setData(res.data);
            } catch (error) {
                console.error("Error al buscar detalles", error);
                toast.error("No se pudo cargar el expediente.");
                navigate('/clientes'); // Si hay error, volvemos a la lista general.
            } finally {
                setLoading(false); // Apagamos el mensaje de carga.
            }
        };
        fetchDetails();
        // 👨‍🏫 Lógica: Esta función se activa una sola vez al entrar en la página.
    }, [id, navigate]);

    // -------------------------------------------------------------------------
    // 🗑️ SECCIÓN 3: LA PAPELERA (handleDelete)
    // -------------------------------------------------------------------------
    const handleDelete = async () => {
        if (window.confirm(`¿Seguro que quieres eliminar a ${data.client.name}?`)) {
            try {
                await api.delete(`/clients/${id}`);
                toast.success("Cliente eliminado correctamente");
                navigate('/clientes'); 
            } catch (error) {
                toast.error("No se pudo eliminar el cliente.");
            }
        }
    };

    // Si la web aún está buscando los datos, mostramos este mensaje.
    if (loading) return <div className="p-10 text-center font-bold text-gray-500 animate-pulse">Cargando expediente...</div>;
    
    // Si por algún motivo no hay datos, avisamos.
    if (!data) return <div className="p-10 text-center">No se encontró la información.</div>;

    // 👨‍🏫 Sacamos el 'client' y las 'tasks' de nuestro paquete de datos para usarlos fácil.
    const { client, tasks } = data;

    return (
        <div className="p-8 max-w-6xl mx-auto animate-fade-in">
            
            {/* CABECERA: BOTONES DE NAVEGACIÓN */}
            <div className="flex justify-between items-center mb-8">
                <button 
                    onClick={() => navigate('/clientes')}
                    className="text-gray-500 hover:text-brand flex items-center gap-2 font-medium transition-colors"
                >
                    ← Volver a Clientes
                </button>

                <button 
                    onClick={handleDelete}
                    className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl font-bold hover:bg-red-100 transition-all border border-red-100"
                >
                    🗑️ Eliminar Cliente
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* 🏠 COLUMNA IZQUIERDA: IDENTIDAD Y CONTACTO */}
                <div className="lg:col-span-1 space-y-6">
                    
                    {/* Tarjeta de Identidad */}
                    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 text-center relative overflow-hidden">
                        <div className="w-20 h-20 bg-brand text-white rounded-3xl flex items-center justify-center text-3xl font-black mx-auto mb-4 shadow-lg shadow-brand/20">
                            {client.name.charAt(0)}
                        </div>
                        <h1 className="text-2xl font-black text-gray-900">{client.name}</h1>
                        <p className="text-brand font-bold text-sm mb-4">{client.companyName || 'Empresa no registrada'}</p>
                        <span className="bg-gray-100 text-gray-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                            {client.category}
                        </span>
                    </div>

                    {/* Datos de Contacto */}
                    <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
                        <h3 className="font-black text-gray-400 mb-4 text-[10px] uppercase tracking-[0.2em]">Contacto</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="text-xl">📧</span>
                                <p className="text-sm font-medium text-gray-700 truncate">{client.email}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xl">📞</span>
                                <p className="text-sm font-medium text-gray-700">{client.phone || 'No disponible'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Notas Técnicas para la IA */}
                    <div className="bg-gray-900 p-6 rounded-[24px] shadow-xl text-white">
                        <h3 className="font-black text-brand mb-4 text-[10px] uppercase tracking-[0.2em]">Notas de Socio</h3>
                        <p className="text-sm leading-relaxed opacity-80 italic">
                            "{client.technicalSheet?.notes || 'No hay comentarios técnicos todavía.'}"
                        </p>
                    </div>
                </div>

                {/* 📝 COLUMNA DERECHA: LISTADO DE TAREAS INTERACTIVO */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-black text-gray-900">Tareas Vinculadas</h2>
                        <span className="bg-gray-100 text-gray-500 px-4 py-1.5 rounded-xl text-xs font-black">
                            {tasks.length} EN TOTAL
                        </span>
                    </div>

                    <div className="space-y-4">
                        {tasks.length === 0 ? (
                            <div className="bg-white p-12 rounded-[32px] border-2 border-dashed border-gray-100 text-center">
                                <p className="text-gray-400 font-medium italic">No hay tareas pendientes con este cliente.</p>
                            </div>
                        ) : (
                            tasks.map(task => (
                                // 🟢 LO NUEVO: Ahora cada tarea es clicable y te lleva a su edición
                                <div 
                                    key={task._id} 
                                    onClick={() => navigate(`/tareas/${task._id}`)}
                                    className={`group cursor-pointer bg-white p-6 rounded-2xl border border-gray-100 flex justify-between items-center shadow-sm hover:shadow-md transition-all hover:scale-[1.01] hover:border-brand ${task.status === 'completed' ? 'opacity-50 grayscale-[0.8]' : ''}`}
                                >
                                    <div className="flex items-center gap-4">
                                        {/* Punto de estado con latido si está pendiente */}
                                        <div className={`w-3 h-3 rounded-full ${task.status === 'completed' ? 'bg-green-500' : 'bg-yellow-400 animate-pulse'}`}></div>
                                        <div>
                                            <h4 className={`font-bold text-gray-900 transition-colors group-hover:text-brand ${task.status === 'completed' ? 'line-through text-gray-400' : ''}`}>
                                                {task.title}
                                            </h4>
                                            <p className="text-xs text-gray-400">
                                                Vence el: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Sin fecha'}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
                                        {/* 🏷️ Categoría de la tarea (Reunión, Email, etc.) */}
                                        <span className="text-[9px] font-black uppercase px-2 py-1 bg-gray-50 text-gray-400 rounded-md">
                                            {task.category || 'General'}
                                        </span>
                                        
                                        <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-lg ${
                                            task.status === 'completed' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-700'
                                        }`}>
                                            {task.status === 'completed' ? 'Hecho' : 'Ver Detalle'}
                                        </span>
                                    </div>
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