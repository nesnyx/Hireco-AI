import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../../store/authStore";

export default function GuestLayout() {
    const { isAuthenticated, loading, checkAuth } = useAuthStore();
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if (loading) return null;

    // Jika sudah login, lempar ke dashboard
    if (isAuthenticated) {
        return <Navigate to="/admin/dashboard" replace />;
    }

    return <Outlet />;
}