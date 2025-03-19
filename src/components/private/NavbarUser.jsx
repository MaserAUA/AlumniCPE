import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../pages/AuthContext';
import { 
  Settings, 
  Bell, 
  LogOut, 
  Edit2, 
  Menu, 
  X, 
  Home,
  Users,
  FolderPlus,
  Newspaper
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NavbarUser = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const dropdownRef = useRef(null);
  const settingsRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  // Calculate total unread messages
  useEffect(() => {
    const calculateUnreadCount = () => {
      try {
        const contacts = JSON.parse(localStorage.getItem("chat_contacts") || "[]");
        const total = contacts.reduce((sum, contact) => sum + (contact.unreadCount || 0), 0);
        setTotalUnreadCount(total);
      } catch (error) {
        console.error("Error calculating unread count:", error);
        setTotalUnreadCount(0);
      }
    };

    calculateUnreadCount();
    const interval = setInterval(calculateUnreadCount, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const departmentSectionHeight = document.getElementById("department-section")?.offsetHeight || 0;
      setIsSticky(window.scrollY > departmentSectionHeight);
    };

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Notification icon component with badge
  const NotificationIcon = ({ size = 18, className = "" }) => (
    <div className="relative inline-block">
      <Bell 
        size={size} 
        className={`transition-transform duration-200 ${
          totalUnreadCount > 0 ? 'text-orange-500' : ''
        } ${className}`}
      />
      {totalUnreadCount > 0 && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 animate-pulse">
          {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
        </div>
      )}
    </div>
  );

  // Check if route is active
  const isActive = (path) => {
    return window.location.pathname === path;
  };

  // Logout handler
  const handleAuthLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
    }
  };

  // Animation variants
  const slideInVariants = {
    initial: { x: "-100%" },
    animate: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
    exit: { x: "-100%", transition: { duration: 0.3 } }
  };

  return (
    <header className="relative z-50 font-sans">
      {/* Department Section */}
      <div 
        id="department-section" 
        className="bg-white flex items-center py-2 shadow-md"
      >
        <img
          src="https://www.kmutt.ac.th/wp-content/uploads/2020/09/KMUTT_CI_Semi_Logo-normal-full-1061x1200.png"
          alt="KMUTT Logo"
          className="h-12 mr-2"
        />
        <p className="text-gray-700 font-semibold">
          Department of Computer Engineering, Faculty of Engineering, King Mongkut's University of Technology Thonburi
        </p>
      </div>

      {/* Main Navbar */}
      <nav 
        className={`
          transition-all duration-500 ease-in-out
          ${isSticky 
            ? 'fixed top-0 left-0 w-full animate-slideDown bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 shadow-lg' 
            : 'relative bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 shadow-lg'}
        `}
      >
        <div className="w-full px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Link
              to="/homeuser"
              className="text-2xl font-extrabold text-white p-2 rounded-full hover:rounded-lg shadow-lg border border-gray-300 outline outline-2 outline-offset-4 outline-gray-200 bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 hover:from-red-400 hover:via-orange-400 hover:to-orange-500 transition duration-300 transform hover:scale-110 cursor-pointer"
            >
              KMUTT CPE Alumni
            </Link>
          </motion.div>

          {/* Hamburger Menu Button */}
          <motion.button 
            onClick={toggleMenu} 
            className="md:hidden text-white text-3xl focus:outline-none z-50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {menuOpen ? <X /> : <Menu />}
          </motion.button>

          {/* Mobile Menu */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                className="fixed top-0 left-0 h-full w-4/5 max-w-xs bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 shadow-2xl z-40 md:hidden"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={slideInVariants}
              >
                <button
                  onClick={toggleMenu}
                  className="absolute top-4 right-4 text-white text-3xl focus:outline-none"
                >
                  <X />
                </button>

                <div className="flex flex-col space-y-4 px-6 py-8 mt-12">
                  <Link
                    to="/homeuser"
                    onClick={toggleMenu}
                    className={`text-white font-medium hover:bg-white/20 px-4 py-3 rounded-lg transition duration-300 shadow-md flex items-center ${
                      isActive("/homeuser") ? 'bg-white text-blue-600' : ''
                    }`}
                  >
                    <Home className="mr-2" />
                    <span>Home</span>
                  </Link>
                  
                  <Link
                    to="/alumni"
                    onClick={toggleMenu}
                    className={`text-white font-medium hover:bg-white/20 px-4 py-3 rounded-lg transition duration-300 shadow-md flex items-center ${
                      isActive("/alumni") ? 'bg-white text-blue-600' : ''
                    }`}
                  >
                    <Users className="mr-2" />
                    <span>Alumni</span>
                  </Link>
                  
                  <Link
                    to="/newuser"
                    onClick={toggleMenu}
                    className={`text-white font-medium hover:bg-white/20 px-4 py-3 rounded-lg transition duration-300 shadow-md flex items-center ${
                      isActive("/newuser") ? 'bg-white text-blue-600' : ''
                    }`}
                  >
                    <Newspaper className="mr-2" />
                    <span>News</span>
                  </Link>
                  
                  <Link
                    to="/createpost"
                    onClick={toggleMenu}
                    className={`text-white font-medium hover:bg-white/20 px-4 py-3 rounded-lg transition duration-300 shadow-md flex items-center ${
                      isActive("/createpost") ? 'bg-white text-blue-600' : ''
                    }`}
                  >
                    <FolderPlus className="mr-2" />
                    <span>Create Post</span>
                  </Link>
                  
                  <Link
                    to="/chatpage"
                    onClick={toggleMenu}
                    className={`text-white font-medium hover:bg-white/20 px-4 py-3 rounded-lg transition duration-300 shadow-md flex items-center ${
                      isActive("/chatpage") ? 'bg-white text-blue-600' : ''
                    }`}
                  >
                    <NotificationIcon className="mr-2" />
                    <span>Notifications</span>
                  </Link>
                  
                  <Link
                    to="/editprofile"
                    onClick={toggleMenu}
                    className={`text-white font-medium hover:bg-white/20 px-4 py-3 rounded-lg transition duration-300 shadow-md flex items-center ${
                      isActive("/editprofile") ? 'bg-white text-blue-600' : ''
                    }`}
                  >
                    <Edit2 className="mr-2" />
                    <span>Edit Profile</span>
                  </Link>
                  
                  <button
                    onClick={handleAuthLogout}
                    className="text-white font-medium bg-red-500 hover:bg-red-600 px-4 py-3 rounded-lg transition duration-300 shadow-md flex items-center"
                  >
                    <LogOut className="mr-2" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-6">
            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              <Link
                to="/homeuser"
                className={`font-medium px-4 py-3 rounded-lg transition duration-300 shadow-md cursor-pointer flex items-center
                            ${isActive("/homeuser") ? 'bg-white text-blue-600' : 'text-white hover:bg-white/10'}`}
              >
                <Home className="mr-1" />
                <span>Home</span>
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              <Link
                to="/alumni"
                className={`font-medium px-4 py-3 rounded-lg transition duration-300 shadow-md cursor-pointer flex items-center
                            ${isActive("/alumni") ? 'bg-white text-blue-600' : 'text-white hover:bg-white/10'}`}
              >
                <Users className="mr-1" />
                <span>Alumni</span>
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              <Link
                to="/newuser"
                className={`font-medium px-4 py-3 rounded-lg transition duration-300 shadow-md cursor-pointer flex items-center
                            ${isActive("/newuser") ? 'bg-white text-blue-600' : 'text-white hover:bg-white/10'}`}
              >
                <Newspaper className="mr-1" />
                <span>News</span>
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              <Link
                to="/createpost"
                className={`font-medium px-4 py-3 rounded-lg transition duration-300 shadow-md cursor-pointer flex items-center
                            ${isActive("/createpost") ? 'bg-white text-blue-600' : 'text-white hover:bg-white/10'}`}
              >
                <FolderPlus className="mr-1" />
                <span>Create Post</span>
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              <Link
                to="/chatpage"
                className={`font-medium px-4 py-3 rounded-lg transition duration-300 shadow-md cursor-pointer flex items-center
                            ${isActive("/chatpage") ? 'bg-white text-blue-600' : 'text-white hover:bg-white/10'}`}
              >
                <NotificationIcon className="mr-1" />
                <span>Notifications</span>
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative" ref={settingsRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 text-white font-medium px-4 py-3 rounded-lg shadow-md hover:bg-gradient-to-r hover:from-blue-400 hover:via-blue-500 hover:to-blue-600 hover:shadow-xl transition duration-300"
                >
                  Settings
                  <Settings className="ml-2" />
                </button>
                
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl overflow-hidden shadow-xl z-50">
                    <div className="py-1">
                      <Link
                        to="/editprofile"
                        className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
                      >
                        <Edit2 size={18} className="mr-3 text-blue-500" />
                        <span>Edit Profile</span>
                      </Link>
                      
                      <hr className="my-1 border-gray-200" />
                      
                      <motion.button
                        whileHover={{ x: 3 }}
                        onClick={handleAuthLogout}
                        className="flex items-center w-full px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
                      >
                        <LogOut size={18} className="mr-3" />
                        <span>Sign Out</span>
                      </motion.button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Add styles for the slideDown animation */}
      <style>{`
        @keyframes slideDown {
          from { transform: translateY(-100%); }
          to { transform: translateY(0); }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-in-out;
        }
      `}</style>
    </header>
  );
};

export default NavbarUser;