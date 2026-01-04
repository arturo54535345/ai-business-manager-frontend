import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom'; 
import { toast } from 'react-hot-toast';

const Clients = () => {
    // 1. ESTADOS (Nuestras cajas de memoria)
    const [client, setClient] = useState([]); // Lista de clientes
    const [loading, setLoading] = useState(true); // Para el mensaje de "Cargando"
    const [searchTerm, setSearchTerm] = useState(''); // Lo que escribes en el buscador
    const [categoryFilter, setCategoryFilter] = useState(''); // La categoría elegida
    
    const navigate = useNavigate(); 

    // 2. LÓGICA DE CARGA E INTELIGENCIA DE BÚSQUEDA
    useEffect(() => {
        const getClients = async () => {
            try {
                // Enviamos al servidor lo que Arturo está buscando o filtrando
                const res = await api.get(`/clients?search=${searchTerm}&category=${categoryFilter}`);
                setClient(res.data.clients || res.data);
            } catch (error) {
                console.error("Error al traer clientes:", error);
            } finally {
                setLoading(false);
            }
        };
        
        // Esta función se activa cada vez que cambias el texto o el filtro
        getClients();
    }, [searchTerm, categoryFilter]); 

    // 3. FUNCIÓN PARA ELIMINAR
    const handleDelete = async (id, name) => {
        if (window.confirm(`¿Seguro que quieres eliminar a ${name}?`)) {
            try {
                await api.delete(`/clients/${id}`);
                setClient(client.filter(c => c._id !== id));
                toast.success(`Cliente ${name} eliminado.`);
            } catch (error) {
                toast.error("No se pudo eliminar el cliente.");
            }
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            
            {/* CABECERA PRINCIPAL */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-4xl font-black text-gray-900">Mis Clientes</h1>
                    <p className="text-gray-500">Gestiona y filtra los contactos de tu negocio</p>
                </div>
                <button
                    onClick={() => navigate('/clientes/nuevo')}
                    className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all"
                >
                    + Nuevo Cliente
                </button>
            </div>

            {/* --- SECCIÓN DE BÚSQUEDA Y FILTROS --- */}
            <div className="flex flex-col md:flex-row gap-4 mb-10">
                {/* BUSCADOR */}
                <div className="flex-grow relative">
                    <input 
                        type="text"
                        placeholder="Buscar cliente por nombre..."
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <span className="absolute left-4 top-4 text-xl">🔍</span>
                </div>

                {/* FILTRO POR CATEGORÍA */}
                <select 
                    className="px-6 py-4 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm bg-white font-bold text-gray-600 cursor-pointer"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                >
                    <option value="">Todas las Categorías</option>
                    <option value="VIP">VIP</option>
                    <option value="Potencial">Potencial</option>
                    <option value="General">General</option>
                </select>
            </div>

            {/* LISTADO DE TARJETAS */}
            {loading ? (
                <p className="text-center py-10 font-bold text-gray-400">Buscando en la base de datos...</p>
            ) : client.length === 0 ? (
                <div className="bg-white p-16 rounded-[40px] border-2 border-dashed border-gray-100 text-center">
                    <p className="text-gray-400 text-xl font-medium">No se encontraron clientes con esos filtros. 🧐</p>
                </div> 
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {client.map((c) => (
                        <div 
                            key={c._id} 
                            className="group bg-white p-7 rounded-[32px] shadow-sm border border-gray-100 hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-50 transition-all duration-300 relative"
                        >
                            {/* BOTONES DE ACCIÓN (Lápiz y Papelera) */}
                            <div className="absolute top-6 right-6 flex gap-1">
                                <button 
                                    onClick={() => navigate(`/clientes/editar/${c._id}`)}
                                    className="p-2 text-gray-300 hover:text-blue-600 transition-colors"
                                    title="Editar cliente"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                </button>
                                <button 
                                    onClick={() => handleDelete(c._id, c.name)}
                                    className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                                    title="Eliminar cliente"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>

                            {/* CONTENIDO DE LA TARJETA */}
                            <div 
                                onClick={() => navigate(`/clientes/${c._id}`)}
                                className="cursor-pointer"
                            >
                                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-xl font-black mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    {c.name.charAt(0)}
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-1">{c.name}</h3>
                                <p className="text-gray-500 text-sm mb-4">{c.email}</p>
                                
                                <div className="flex items-center gap-2">
                                    <span className="bg-blue-50 text-blue-600 text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest">
                                        {c.category || 'General'}
                                    </span>
                                    {c.phone && (
                                        <span className="text-[10px] text-gray-400 font-bold">
                                            📞 {c.phone}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Clients;