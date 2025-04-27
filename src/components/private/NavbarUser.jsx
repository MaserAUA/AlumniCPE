import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
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
  Newspaper,
  MessageCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NavbarUser = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const dropdownRef = useRef(null);
  const settingsRef = useRef(null);
  const notificationRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState([]);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  // Calculate total unread messages and collect unread message details
  useEffect(() => {
    const calculateUnreadCount = () => {
      try {
        const contacts = JSON.parse(localStorage.getItem("chat_contacts") || "[]");
        const total = contacts.reduce((sum, contact) => sum + (contact.unreadCount || 0), 0);
        setTotalUnreadCount(total);
        
        const unreadMsgs = contacts
          .filter(contact => contact.unreadCount > 0)
          .map(contact => ({
            id: contact.email,
            sender: `${contact.firstName} ${contact.lastName}`,
            avatar: contact.avatar || "https://via.placeholder.com/150",
            message: contact.lastMessage || "New message",
            time: contact.lastMessageTime || new Date().toISOString(),
            unreadCount: contact.unreadCount
          }));
        
        setUnreadMessages(unreadMsgs);
      } catch (error) {
        console.error("Error calculating unread count:", error);
        setTotalUnreadCount(0);
        setUnreadMessages([]);
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
      
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationOpen(false);
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

  // Format date/time
  const formatTime = (timestamp) => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      
      if (date.toDateString() === now.toDateString()) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else if (
        date.getDate() === now.getDate() - 1 &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      ) {
        return "Yesterday";
      } else {
        return date.toLocaleDateString();
      }
    } catch (error) {
      return "Unknown";
    }
  };

  // Navigate to chat with specific contact
  const goToChat = (contactId) => {
    // ปิดป็อปอัพและเปิดหน้าแชท
    setNotificationOpen(false);
    
    // ค้นหาข้อมูลผู้ติดต่อจาก localStorage
    try {
      const contacts = JSON.parse(localStorage.getItem("chat_contacts") || "[]");
      const contact = contacts.find(c => c.email === contactId);
      
      if (contact) {
        navigate("/chatpage", { state: { contact } });
      } else {
        navigate("/chatpage");
      }
    } catch (error) {
      console.error("Error navigating to chat:", error);
      navigate("/chatpage");
    }
  };

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

  // Dropdown animation variants
  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2 } }
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
                      isActive("/homeuser") ? 'bg-blue-600 text-white' : ''
                    }`}
                  >
                    <Home className="mr-2" />
                    <span>Home</span>
                  </Link>
                  
                  <Link
                    to="/alumni"
                    onClick={toggleMenu}
                    className={`text-white font-medium hover:bg-white/20 px-4 py-3 rounded-lg transition duration-300 shadow-md flex items-center ${
                      isActive("/alumni") ? 'bg-blue-600 text-white' : ''
                    }`}
                  >
                    <Users className="mr-2" />
                    <span>Alumni</span>
                  </Link>
                  
                  <Link
                    to="/newuser"
                    onClick={toggleMenu}
                    className={`text-white font-medium hover:bg-white/20 px-4 py-3 rounded-lg transition duration-300 shadow-md flex items-center ${
                      isActive("/newuser") ? 'bg-blue-600 text-white' : ''
                    }`}
                  >
                    <Newspaper className="mr-2" />
                    <span>News</span>
                  </Link>
                  
                  <Link
                    to="/createpost"
                    onClick={toggleMenu}
                    className={`text-white font-medium hover:bg-white/20 px-4 py-3 rounded-lg transition duration-300 shadow-md flex items-center ${
                      isActive("/createpost") ? 'bg-blue-600 text-white' : ''
                    }`}
                  >
                    <FolderPlus className="mr-2" />
                    <span>Create Post</span>
                  </Link>
                  
                  <button
                    onClick={() => setNotificationOpen(!notificationOpen)}
                    className={`text-white font-medium hover:bg-white/20 px-4 py-3 rounded-lg transition duration-300 shadow-md flex items-center ${
                      notificationOpen ? 'bg-blue-600 text-white' : ''
                    }`}
                  >
                    <NotificationIcon className="mr-2" />
                    <span>Notifications</span>
                  </button>
                  
                  <Link
                    to="/editprofile"
                    onClick={toggleMenu}
                    className={`text-white font-medium hover:bg-white/20 px-4 py-3 rounded-lg transition duration-300 shadow-md flex items-center ${
                      isActive("/editprofile") ? 'bg-blue-600 text-white' : ''
                    }`}
                  >
                    <Edit2 className="mr-2" />
                    <span>Edit Profile</span>
                  </Link>
                  
                  <button
                    onClick={()=>{
                      handleAuthLogout();
                      setDropdownOpen(false)
                    }}
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
                            ${isActive("/homeuser") ? 'bg-blue-600 text-white' : 'text-white hover:bg-white/10'}`}
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
                            ${isActive("/alumni") ? 'bg-blue-600 text-white' : 'text-white hover:bg-white/10'}`}
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
                            ${isActive("/newuser") ? 'bg-blue-600 text-white' : 'text-white hover:bg-white/10'}`}
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
                            ${isActive("/createpost") ? 'bg-blue-600 text-white' : 'text-white hover:bg-white/10'}`}
              >
                <FolderPlus className="mr-1" />
                <span>Create Post</span>
              </Link>
            </motion.div>
            
            {/* Notification Dropdown */}
            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
              ref={notificationRef}
            >
              <div className="relative">
                <button
                  onClick={() => setNotificationOpen(!notificationOpen)}
                  className={`font-medium px-4 py-3 rounded-lg transition duration-300 shadow-md cursor-pointer flex items-center
                            ${notificationOpen ? 'bg-blue-600 text-white' : 'text-white hover:bg-white/10'}`}
                >
                  <NotificationIcon className="mr-1" />
                  <span>Notifications</span>
                </button>
                
                <AnimatePresence>
                  {notificationOpen && (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={dropdownVariants}
                      className="absolute right-0 mt-2 w-80 bg-white rounded-xl overflow-hidden shadow-xl z-50 max-h-[400px] flex flex-col"
                    >
                      <div className="bg-blue-50 p-3 border-b border-blue-100">
                        <h3 className="font-medium text-blue-800">Message Notifications</h3>
                      </div>
                      
                      <div className="overflow-y-auto max-h-[300px]">
                        {unreadMessages.length > 0 ? (
                          <div className="divide-y divide-gray-100">
                            {unreadMessages.map(msg => (
                              <div 
                                key={msg.id}
                                className="p-3 hover:bg-blue-50 transition-colors cursor-pointer"
                                onClick={() => goToChat(msg.id)}
                              >
                                <div className="flex items-start">
                                  <div className="relative flex-shrink-0">
                                    <img 
                                      src={msg.avatar} 
                                      alt={msg.sender}
                                      className="w-10 h-10 rounded-full object-cover border border-gray-200"
                                    />
                                    {msg.unreadCount > 0 && (
                                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {msg.unreadCount}
                                      </span>
                                    )}
                                  </div>
                                  
                                  <div className="ml-3 flex-1">
                                    <div className="flex justify-between">
                                      <span className="font-medium text-gray-800">{msg.sender}</span>
                                      <span className="text-xs text-gray-500">{formatTime(msg.time)}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 line-clamp-1">{msg.message}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-8 text-center text-gray-500">
                            <div className="flex justify-center mb-2">
                              <MessageCircle size={40} className="text-gray-300" />
                            </div>
                            <p>No unread messages</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-auto bg-gray-50 p-2 border-t border-gray-100">
                        <button 
                          onClick={() => navigate('/chatpage')}
                          className="w-full py-2 px-3 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors text-sm font-medium flex items-center justify-center"
                        >
                          <MessageCircle size={16} className="mr-2" />
                          Open Chat Page
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
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
                
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={dropdownVariants}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-xl overflow-hidden shadow-xl z-50"
                    >
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
                          onClick={()=>{
                            handleAuthLogout();
                            setDropdownOpen(false)
                          }}
                          className="flex items-center w-full px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
                        >
                          <LogOut size={18} className="mr-3" />
                          <span>Sign Out</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* ป็อปอัพแจ้งเตือนสำหรับโหมด Mobile */}
      <AnimatePresence>
        {notificationOpen && menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div 
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setNotificationOpen(false)}
            ></div>
            <div className="bg-white w-full max-w-sm rounded-xl overflow-hidden shadow-2xl relative z-10 max-h-[80vh] flex flex-col">
              <div className="bg-blue-50 p-3 border-b border-blue-100">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-blue-800">Message Notifications</h3>
                  <button 
                    onClick={() => setNotificationOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
              
              <div className="overflow-y-auto flex-1">
                {unreadMessages.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {unreadMessages.map(msg => (
                      <div 
                        key={msg.id}
                        className="p-3 hover:bg-blue-50 transition-colors cursor-pointer"
                        onClick={() => {
                          setMenuOpen(false);
                          goToChat(msg.id);
                        }}
                      >
                        <div className="flex items-start">
                          <div className="relative flex-shrink-0">
                            <img 
                              src={msg.avatar} 
                              alt={msg.sender}
                              className="w-10 h-10 rounded-full object-cover border border-gray-200"
                            />
                            {msg.unreadCount > 0 && (
                              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {msg.unreadCount}
                              </span>
                            )}
                          </div>
                          
                          <div className="ml-3 flex-1">
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-800">{msg.sender}</span>
                              <span className="text-xs text-gray-500">{formatTime(msg.time)}</span>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-1">{msg.message}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <div className="flex justify-center mb-2">
                      <MessageCircle size={40} className="text-gray-300" />
                    </div>
                    <p>No unread messages</p>
                  </div>
                )}
              </div>
              
              <div className="bg-gray-50 p-3 border-t border-gray-100">
                <button 
                  onClick={() => {
                    setNotificationOpen(false);
                    setMenuOpen(false);
                    navigate('/chatpage');
                  }}
                  className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors font-medium flex items-center justify-center"
                >
                  <MessageCircle size={16} className="mr-2" />
                  Open Chat Page
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
