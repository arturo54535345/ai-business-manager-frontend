import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicLayout from './layouts/PublicLayout';


// Importamos las páginas que creamos en los pasos 6 y 7
import Home from './pages/public/Home';
import Login from './pages/public/Login';

// Página temporal para el Dashboard (la crearemos real en el paso 9)
import Dashboard from './pages/private/Dashboard';

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

          {/* zona privada*/}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
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