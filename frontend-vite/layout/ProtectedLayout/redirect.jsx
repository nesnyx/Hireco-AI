// src/components/LoginRedirectRoute.jsx
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getUserMe } from "../../src/api";

const isAuthenticated = () => {
    return localStorage.getItem("token") !== null;
};

export default function LoginRedirectRouteUser() {
    const [status, setStatus] = useState('loading'); // loading, redirect, allow

    useEffect(() => {
        const checkLogin = async () => {
            if (!isAuthenticated()) {
                setStatus('allow'); // boleh lihat login page
                return;
            }

            try {
                const userData = await getUserMe();
                if (userData?.role === 'hr') {
                    setStatus('redirect'); // sudah login sebagai user → arahkan ke dashboard
                } else {
                    // Jika bukan user, biarkan login (mungkin HR/Admin login di tempat lain)
                    // Tapi kita tetap izinkan akses ke login page
                    setStatus('allow');
                }
            } catch (error) {
                console.error("Auth check failed:", error);
                localStorage.removeItem("token");
                setStatus('allow');
            }
        };

        checkLogin();
    }, []);

    if (status === 'loading') {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Checking session...</p>
            </div>
        );
    }

    if (status === 'redirect') {
        return <Navigate to="/admin/dashboard" replace />;
    }

    return <Outlet />;
}