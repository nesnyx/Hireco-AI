import { BrowserRouter, Route, Routes } from "react-router-dom";

import LoginPage from "../src/pages/admin/Login";
import DashboardPage from "../src/pages/admin/Dashboard"
import NotFoundRoute from "../src/pages/NotFound";
import ProtectedRoute from "../src/layout/ProtectedLayout/admin";
import LandingPage from "../src/pages/guest/LandingPage";
import GuestLayout from "./layout/MainLayout/guestLayout";
import VerifyAccount from "./pages/admin/VerifyAccount";
import AboutPage from "./components/landingPage/About";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin Protected Routes */}
        <Route element={<GuestLayout/>}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/about" element={<AboutPage/>}/>
        </Route>
        <Route path="/verify" element={<VerifyAccount />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/dashboard" element={<DashboardPage />} />
        </Route>
        <Route path="*" element={<NotFoundRoute />} />
      </Routes>
    </BrowserRouter>
  );
}

