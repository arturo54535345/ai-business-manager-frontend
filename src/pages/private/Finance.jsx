// -------------------------------------------------------------------------
// 🛠️ SECCIÓN 1: IMPORTACIONES (Nuestras herramientas de construcción)
// -------------------------------------------------------------------------
import { useState, useEffect } from "react";
import api from "../../api/axios";
import { toast } from "react-hot-toast";
// 👨‍🏫 Importamos AreaChart para que el gráfico de dinero sea "suave" y profesional
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts";

const Finance = () => {
  // 🧠 SECCIÓN 2: LA MEMORIA (Estados)
  const [data, setData] = useState(null); // Aquí guardamos el resumen económico
  const [loading, setLoading] = useState(true); // El interruptor de "Cargando..."
  const [filter, setFilter] = useState("todos"); // Filtro para ver ingresos o gastos

  // 📡 SECCIÓN 3: EL VIGILANTE (Traer los datos del servidor)
  useEffect(() => {
    const fetchFinance = async () => {
      try {
        // 👨‍🏫 Llamamos a la dirección que acabamos de arreglar en el servidor
        const res = await api.get("/finance/summary");
        setData(res.data);
      } catch (error) {
        toast.error("No pudimos cargar tu libro contable.");
      } finally {
        setLoading(false);
      }
    };
    fetchFinance();
  }, []);

  // -------------------------------------------------------------------------
  // 📥 SECCIÓN 4: EXPORTACIÓN (Para llevar tus datos a Excel)
  // -------------------------------------------------------------------------
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
    a.download = "Reporte_Financiero_Arturo.csv";
    a.click();
  };

  // 👨‍🏫 LÓGICA DE SEGURIDAD: Si no hay datos todavía, no dibujamos nada para evitar errores
  if (loading || !data) return <div className="p-20 text-center animate-pulse font-black text-gray-300">Sincronizando cuentas...</div>;

  // Filtramos la lista según lo que Arturo quiera ver (Ingresos o Gastos)
  const filteredRecords = data.records.filter(r => filter === "todos" ? true : r.type === filter);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 animate-fade-in print:p-0">
      
      {/* --- CABECERA (Botones de acción) --- */}
      <header className="flex justify-between items-center print:hidden">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Centro Financiero</h1>
          <p className="text-gray-500 font-medium italic">Análisis de rentabilidad y evolución.</p>
        </div>
        <div className="flex gap-4">
          <button onClick={exportToCSV} className="bg-white border border-gray-100 px-6 py-3 rounded-2xl font-bold shadow-sm hover:bg-gray-50 transition-all">
            📥 Exportar Excel
          </button>
          <button onClick={() => window.print()} className="bg-gray-900 text-white px-6 py-3 rounded-2xl font-bold shadow-xl hover:opacity-90 transition-all">
            🖨️ Imprimir PDF
          </button>
        </div>
      </header>

      {/* -------------------------------------------------------------------------
          💰 SECCIÓN 5: LAS TARJETAS DE DINERO (Tus números clave)
          ------------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* INGRESOS */}
        <div className="bg-white p-10 rounded-[45px] shadow-sm border border-gray-100">
          <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest mb-2">Ingresos Acumulados</p>
          <h3 className="text-5xl font-black text-blue-600">+{data.summary.totalIncome}€</h3>
        </div>

        {/* GASTOS */}
        <div className="bg-white p-10 rounded-[45px] shadow-sm border border-gray-100">
          <p className="text-red-400 text-[10px] font-black uppercase tracking-widest mb-2">Inversión / Gastos</p>
          <h3 className="text-5xl font-black text-red-600">-{data.summary.totalExpenses}€</h3>
        </div>

        {/* BENEFICIO NETO (Lo más importante) */}
        <div className="bg-gray-900 p-10 rounded-[45px] shadow-2xl text-white relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-500 opacity-20 blur-3xl"></div>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">Margen Real</p>
          <h3 className={`text-5xl font-black ${data.netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {data.netProfit}€
          </h3>
        </div>
      </div>

      {/* -------------------------------------------------------------------------
          📈 SECCIÓN 6: EL GRÁFICO DEL DINERO (Tendencia)
          ------------------------------------------------------------------------- */}
      <div className="bg-white p-12 rounded-[55px] shadow-sm border border-gray-100">
        <h3 className="text-2xl font-black text-gray-900 mb-10 tracking-tight">Evolución de Ingresos</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.records.slice(-7)}> {/* 👨‍🏫 Mostramos los últimos 7 movimientos */}
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" hide />
              <Tooltip 
                contentStyle={{ borderRadius: '25px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                formatter={(val) => [`${val}€`, 'Cantidad']}
              />
              <Area type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={4} fill="url(#colorIncome)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* --- LISTADO DE MOVIMIENTOS --- */}
      <div className="bg-white rounded-[50px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex gap-4">
          {["todos", "ingreso", "gasto"].map(t => (
            <button 
              key={t}
              onClick={() => setFilter(t)}
              className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                filter === t ? "bg-gray-900 text-white shadow-lg" : "bg-gray-50 text-gray-400"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <table className="w-full text-left">
          <tbody className="divide-y divide-gray-50">
            {filteredRecords.map((r) => (
              <tr key={r._id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-8 font-bold text-gray-900">{r.description}</td>
                <td className="p-8 text-sm text-gray-400">{r.clientId?.name || 'General'}</td>
                <td className={`p-8 text-right font-black ${r.type === 'ingreso' ? 'text-blue-600' : 'text-red-500'}`}>
                  {r.type === 'ingreso' ? '+' : '-'}{r.amount}€
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Finance;