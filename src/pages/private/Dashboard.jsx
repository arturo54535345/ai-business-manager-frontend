// -------------------------------------------------------------------------
// 🛠️ SECCIÓN 1: HERRAMIENTAS (Los cimientos de la página)
// -------------------------------------------------------------------------
import { useState, useEffect } from "react"; 
import api from "../../api/axios"; 
import { useNavigate } from "react-router-dom"; 
import { toast } from "react-hot-toast"; 

// 👨‍🏫 Importamos las piezas para dibujar los gráficos. 
// Hemos añadido 'AreaChart' y 'Area' para el gráfico del dinero.
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, PieChart, Pie, Cell, Legend, AreaChart, Area
} from "recharts";

const Dashboard = () => {
  // -------------------------------------------------------------------------
  // 🧠 SECCIÓN 2: LAS PIZARRAS DE MEMORIA (Estados)
  // -------------------------------------------------------------------------
  
  // 1. Aquí guardamos todo el paquete financiero y de tareas que envía el servidor.
  const [stats, setStats] = useState(null); 
  
  // 2. El interruptor para mostrar "Sincronizando..." mientras el servidor responde.
  const [loading, setLoading] = useState(true); 
  
  // 3. Pequeño retardo para que los gráficos se animen suavemente al entrar.
  const [isChartReady, setIsChartReady] = useState(false); 

  const navigate = useNavigate();

  // 🎨 Colores elegantes para los trozos del gráfico de tarta (Donut).
  const COLORS = ["#3b82f6", "#8b5cf6", "#f59e0b", "#10b981", "#ef4444", "#64748b"];

  // -------------------------------------------------------------------------
  // 📡 SECCIÓN 3: EL VIGILANTE (Traer los datos del servidor)
  // -------------------------------------------------------------------------
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // 👨‍🏫 Llamamos a la "cocina" (Backend) para que nos dé las estadísticas.
        const res = await api.get("/dashboard");
        setStats(res.data);
      } catch (error) {
        console.error("Error en Dashboard", error);
        toast.error("No se pudieron cargar las finanzas.");
      } finally {
        setLoading(false);
        // Esperamos medio segundo para que la estructura de la web esté lista antes del gráfico.
        setTimeout(() => setIsChartReady(true), 500);
      }
    };
    fetchStats();
  }, []);

  // Mensaje de carga con latido visual.
  if (loading) return <div className="min-h-screen flex items-center justify-center font-black text-gray-400 uppercase animate-pulse">Calculando balances...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 animate-fade-in">
      
      {/* -------------------------------------------------------------------------
          📢 SECCIÓN 4: CABECERA E IA (Tu consultor estratégico)
          ------------------------------------------------------------------------- */}
      <header className="space-y-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Centro de Mando</h1>
          <p className="text-gray-500 font-medium">Análisis en tiempo real de tu crecimiento.</p>
        </div>

        {/* 👨‍🏫 El consejo de la IA sobre tus finanzas y tareas */}
        {stats?.aiInsight && (
          <div className="bg-gray-900 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden border border-white/5">
            <div className="absolute -top-32 -right-32 w-80 h-80 bg-blue-600 opacity-20 blur-[120px]"></div>
            <p className="text-xl md:text-2xl font-medium italic leading-relaxed relative z-10">"{stats.aiInsight}"</p>
          </div>
        )}
      </header>

      {/* -------------------------------------------------------------------------
          💰 SECCIÓN 5: BALANCES FINANCIEROS (Tus euros al detalle)
          ------------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Tarjeta de Ingresos (Lo que ya has ganado) */}
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
          <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-4">Ingresos Reales</p>
          <div className="flex items-baseline gap-1">
            <span className="text-5xl font-black text-gray-900">{stats?.financialSummary?.realIncome || 0}</span>
            <span className="text-xl font-bold text-gray-400">€</span>
          </div>
        </div>

        {/* Tarjeta de Gastos (Tu inversión en materiales/tiempo) */}
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
          <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-4">Inversión Total</p>
          <div className="flex items-baseline gap-1">
            <span className="text-5xl font-black text-gray-900">{stats?.financialSummary?.totalExpenses || 0}</span>
            <span className="text-xl font-bold text-gray-400">€</span>
          </div>
        </div>

        {/* Tarjeta de Beneficio Neto (El resultado final de tu esfuerzo) */}
        <div className="bg-blue-600 p-8 rounded-[40px] shadow-2xl shadow-blue-100 text-white">
          <p className="text-blue-100 text-[10px] font-black uppercase tracking-widest mb-4">Margen de Beneficio</p>
          <div className="flex items-baseline gap-1">
            <span className="text-5xl font-black">{stats?.currentProfit || 0}</span>
            <span className="text-xl font-bold opacity-60">€</span>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------------------
          📈 SECCIÓN 6: EVOLUCIÓN FINANCIERA (Tu gráfico de "Cash Flow")
          ------------------------------------------------------------------------- */}
      <div className="bg-white p-10 rounded-[50px] shadow-sm border border-gray-100">
        <h3 className="text-lg font-black text-gray-900 mb-10 uppercase tracking-widest">Evolución Semanal del Dinero</h3>
        <div className="h-72 w-full">
          {isChartReady && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.weeklyHistory || []}>
                <defs>
                  {/* 👨‍🏫 Creamos un degradado para que el gráfico sea "delicado" y profesional */}
                  <linearGradient id="colorMoney" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 'bold'}} dy={10} />
                <Tooltip contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.1)'}} />
                <Area 
                  type="monotone" 
                  dataKey="dinero" 
                  stroke="#3b82f6" 
                  strokeWidth={4} 
                  fill="url(#colorMoney)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* -------------------------------------------------------------------------
          🚨 SECCIÓN 7: RADAR DE URGENCIAS (Atención Inmediata)
          ------------------------------------------------------------------------- */}
      {stats?.criticalTasks?.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xs font-black text-red-500 uppercase tracking-[0.3em]">⚠️ Atención Inmediata</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.criticalTasks.map((task) => (
              <div 
                key={task._id} 
                onClick={() => navigate(`/tareas/${task._id}`)}
                className="group cursor-pointer bg-white border-l-8 border-red-500 p-8 rounded-[35px] shadow-sm hover:shadow-xl transition-all"
              >
                <h4 className="text-lg font-black group-hover:text-red-600 transition-colors">{task.title}</h4>
                <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase">Cliente: {task.client?.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------------
          📊 SECCIÓN 8: GRÁFICOS DE GESTIÓN (Trabajo y Ritmo)
          ------------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Gráfico de Barras: Actividad Semanal */}
        <div className="bg-white p-10 rounded-[50px] shadow-sm border border-gray-100 flex flex-col h-[450px]">
          <h3 className="text-lg font-black text-gray-900 mb-10 uppercase tracking-widest">Ritmo de Actividad</h3>
          <div className="h-full">
            {isChartReady && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.weeklyHistory || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 'bold'}} />
                  <Bar dataKey="acciones" fill="#8b5cf6" radius={[10, 10, 10, 10]} barSize={35} />
                  <Tooltip cursor={{fill: '#f8fafc'}} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Gráfico de Tarta: Reparto por Categorías */}
        <div className="bg-white p-10 rounded-[50px] shadow-sm border border-gray-100 flex flex-col h-[450px]">
          <h3 className="text-lg font-black text-gray-900 mb-6 uppercase tracking-widest">Reparto de Trabajo</h3>
          <div className="h-full">
            {isChartReady && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={stats?.categoryData || []} innerRadius={60} outerRadius={85} paddingAngle={8} dataKey="value">
                    {stats?.categoryData?.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;