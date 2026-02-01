import { Outlet, Link } from "react-router-dom";

export default function MainLayout() {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Navbar */}
            <nav className="bg-blue-600 p-4 text-white flex justify-between">
                <h1 className="font-bold text-xl">MyApp</h1>
                <div className="space-x-4">
                    <Link to="/" className="hover:underline">Home</Link>
                    <Link to="/dashboard" className="hover:underline">Dashboard</Link>
                    <Link to="/login" className="hover:underline">Login</Link>
                </div>
            </nav>

            {/* Konten */}
            <main className="flex-1 p-6 bg-gray-100">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-blue-600 text-white text-center p-4">
                © 2025 MyApp
            </footer>
        </div>
    );
}
