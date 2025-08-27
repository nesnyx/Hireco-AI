import React, { useEffect, useState } from 'react';
import Applicant from '../../components/admin/Applicants';
import Jobs from '../../components/admin/Jobs';
import Dashboard from '../../components/admin/Dashboard';
import Profile from '../../components/admin/Profile';
import { getUserMe } from '../../src/api';

const DashboardPage = () => {
  const [activePage, setActivePage] = useState('applicant'); // Default page
  useEffect(() => {
    (async () => {
      try {
        await getUserMe()
      } catch (error) {
        console.log("Caught in useEffect:", error)
      }
    })()
  }, [])



  // --- Render Content Based on Active Page ---
  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />

      case 'applicant':
        return <Applicant />

      case 'jobs':
        return <Jobs />

      case 'profile':
        return <Profile />

      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-200 via-blue-100 to-blue-300 flex">
      {/* Container tanpa max-width, full screen */}
      <div className="w-full flex flex-col bg-white shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b bg-white">
          <div className="text-2xl font-bold text-black">Hireco</div>
          <img src="https://avatar.iran.liara.run/public/49" alt="Profile" className="w-10 h-10 rounded-full" />
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col flex-shrink-0">
            <div className="p-6 border-b">
              <img src="https://avatar.iran.liara.run/public/48" alt="Logo" className="h-8" />
            </div>
            <nav className="flex-1 px-4 py-6">
              <ul className="space-y-4">
                <li>
                  <button
                    onClick={() => setActivePage('dashboard')}
                    className={`flex items-center px-4 py-3 w-full text-left rounded-md transition ${activePage === 'dashboard'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-blue-50'
                      }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                    </svg>
                    Dashboard
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActivePage('applicant')}
                    className={`flex items-center px-4 py-3 w-full text-left rounded-md transition ${activePage === 'applicant'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-blue-50'
                      }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" />
                      <path d="M10 8a2 2 0 110 4 2 2 0 010-4z" />
                    </svg>
                    Applicant
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActivePage('jobs')}
                    className={`flex items-center px-4 py-3 w-full text-left rounded-md transition ${activePage === 'jobs'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-blue-50'
                      }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                    </svg>
                    Jobs
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActivePage('profile')}
                    className={`flex items-center px-4 py-3 w-full text-left rounded-md transition ${activePage === 'profile'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-blue-50'
                      }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    Profile
                  </button>
                </li>
              </ul>
            </nav>
            <div className="p-4 border-t">
              <button
                onClick={() => {
                  alert('Logged out!')
                  localStorage.removeItem('token')
                  window.location.href = '/admin/login'
                }}
                className="flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-md transition w-full text-left cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 000-2H4.707l1-1H15a1 1 0 000-2H3.707l-.707.707L3 3z" clipRule="evenodd" />
                </svg>
                Logout
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-auto bg-gray-50 p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;