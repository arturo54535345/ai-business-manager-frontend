// -------------------------------------------------------------------------
// 📂 ARCHIVO: src/pages/private/Dashboard.jsx
// 📝 DESCRIPCIÓN: Terminal central de mando. Estética de alta fidelidad.
// -------------------------------------------------------------------------
import { useState, useEffect } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer 
} from "recharts";

const Dashboard = () => {
  // 🧠 LÓGICA (INTACTA)
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/dashboard");
        setStats(res.data);
      } catch (error) {
        console.error("Error en Dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-cyber-blue font-black tracking-[0.6em] animate-pulse text-[10px] uppercase">
        Sincronizando Núcleo Neural...
      </div>
    </div>
  );

  return (
    <div className="space-y-16 reveal-premium pb-20">
      
      {/* 🛰️ SECCIÓN A: CABECERA CINEMATOGRÁFICA
          Lógica: Títulos masivos para una sensación de autoridad total. */}
      <header className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-4">
             <div className="w-10 h-[2px] bg-cyber-blue"></div>
             <span className="text-[9px] font-black text-cyber-blue uppercase tracking-[0.5em]">Main_System_Active</span>
             <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-blue opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyber-blue"></span>
             </span>
          </div>
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-white leading-none italic">
            Status <span className="text-cyber-blue">Vital</span>
          </h1>
          <p className="text-cyber-silver/40 font-medium text-lg italic max-w-lg">
            Arturo, todos los sistemas están operativos. El rendimiento actual supera los objetivos del Q1.
          </p>
        </div>

        {/* 🤖 Caja de IA (Asistente de Estrategia) */}
        <div className="glass p-10 border-l-2 border-l-cyber-purple bg-cyber-purple/[0.02] relative overflow-hidden animate-float-slow">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-[8px] font-black text-white uppercase tracking-widest">Neural_Link_V.4</div>
          <h4 className="text-[9px] font-black text-cyber-purple uppercase tracking-[0.4em] mb-6">AI_Insight</h4>
          <p className="text-base italic leading-relaxed text-cyber-silver/80 font-medium">
            "{stats?.aiInsight || 'Analizando variables de mercado para optimizar tu próximo movimiento...'}"
          </p>
        </div>
      </header>

      {/* 💰 SECCIÓN B: BENTO GRID (Tarjetas de Poder) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Card Principal: Profit */}
        <div className="glass glass-hover p-12 lg:col-span-2 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-cyber-blue/5 blur-[100px] group-hover:bg-cyber-blue/10 transition-all duration-1000"></div>
          <span className="text-[9px] font-black tracking-[0.5em] text-cyber-blue uppercase mb-12">Capital_Neto_Real</span>
          <div>
            <h2 className="text-8xl md:text-9xl font-black tracking-tighter text-white italic">
              {stats?.currentProfit}€
            </h2>
            <div className="flex items-center gap-4 mt-8">
               <div className="h-[2px] flex-grow bg-white/5 overflow-hidden">
                  <div className="h-full bg-cyber-blue shadow-[0_0_20px_#00D1FF]" style={{ width: '85%' }}></div>
               </div>
               <span className="text-[10px] font-black text-cyber-blue">85% OPTIMIZADO</span>
            </div>
          </div>
        </div>

        {/* Card: Gastos */}
        <div className="glass glass-hover p-10 flex flex-col justify-between">
          <span className="text-[9px] font-black tracking-[0.5em] text-red-500/60 uppercase">Inversión_Out</span>
          <h3 className="text-5xl font-black text-white tracking-tighter mt-10 italic">
            -{stats?.financialSummary?.totalExpenses}€
          </h3>
          <p className="text-[10px] text-cyber-silver/30 font-black uppercase tracking-widest mt-6">Flujo de salida mensual</p>
        </div>

        {/* Card: VIPs */}
        <div className="glass glass-hover p-10 flex flex-col justify-between">
          <span className="text-[9px] font-black tracking-[0.5em] text-cyber-purple uppercase">Elite_Assets</span>
          <h3 className="text-5xl font-black text-white tracking-tighter mt-10 italic">
            {stats?.clientSummary?.vips}
          </h3>
          <p className="text-[10px] text-cyber-silver/30 font-black uppercase tracking-widest mt-6">Clientes de alta prioridad</p>
        </div>
      </div>

      {/* 📈 SECCIÓN C: VISUALIZACIÓN DE DATOS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Gráfico Holográfico */}
        <div className="glass p-12 lg:col-span-2">
          <div className="flex justify-between items-center mb-12">
            <h3 className="text-[10px] font-black tracking-[0.4em] text-white uppercase">Evolución_Financiera_Log</h3>
            <span className="text-cyber-blue text-[8px] font-black border border-cyber-blue/20 px-3 py-1 rounded-full">REAL TIME</span>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.weeklyHistory || []}>
                <defs>
                  <linearGradient id="cyberGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00D1FF" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#00D1FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" hide />
                <Tooltip 
                  contentStyle={{backgroundColor: '#030303', border: '1px solid rgba(0,209,255,0.2)', borderRadius: '20px', padding: '15px'}}
                  itemStyle={{color: '#00D1FF', fontWeight: '900', textTransform: 'uppercase', fontSize: '10px'}}
                />
                <Area 
                    type="monotone" 
                    dataKey="dinero" 
                    stroke="#00D1FF" 
                    strokeWidth={6} 
                    fill="url(#cyberGradient)" 
                    animationDuration={4000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Terminal de Urgencias */}
        <div className="glass p-10 border-red-500/10 bg-red-500/[0.01]">
          <h3 className="text-[10px] font-black tracking-[0.4em] text-red-500 uppercase mb-10">Objetivos_Críticos</h3>
          <div className="space-y-6">
            {stats?.criticalTasks?.map(task => (
              <div 
                key={task._id} 
                className="group flex flex-col gap-2 p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-red-500/30 transition-all duration-700 cursor-pointer"
                onClick={() => navigate(`/tareas/${task._id}`)}
              >
                <div className="flex justify-between items-center">
                   <span className="text-[8px] font-black text-red-500/60 tracking-widest uppercase">Misión_Urgente</span>
                   <span className="text-red-500 animate-pulse">●</span>
                </div>
                <p className="text-sm font-black text-white group-hover:text-red-400 transition-colors">{task.title}</p>
                <p className="text-[10px] font-bold text-cyber-silver/20 uppercase tracking-widest">{task.client?.name}</p>
              </div>
            ))}
          </div>
          <button 
            onClick={() => navigate('/tareas')} 
            className="w-full mt-10 py-4 glass bg-white/5 text-[9px] font-black text-cyber-silver/40 uppercase tracking-[0.3em] hover:text-cyber-blue hover:bg-white/10 transition-all duration-700 rounded-xl"
          >
            Abrir Registro Completo
          </button>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;