import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";


import useAuthStore from "../../store/authStore";
import { Loader2 } from "lucide-react";



export default function ProtectedLayout() {
    const { isAuthenticated, loading, checkAuth } = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-10 w-10 animate-spin text-red-600" />
                    <p className="text-sm font-medium text-gray-500">Memvalidasi Sesi...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    return <Outlet />;
}
