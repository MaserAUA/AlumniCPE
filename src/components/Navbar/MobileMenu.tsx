import React, {useState} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthContext } from '../../context/auth_context';
import { FaUserPlus } from 'react-icons/fa';
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
  MessageCircle,
  LogIn
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const slideInVariants = {
  initial: { x: "100%" },
  animate: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
  exit: { x: "-100%", transition: { duration: 0.3 } }
};

const isActive = (path) => {
  return window.location.pathname === path;
};

export default function MobileMenu({
  userData,
  onClose,
  onSignOut,
  onShowNotification,
  showNotification
}) {
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  const {isLoading: isLoadingAuth, isAuthenticated, role } = useAuthContext()
  const navigate = useNavigate()
  const location = useLocation()

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
        className="fixed top-0 right-0 h-full w-4/5 max-w-xs bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 shadow-2xl md:hidden"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={slideInVariants}
      >

        <div className="flex flex-col space-y-4 px-6 py-8 mt-20">
          {isAuthenticated &&
            <img
              className="mx-auto cursor-pointer w-24 h-24 md:w-12 md:h-12 rounded-full object-cover hover:border-2 border-white shadow-lg transition-all duration-100 group-hover:border-blue-200"
              onClick={()=>{
                navigate("/editprofile");
                onClose()
              }}
              src={userData?.profile_picture == "" || userData?.profile_picture == undefined ?
                `https://ui-avatars.com/api/?name=${userData?.username}&background=0D8ABC&color=fff`
                : userData?.profile_picture
              }
              alt="Profile"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${userData?.username}&background=0D8ABC&color=fff`;
              }}
            />
          }
          <Link
            to={isAuthenticated ? "/homeuser" : "/"}
            onClick={onClose}
            className={`text-white font-medium hover:bg-white/20 px-4 py-3 rounded-lg transition duration-300 shadow-md flex items-center ${
              isActive(isAuthenticated ? "/homeuser" : "/") ? 'bg-blue-600' : ''
            }`}
          >
            <Home className="mr-2" />
            <span>Home</span>
          </Link>
          <Link
            to={"/newsuser"}
            onClick={onClose}
            className={`text-white font-medium hover:bg-white/20 px-4 py-3 rounded-lg transition duration-300 shadow-md flex items-center ${
              isActive("/newsuser") ? 'bg-blue-600' : ''
            }`}
          >
            <Newspaper className="mr-2" />
            <span>News</span>
          </Link>
          {isAuthenticated ?
            <>
              {!isLoadingAuth && role == "admin" &&
                <Link
                  to="/admin"
                  onClick={onClose}
                  className={`text-white font-medium hover:bg-white/20 px-4 py-3 rounded-lg transition duration-300 shadow-md flex items-center ${
                    isActive("/admin") ? 'bg-blue-600 text-white' : ''
                  }`}
                >
                  <Home className="mr-2" />
                  <span>Dashboard</span>
                </Link>
              }
              {
                // <button
                //   onClick={onShowNotification)}
                //   className={`font-medium px-3 py-3 transition transition-all duration-100 rounded-full cursor-pointer flex items-center hover:border-b-2
                //             ${showNotification ? 'bg-blue-600 text-white' : 'text-white hover:bg-white/10'}`}
                // >
                //   <NotificationIcon className="mr-2" />
                //   {showNotification && (
                //     <NotificationDropdown
                //       notifications={""}
                //       onClose={()=>setShowNotification(!showNotification)}
                //     />
                //   )}
                // </button>
              }
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
                onClick={onSignOut}
                className="text-white font-medium bg-red-500 hover:bg-red-600 px-4 py-3 rounded-lg transition duration-300 shadow-md flex items-center"
              >
                <LogOut className="mr-2" />
                <span>Sign Out</span>
              </button>
            </> 
            :
            <div className="space-y-4">
              <Link
                to="/login"
                state={{ from: location }}
                className="flex items-center bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 text-white font-medium px-4 py-3 rounded-lg transition duration-300 shadow-md hover:bg-gradient-to-r hover:from-orange-500 hover:via-orange-600 hover:to-orange-700"
              >
                <LogIn className="mr-2 bg-white text-blue-600 p-1 rounded-full text-3xl" />
                Sign In
              </Link>
              <Link
                to="/registryUser"
                className="flex items-center bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 text-white font-bold px-4 sm:px-6 py-2.5 sm:py-3 rounded-[25px] shadow-lg transition duration-300 transform hover:scale-110 cursor-pointer hover:from-blue-400 hover:via-blue-500 hover:to-blue-600 hover:shadow-blue-500/50 hover:shadow-xl group text-sm sm:text-base"
              >
                <FaUserPlus className="mr-2 bg-white text-orange-500 p-1 sm:p-1.5 rounded-full text-xl sm:text-2xl transition-colors duration-300 group-hover:text-blue-500" />
                Sign Up
              </Link>
            </div>
          }
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
