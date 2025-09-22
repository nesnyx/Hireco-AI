import { BrowserRouter, Route, Routes } from "react-router-dom";

import LoginPage from "../pages/admin/Login";
import DashboardPage from "../pages/admin/Dashboard"
import JobDashboard from "../pages/user/Dashboard";
import NotFoundRoute from "../pages/NotFound";
import LoginPageUser from "../pages/user/Login";
import ProtectedRoute from "../layout/ProtectedLayout/admin";
import UserProtectedRoute from "../layout/ProtectedLayout/user";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/dashboard" element={<DashboardPage />} />
        </Route>

        {/* User Protected Routes */}
        <Route element={<UserProtectedRoute />}>
          <Route path="/dashboard/jobs" element={<JobDashboard />} />
        </Route>
        
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/user/login" element={<LoginPageUser />} />



        <Route path="*" element={<NotFoundRoute />} />
      </Routes>
    </BrowserRouter>
  );
}

