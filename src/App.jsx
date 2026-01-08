import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// CEREBRO Y SEGURIDAD
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// MARCO VISUAL (Navbar + Footer + Temas)
import MainLayout from './layouts/MainLayout';

// PÁGINAS PÚBLICAS (Abiertas a todos)
import Home from './pages/public/Home';
import About from './pages/public/About';
import Login from './pages/public/Login';
import Register from './pages/public/Register';

// PÁGINAS PRIVADAS (Solo con llave/token)
import Dashboard from './pages/private/Dashboard';
import Profile from './pages/private/Profile';
import Clients from './pages/private/Clients';
import AddClient from './pages/private/AddClient';
import EditClient from './pages/private/EditClient';
import ClientDetails from './pages/private/ClientDetails';
import Tasks from './pages/private/Tasks';
import TaskDetails from './pages/private/TaskDetails';
import AddTask from './pages/private/AddTask';
import EditTask from './pages/private/EditTask';
import CompletedTasks from './pages/private/CompletedTasks'; 
import AIConsultancy from './pages/private/AIConsultancy';
import Finance from './pages/private/Finance';

function App() {
  return (
    <AuthProvider>
      {/* 🟢 El Toaster permite ver las notificaciones de éxito/error arriba a la derecha */}
      <Toaster position="top-right" reverseOrder={false} />

      <BrowserRouter>
        <Routes>
          
          {/* 1. GRUPO PRINCIPAL: Todo lo que lleva Navbar y Footer */}
          <Route element={<MainLayout />}>
            
            {/* --- SECCIONES PÚBLICAS --- */}
            <Route path="/" element={<Home />} />
            <Route path="/nosotros" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* 2. GRUPO PROTEGIDO: El "Portero" (ProtectedRoute) vigila estas rutas */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/perfil" element={<Profile />} />
              
              {/* Gestión de Clientes */}
              <Route path="/clientes" element={<Clients />} />
              <Route path="/clientes/nuevo" element={<AddClient />} />
              <Route path="/clientes/:id" element={<ClientDetails />} />
              <Route path="/clientes/editar/:id" element={<EditClient />} />
              
              {/* Gestión de Tareas */}
              <Route path="/tareas" element={<Tasks />} />
              <Route path="/tareas/:id" element={<TaskDetails />} />
              <Route path="/tareas/nueva" element={<AddTask />} />
              <Route path="/tareas/editar/:id" element={<EditTask />} />
              <Route path="/tareas/completadas" element={<CompletedTasks />} />

              {/* Gestión Financiera */}
              <Route path="/finanzas" element={<Finance />} />

              
              {/* Inteligencia Artificial (Chat Estratégico) */}
              <Route path="/ia" element={<AIConsultancy />} />
            </Route>

          </Route>

          {/* 3. RUTA 404: Si Arturo escribe una dirección que no existe */}
          <Route path="*" element={
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-20 text-center">
              <h2 className="text-4xl font-black text-gray-900 mb-4">404</h2>
              <p className="text-gray-500 font-medium text-xl">Parece que esta página no existe en tu sistema.</p>
              <button 
                onClick={() => window.location.href = '/dashboard'}
                className="mt-8 bg-brand text-white px-8 py-3 rounded-2xl font-bold shadow-lg"
              >
                Volver al Panel
              </button>
            </div>
          } />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;