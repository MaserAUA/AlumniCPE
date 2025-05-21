import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  FiLogOut, FiMenu, FiX, FiHome
} from 'react-icons/fi';

function AdminNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  
  return (
    <>
      <nav className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-3">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <Link to="/admin" className="text-xl font-bold tracking-tight hover:opacity-90 transition-opacity duration-200">
                <span className="text-blue-300">KMUTT</span> <span className="text-white">CPE Alumni</span> <span className="text-xs bg-blue-600 px-2 py-1 rounded-md ml-1 uppercase tracking-wider">Admin</span>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Link 
                to="/homeuser"
                className="group flex items-center px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 text-white font-medium hover:shadow-lg hover:scale-105"
              >
                <FiHome className="mr-2 group-hover:rotate-12 transition-transform duration-200" />
                Back to Home
              </Link>
              <button
                onClick={handleLogout}
                className="group flex items-center px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-all duration-200 text-white font-medium hover:shadow-lg hover:scale-105"
              >
                <FiLogOut className="mr-2 group-hover:rotate-12 transition-transform duration-200" />
                Logout
              </button>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                }}
                className="p-2 rounded-md bg-white/10 hover:bg-white/20 transition-all duration-200 focus:outline-none hover:scale-110"
              >
                {isMobileMenuOpen ? (
                  <FiX className="h-6 w-6" />
                ) : (
                  <FiMenu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
          
          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="py-3 border-t border-blue-700">
              <div className="flex flex-col space-y-2 px-2">
                <Link 
                  to="/homeuser"
                  className="group flex items-center px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 text-white font-medium hover:shadow-lg hover:scale-105"
                >
                  <FiHome className="mr-2 group-hover:rotate-12 transition-transform duration-200" />
                  Back to Home
                </Link>
                <button
                  onClick={handleLogout}
                  className="group flex items-center px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 transition-all duration-200 text-white font-medium hover:shadow-lg hover:scale-105"
                >
                  <FiLogOut className="mr-2 group-hover:rotate-12 transition-transform duration-200" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}

export default AdminNavbar;
