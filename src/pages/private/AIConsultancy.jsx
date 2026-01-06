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

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        const userMsg = { role: 'user', text: prompt };
        setMessages([...messages, userMsg]);
        setLoading(true);
        const currentPrompt = prompt;
        setPrompt(''); 

        try {
            // 🟢 Enviamos la pregunta a la ruta de consultoría
            const res = await api.post('/ai/advice', { prompt: currentPrompt });
            
            // Accedemos a aiAdvice que es como lo definimos en el ai.controller.js
            const aiMsg = { role: 'ai', text: res.data.aiAdvice };
            setMessages((prev) => [...prev, aiMsg]);
        } catch (error) {
            toast.error("Error de conexión.");
            setMessages((prev) => [...prev, { role: 'ai', text: "No he podido procesar los datos ahora." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto h-[calc(100vh-120px)] flex flex-col">
            <header className="mb-6">
                <h1 className="text-4xl font-black text-gray-900">Consultoría Estratégica</h1>
                <p className="text-gray-500">Modo: <span className="font-bold text-blue-600 uppercase">{user?.preferences?.aiTone || 'Socio'}</span></p>
            </header>

            <div ref={scrollRef} className="flex-grow overflow-y-auto bg-white rounded-[40px] shadow-sm border border-gray-100 p-6 mb-6 space-y-4">
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-3xl animate-bounce mb-4">🤖</div>
                        <p className="text-gray-400">Hola {user?.name}, ¿cómo va tu negocio hoy?</p>
                    </div>
                )}

                {messages.map((m, index) => (
                    <div key={index} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-5 rounded-[28px] ${m.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                            <p className="text-sm leading-relaxed whitespace-pre-line">{m.text}</p>
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-50 p-4 rounded-[20px] rounded-bl-none flex items-center gap-3">
                            <div className="flex gap-1">
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            </div>
                            <span className="text-xs font-bold text-blue-400 uppercase">Pensando...</span>
                        </div>
                    </div>
                )}
            </div>

            <form onSubmit={handleSendMessage} className="relative group">
                <input 
                    type="text"
                    placeholder="Escribe tu consulta aquí..."
                    className="w-full p-6 pr-20 rounded-[30px] border border-gray-100 shadow-xl focus:ring-4 focus:ring-blue-50 outline-none transition-all"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                />
                <button type="submit" disabled={loading} className="absolute right-3 top-3 bottom-3 px-6 bg-blue-600 text-white rounded-[22px] font-bold">🚀</button>
            </form>
        </div>
    );
};

export default AIConsultancy;