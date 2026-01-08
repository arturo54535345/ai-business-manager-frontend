// -------------------------------------------------------------------------
// 🛠️ SECCIÓN 1: HERRAMIENTAS (Lo que necesitamos para construir la página)
// -------------------------------------------------------------------------
import { useState, useEffect } from "react"; // Para la memoria (state) y el vigilante (effect).
import api from "../../api/axios"; // El mensajero que trae los datos del servidor.
import { useNavigate } from "react-router-dom"; // El mando para saltar a otras páginas.
import { toast } from "react-hot-toast"; // Para mostrar avisos si algo falla.

// 👨‍🏫 Importamos las piezas para dibujar gráficos (Barras, Donut, Ejes, etc.)
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const Dashboard = () => {
  // -------------------------------------------------------------------------
  // 🧠 SECCIÓN 2: LAS PIZARRAS DE MEMORIA (Estados)
  // -------------------------------------------------------------------------
  
  // 1. Aquí guardamos todo el paquete de datos (números, listas, IA) que viene del servidor.
  const [stats, setStats] = useState(null); 
  
  // 2. El interruptor para mostrar el mensaje de "Sincronizando..." mientras llegan los datos.
  const [loading, setLoading] = useState(true); 
  
  // 3. Un pequeño truco visual: esperamos a que la página cargue para animar los gráficos.
  const [isChartReady, setIsChartReady] = useState(false); 

  // 4. Activamos el mando a distancia para navegar.
  const navigate = useNavigate();

  // 🎨 Paleta de colores para los trozos del gráfico de tarta (Donut).
  const COLORS = ["#2563eb", "#7c3aed", "#ea580c", "#64748b", "#059669", "#94a3b8"];

  // -------------------------------------------------------------------------
  // 📡 SECCIÓN 3: EL VIGILANTE (useEffect - Traer los datos)
  // -------------------------------------------------------------------------
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // 👨‍🏫 Llamamos a la dirección /dashboard de nuestro servidor.
        const res = await api.get("/dashboard");
        setStats(res.data); // Guardamos el éxito en nuestra pizarra 'stats'.
      } catch (error) {
        console.error("Error al pedir datos", error);
        toast.error("No pudimos conectar con el servidor.");
      } finally {
        setLoading(false); // Apagamos el mensaje de carga.
        // Esperamos medio segundo antes de dejar que los gráficos aparezcan con animación.
        setTimeout(() => setIsChartReady(true), 500);
      }
    };
    fetchStats();
  }, []);

  // Si todavía estamos buscando la información, mostramos este aviso con un latido visual.
  if (loading)
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 text-xs font-black text-gray-400 uppercase animate-pulse">
        Sincronizando oficina virtual...
      </div>
    );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12 animate-fade-in">
      
      {/* -------------------------------------------------------------------------
          📢 SECCIÓN 4: CABECERA E IA (Tu visión estratégica)
          ------------------------------------------------------------------------- */}
      <header className="space-y-8">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Panel de Control</h1>
          <p className="text-gray-500 font-medium">Estado actual de tu ecosistema de negocio.</p>
        </div>

        {/* 👨‍🏫 Si la IA tiene algo que decirnos, pintamos este bloque negro elegante */}
        {stats?.aiInsight && (
          <div className="bg-gray-900 rounded-[50px] p-12 text-white shadow-2xl relative overflow-hidden border border-white/5">
            {/* Un efecto de luz decorativa en la esquina */}
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-brand opacity-20 blur-[130px]"></div>
            <div className="relative z-10 space-y-6">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] bg-brand/20 text-brand px-5 py-2 rounded-full border border-brand/30">
                Groq Insight
              </span>
              <p className="text-2xl md:text-3xl font-medium italic leading-relaxed text-gray-200">
                "{stats.aiInsight}"
              </p>
            </div>
          </div>
        )}
      </header>

      {/* -------------------------------------------------------------------------
          🚨 SECCIÓN 5 (NUEVA): ATENCIÓN INMEDIATA (Tareas Críticas)
          ------------------------------------------------------------------------- */}
      {/* 👨‍🏫 Solo se muestra si el servidor nos avisó de que hay tareas urgentes */}
      {stats?.criticalTasks && stats.criticalTasks.length > 0 && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center gap-3 text-red-600">
            <span className="text-2xl animate-bounce"></span>
            <h2 className="text-sm font-black uppercase tracking-[0.2em]">Prioridad Máxima</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.criticalTasks.map((task) => (
              <div 
                key={task._id}
                // Si haces clic, el mando te lleva a la FICHA TÉCNICA de la tarea.
                onClick={() => navigate(`/tareas/${task._id}`)}
                className="group cursor-pointer bg-white border-l-[10px] border-red-500 p-8 rounded-[35px] shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-black text-red-500 bg-red-50 px-3 py-1 rounded-lg uppercase">Urgente</span>
                  <span className="text-[10px] font-bold text-gray-400">📅 {new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
                <h3 className="text-xl font-black text-gray-900 group-hover:text-red-600 transition-colors">{task.title}</h3>
                <p className="text-xs text-gray-400 font-bold mt-4 uppercase tracking-widest">👤 {task.client?.name || 'Particular'}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------------
          💰 SECCIÓN 6: TARJETAS DE MÉTRICAS (Tus números clave)
          ------------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Tarjeta 1: Clientes */}
        <div className="bg-white p-10 rounded-[45px] shadow-sm border border-gray-100">
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">Clientes Activos</p>
          <h3 className="text-6xl font-black text-gray-900">{stats?.clientSummary?.total || 0}</h3>
        </div>
        
        {/* Tarjeta 2: Tareas Pendientes */}
        <div className="bg-white p-10 rounded-[45px] shadow-sm border border-gray-100">
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">Pendientes</p>
          <h3 className="text-6xl font-black text-gray-900">{stats?.taskSummary?.pending || 0}</h3>
        </div>
        
        {/* Tarjeta 3: Logros (Completadas) */}
        <div className="bg-white p-10 rounded-[45px] shadow-sm border border-gray-100">
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">Logros</p>
          <h3 className="text-6xl font-black text-green-500">{stats?.taskSummary?.completed || 0}</h3>
        </div>
      </div>

      {/* -------------------------------------------------------------------------
          📊 SECCIÓN 7: GRÁFICOS (Visión Visual)
          ------------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* GRÁFICO 1: ACTIVIDAD SEMANAL (Barras) */}
        <div className="bg-white p-12 rounded-[55px] shadow-sm border border-gray-100 flex flex-col h-[500px]">
          <h3 className="text-2xl font-black text-gray-900 mb-12">Ritmo Semanal</h3>
          <div className="w-full h-full">
            {isChartReady && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.weeklyHistory || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: "800", fill: "#cbd5e1" }} dy={15} />
                  <Tooltip contentStyle={{ borderRadius: "24px", border: "none", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)" }} />
                  <Bar dataKey="acciones" fill="#2563eb" radius={[14, 14, 14, 14]} barSize={35} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* GRÁFICO 2: REPARTO POR CATEGORÍA (Donut) */}
        <div className="bg-white p-12 rounded-[55px] shadow-sm border border-gray-100 flex flex-col h-[500px]">
          <h3 className="text-2xl font-black text-gray-900 mb-8">Reparto de Trabajo</h3>
          <div className="h-full w-full">
            {isChartReady && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats?.categoryData || []}
                    innerRadius={60} // El hueco central para que parezca un donut.
                    outerRadius={90}
                    paddingAngle={8} // Separación entre trozos.
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={1500}
                  >
                    {/* Pintamos cada categoría con un color de la paleta COLORS */}
                    {stats?.categoryData?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: "20px", border: "none", fontWeight: "bold" }} />
                  <Legend iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* -------------------------------------------------------------------------
            📝 SECCIÓN 8: ACTIVIDAD RECIENTE (Tu bitácora)
            ------------------------------------------------------------------------- */}
        <div className="lg:col-span-2 bg-white p-12 rounded-[55px] shadow-sm border border-gray-100">
          <h3 className="text-2xl font-black text-gray-900 mb-12">Actividad Reciente</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats?.recentActivity?.map((act, i) => (
              <div
                key={i}
                className="flex items-center gap-6 p-6 hover:bg-gray-50 rounded-[30px] transition-all border border-transparent hover:border-gray-100"
              >
                {/* Punto de color según si es acción de cliente o de tarea */}
                <div className={`w-3.5 h-3.5 rounded-full ${act.type === "client" ? "bg-blue-600" : "bg-green-500"}`}></div>
                <p className="text-base font-bold text-gray-700 flex-grow">{act.action}</p>
                <span className="text-[10px] text-gray-400 font-black uppercase">
                  {new Date(act.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;