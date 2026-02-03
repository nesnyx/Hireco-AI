import React, { useEffect, useState } from 'react';
import Applicant from '../../components/admin/Applicants';
import Jobs from '../../components/admin/Jobs';
import Dashboard from '../../components/admin/Dashboard';
import Profile from '../../components/admin/Profile';
import FileUploads from '../../components/admin/FileUploads';
import ComparingPage from '../../components/admin/Comparing';
import useAuthStore from '../../store/authStore';

const DashboardPage = () => {
  const [activePage, setActivePage] = useState('applicant'); // Default page

  const { user } = useAuthStore()
  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />

      case 'applicant':
        return <Applicant />

      case 'jobs':
        return <Jobs />

      case 'profile':
        return <Profile profile={user} />

      case 'file-uploads':
        return <FileUploads />

      case 'comparing':
        return <ComparingPage />

      case 'exporting':
        return <div>Exporting Page</div>
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex">
      {/* Container dengan tema dark */}
      <div className="w-full flex flex-col bg-slate-900 shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-700 bg-slate-900">
          <div className="flex items-center">
            <div className="text-2xl font-bold text-gradient">Hireco</div>
          </div>
          <div>{user?.email}</div>
          <img
            src="https://api.dicebear.com/9.x/adventurer/svg?seed=Maria"
            alt="Profile"
            className="w-10 h-10 rounded-full border-2 border-slate-700"
          />
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col flex-shrink-0">
            <div className="p-6 border-b border-slate-700 flex items-center space-x-3">

              <img
                src="https://api.dicebear.com/9.x/adventurer/svg?seed=Maria"
                alt="Logo"
                className="h-8 rounded"
              />
              <p>{user?.email}</p>
            </div>

            <nav className="flex-1 px-4 py-6">
              <ul className="space-y-2">
                {[
                  {
                    key: 'dashboard',
                    label: 'Dashboard',

                  },
                  {
                    key: 'applicant',
                    label: 'Applicant',

                  },
                  {
                    key: 'jobs',
                    label: 'Jobs',

                  },

                  {
                    key: 'file-uploads',
                    label: 'FileUploads',

                  },
                  {
                    key: 'comparing',
                    label: 'Comparing',

                  },
                  {
                    key: 'profile',
                    label: 'Profile',

                  },
                  {
                    key: 'exporting',
                    label: 'Exporting',

                  },
                ].map((item) => (
                  <li key={item.key}>
                    <button
                      onClick={() => setActivePage(item.key)}
                      className={`flex items-center px-4 py-3 w-full text-left rounded-xl transition-all duration-200 ${activePage === item.key
                        ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-400 border border-blue-500/30'
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                        }`}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
            <div className='flex items-center justify-center mb-5'>
              Pricing Plan : <div className='bg-green-700 px-1 '>{user?.pricing?.name}</div>
            </div>
            <div className="p-4 border-t border-slate-700">
              <button
                onClick={() => {
                  alert('Logged out!')
                  localStorage.removeItem('token')
                  window.location.href = '/admin/login'
                }}
                className="flex items-center px-4 py-3 text-red-400 hover:bg-red-900/20 hover:text-red-300 rounded-xl transition-all duration-200 w-full text-left cursor-pointer"
              >
                <svg className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                </svg>
                Logout
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-auto bg-slate-900 p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;