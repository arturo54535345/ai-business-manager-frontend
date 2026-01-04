// 1. HERRAMIENTAS EXTERNAS (El motor de la web)
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// 2. EL CEREBRO Y EL PORTERO (Memoria y Seguridad)
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// 3. LOS ESQUELETOS (Diseño global)
import MainLayout from './layouts/MainLayout';

// 4. PÁGINAS PÚBLICAS (Cualquiera puede entrar)
import Home from './pages/public/Home';
import About from './pages/public/About';
import Profile from './pages/private/Profile';
import Login from './pages/public/Login';
import Register from './pages/public/Register';

// 5. PÁGINAS PRIVADAS (Solo para usuarios con llave/token)
import Dashboard from './pages/private/Dashboard';
import Clients from './pages/private/Clients';
import AddClient from './pages/private/AddClient';
import EditClient from './pages/private/EditClient';
import ClientDetails from './pages/private/ClientDetails';
import Tasks from './pages/private/Tasks';
import AddTask from './pages/private/AddTask';
import EditTask from './pages/private/EditTask';
import ConsultanIA from './pages/private/ConsultanIA';

function App() {
  return (
    /* El cerebro envuelve a todos para que compartan la memoria del usuario */
    <AuthProvider>
      
      {/* El centro de notificaciones (las burbujas de aviso) */}
      <Toaster position="top-right" reverseOrder={false} />

      {/* El gestor de las calles (URL) de nuestra ciudad/web */}
      <BrowserRouter>
        <Routes>
          
          {/* A. CALLES CON NAVBAR (Todo lo que esté aquí dentro tendrá el Navbar arriba) */}
          <Route element={<MainLayout />}>
            
            {/* Secciones Públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/perfil"element={<Profile/>}/>
            <Route path="/nosotros"element={<About/>}/>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* Aquí podrías añadir /nosotros en el futuro */}

            {/* B. CALLES PROTEGIDAS (El portero revisa la entrada) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* Sección de Clientes */}
              <Route path="/clientes" element={<Clients />} />
              <Route path="/clientes/nuevo" element={<AddClient />} />
              <Route path="/clientes/:id" element={<ClientDetails />} />
              <Route path="/clientes/editar/:id" element={<EditClient />} />
              
              {/* Sección de Tareas */}
              <Route path="/tareas" element={<Tasks />} />
              <Route path="/tareas/nueva" element={<AddTask />} />
              <Route path="/tareas/editar/:id" element={<EditTask />} />
              
              {/* Sección de IA */}
              <Route path="/ia" element={<ConsultanIA />} />
            </Route>

          </Route>

          {/* RUTA DE EMERGENCIA: Si Arturo escribe una calle que no existe */}
          <Route path="*" element={
            <div className="p-20 text-center">
              <h2 className="text-2xl font-bold">404 - Página no encontrada</h2>
              <p className="text-gray-500">Parece que te has perdido en el mapa.</p>
            </div>
          } />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;