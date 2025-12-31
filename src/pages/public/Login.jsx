import { useState } from "react";
import {useAuth} from '../../context/AuthContext'
import { useNavigate, Link} from "react-router-dom";

const Login = () =>{
    //cajas para guardar lo que se escribe en el
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const {login} = useAuth();// saco la funcion login del cerebro
    const navigate = useNavigate();// con esto nos moveremos de paginas

    //funcion que al darle click al boton de entrar
    const handleSubmit = async (e) =>{
        e.preventDefault();//evita que la pagina se recargue sola 
        setError(null);//se limpian los errores anteriores

        try{
            //llamo a la funcion login
            await login(email, password);
            //si todo esta correcto nos envia al dashboard
            navigate('/dashboard');
        }catch(err) {
            //si los datos son incorrectos se mostraran estos resultados
            setError('Email o contraseña incorrectos. Revisa tu PC');
        }
    };
    return(
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="text-3xl font-extrabold text-gray-900">

                <div className="text-center mb-10">
                    <h2 className="text-3xl font-extrabold text-gray-900">Bienvenido de nuevo</h2>
                    <p className="text-gray-500 mt-2">Introduce tus datos para gestionar tu negocio</p>
                </div>
                {/*formulario*/}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/*si algo falla saltara este error*/}
                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100">
                            {error}
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Tu Email</label>
                        <input
                        type="email"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Tu Contraseña</label>
                        <input
                        type="password"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="........"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
                    >
                        Entrar a mi Panel
                    </button>
                </form>
                <p className="text-center mt-8 text-gray-600">
                    ¿No tienes cuenta?{' '}
                    <Link to="/register" className="text-blue-600 font-bold hover:underline">
                    Registrate aqui
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;