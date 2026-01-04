import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import MainLayout from './layouts/MainLayout';

// PÁGINAS PÚBLICAS
import Home from './pages/public/Home';
import About from './pages/public/About';
import Login from './pages/public/Login';
import Register from './pages/public/Register';

// PÁGINAS PRIVADAS
import Dashboard from './pages/private/Dashboard';
import Profile from './pages/private/Profile';
import Clients from './pages/private/Clients';
import AddClient from './pages/private/AddClient';
import EditClient from './pages/private/EditClient';
import ClientDetails from './pages/private/ClientDetails';
import Tasks from './pages/private/Tasks';
import AddTask from './pages/private/AddTask';
import EditTask from './pages/private/EditTask';
import CompletedTasks from './pages/private/CompletedTasks'; // <-- 1. IMPORTANTE: Importar el registro
import AIConsultancy from './pages/private/AIConsultancy';

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" reverseOrder={false} />

      <BrowserRouter>
        <Routes>
          
          <Route element={<MainLayout />}>
            
            {/* --- SECCIONES PÚBLICAS --- */}
            <Route path="/" element={<Home />} />
            <Route path="/nosotros" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* --- SECCIONES PROTEGIDAS (Solo con llave/token) --- */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/perfil" element={<Profile />} /> {/* <-- 2. CORRECCIÓN: Solo aquí dentro */}
              
              {/* Sección de Clientes */}
              <Route path="/clientes" element={<Clients />} />
              <Route path="/clientes/nuevo" element={<AddClient />} />
              <Route path="/clientes/:id" element={<ClientDetails />} />
              <Route path="/clientes/editar/:id" element={<EditClient />} />
              
              {/* Sección de Tareas */}
              <Route path="/tareas" element={<Tasks />} />
              <Route path="/tareas/nueva" element={<AddTask />} />
              <Route path="/tareas/editar/:id" element={<EditTask />} />
              <Route path="/tareas/completadas" element={<CompletedTasks />} /> {/* <-- 3. CORRECCIÓN: Nueva calle */}
              
              {/* Sección de IA */}
              <Route path="/ia" element={<AIConsultancy />} />
            </Route>

          </Route>

          {/* RUTA 404 */}
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