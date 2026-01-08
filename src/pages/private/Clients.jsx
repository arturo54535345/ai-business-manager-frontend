import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom'; 
import { toast } from 'react-hot-toast';

const Clients = () => {
    // -------------------------------------------------------------------------
    // 🧠 SECCIÓN 1: LOS ESTADOS (Nuestras cajas de memoria)
    // -------------------------------------------------------------------------
    const [client, setClient] = useState([]); // Guarda la lista de clientes que vienen de la base de datos.
    const [loading, setLoading] = useState(true); // Controla si mostramos el mensaje de "Sincronizando...".
    const [searchTerm, setSearchTerm] = useState(''); // Guarda el nombre que Arturo escribe en la lupa.
    const [categoryFilter, setCategoryFilter] = useState(''); // Guarda la categoría (VIP, Potencial...) elegida.
    
    const navigate = useNavigate(); // El mando a distancia para movernos entre páginas.

    // -------------------------------------------------------------------------
    // 📥 SECCIÓN 2: EXPORTACIÓN (Tu secretaria para Excel)
    // -------------------------------------------------------------------------
    const exportToCSV = () => {
        if (client.length === 0) return toast.error("No hay clientes para exportar.");

        const headers = ["Nombre", "Email", "Telefono", "Categoria", "Tareas Pendientes"];
        const rows = client.map(c => [
            `"${c.name}"`,
            `"${c.email || 'Sin email'}"`,
            `"${c.phone || 'Sin telefono'}"`,
            `"${c.category || 'General'}"`,
            `"${c.taskCount || 0}"` // 🟢 Incluimos el contador en tu Excel
        ]);

        const csvContent = [headers.join(","), ...rows.map(row => row.join(","))].join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `Clientes_Arturo_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        
        toast.success("Archivo descargado correctamente");
    };

    // -------------------------------------------------------------------------
    // 📡 SECCIÓN 3: EL VIGILANTE (useEffect)
    // -------------------------------------------------------------------------
    useEffect(() => {
        const getClients = async () => {
            try {
                // Pedimos los clientes al servidor enviando los filtros de búsqueda.
                const res = await api.get(`/clients?search=${searchTerm}&category=${categoryFilter}`);
                setClient(res.data.clients || res.data);
            } catch (error) {
                console.error("Error al traer clientes:", error);
            } finally {
                setLoading(false);
            }
        };
        getClients();
        // 👨‍🏫 Lógica: Se activa cada vez que Arturo cambia un filtro.
    }, [searchTerm, categoryFilter]); 

    // -------------------------------------------------------------------------
    // 🗑️ SECCIÓN 4: ACCIONES (Borrar cliente)
    // -------------------------------------------------------------------------
    const handleDelete = async (id, name) => {
        if (window.confirm(`¿Seguro que quieres eliminar a ${name}?`)) {
            try {
                await api.delete(`/clients/${id}`);
                setClient(client.filter(c => c._id !== id));
                toast.success(`Cliente eliminado.`);
            } catch (error) {
                toast.error("No se pudo eliminar.");
            }
        }
    };

    // -------------------------------------------------------------------------
    // 🖼️ SECCIÓN 5: EL RENDERIZADO (Lo que Arturo ve)
    // -------------------------------------------------------------------------
    return (
        <div className="p-8 max-w-7xl mx-auto animate-fade-in">
            
            {/* CABECERA */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Mis Clientes</h1>
                    <p className="text-gray-500 font-medium">Gestiona y exporta los contactos de tu negocio</p>
                </div>
                
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button onClick={exportToCSV} className="flex-1 md:flex-none bg-white text-gray-600 px-6 py-4 rounded-2xl font-bold border border-gray-100 shadow-sm hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                        <span>📥</span> Exportar
                    </button>
                    <button onClick={() => navigate('/clientes/nuevo')} className="flex-1 md:flex-none bg-brand text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-brand/20 hover:opacity-90 transition-all">
                        + Nuevo Cliente
                    </button>
                </div>
            </div>

            {/* BÚSQUEDA Y FILTROS */}
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
                            {/* 🟢 NUEVO: CONTADOR DE TAREAS PENDIENTES */}
                            {/* 👨‍🏫 Solo aparece si el número es mayor que 0 */}
                            {c.taskCount > 0 && (
                                <div className="absolute top-8 left-28 bg-orange-500 text-white text-[9px] font-black px-3 py-1.5 rounded-lg shadow-lg shadow-orange-100 animate-pulse uppercase tracking-widest z-10">
                                    {c.taskCount} {c.taskCount === 1 ? 'Tarea' : 'Tareas'}
                                </div>
                            )}

                            <div className="absolute top-8 right-8 flex gap-2">
                                <button onClick={() => navigate(`/clientes/editar/${c._id}`)} className="p-2 text-gray-300 hover:text-brand transition-colors">✎</button>
                                <button onClick={() => handleDelete(c._id, c.name)} className="p-2 text-gray-300 hover:text-red-500 transition-colors">🗑</button>
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