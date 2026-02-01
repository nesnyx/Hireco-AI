import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getUserMe } from "../../src/api";




const isAuthenticated = () => {
    return localStorage.getItem("token") !== null;
};



export default function ProtectedRoute() {
    const [status, setStatus] = useState('loading'); // 'loading', 'allowed', 'forbidden'
    useEffect(() => {
        const verifyUser = async () => {
            if (!isAuthenticated()) {
                setStatus('forbidden');
                return;
            }
            try {
                const userData = await getUserMe();
                if (userData?.role === 'hr') {
                    setStatus('allowed');
                } else {
                    // Role bukan user → tidak diizinkan
                    localStorage.removeItem("token"); // opsional: tolak akses token invalid-role
                    setStatus('forbidden');
                }
            } catch (error) {
                console.error("Failed to fetch user data:", error);
                localStorage.removeItem("token");
                setStatus('forbidden');
            }
        };

        verifyUser();
    }, []);

    if (status === 'loading') {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Loading...</p>
            </div>
        );
    }

    if (status === 'forbidden') {
        return <Navigate to="/admin/login" replace />;
    }

    if (!isAuthenticated()) {
        return <Navigate to="/admin/login" replace />;
    }

    return <Outlet />
}

