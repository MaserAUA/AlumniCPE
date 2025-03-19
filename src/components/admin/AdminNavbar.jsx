import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../pages/AuthContext'; // Adjust path as needed
import { 
  FiLogOut, FiMenu, FiX, FiChevronDown, FiBell 
} from 'react-icons/fi';

function AdminNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'user',
      message: '5 new members registered today',
      time: '30 minutes ago',
      read: false
    },
    {
      id: 2,
      type: 'report',
      message: '2 inappropriate content reports',
      time: '2 hours ago',
      read: true
    },
    {
      id: 3,
      type: 'system',
      message: 'System update successful',
      time: '1 day ago',
      read: true
    }
  ]);

  // Check if route is active
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Close dropdown menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsNotificationOpen(false);
      setIsUserMenuOpen(false);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  
  return (
    <>
      <nav className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-3">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-white text-blue-800 p-2 rounded-lg shadow-md mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <Link to="/admin" className="text-xl font-bold tracking-tight">
                <span className="text-blue-300">CPE</span> <span className="text-white">Alumni</span> <span className="text-xs bg-blue-600 px-2 py-1 rounded-md ml-1 uppercase tracking-wider">Admin</span>
              </Link>
            </div>
            
          
            {/* Desktop User Menu */}
            <div className="hidden md:flex items-center space-x-3">
              {/* Notification Bell */}
              <div className="relative">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsNotificationOpen(!isNotificationOpen);
                    setIsUserMenuOpen(false);
                  }}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors relative"
                >
                  <FiBell className="text-xl" />
                  {notifications.some(n => !n.read) && (
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-blue-800"></span>
                  )}
                </button>
                
                {/* Notification Dropdown */}
                {isNotificationOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl overflow-hidden z-50 border border-gray-100"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white px-4 py-3 flex justify-between items-center">
                      <h3 className="font-medium">Notifications</h3>
                      <span className="text-xs bg-blue-800 px-2 py-1 rounded-full">
                        {notifications.filter(n => !n.read).length} new
                      </span>
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        <div>
                          {notifications.map(notification => (
                            <div 
                              key={notification.id} 
                              className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                                !notification.read ? 'bg-blue-50' : ''
                              }`}
                            >
                              <div className="flex justify-between items-start">
                                <p className={`text-sm ${!notification.read ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                                  {notification.message}
                                </p>
                                {!notification.read && (
                                  <span className="h-2 w-2 bg-blue-600 rounded-full"></span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                            </div>
                          ))}
                          <div className="px-4 py-2 text-center bg-gray-50">
                            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                              View all notifications
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="px-4 py-6 text-center text-gray-500">
                          <p>No new notifications</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* User Profile */}
              <div className="relative">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsUserMenuOpen(!isUserMenuOpen);
                    setIsNotificationOpen(false);
                  }}
                  className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 rounded-full py-1 pl-1 pr-3 transition-colors"
                >
                  <div className="bg-blue-700 rounded-full h-8 w-8 flex items-center justify-center">
                    <span className="text-md font-semibold text-white uppercase">
                      {user?.firstName?.charAt(0) || 'A'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium">{user?.firstName || 'Admin'}</span>
                    <FiChevronDown className="ml-1 h-4 w-4" />
                  </div>
                </button>
                
                {/* User Dropdown - Simplified with only logout option */}
                {isUserMenuOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl overflow-hidden z-50 border border-gray-100"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="bg-gradient-to-r from-blue-700 to-indigo-800 px-4 py-3 text-white">
                      <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs text-blue-200">Administrator</p>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium flex items-center"
                      >
                        <FiLogOut className="mr-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                }}
                className="p-2 rounded-md bg-white/10 hover:bg-white/20 transition-colors focus:outline-none"
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
              <div className="flex flex-col space-y-1">
                <div className="pt-2 border-t border-blue-700 mt-2">
                  <div className="flex items-center px-3 py-2 space-x-3">
                    <div className="bg-blue-700 rounded-full h-8 w-8 flex items-center justify-center">
                      <span className="text-md font-semibold text-white uppercase">
                        {user?.firstName?.charAt(0) || 'A'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs text-blue-300">Administrator</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full mt-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm transition"
                  >
                    <FiLogOut className="mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}

export default AdminNavbar;