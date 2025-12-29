//he creado el marco que contiene el navbar y el footer
import { Outlet } from "react-router-dom";
import Navbar from '../components/Navbar';
//import footer...

const PublicLayout = () =>{
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar/> {/*aqui estara siempre el navbar arriba*/}

            <main className="flex-grow">
                <Outlet/> {/*Aqui es donde se almacenaran los textos para el cambio de pagina*/}
            </main>

            <footer className="bg-white border-t p-4 text-center text-gray-600">
                <p>© 2025 AI Business Manager</p> {/*Pie de pagina que siempre estara abajo*/}
            </footer>
        </div>
    );
};
export default PublicLayout;