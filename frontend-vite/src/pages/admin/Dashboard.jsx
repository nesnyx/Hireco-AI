import React, { useEffect, useState } from 'react';
import { Menu, X, LayoutDashboard, Users, Briefcase, FileText, User, LogOut } from 'lucide-react'; // Menggunakan Lucide untuk icon agar lebih rapi
import Applicant from '../../components/admin/Applicants';
import Jobs from '../../components/admin/Jobs';
import Dashboard from '../../components/admin/Dashboard';
import Profile from '../../components/admin/Profile';
import FileUploads from '../../components/admin/FileUploads';
import ComparingPage from '../../components/admin/Comparing';
import useAuthStore from '../../store/authStore';
import CustomAlert from '../../components/landingPage/UI/Alert';
import { useNavigate } from 'react-router-dom';
import useCreditStore from '../../store/creditStore';

const DashboardPage = () => {
  const [activePage, setActivePage] = useState('applicant');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State untuk mobile menu
  const [alertConfig, setAlertConfig] = useState({
    show: false,
    type: 'info',
    title: '',
    message: ''
  });
  const { user } = useAuthStore();
  const { credit, findCredit } = useCreditStore()
  const navigate = useNavigate();
  useEffect(() => {
    findCredit();
    const interval = setInterval(() => {
      findCredit();
    }, 10000);

    return () => clearInterval(interval);
  }, [findCredit]);

  const showAlert = (type, title, message) => {
    setAlertConfig({ show: true, type, title, message });
  };

  const navItems = [
    { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { key: 'applicant', label: 'Applicant', icon: <Users size={20} /> },
    { key: 'jobs', label: 'Jobs', icon: <Briefcase size={20} /> },
    { key: 'file-uploads', label: 'Analysis CV', icon: <FileText size={20} /> },
    { key: 'profile', label: 'Profile', icon: <User size={20} /> },
  ];

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard />;
      case 'applicant': return <Applicant />;
      case 'jobs': return <Jobs />;
      case 'profile': return <Profile profile={user} />;
      case 'file-uploads': return <FileUploads />;
      case 'comparing': return <ComparingPage />;
      default: return <div>Page not found</div>;
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col lg:flex-row">
      {alertConfig.show && (
        <CustomAlert
          {...alertConfig}
          onClose={() => setAlertConfig(prev => ({ ...prev, show: false }))}
        />
      )}

      {/* --- MOBILE HEADER --- */}
      <div className="lg:hidden flex justify-between items-center px-6 py-4 border-b border-slate-700 bg-slate-900 sticky top-0 z-50">
        <div className="text-xl font-bold text-blue-500">Hireco</div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-slate-300 hover:bg-slate-800 rounded-lg"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* --- SIDEBAR --- */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-slate-800 border-r border-slate-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Sidebar Logo (Hidden on mobile header if redundant) */}
          <div className="hidden lg:flex p-6 border-b border-slate-700 items-center space-x-3">
            <img src="https://api.dicebear.com/9.x/adventurer/svg?seed=Maria" alt="Logo" className="h-8 rounded" />
            <span className="text-xl font-bold text-white">Hireco</span>
          </div>

          <div className="p-4 border-b border-slate-700 lg:hidden">
            <p className="text-sm text-slate-400 truncate">{user?.email}</p>
          </div>

          <nav className="flex-1 px-4 py-6 overflow-y-auto">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.key}>
                  <button
                    onClick={() => {
                      setActivePage(item.key);
                      setIsSidebarOpen(false); // Close sidebar on mobile after click
                    }}
                    className={`flex items-center space-x-3 px-4 py-3 w-full text-left rounded-xl transition-all duration-200 ${activePage === item.key
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                      }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* User Credits Section */}
          <div className="px-4 py-4 space-y-2 text-xs border-t border-slate-700">
            <div className="flex justify-between items-center bg-slate-900/50 p-2 rounded-lg">
              <span className="text-slate-400">Plan:</span>
              <span className="bg-green-700 px-2 py-0.5 rounded text-white font-medium">{user?.pricing}</span>
            </div>
            <div className="flex justify-between items-center bg-slate-900/50 p-2 rounded-lg">
              <span className="text-slate-400">Credits:</span>
              <span className="bg-blue-700 px-2 py-0.5 rounded text-white font-medium">{credit}</span>
            </div>
          </div>

          <div className="p-4 border-t border-slate-700">
            <button
              onClick={() => {
                showAlert('success', "Logout", "Logout successful");
                localStorage.removeItem('token');
                navigate("/admin/login");
              }}
              className="flex items-center px-4 py-3 text-red-400 hover:bg-red-900/20 hover:text-red-300 rounded-xl transition-all duration-200 w-full text-left cursor-pointer"
            >
              <LogOut size={20} className="mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* --- OVERLAY (Click to close sidebar on mobile) --- */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-900 overflow-hidden">
        {/* Desktop Header (Hidden on Mobile) */}
        <div className="hidden lg:flex justify-between items-center px-8 py-4 border-b border-slate-700 bg-slate-900">
          <div className="text-slate-400 italic">Welcome back, <span className="text-white font-medium">{user?.email}</span></div>
          <img
            src="https://api.dicebear.com/9.x/adventurer/svg?seed=Maria"
            alt="Profile"
            className="w-10 h-10 rounded-full border-2 border-slate-700"
          />
        </div>

        <main className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;