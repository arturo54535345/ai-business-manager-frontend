import {Link} from 'react-router-dom';

const Home = () =>{
    return(
    <div className="bg-white">
        {/*seccion principal HERO*/}
        <section className="pt-20 pb-32 px-4">
            <div className="max-w-7xl mx-auto text-center">
                <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 tracking-tight">
                    Gestiona tu negocio con <br/>
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-trasnparent">
                        Inteligencia Artificial
                    </span>
                </h1>
                <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                    Organiza tus clientes, controla tus tareas y recibe consejos estrategicos
                    de la IA en un solo lugar.
                </p>
                <div className="flex justify-center gap-4">
                    <Link
                    to="/register"
                    className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all"
                    >
                        Empezar Ahora
                    </Link>
                    <Link
                    to="/nosotros"
                    className="bg-gray-50 text-gray-900 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all"
                    >
                        Saber mas
                    </Link>
                </div>
            </div>
        </section>
    {/*seccion  de las caracteristicas*/}
    <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="text-blue-600 text--3xl mb-4">Te ayudamos</div>
                <h3 className="text-xl font-bold mb-2">Clientes VIP</h3>
                <p className="text-gray-600">Control total de tus contactos y su importancia para el negocio.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <dvi classNam="text-blue-600 text-3xl mb-4">Calendario</dvi>
                <h3 className="text-xl font-bold mb-2">Tareas Inteligentes</h3>
                <p className="text-gray-600">Nunca olvides un vencimiento. Prioriza lo que de verdad importa.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="text-blue-600 text-3xl mb-4">IA</div>
                <h3 className="text-xl font-bold mb-2">Consultora IA</h3>
                <p className="text-gray-600">Preguntale a la IA como mejorar tus ventas basandose en tus datos.</p>
            </div>
        </div>
    </section>
    </div>
    );
};