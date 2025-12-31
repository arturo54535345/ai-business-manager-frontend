import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicLayout from './layouts/PublicLayout';


// Importamos las páginas que creamos en los pasos 6 y 7
import Home from './pages/public/Home';
import Login from './pages/public/Login';
import Register from './pages/public/Register'
import Dashboard from './pages/private/Dashboard';
import Clients from './pages/private/Clients'
import AddClient from './pages/private/AddClient';
import Tasks from './pages/private/Tasks';
import AddTask from './pages/private/AddTask';
import ConsultanIA from './pages/private/ConsultanIA';
import EditClient from './pages/private/EditClient';

function App() {
  return (
    // 1. El cerebro envuelve a todos para que tengan memoria
    <AuthProvider>
      
      {/*gestiona las URL*/}
      <BrowserRouter>
        <Routes>
          
          {/*zona publica*/}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            {/*aqui ira nosotros precio etc...*/}
          </Route>

          {/*pagina del login*/}
          <Route path="/login" element={<Login />} />
          <Route path="/register"element={<Register/>}/>

          {/* zona privada*/}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/clientes"element={<Clients/>}/>
            <Route path="/clientes/nuevo"element={<AddClient/>}/>
            <Route path="/tareas"element={<Tasks/>}/>
            <Route path="/tareas/nueva"element={<AddClient/>}/>
            <Route path="/ia"element={<ConsultanIA/>}/>
            <Route path="/clientes/editar/:id"element={<EditClient/>}/>
            {/* Aquí ira clientes, tareas y la IA*/}
          </Route>

          {/*ruta de emergencia por si quiero escribir mas cosas*/}
          <Route path="*" element={<div className="p-20 text-center">404 - Página no encontrada</div>} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;