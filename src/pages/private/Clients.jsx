import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom'; 
import { toast } from 'react-hot-toast';

const Clients = () => {
    // 1. ESTADOS: Nuestras cajas de memoria
    const [client, setClient] = useState([]); 
    const [loading, setLoading] = useState(true); 
    const [searchTerm, setSearchTerm] = useState(''); 
    const [categoryFilter, setCategoryFilter] = useState(''); 
    
    const navigate = useNavigate(); 

    // 🟢 FUNCIÓN MAESTRA DE EXPORTACIÓN (CSV)
    const exportToCSV = () => {
        if (client.length === 0) {
            return toast.error("No hay clientes para exportar.");
        }

        // 1. Títulos de las columnas
        const headers = ["Nombre", "Email", "Telefono", "Categoria", "Fecha de Registro"];
        
        // 2. Transformamos los datos de los clientes en filas de texto
        const rows = client.map(c => [
            `"${c.name}"`, // Usamos comillas por si el nombre tiene comas
            `"${c.email || 'Sin email'}"`,
            `"${c.phone || 'Sin telefono'}"`,
            `"${c.category || 'General'}"`,
            `"${new Date(c.createdAt).toLocaleDateString()}"`
        ]);

        // 3. Unimos todo con comas y saltos de línea
        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.join(","))
        ].join("\n");

        // 4. Creamos el archivo y disparamos la descarga
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `Clientes_Arturo_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.success("Archivo descargado correctamente");
    };

    // 2. LÓGICA DE CARGA
    useEffect(() => {
        const getClients = async () => {
            try {
                const res = await api.get(`/clients?search=${searchTerm}&category=${categoryFilter}`);
                setClient(res.data.clients || res.data);
            } catch (error) {
                console.error("Error al traer clientes:", error);
            } finally {
                setLoading(false);
            }
        };
        getClients();
    }, [searchTerm, categoryFilter]); 

    // 3. FUNCIÓN ELIMINAR
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
        <div className="p-8 max-w-7xl mx-auto animate-fade-in">
            
            {/* CABECERA: Título y Grupo de Botones */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Mis Clientes</h1>
                    <p className="text-gray-500 font-medium">Gestiona y exporta los contactos de tu negocio</p>
                </div>
                
                <div className="flex items-center gap-3 w-full md:w-auto">
                    {/* Botón de Exportar (Estilo secundario elegante) */}
                    <button
                        onClick={exportToCSV}
                        className="flex-1 md:flex-none bg-white text-gray-600 px-6 py-4 rounded-2xl font-bold border border-gray-100 shadow-sm hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                    >
                        <span className="text-lg">📥</span> 
                        <span>Exportar</span>
                    </button>

                    {/* Botón de Nuevo Cliente (Principal) */}
                    <button
                        onClick={() => navigate('/clientes/nuevo')}
                        className="flex-1 md:flex-none bg-brand text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-brand/20 hover:opacity-90 transition-all"
                    >
                        + Nuevo Cliente
                    </button>
                </div>
            </div>

            {/* --- SECCIÓN DE BÚSQUEDA Y FILTROS --- */}
            <div className="flex flex-col md:flex-row gap-4 mb-10">
                <div className="flex-grow relative">
                    <input 
                        type="text"
                        placeholder="Buscar cliente por nombre..."
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-brand outline-none shadow-sm transition-all bg-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <span className="absolute left-4 top-4.5 text-xl opacity-40">🔍</span>
                </div>

                <select 
                    className="px-6 py-4 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-brand outline-none shadow-sm bg-white font-bold text-gray-600 cursor-pointer"
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
                <div className="text-center py-20">
                    <p className="font-black text-gray-300 animate-pulse text-xl uppercase tracking-widest">Sincronizando base de datos...</p>
                </div>
            ) : client.length === 0 ? (
                <div className="bg-white p-16 rounded-[40px] border-2 border-dashed border-gray-100 text-center">
                    <p className="text-gray-400 text-xl font-medium">No se encontraron clientes. 🧐</p>
                </div> 
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {client.map((c) => (
                        <div 
                            key={c._id} 
                            className="group bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 hover:border-brand hover:shadow-2xl hover:shadow-brand/10 transition-all duration-500 relative"
                        >
                            <div className="absolute top-8 right-8 flex gap-2">
                                <button onClick={() => navigate(`/clientes/editar/${c._id}`)} className="p-2 text-gray-300 hover:text-brand transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                </button>
                                <button onClick={() => handleDelete(c._id, c.name)} className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>

                            <div onClick={() => navigate(`/clientes/${c._id}`)} className="cursor-pointer">
                                <div className="w-16 h-16 bg-brand-light text-brand rounded-[22px] flex items-center justify-center text-2xl font-black mb-6 group-hover:bg-brand group-hover:text-white transition-all duration-500">
                                    {c.name.charAt(0)}
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 mb-1 group-hover:text-brand transition-colors">{c.name}</h3>
                                <p className="text-gray-400 font-medium text-sm mb-6">{c.email || 'Sin correo registrado'}</p>
                                <div className="flex items-center gap-3">
                                    <span className="bg-brand-light text-brand text-[10px] px-4 py-1.5 rounded-full font-black uppercase tracking-[0.15em]">
                                        {c.category || 'General'}
                                    </span>
                                    {c.phone && <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1">📞 {c.phone}</span>}
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