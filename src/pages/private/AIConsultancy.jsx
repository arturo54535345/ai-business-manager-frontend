import { useState } from "react";
import api from '../../api/axios';
import { useAuth } from "../../context/AuthContext";

const AIConsultancy = () =>{
    const {user} = useAuth();
    const [prompt, setPrompt] = useState('');
    const [message, setMessages] = useState([]);//historial de la charla con la ia
    const [loading, setLoading] = useState(false);

    const handleSend = async (e) =>{
        e.preventDefault();
        if(!prompt.trim()) return;

        const userMessages = {role: 'user', text: prompt};
        setMessages([...setMessages, userMessages]);
        setLoading(true);
        setPrompt('');

        try{
            const res = await api.post('/api/ask', {prompt});
            const aiMessage = {role: 'ai', text: res.data.answer};
            setMessages(prev => [...prev, aiMessage]);
        }catch(error){
            setMessages(prev => [...prev, {role: 'ai', text: 'Lo siento, he tenido un error al conectar con mis circuitos.'}]);
        }finally{
            setLoading(false);
        }
    };
    return(
        <div className="p-8 max-w-4xl mx-auto h-[85vh] flex flex-col">
            <header className="mb-8">
                <h1 className="text-3xl font-black text-gray-900">Consultoría <span className="text-blue-600">IA</span></h1>
                <p className="text-gray-500 text-sm">Tu asistente en modo <span className="font-bold text-blue-500 uppercase">{user.preferences?.aiTone}</span></p>
            </header>

            {/* ZONA DE MENSAJES */}
            <div className="flex-grow overflow-y-auto space-y-4 mb-6 p-4 bg-gray-50 rounded-[32px] border border-gray-100">
                {messages.length === 0 && (
                    <p className="text-center text-gray-400 mt-10">Pregúntame algo sobre tus clientes o tus tareas...</p>
                )}
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-4 rounded-[24px] ${
                            m.role === 'user' 
                            ? 'bg-blue-600 text-white rounded-br-none' 
                            : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-none'
                        }`}>
                            <p className="text-sm">{m.text}</p>
                        </div>
                    </div>
                ))}
                {loading && <p className="text-xs text-blue-500 animate-pulse font-bold">La IA está analizando tus datos...</p>}
            </div>

            {/* BARRA DE ENTRADA */}
            <form onSubmit={handleSend} className="relative">
                <input 
                    type="text"
                    placeholder="¿Cómo puedo mejorar mi rendimiento hoy?"
                    className="w-full p-5 pr-16 rounded-2xl border border-gray-100 shadow-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                />
                <button 
                    type="submit"
                    className="absolute right-3 top-3 bg-blue-600 text-white w-10 h-10 rounded-xl flex items-center justify-center hover:bg-blue-700 transition-all"
                >
                    🚀
                </button>
            </form>
        </div>
    )
}