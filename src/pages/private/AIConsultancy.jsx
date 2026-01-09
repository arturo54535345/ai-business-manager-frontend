// -------------------------------------------------------------------------
// 🛠️ SECCIÓN 1: IMPORTACIONES Y HERRAMIENTAS
// -------------------------------------------------------------------------
import { useState, useEffect, useRef } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const AIConsultancy = () => {
    const { user } = useAuth();
    const [prompt, setPrompt] = useState(''); 
    const [messages, setMessages] = useState([]); 
    const [loading, setLoading] = useState(false); 
    
    const scrollRef = useRef(null);

    // 👨‍🏫 Lógica: El scroll baja automáticamente cuando hay mensajes nuevos
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // 🚀 ENVÍO DE DATOS AL CEREBRO IA
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        const userMsg = { role: 'user', text: prompt };
        setMessages([...messages, userMsg]);
        setLoading(true);
        const currentPrompt = prompt;
        setPrompt(''); 

        try {
            const res = await api.post('/ai/advice', { prompt: currentPrompt });
            const aiMsg = { role: 'ai', text: res.data.aiAdvice };
            setMessages((prev) => [...prev, aiMsg]);
        } catch (error) {
            toast.error("Fallo en el enlace neural.");
            setMessages((prev) => [...prev, { role: 'ai', text: "Error de conexión con el núcleo central." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        // 👨‍🏫 Lógica: Ajustamos el alto para que el chat ocupe casi toda la pantalla
        <div className="h-[calc(100vh-140px)] flex flex-col space-y-8 animate-reveal">
            
            {/* --- CABECERA (Status de Conexión) --- */}
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic">
                        Neural <span className="text-cyber-purple">Link</span>
                    </h1>
                    <p className="text-cyber-silver text-[10px] font-black uppercase tracking-[0.3em] mt-2">
                        Operador: <span className="text-cyber-purple">{user?.preferences?.aiTone || 'Estratega'}</span>
                    </p>
                </div>
                <div className="flex items-center gap-2 text-[9px] font-black text-cyber-blue animate-pulse">
                    <div className="w-2 h-2 bg-cyber-blue rounded-full"></div>
                    SISTEMA EN LINEA
                </div>
            </header>

            {/* --- VENTANA DE TRANSMISIÓN (Chat) --- */}
            <div 
                ref={scrollRef} 
                className="flex-grow overflow-y-auto glass p-8 space-y-6 border-white/5 scrollbar-hide"
            >
                {/* Pantalla de inicio si no hay mensajes */}
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                        <div className="w-20 h-20 bg-cyber-purple/10 rounded-3xl border border-cyber-purple/20 flex items-center justify-center text-4xl mb-6 shadow-[0_0_30px_rgba(157,0,255,0.1)]">
                            🤖
                        </div>
                        <p className="text-cyber-silver font-bold uppercase text-[10px] tracking-widest">
                            Esperando consulta estratégica de {user?.name}...
                        </p>
                    </div>
                )}

                {/* MAPEADO DE MENSAJES */}
                {messages.map((m, index) => (
                    <div key={index} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-reveal`}>
                        <div className={`
                            max-w-[80%] p-6 rounded-[30px] shadow-2xl relative
                            ${m.role === 'user' 
                                ? 'bg-cyber-blue text-black font-bold rounded-br-none' 
                                : 'glass bg-white/5 text-gray-200 rounded-bl-none border-white/10'}
                        `}>
                            {/* Etiqueta de quién habla */}
                            <span className={`text-[8px] font-black uppercase tracking-widest absolute -top-5 ${m.role === 'user' ? 'right-2 text-cyber-blue' : 'left-2 text-cyber-purple'}`}>
                                {m.role === 'user' ? 'Arturo_Request' : 'AI_Response'}
                            </span>
                            <p className="text-sm leading-relaxed whitespace-pre-line">{m.text}</p>
                        </div>
                    </div>
                ))}

                {/* EFECTO "PENSANDO" */}
                {loading && (
                    <div className="flex justify-start animate-reveal">
                        <div className="glass bg-white/5 p-6 rounded-[25px] rounded-bl-none border-white/10 flex items-center gap-4">
                            <div className="flex gap-1.5">
                                <div className="w-1.5 h-1.5 bg-cyber-purple rounded-full animate-bounce"></div>
                                <div className="w-1.5 h-1.5 bg-cyber-purple rounded-full animate-bounce [animation-delay:-0.2s]"></div>
                                <div className="w-1.5 h-1.5 bg-cyber-purple rounded-full animate-bounce [animation-delay:-0.4s]"></div>
                            </div>
                            <span className="text-[10px] font-black text-cyber-purple uppercase tracking-widest">Analizando Variables...</span>
                        </div>
                    </div>
                )}
            </div>

            {/* --- TERMINAL DE ENTRADA (Input) --- */}
            <form onSubmit={handleSendMessage} className="relative group">
                <input 
                    type="text"
                    placeholder="Escribir comando estratégico..."
                    className="w-full glass bg-white/5 p-6 pr-24 text-white outline-none focus:border-cyber-blue transition-all font-medium border-white/10 shadow-2xl"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                />
                <button 
                    type="submit" 
                    disabled={loading} 
                    className="absolute right-4 top-4 bottom-4 px-8 bg-cyber-blue text-black rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg hover:scale-105 transition-all disabled:opacity-30"
                >
                    Enviar
                </button>
            </form>
        </div>
    );
};

export default AIConsultancy;