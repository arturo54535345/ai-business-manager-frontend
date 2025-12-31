import {useState} from 'react';
import {useAuth} from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () =>{
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState(null);

    const {register} = useAuth();//esta funcion recien la añado al auth
    const navigate = useNavigate();

    const handleSubmit = async (e) =>{
        e.preventDefault();
        setError(null);

        try{
            await register(formData.name, formData.email, formData.password);
            navigate('/dashboard');//si sale bien el registro sera enviado directamente al dashboard
        }catch(error){
            setError('No se pudo crear la cuenta. ¿Quizas el email ya existe?');
        }
    };
    return(
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
            <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl shadow-gray-200">

                <div className="text-center mb-10">
                    <h2 className="text-3xl font-extrabold text-gray-900">Crea tu cuenta</h2>
                    <p className="text-gray-500 mt-2">Empieza a gestionar tu negocio con IA</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100">
                            {error}
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre de Usuario</label>
                        <input
                        type="text"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        onChange={(e)=> setFormData({...formData, name: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Tu Email</label>
                        <input
                        type="email"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        placeholder="arturo@ejemplo.com"
                        onChange={(e)=> setFormData({...formData, email: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Contraseña</label>
                        <input
                        type="password"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        placeholder="Minimo 6 caracteres"
                        onChange={(e)=> setFormData({...formData, password: e.target.value})}
                        />
                    </div>
                    <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all mt-4"
                    >
                        Crear mi cuenta gratis
                    </button>
                </form>
                <p className="text-center mt-8 text-gray-600">
                    ¿Ya tienes cuenta?{' '}
                    <Link to="/login" className="text-blue-600 font-bold hover:underline">
                    Iniciar sesion
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;