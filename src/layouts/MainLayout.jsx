import {Outlet} from "react-router-dom";
import Navbar from "../components/Navbar";

const MainLayout = () =>{
    return(
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar /> {/* El Navbar ahora vive aquí para todos */}
            <main className="flex-grow">
                <Outlet />
            </main>
            <footer className="bg-white border-t p-4 text-center text-gray-600">
                <p>© 2025 AI Business Manager</p>
            </footer>
        </div>
    );
};
export default MainLayout;