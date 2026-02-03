import { BrowserRouter, Route, Routes } from "react-router-dom";

import LoginPage from "../src/pages/admin/Login";
import DashboardPage from "../src/pages/admin/Dashboard"
import NotFoundRoute from "../src/pages/NotFound";
import ProtectedRoute from "../src/layout/ProtectedLayout/admin";
import Home from "../src/pages/guest/Home";
import LandingPage from "../src/pages/guest/LandingPage";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin Protected Routes */}
        <Route>
          <Route path="/" element={<LandingPage />} />
        </Route>
        <Route>
          <Route path="/admin/dashboard/analytics" element={<Home />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/dashboard" element={<DashboardPage />} />
        </Route>
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="*" element={<NotFoundRoute />} />
      </Routes>
    </BrowserRouter>
  );
}

