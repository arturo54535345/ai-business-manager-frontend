import { useState, useEffect, useRef } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const AIConsultancy = () => {
    const { user } = useAuth(); // Sacamos al usuario para saber su nombre y su tono de IA
    const [prompt, setPrompt] = useState(''); // Lo que escribes en la caja
    const [messages, setMessages] = useState([]); // El historial de la conversación
    const [loading, setLoading] = useState(false); // Para saber si la IA está "pensando"
    
    // Referencia para que el chat siempre baje solo al último mensaje
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!prompt.trim()) return; // No enviar si está vacío

        // 1. Añadimos tu pregunta al chat inmediatamente
        const userMsg = { role: 'user', text: prompt };
        setMessages([...messages, userMsg]);
        setLoading(true);
        const currentPrompt = prompt;
        setPrompt(''); // Limpiamos la caja para que puedas seguir escribiendo

        try {
            // 2. Llamamos al Backend (el controlador que ya arreglamos)
            const res = await api.post('/ai/advice', { prompt: currentPrompt });
            
            // 3. Añadimos la respuesta de la IA al chat
            const aiMsg = { role: 'ai', text: res.data.aiAdvice };
            setMessages((prev) => [...prev, aiMsg]);
        } catch (error) {
            toast.error("Hubo un problema de conexión con la IA.");
            setMessages((prev) => [...prev, { role: 'ai', text: "Lo siento, Arturo. No he podido procesar los datos en este momento." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto h-[calc(100vh-120px)] flex flex-col">
            {/* CABECERA */}
            <header className="mb-6">
                <h1 className="text-4xl font-black text-gray-900">
                    Consultoría <span className="text-blue-600">Estratégica</span>
                </h1>
                <p className="text-gray-500">
                    Tu asistente está operando en modo: <span className="font-bold text-blue-600 uppercase tracking-widest">{user?.preferences?.aiTone || 'Socio'}</span>
                </p>
            </header>

            {/* CAJA DE CHAT */}
            <div 
                ref={scrollRef}
                className="flex-grow overflow-y-auto bg-white rounded-[40px] shadow-sm border border-gray-100 p-6 mb-6 space-y-4 scroll-smooth"
            >
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-3xl animate-bounce">
                            🤖
                        </div>
                        <p className="text-gray-400 max-w-xs">
                            Hola {user?.name}, ¿en qué puedo ayudarte hoy con tus {user?.preferences?.monthlyGoal} objetivos?
                        </p>
                    </div>
                )}

                {messages.map((m, index) => (
                    <div key={index} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-5 rounded-[28px] ${
                            m.role === 'user' 
                            ? 'bg-blue-600 text-white rounded-br-none shadow-lg shadow-blue-100' 
                            : 'bg-gray-100 text-gray-800 rounded-bl-none'
                        }`}>
                            <p className="text-sm leading-relaxed whitespace-pre-line">{m.text}</p>
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-50 border border-gray-100 p-4 rounded-[20px] rounded-bl-none flex items-center gap-3">
                            <div className="flex gap-1">
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.5s]"></div>
                            </div>
                            <span className="text-xs font-bold text-blue-400 uppercase tracking-tighter">Analizando Negocio...</span>
                        </div>
                    </div>
                )}
            </div>

            {/* BARRA DE ENTRADA */}
            <form onSubmit={handleSendMessage} className="relative group">
                <input 
                    type="text"
                    placeholder="Escribe tu consulta aquí (ej: ¿Cómo voy con mis clientes VIP?)"
                    className="w-full p-6 pr-20 rounded-[30px] border border-gray-100 shadow-xl focus:ring-4 focus:ring-blue-50 outline-none transition-all placeholder:text-gray-300"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                />
                <button 
                    type="submit"
                    disabled={loading}
                    className="absolute right-3 top-3 bottom-3 px-6 bg-blue-600 text-white rounded-[22px] font-bold hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center"
                >
                    {loading ? '...' : '🚀'}
                </button>
            </form>
        </div>
    );
};

export default AIConsultancy;