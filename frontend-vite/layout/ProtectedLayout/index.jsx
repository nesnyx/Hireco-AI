import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getUserMe } from "../../src/api";



const isAuthenticated = () => {
    return localStorage.getItem("token") !== null;
};



export default function ProtectedRoute() {
    if (!isAuthenticated()) {
        return <Navigate to="/admin/login" />;
    }
    return <Outlet />
}
