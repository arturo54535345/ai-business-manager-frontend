import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PrivateLayout from './layouts/PrivateLayout'; 

// PÁGINAS
import Home from './pages/public/Home';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import Dashboard from './pages/private/Dashboard';
import Clients from './pages/private/Clients';
import AddClient from './pages/private/AddClient'; // ✅ Nueva
import EditClient from './pages/private/EditClient'; // ✅ Nueva
import ClientDetails from './pages/private/ClientDetails'; // ✅ Nueva
import Tasks from './pages/private/Tasks';
import AddTask from './pages/private/AddTask'; // ✅ Nueva
import EditTask from './pages/private/EditTask'; // ✅ Nueva
import TaskDetails from './pages/private/TaskDetails'; // ✅ Nueva
import CompletedTasks from './pages/private/CompletedTasks'; // ✅ Nueva
import Finance from './pages/private/Finance';
import AIConsultancy from './pages/private/AIConsultancy';
import Profile from './pages/private/Profile';

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<PrivateLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* RUTAS DE CLIENTES */}
              <Route path="/clientes" element={<Clients />} />
              <Route path="/clientes/nuevo" element={<AddClient />} />
              <Route path="/clientes/:id" element={<ClientDetails />} />
              <Route path="/clientes/editar/:id" element={<EditClient />} />

              {/* RUTAS DE TAREAS */}
              <Route path="/tareas" element={<Tasks />} />
              <Route path="/tareas/nueva" element={<AddTask />} />
              <Route path="/tareas/:id" element={<TaskDetails />} />
              <Route path="/tareas/editar/:id" element={<EditTask />} />
              <Route path="/tareas/completadas" element={<CompletedTasks />} />

              <Route path="/finanzas" element={<Finance />} />
              <Route path="/ia" element={<AIConsultancy />} />
              <Route path="/perfil" element={<Profile />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;