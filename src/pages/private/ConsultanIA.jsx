// -------------------------------------------------------------------------
// 📂 ARCHIVO: src/pages/private/ConsultantIA.jsx
// 📝 DESCRIPCIÓN: Consola de consulta neural con estética de inteligencia avanzada.
// -------------------------------------------------------------------------
import { useState } from "react";
import api from '../../api/axios';
import { toast } from 'react-hot-toast';

const ConsultanIA = () => {
    // 🧠 LÓGICA (INTACTA)
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [loading, setLoading] = useState(false);

    const askIA = async (e) => {
        e.preventDefault();
        if(!question.trim()) return;

        setLoading(true);
        setAnswer('');

        try {
            const res = await api.post('/ai/consult', { prompt: question });
            setAnswer(res.data.aiAdvice);
            toast.success('Análisis completado', { 
                style: { background: '#030303', color: '#9D00FF', border: '1px solid rgba(157,0,255,0.2)' } 
            });
        } catch (error) {
            toast.error("Error en el núcleo de pensamiento.");
            setAnswer("Fallo de conexión con el motor neural.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-16 reveal-premium pb-20">
            
            {/* --- CABECERA (Identidad del Módulo) --- */}
            <header className="text-center space-y-6">
                <div className="flex justify-center items-center gap-4">
                    <div className="w-12 h-[1px] bg-cyber-purple opacity-30"></div>
                    <span className="text-[9px] font-black text-cyber-purple uppercase tracking-[0.5em]">Neural_Consultancy_Module_V.4</span>
                    <div className="w-12 h-[1px] bg-cyber-purple opacity-30"></div>
                </div>
                <h1 className="text-7xl md:text-9xl font-black text-white tracking-tighter leading-none italic">
                    Núcleo <span className="text-cyber-purple">IA</span>
                </h1>
                <p className="text-cyber-silver/40 font-medium italic text-lg">Tu consultor estratégico de alta fidelidad.</p>
            </header>

            {/* --- ZONA DE PROCESAMIENTO (El "Monitor") --- */}
            <div className="min-h-[400px] relative">
                {/* Luz ambiental púrpura de fondo */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-cyber-purple/5 blur-[120px] rounded-full pointer-events-none"></div>

                {loading ? (
                    <div className="flex flex-col justify-center items-center py-20 space-y-8 reveal-premium">
                        <div className="relative">
                            <div className="w-20 h-20 border-2 border-cyber-purple/20 border-t-cyber-purple rounded-full animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-2 h-2 bg-cyber-purple rounded-full animate-ping"></div>
                            </div>
                        </div>
                        <span className="text-[10px] font-black text-cyber-purple uppercase tracking-[0.4em] animate-pulse">Sincronizando Sinapsis...</span>
                    </div>
                ) : answer ? (
                    <div className="glass p-12 md:p-16 border-cyber-purple/20 bg-black/40 reveal-premium relative overflow-hidden group">
                        {/* El Escáner sutil que recorre la respuesta */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyber-purple/[0.03] to-transparent h-1/2 w-full animate-scan pointer-events-none"></div>
                        
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-10">
                                <span className="text-[9px] font-black text-cyber-purple uppercase tracking-[0.4em]">Respuesta_Generada</span>
                                <div className="flex-grow h-[1px] bg-cyber-purple/10"></div>
                            </div>
                            <p className="text-white text-xl md:text-2xl leading-relaxed italic font-medium whitespace-pre-line selection:bg-cyber-purple selection:text-white">
                                "{answer}"
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="glass p-20 border-dashed border-white/5 flex flex-col items-center justify-center text-center space-y-6">
                        <div className="w-16 h-16 rounded-full border border-white/5 flex items-center justify-center opacity-20">
                            <span className="text-2xl">?</span>
                        </div>
                        <p className="text-cyber-silver/20 text-[10px] font-black uppercase tracking-[0.3em]">Esperando parámetros de consulta...</p>
                    </div>
                )}
            </div>

            {/* --- TERMINAL DE ENTRADA (Formulario) --- */}
            <form onSubmit={askIA} className="relative group max-w-4xl mx-auto">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyber-purple to-cyber-blue opacity-10 group-focus-within:opacity-20 blur-xl transition-all duration-1000"></div>
                
                <div className="relative flex items-center">
                    <input
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Introduce comando o consulta estratégica..."
                        className="w-full bg-black/60 glass border-white/10 p-7 pl-10 pr-40 text-white placeholder:text-white/10 outline-none focus:border-cyber-purple/40 transition-all duration-700 text-lg font-medium rounded-3xl"
                    />
                    <button
                        type="submit"
                        disabled={loading || !question.trim()}
                        className="absolute right-4 top-4 bottom-4 bg-cyber-purple text-white px-10 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] shadow-[0_10px_30px_-10px_rgba(157,0,255,0.5)] hover:scale-105 active:scale-95 disabled:opacity-20 disabled:scale-100 transition-all duration-700"
                    >
                        Ejecutar
                    </button>
                </div>
                
                <div className="mt-6 flex justify-center gap-8">
                    {["Organizar día", "Plan de ventas", "Análisis de riesgos"].map((sug) => (
                        <button 
                            key={sug}
                            type="button"
                            onClick={() => setQuestion(sug)}
                            className="text-[8px] font-black text-cyber-silver/20 uppercase tracking-[0.3em] hover:text-cyber-purple transition-colors duration-500"
                        >
                            # {sug}
                        </button>
                    ))}
                </div>
            </form>
        </div>
    );
};

export default ConsultanIA;