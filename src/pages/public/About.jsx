const About = () => {
    return (
        <div className="p-8 max-w-4xl mx-auto space-y-12">
            {/* 1. QUIÉNES SOMOS */}
            <section>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">¿Quiénes Somos?</h2>
                <p className="text-gray-600 leading-relaxed text-lg">
                    Somos un equipo enfocado en potenciar pequeños negocios mediante el uso de 
                    <strong> Inteligencia Artificial</strong>. Creemos que la tecnología debe ser 
                    una aliada para organizar mejor el tiempo y los clientes.
                </p>
            </section>

            {/* 2. QUÉ HACE LA WEB */}
            <section className="bg-blue-50 p-8 rounded-3xl border border-blue-100">
                <h2 className="text-3xl font-bold text-blue-900 mb-4">¿Qué hace esta plataforma?</h2>
                <ul className="space-y-4 text-blue-800">
                    <li className="flex items-start gap-2">
                        <span>✅</span> 
                        <strong>Gestión de Clientes:</strong> Guarda contactos, clasifícalos por categorías (VIP, Potencial) y añade notas técnicas.
                    </li>
                    <li className="flex items-start gap-2">
                        <span>✅</span> 
                        <strong>Control de Tareas:</strong> Organiza tus pendientes con prioridades y fechas de entrega.
                    </li>
                    <li className="flex items-start gap-2">
                        <span>✅</span> 
                        <strong>Asistente IA:</strong> Recibe consejos estratégicos basados en tus propios datos reales.
                    </li>
                </ul>
            </section>

            {/* 3. CÓMO USARLA */}
            <section>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Guía rápida de uso</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <span className="text-2xl font-bold text-blue-600">1</span>
                        <h4 className="font-bold mt-2">Regístrate</h4>
                        <p className="text-sm text-gray-500">Crea tu cuenta gratis para empezar a guardar datos.</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <span className="text-2xl font-bold text-blue-600">2</span>
                        <h4 className="font-bold mt-2">Añade Datos</h4>
                        <p className="text-sm text-gray-500">Registra tus primeros clientes y las tareas que tienes pendientes.</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <span className="text-2xl font-bold text-blue-600">3</span>
                        <h4 className="font-bold mt-2">Consulta a la IA</h4>
                        <p className="text-sm text-gray-500">Ve a la sección de IA y pregunta cómo mejorar tu rendimiento.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;