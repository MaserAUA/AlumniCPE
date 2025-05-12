import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from '../../pages/admin/AdminDashboard';
import AdminReports from '../../pages/admin/AdminReports';
import UserManagement from '../../pages/admin/UserManagement';

function Homeadmin({ section }) {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  
  // Get the title based on active section
  const getSectionTitle = () => {
    switch(activeSection) {
      case 'dashboard':
        return 'Admin Dashboard';
      case 'reports':
        return 'Admin Reports';
      case 'users':
        return 'User Management';
      default:
        return 'Admin Dashboard';
    }
  };
  
  // Scroll to section if specified
  useEffect(() => {
    if (section) {
      setActiveSection(section);
      const sectionElement = document.getElementById(section);
      if (sectionElement) {
        sectionElement.scrollIntoView({ behavior: 'smooth' });
      } else {
        console.warn(`Section "${section}" not found`);
      }
    }
  }, [section]);

  // Handle navigation between sections
  const handleSectionChange = (sectionName) => {
    setActiveSection(sectionName);
    // Optional: Update URL without page reload
    // window.history.pushState(null, '', `/admin/${sectionName}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Dynamic Title */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight text-center">{getSectionTitle()}</h1>
          <p className="text-slate-500 mt-2 text-center">CPE Alumni System Overview and Activity Data</p>
        </header>
        
        {/* Navigation Tabs - Styled according to the image */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-gray-100 shadow-sm rounded-full">
            <button 
              onClick={() => handleSectionChange('dashboard')}
              className={`px-8 py-2.5 rounded-full font-medium text-sm transition duration-200 ${
                activeSection === 'dashboard' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => handleSectionChange('reports')}
              className={`px-8 py-2.5 rounded-full font-medium text-sm transition duration-200 ${
                activeSection === 'reports' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              Reports
            </button>
            <button 
              onClick={() => handleSectionChange('users')}
              className={`px-8 py-2.5 rounded-full font-medium text-sm transition duration-200 ${
                activeSection === 'users' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              User Management
            </button>
          </div>
        </div>
        
        {/* Content Sections */}
        <div id="dashboard" className={activeSection === 'dashboard' ? 'block' : 'hidden'}>
          <AdminDashboard />
        </div>
        
        <div id="reports" className={activeSection === 'reports' ? 'block' : 'hidden'}>
          <AdminReports />
        </div>
        
        <div id="users" className={activeSection === 'users' ? 'block' : 'hidden'}>
          <UserManagement />
        </div>
      </div>
    </div>
  );
}

export default Homeadmin;
