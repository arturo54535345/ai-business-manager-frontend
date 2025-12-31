import { useState } from "react";
import api from '../../api/axios';

const ConsultanIA = () =>{
    const [question, setQuestion] = useState('')//lo que los clientes escriben
    const [answer, setAnswer] = useState('')//lo que la IA responde
    const [loading, setLoading] = useState(false);//para que los usuarios sepan si la ia esta pensando

    const askIA = async (e) =>{
        e.preventDefault();
        if(!question.trim()) return;//si no una pregunta no haremos nada de nada

        setLoading(true);
        setAnswer('');//limpio la respuesta anterior para que parezca que escribe de nuevo

        try{
            //envio la pregunta al back
            const res = await api.post('/ai/consult', {prompt: question});
            setAnswer(res.data.response);//se guardara la respuesta
        }catch(error){
            console.log("Error al consultar la IA:", error);
            setAnswer("Lo siento, Arturo. No he podido conectar con el back, revisa que este conectado.");
        }finally{
            setLoading(false);
        }
    };
    return(
        <div className="p-8 max-w-4xl mx-auto">
            {/* CABECERA */}
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                    Consultora <span className="text-blue-600">IA</span>
                </h1>
                <p className="text-gray-500">Tu asistente estratégico personal</p>
            </div>

            {/* ZONA DE RESPUESTA */}
            <div className="mb-8 min-h-[200px]">
                {loading ? (
                    <div className="flex justify-center items-center py-10">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                        <span className="ml-3 text-gray-500 font-medium">La IA está analizando tus datos...</span>
                    </div>
                ) : answer ? (
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-blue-100 animate-fade-in">
                        <p className="text-blue-600 font-bold text-xs uppercase tracking-widest mb-4">Consejo de la IA</p>
                        <p className="text-gray-800 leading-relaxed whitespace-pre-line text-lg">
                            {answer}
                        </p>
                    </div>
                ) : (
                    <div className="bg-gray-100 p-8 rounded-3xl border border-dashed border-gray-300 text-center">
                        <p className="text-gray-400">Escribe una pregunta abajo para empezar a recibir consejos.</p>
                    </div>
                )}
            </div>

            {/* FORMULARIO DE PREGUNTA */}
            <form onSubmit={askAI} className="relative">
                <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ej: ¿Cómo puedo organizar mis tareas hoy?"
                    className="w-full px-6 py-5 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-lg text-lg pr-32"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="absolute right-2 top-2 bottom-2 bg-blue-600 text-white px-8 rounded-xl font-bold hover:bg-blue-700 transition-all disabled:bg-gray-400"
                >
                    Preguntar
                </button>
            </form>
        </div>
    );
};

export default ConsultanIA;