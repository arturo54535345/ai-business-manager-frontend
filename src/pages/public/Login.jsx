// -------------------------------------------------------------------------
// 📂 ARCHIVO: src/pages/public/Login.jsx
// 📝 DESCRIPCIÓN: Interfaz de acceso premium con animaciones de alta gama.
// -------------------------------------------------------------------------
import { useState } from "react";
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
    // 🧠 LÓGICA (INTACTA)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError('Acceso denegado. Revisa tus credenciales.');
        }
    };

    return (
        // 🌌 CONTENEDOR PRINCIPAL
        // Usamos 'overflow-hidden' para contener las luces flotantes.
        // El fondo de rejilla ya viene del body en index.css.
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-20">
            
            {/* ✨ LUCES AMBIENTALES FLOTANTES (Atmósfera Premium)
                Lógica: Usamos 'animate-float-slow' para un movimiento casi imperceptible 
                que da profundidad y vida al fondo sin distraer. */}
            <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] bg-cyber-blue/5 blur-[150px] rounded-full animate-float-slow pointer-events-none"></div>
            <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] bg-cyber-purple/5 blur-[150px] rounded-full animate-float-slow [animation-delay:2s] pointer-events-none"></div>

            {/* 💎 EL NÚCLEO DE ACCESO (Tarjeta de Cristal)
                Lógica: 
                1. 'glass': El efecto de cristal base con el escáner sutil.
                2. 'reveal-premium': La entrada lenta con desenfoque (blur) de 2 segundos.
                3. 'border-white/5': Un borde apenas visible para definir el límite. */}
            <div className="glass p-12 md:p-16 max-w-[480px] w-full reveal-premium relative z-10 border border-white/5 backdrop-blur-2xl">
                
                {/* CABECERA DEL FORMULARIO */}
                <div className="text-center mb-12">
                    {/* Un pequeño icono o detalle técnico encima del título da sensación de "sistema" */}
                    <div className="flex justify-center mb-6">
                        <div className="w-12 h-1 bg-gradient-to-r from-transparent via-cyber-blue to-transparent opacity-50"></div>
                    </div>
                    <h2 className="text-4xl font-black text-white tracking-tighter uppercase">
                        AI<span className="text-cyber-blue">.</span>Manager
                    </h2>
                    <p className="text-cyber-silver/60 text-[9px] font-bold uppercase tracking-[0.4em] mt-4">
                        Identificación de Usuario
                    </p>
                </div>

                {/* FORMULARIO */}
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* ALERTA DE ERROR (Elegante) */}
                    {error && (
                        <div className="bg-red-500/10 text-red-300/90 p-4 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-red-500/10 flex items-center gap-3 reveal-premium">
                            <span className="text-lg">⚠️</span> {error}
                        </div>
                    )}

                    {/* INPUTS CON INTERACCIÓN LENTA
                        Lógica: 'duration-500' hace que el brillo azul al hacer click aparezca lentamente,
                        dando una sensación de software robusto y caro. */}
                    <div className="space-y-6">
                        <div className="group">
                            <label className="block text-[9px] font-bold text-cyber-silver/80 uppercase tracking-[0.2em] mb-3 ml-1 group-hover:text-cyber-blue transition-colors duration-500">
                                Email Corporativo
                            </label>
                            <input
                                type="email"
                                required
                                className="w-full bg-white/[0.03] border border-white/10 p-5 rounded-2xl text-white placeholder:text-white/20 outline-none focus:border-cyber-blue/50 focus:bg-white/[0.05] focus:shadow-[0_0_30px_rgba(0,209,255,0.1)] transition-all duration-500 font-medium"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="group">
                            <label className="block text-[9px] font-bold text-cyber-silver/80 uppercase tracking-[0.2em] mb-3 ml-1 group-hover:text-cyber-blue transition-colors duration-500">
                                Clave de Acceso
                            </label>
                            <input
                                type="password"
                                required
                                className="w-full bg-white/[0.03] border border-white/10 p-5 rounded-2xl text-white placeholder:text-white/20 outline-none focus:border-cyber-blue/50 focus:bg-white/[0.05] focus:shadow-[0_0_30px_rgba(0,209,255,0.1)] transition-all duration-500 font-medium tracking-widest"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* BOTÓN PRINCIPAL DE ALTA GAMA
                        Lógica: Una sombra inicial más difusa y un estado hover que aumenta la luz
                        y la escala muy lentamente para una sensación de poder. */}
                    <button
                        type="submit"
                        className="w-full bg-cyber-blue text-black py-5 rounded-2xl font-black uppercase text-[11px] tracking-[0.25em] shadow-[0_10px_30px_-10px_rgba(0,209,255,0.4)] hover:shadow-[0_20px_40px_-10px_rgba(0,209,255,0.6)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-500 relative overflow-hidden group"
                    >
                        <span className="relative z-10">Conectar Sistema</span>
                        {/* Un destello de luz extra al pasar el ratón por el botón */}
                        <div className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-500 group-hover:scale-100 group-hover:bg-white/10"></div>
                    </button>
                </form>

                {/* PIE DE PÁGINA DISCRETO */}
                <p className="text-center mt-12 text-[10px] font-bold text-cyber-silver/40 uppercase tracking-widest">
                    Sistema Privado ·{' '}
                    <Link to="/register" className="text-white hover:text-cyber-blue transition-colors duration-300">
                        Solicitar Credenciales
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;