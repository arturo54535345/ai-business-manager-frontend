// -------------------------------------------------------------------------
// 📂 ARCHIVO: src/pages/private/Finance.jsx
// 📝 DESCRIPCIÓN: Terminal de monitoreo de activos con gráfica holográfica.
// -------------------------------------------------------------------------
import { useState, useEffect } from "react";
import api from "../../api/axios";
import { toast } from "react-hot-toast";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts";

const Finance = () => {
  // 🧠 LÓGICA (INTACTA)
  const [data, setData] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("todos"); 
  const [showForm, setShowForm] = useState(false); 
  const [newRecord, setNewRecord] = useState({ type: "gasto", amount: "", description: "" });

  const fetchFinance = async () => {
    try {
      const res = await api.get("/finance/summary");
      setData(res.data);
    } catch (error) {
      toast.error("Fallo en la sincronización contable.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFinance(); }, []);

  const handleSaveRecord = async (e) => {
    e.preventDefault();
    if (!newRecord.amount || !newRecord.description) return toast.error("Arturo, completa el registro.");
    try {
      await api.post("/finance", newRecord);
      toast.success("Registro inyectado al sistema 💰");
      setNewRecord({ type: "gasto", amount: "", description: "" });
      setShowForm(false);
      fetchFinance();
    } catch (error) { toast.error("Error al procesar el movimiento."); }
  };

  const exportToCSV = () => {
    if (!data?.records) return;
    const headers = ["Fecha,Cliente,Concepto,Tipo,Cantidad"];
    const rows = data.records.map(r => 
      `${new Date(r.date).toLocaleDateString()},${r.clientId?.name || 'General'},${r.description},${r.type},${r.amount}`
    );
    const blob = new Blob([[headers, ...rows].join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Financial_Report_Arturo.csv`;
    a.click();
  };

  if (loading || !data) return <div className="p-20 text-center font-black text-cyber-blue animate-pulse uppercase tracking-[0.5em] text-[10px]">Escaneando Libros Contables...</div>;

  const filteredRecords = data.records.filter(r => filter === "todos" ? true : r.type === filter);

  return (
    <div className="space-y-16 reveal-premium pb-20">
      
      {/* --- CABECERA (Arquitectura de Riqueza) --- */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="w-8 h-[2px] bg-cyber-blue opacity-50"></div>
             <span className="text-[9px] font-black text-cyber-blue uppercase tracking-[0.4em]">Finance_Asset_Monitor</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none italic">
            Centro <span className="text-cyber-blue">Financiero</span>
          </h1>
          <p className="text-cyber-silver/40 font-medium italic text-lg">Monitoreo de flujos y rentabilidad en tiempo real.</p>
        </div>
        <div className="flex gap-4 w-full lg:w-auto">
          <button onClick={exportToCSV} className="flex-1 lg:flex-none glass px-8 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest text-cyber-silver/60 hover:text-white transition-all duration-700">
            📥 Exportar Data
          </button>
          <button onClick={() => window.print()} className="flex-1 lg:flex-none glass bg-white/[0.05] text-white px-8 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/[0.1] transition-all duration-700">
            🖨️ Generar PDF
          </button>
        </div>
      </header>

      {/* --- REGISTRO DE MOVIMIENTOS (Entrada Táctica) --- */}
      <div className="print:hidden">
        <button 
          onClick={() => setShowForm(!showForm)}
          className="w-full py-8 border border-dashed border-white/10 rounded-[32px] text-cyber-silver/30 font-black hover:border-cyber-blue/40 hover:text-cyber-blue transition-all duration-700 uppercase text-[10px] tracking-[0.4em] bg-white/[0.01]"
        >
          {showForm ? "✖ Cancelar Operación" : "＋ Inyectar Movimiento Directo"}
        </button>

        {showForm && (
          <form onSubmit={handleSaveRecord} className="mt-8 glass p-10 grid grid-cols-1 md:grid-cols-4 gap-8 reveal-premium border-cyber-blue/20">
            <div className="space-y-3">
              <label className="text-[8px] font-black text-cyber-blue uppercase tracking-[0.4em] ml-2">Tipo_Flujo</label>
              <select className="w-full p-5 rounded-2xl bg-white/[0.03] border border-white/5 text-white font-bold outline-none cursor-pointer focus:border-cyber-blue/30" value={newRecord.type} onChange={(e) => setNewRecord({...newRecord, type: e.target.value})}>
                <option value="gasto">🔻 Gasto</option>
                <option value="ingreso">▲ Ingreso</option>
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[8px] font-black text-cyber-blue uppercase tracking-[0.4em] ml-2">Cuantía_EUR</label>
              <input type="number" placeholder="0.00" className="w-full p-5 rounded-2xl bg-white/[0.03] border border-white/5 text-white font-bold outline-none focus:border-cyber-blue/30" value={newRecord.amount} onChange={(e) => setNewRecord({...newRecord, amount: Number(e.target.value)})} />
            </div>
            <div className="space-y-3 md:col-span-1">
              <label className="text-[8px] font-black text-cyber-blue uppercase tracking-[0.4em] ml-2">Concepto_ID</label>
              <input type="text" placeholder="Ej: Cloud Server..." className="w-full p-5 rounded-2xl bg-white/[0.03] border border-white/5 text-white font-bold outline-none focus:border-cyber-blue/30" value={newRecord.description} onChange={(e) => setNewRecord({...newRecord, description: e.target.value})} />
            </div>
            <button type="submit" className="bg-cyber-blue text-black p-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-[0_20px_40px_-10px_rgba(0,209,255,0.4)] hover:scale-105 transition-all duration-700">
              Confirmar
            </button>
          </form>
        )}
      </div>

      {/* --- STATUS ECONÓMICO (Tarjetas de Poder) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {[
          { label: "Ingresos Totales", val: `+${data.summary.totalIncome}€`, color: "border-l-cyber-blue", text: "text-cyber-blue" },
          { label: "Gastos Ejecutados", val: `-${data.summary.totalExpenses}€`, color: "border-l-red-500", text: "text-red-500" },
          { label: "Margen Neto", val: `${data.netProfit}€`, color: "border-l-cyber-purple", text: data.netProfit >= 0 ? "text-white" : "text-red-500", glow: true }
        ].map((card, i) => (
          <div key={i} className={`glass glass-hover p-12 border-l-4 ${card.color} reveal-premium`} style={{ animationDelay: `${i * 0.2}s` }}>
            {card.glow && <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyber-purple/5 blur-3xl animate-pulse" />}
            <p className={`${card.text} text-[9px] font-black uppercase tracking-[0.4em] mb-6 opacity-60`}>{card.label}</p>
            <h3 className="text-6xl font-black text-white tracking-tighter italic">{card.val}</h3>
          </div>
        ))}
      </div>

      {/* --- GRÁFICO HOLOGRÁFICO (Evolución) --- */}
      <div className="glass p-12 reveal-premium">
        <div className="flex items-center gap-4 mb-12">
           <div className="w-2 h-2 bg-cyber-blue rounded-full animate-ping"></div>
           <h3 className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Evolución_Activos_Hologram</h3>
        </div>
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.records.slice(-12)}> 
              <defs>
                <linearGradient id="cyberIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00D1FF" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#00D1FF" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
              <XAxis dataKey="date" hide />
              <YAxis hide domain={['auto', 'auto']} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#030303', border: '1px solid rgba(0,209,255,0.2)', borderRadius: '20px', padding: '20px' }}
                itemStyle={{ color: '#00D1FF', fontWeight: '900', fontSize: '14px', textTransform: 'uppercase' }}
                cursor={{ stroke: 'rgba(0,209,255,0.2)', strokeWidth: 2 }}
              />
              <Area type="monotone" dataKey="amount" stroke="#00D1FF" strokeWidth={6} fill="url(#cyberIncome)" animationDuration={3000} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* --- LOG DE MOVIMIENTOS (Tabla de Datos) --- */}
      <div className="glass overflow-hidden reveal-premium">
        <div className="p-10 border-b border-white/5 flex gap-6 bg-white/[0.01]">
          {["todos", "ingreso", "gasto"].map(t => (
            <button key={t} onClick={() => setFilter(t)} className={`px-8 py-3 rounded-xl text-[9px] font-black uppercase tracking-[0.3em] transition-all duration-700 ${
                filter === t ? "bg-cyber-blue text-black shadow-[0_15px_30px_-10px_rgba(0,209,255,0.5)]" : "bg-white/5 text-cyber-silver/40 hover:text-white"
              }`}>
              {t}
            </button>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <tbody className="divide-y divide-white/5">
              {filteredRecords.map((r) => (
                <tr key={r._id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="p-10">
                    <p className="text-[8px] font-black text-cyber-blue/40 uppercase tracking-[0.4em] mb-2">Concepto</p>
                    <span className="font-bold text-white text-lg group-hover:text-cyber-blue transition-colors duration-500">{r.description}</span>
                  </td>
                  <td className="p-10">
                    <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em] mb-2">Origen</p>
                    <span className="text-[10px] font-black text-cyber-silver/40 uppercase tracking-widest">{r.clientId?.name || 'Sistema General'}</span>
                  </td>
                  <td className="p-10 text-right">
                    <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em] mb-2">Monto</p>
                    <span className={`text-2xl font-black italic tracking-tighter ${r.type === 'ingreso' ? 'text-cyber-blue' : 'text-red-500'}`}>
                      {r.type === 'ingreso' ? '+' : '-'}{r.amount}€
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Finance;