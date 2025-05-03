import React, {useState} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { Link, useNavigate } from 'react-router-dom';

const slideInVariants = {
  initial: { x: "-100%" },
  animate: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
  exit: { x: "-100%", transition: { duration: 0.3 } }
};

const isActive = (path) => {
  return window.location.pathname === path;
};

export default function MobileMenu({ onClose, onShowSignOut, onShowNotification, showNotification }) {
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);

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

  return (
    <AnimatePresence>
      <motion.div
        className="fixed top-0 left-0 h-full w-4/5 max-w-xs bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 shadow-2xl z-40 md:hidden"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={slideInVariants}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-3xl focus:outline-none"
        >
          <X />
        </button>

        <div className="flex flex-col space-y-4 px-6 py-8 mt-12">
          <Link
            to="/admin"
            onClick={onClose}
            className={`text-white font-medium hover:bg-white/20 px-4 py-3 rounded-lg transition duration-300 shadow-md flex items-center ${
              isActive("/homeuser") ? 'bg-blue-600 text-white' : ''
            }`}
          >
            <Home className="mr-2" />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/homeuser"
            onClick={onClose}
            className={`text-white font-medium hover:bg-white/20 px-4 py-3 rounded-lg transition duration-300 shadow-md flex items-center ${
              isActive("/homeuser") ? 'bg-blue-600 text-white' : ''
            }`}
          >
            <Home className="mr-2" />
            <span>Home</span>
          </Link>
          
          <Link
            to="/alumni"
            onClick={onClose}
            className={`text-white font-medium hover:bg-white/20 px-4 py-3 rounded-lg transition duration-300 shadow-md flex items-center ${
              isActive("/alumni") ? 'bg-blue-600 text-white' : ''
            }`}
          >
            <Users className="mr-2" />
            <span>Alumni</span>
          </Link>
          
          <Link
            to="/newsuser"
            onClick={onClose}
            className={`text-white font-medium hover:bg-white/20 px-4 py-3 rounded-lg transition duration-300 shadow-md flex items-center ${
              isActive("/newsuser") ? 'bg-blue-600 text-white' : ''
            }`}
          >
            <Newspaper className="mr-2" />
            <span>News</span>
          </Link>
          
          <Link
            to="/createpost"
            onClick={onClose}
            className={`text-white font-medium hover:bg-white/20 px-4 py-3 rounded-lg transition duration-300 shadow-md flex items-center ${
              isActive("/createpost") ? 'bg-blue-600 text-white' : ''
            }`}
          >
            <FolderPlus className="mr-2" />
            <span>Create Post</span>
          </Link>
          
          <button
            onClick={onShowNotification}
            className={`text-white font-medium hover:bg-white/20 px-4 py-3 rounded-lg transition duration-300 shadow-md flex items-center ${
              showNotification ? 'bg-blue-600 text-white' : ''
            }`}
          >
            <NotificationIcon className="mr-2" />
            <span>Notifications</span>
          </button>
          
          <Link
            to="/editprofile"
            onClick={onClose}
            className={`text-white font-medium hover:bg-white/20 px-4 py-3 rounded-lg transition duration-300 shadow-md flex items-center ${
              isActive("/editprofile") ? 'bg-blue-600 text-white' : ''
            }`}
          >
            <Edit2 className="mr-2" />
            <span>Edit Profile</span>
          </Link>
          
          <button
            onClick={onShowSignOut}
            className="text-white font-medium bg-red-500 hover:bg-red-600 px-4 py-3 rounded-lg transition duration-300 shadow-md flex items-center"
          >
            <LogOut className="mr-2" />
            <span>Sign Out</span>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
