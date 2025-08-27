import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../layout/ProtectedLayout";
import LoginPage from "../pages/admin/Login";
import DashboardPage from "../pages/admin/Dashboard"
import JobDashboard from "../pages/user/Dashboard";
import NotFoundRoute from "../pages/NotFound";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/dashboard" element={<DashboardPage />} />
        </Route>
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/jobs" element={<JobDashboard />} />
        {/* Route 404 harus paling bawah */}
        <Route path="*" element={<NotFoundRoute />} />
      </Routes>
    </BrowserRouter>
  )
}

