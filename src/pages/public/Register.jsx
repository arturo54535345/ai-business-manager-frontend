// -------------------------------------------------------------------------
// 📂 ARCHIVO: src/pages/public/Register.jsx
// 📝 DESCRIPCIÓN: Interfaz de registro premium con estética Neo-Tokio.
// -------------------------------------------------------------------------
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    // 🧠 LÓGICA (INTACTA)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState(null);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await register(formData.name, formData.email, formData.password);
            navigate('/dashboard');
        } catch (error) {
            setError('No se pudo crear la cuenta. ¿Quizás el email ya existe?');
        }
    };

    return (
        // 🌌 ESCENARIO PRINCIPAL
        // El fondo con rejilla técnica ya viene heredado del 'body' en index.css.
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-24">
            
            {/* ✨ NUBES DE LUZ DINÁMICAS
                Lógica: Movimientos lentos que dan sensación de profundidad. 
                Usamos 'animate-float-slow' para ese toque premium de 3000€. */}
            <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-cyber-purple/5 blur-[140px] rounded-full animate-float-slow pointer-events-none"></div>
            <div className="absolute bottom-[5%] right-[-5%] w-[45%] h-[45%] bg-cyber-blue/5 blur-[140px] rounded-full animate-float-slow [animation-delay:4s] pointer-events-none"></div>

            {/* 💎 MÓDULO DE CRISTAL (Registration Core)
                Lógica: 'reveal-premium' para una entrada majestuosa y lenta de 2 segundos. */}
            <div className="glass p-12 md:p-16 max-w-[520px] w-full reveal-premium relative z-10 border border-white/5 shadow-2xl">
                
                {/* CABECERA: TÍTULO Y SUBTÍTULO */}
                <div className="text-center mb-14">
                    <div className="inline-block px-4 py-1.5 rounded-full border border-cyber-blue/20 bg-cyber-blue/5 mb-6">
                        <span className="text-[8px] font-black text-cyber-blue uppercase tracking-[0.4em]">Nuevo_Registro_V4.0</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase">
                        Crear<span className="text-cyber-blue">.</span>Perfil
                    </h2>
                    <p className="text-cyber-silver/50 text-[10px] font-bold uppercase tracking-[0.2em] mt-5 italic">
                        Iniciando despliegue de ecosistema inteligente
                    </p>
                </div>

                {/* FORMULARIO DE ACCESO */}
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* ALERTA DE ERROR (Glassy Style) */}
                    {error && (
                        <div className="bg-red-500/10 text-red-300/80 p-5 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-red-500/10 reveal-premium">
                            ⚠️ System_Error: {error}
                        </div>
                    )}

                    <div className="space-y-6">
                        {/* CAMPO: NOMBRE */}
                        <div className="group">
                            <label className="block text-[9px] font-bold text-cyber-silver/60 uppercase tracking-[0.3em] mb-3 ml-1 group-hover:text-cyber-blue transition-colors duration-500">
                                Alias de Operador
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="Escribe tu nombre..."
                                className="w-full bg-white/[0.02] border border-white/10 p-5 rounded-2xl text-white placeholder:text-white/10 outline-none focus:border-cyber-blue/40 focus:bg-white/[0.04] focus:shadow-[0_0_40px_rgba(0,209,255,0.05)] transition-all duration-700 font-medium"
                                onChange={(e)=> setFormData({...formData, name: e.target.value})}
                            />
                        </div>

                        {/* CAMPO: EMAIL */}
                        <div className="group">
                            <label className="block text-[9px] font-bold text-cyber-silver/60 uppercase tracking-[0.3em] mb-3 ml-1 group-hover:text-cyber-blue transition-colors duration-500">
                                Enlace de Comunicación (Email)
                            </label>
                            <input
                                type="email"
                                required
                                placeholder="ejemplo@red.com"
                                className="w-full bg-white/[0.02] border border-white/10 p-5 rounded-2xl text-white placeholder:text-white/10 outline-none focus:border-cyber-blue/40 focus:bg-white/[0.04] focus:shadow-[0_0_40px_rgba(0,209,255,0.05)] transition-all duration-700 font-medium"
                                onChange={(e)=> setFormData({...formData, email: e.target.value})}
                            />
                        </div>

                        {/* CAMPO: CONTRASEÑA */}
                        <div className="group">
                            <label className="block text-[9px] font-bold text-cyber-silver/60 uppercase tracking-[0.3em] mb-3 ml-1 group-hover:text-cyber-blue transition-colors duration-500">
                                Cifrado de Seguridad (Pass)
                            </label>
                            <input
                                type="password"
                                required
                                placeholder="Mínimo 6 caracteres"
                                className="w-full bg-white/[0.02] border border-white/10 p-5 rounded-2xl text-white placeholder:text-white/10 outline-none focus:border-cyber-blue/40 focus:bg-white/[0.04] focus:shadow-[0_0_40px_rgba(0,209,255,0.05)] transition-all duration-700 font-medium tracking-tighter"
                                onChange={(e)=> setFormData({...formData, password: e.target.value})}
                            />
                        </div>
                    </div>

                    {/* BOTÓN DE ACCIÓN TÉCNICA */}
                    <button
                        type="submit"
                        className="w-full bg-cyber-blue text-black py-5 rounded-2xl font-black uppercase text-[11px] tracking-[0.3em] shadow-[0_15px_40px_-10px_rgba(0,209,255,0.4)] hover:shadow-[0_25px_50px_-10px_rgba(0,209,255,0.6)] hover:scale-[1.01] active:scale-[0.98] transition-all duration-700 mt-6 relative overflow-hidden group"
                    >
                        <span className="relative z-10">Generar Credenciales</span>
                        <div className="absolute inset-0 bg-white/10 scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>
                    </button>
                </form>

                {/* PIE DE PÁGINA: REDIRECCIÓN */}
                <p className="text-center mt-12 text-[10px] font-bold text-cyber-silver/30 uppercase tracking-[0.2em]">
                    ¿Ya posees acceso al sistema?{' '}
                    <Link to="/login" className="text-white hover:text-cyber-blue transition-colors duration-500 ml-1">
                        Autenticarme
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;