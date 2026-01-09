// -------------------------------------------------------------------------
// 📂 ARCHIVO: src/pages/public/Home.jsx
// 📝 DESCRIPCIÓN: Landing Page Premium con estética de alta ingeniería.
// -------------------------------------------------------------------------
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="min-h-screen relative overflow-hidden">
            
            {/* 🌌 LUCES AMBIENTALES DE BIENVENIDA
                Lógica: Creamos una atmósfera de lujo con nubes de luz que flotan. */}
            <div className="absolute top-[10%] left-[-10%] w-[70%] h-[70%] bg-cyber-blue/5 blur-[160px] rounded-full animate-float-slow pointer-events-none"></div>
            <div className="absolute bottom-[0%] right-[-10%] w-[60%] h-[60%] bg-cyber-purple/5 blur-[160px] rounded-full animate-float-slow [animation-delay:3s] pointer-events-none"></div>

            {/* 🚀 SECCIÓN HERO (El primer impacto) */}
            <section className="relative z-10 pt-32 pb-40 px-6">
                <div className="max-w-7xl mx-auto text-center reveal-premium">
                    
                    {/* Etiqueta técnica superior */}
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/5 bg-white/[0.02] mb-10">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-blue opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyber-blue"></span>
                        </span>
                        <span className="text-[9px] font-black text-cyber-silver uppercase tracking-[0.4em]">Sincronización Neural V.4</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-none">
                        Domina el mercado con <br/>
                        <span className="bg-gradient-to-r from-cyber-blue via-white to-cyber-purple bg-clip-text text-transparent italic">
                            Inteligencia Pura
                        </span>
                    </h1>
                    
                    <p className="text-lg md:text-xl text-cyber-silver/60 mb-14 max-w-3xl mx-auto font-medium leading-relaxed">
                        Despliega un ecosistema de gestión avanzada. Controla activos, 
                        optimiza flujos de trabajo y escala tu visión con consultoría IA de élite.
                    </p>

                    <div className="flex flex-col md:flex-row justify-center items-center gap-6">
                        <Link
                            to="/register"
                            className="w-full md:w-auto bg-cyber-blue text-black px-12 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] shadow-[0_20px_40px_-15px_rgba(0,209,255,0.5)] hover:scale-105 transition-all duration-700"
                        >
                            Iniciar Protocolo
                        </Link>
                        <Link
                            to="/login"
                            className="w-full md:w-auto glass border-white/10 text-white px-12 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-white/5 transition-all duration-700"
                        >
                            Acceso Sistema
                        </Link>
                    </div>
                </div>
            </section>

            {/* 🛠️ SECCIÓN DE CARACTERÍSTICAS (Módulos de Cristal) */}
            <section className="relative z-10 py-32 border-t border-white/5 bg-white/[0.01]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-3 gap-10">
                        
                        {/* CARD 1: CLIENTES */}
                        <div className="glass glass-hover p-12 reveal-premium [animation-delay:0.2s]">
                            <div className="text-cyber-blue text-xs font-black mb-10 tracking-[0.4em] uppercase">01 / Activos</div>
                            <h3 className="text-3xl font-black text-white mb-4 tracking-tighter italic">Clientes VIP</h3>
                            <p className="text-cyber-silver/50 text-sm leading-relaxed font-medium">
                                Base de datos inteligente con segmentación por prioridad y análisis de valor real.
                            </p>
                        </div>

                        {/* CARD 2: TAREAS */}
                        <div className="glass glass-hover p-12 reveal-premium [animation-delay:0.4s]">
                            <div className="text-cyber-blue text-xs font-black mb-10 tracking-[0.4em] uppercase">02 / Operaciones</div>
                            <h3 className="text-3xl font-black text-white mb-4 tracking-tighter italic">Objetivos Pro</h3>
                            <p className="text-cyber-silver/50 text-sm leading-relaxed font-medium">
                                Sistema de cumplimiento dinámico. Prioriza misiones críticas con alertas de urgencia.
                            </p>
                        </div>

                        {/* CARD 3: IA */}
                        <div className="glass glass-hover p-12 reveal-premium [animation-delay:0.6s]">
                            <div className="text-cyber-blue text-xs font-black mb-10 tracking-[0.4em] uppercase">03 / Estrategia</div>
                            <h3 className="text-3xl font-black text-white mb-4 tracking-tighter italic">Núcleo IA</h3>
                            <p className="text-cyber-silver/50 text-sm leading-relaxed font-medium">
                                Consultoría neural 24/7. Transforma tus datos en estrategias de crecimiento explosivo.
                            </p>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;