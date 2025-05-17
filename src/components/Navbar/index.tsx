import React, { useState, useEffect, useRef } from 'react';
// import { useRouter } from "next/router";
import { IoIosLogIn } from 'react-icons/io';
import { FaUserPlus } from 'react-icons/fa';
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
  MessageCircle,
  LogIn
} from 'lucide-react';
import { useQueryClient } from "@tanstack/react-query";
import Header from "./Header"
import NotificationDropdown from "./NotificationDropdown";
import LogoutModal from "./LogoutModal";
import MobileMenu from "./MobileMenu";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../context/auth_context';
import { useGetUserById } from '../../hooks/useUser';
import { useAuth } from '../../hooks/useAuth';
import { 
  initWebSocket,
  addWebSocketListener,
  getWebSocket
} from '../../hooks/useNotifiaction';
import { useVerifyToken } from '../../api/auth';

const navLinksAuth = [
  { to: "/homeuser", label: "Home", icon: <Home className="mr-1" /> },
  { to: "/alumni", label: "Alumni", icon: <Users className="mr-1" /> },
  { to: "/newsuser", label: "News", icon: <Newspaper className="mr-1" /> },
  { to: "/createpost", label: "Create Post", icon: <FolderPlus className="mr-1" /> },
];

const navLinksUnAuth= [
  { to: "/", label: "Home", icon: <Home className="mr-1" /> },
  { to: "/newsuser", label: "News", icon: <Newspaper className="mr-1" /> },
];

const isActive = (path) => {
  return window.location.pathname === path;
};

export default function Navbar() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showSignOut, setShowSignOut] = useState(false);
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);

  const { data: verifyData, isLoading: isLoadingVerify } = useVerifyToken();

  useEffect(() => {
    if (!isLoadingVerify && verifyData?.jwt) {
      initWebSocket(verifyData.jwt, (parsed) => {
        setNotifications((prev) => [...prev, parsed]);
        setTotalUnreadCount((prev) => prev + 1);
      });
    }
  }, [isLoadingVerify, verifyData]);

  useEffect(() => {
    const handleScroll = () => {
      const departmentSectionHeight = document.getElementById("department-section")?.offsetHeight || 0;
      setIsSticky(window.scrollY > departmentSectionHeight);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        event.target instanceof Node &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
      if (
        notificationRef.current &&
        event.target instanceof Node &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotification(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const settingsRef = useRef(null);

  // const router = useRouter();
  const [isSticky, setIsSticky] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const { logout } = useAuth();
  const { userId, isAuthenticated, isLoading: isLoadingAuth, role } = useAuthContext()
  const { data: userData, isLoading: isLoadingUser} = useGetUserById(userId, {enabled: !!userId})

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


  if (isAuthenticated && (!userData || isLoadingUser || isLoadingAuth)) {
    return (<div>loading. . .</div>)
  }

  return (
  <header className="relative z-50 font-sans">
    <Header/>
    <nav 
      className={`
        transition-all duration-500 ease-in-out
        ${isSticky 
          ? 'fixed top-0 left-0 w-full animate-slideDown bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 shadow-lg' 
          : 'relative bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 shadow-lg'}
      `}
    >
      <div className="w-full px-6 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="text-2xl font-extrabold text-white p-2 rounded-full hover:rounded-lg shadow-lg
            border border-gray-300 outline outline-2 outline-offset-4 outline-gray-200 bg-gradient-to-r
            from-blue-300 via-blue-400 to-blue-500 hover:from-red-400 hover:via-orange-400 hover:to-orange-500
            transition duration-300 transform hover:scale-110 cursor-pointer"
        >
          KMUTT CPE Alumni
        </Link>

        <motion.button 
          onClick={()=>{ setShowMobileMenu(!showMobileMenu) }}
          className="md:hidden text-white text-3xl focus:outline-none z-50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {showMobileMenu ? <X /> : <Menu />}
        </motion.button>


        {showMobileMenu && (
          <MobileMenu
            userData={userData}
            onClose={()=>setShowMobileMenu(!showMobileMenu)}
            onSignOut={()=> logout()}
            onShowNotification={()=>setShowNotification(!showNotification)}
            showNotification={showNotification}
          />
        )}

        {showNotification && (
          <NotificationDropdown
            notifications={notifications}
            onClose={()=>setShowNotification(!showNotification)}
            reference={notificationRef}
          />
        )}

        <div className="hidden md:flex items-center space-x-6">
          {!isLoadingAuth && role == "admin" &&
            <Link
              key={"/admin"}
              to={"/admin"}
              className={`font-medium px-4 py-3 rounded-lg transition-all transition duration-100 shadow-md cursor-pointer flex items-center hover:border-b-2
                ${isActive("/admin") ? 'bg-blue-600 text-white' : 'text-white hover:bg-white/10'}`}
            >
              <Home className="mr-1" />
              <span>Admin</span>
            </Link>
          }
          {isAuthenticated ?
              navLinksAuth.map(({ to, label, icon }) => {
            const active = isActive(to);
            return (
              <Link
                key={to}
                to={to}
                className={`font-medium px-4 py-3 rounded-lg transition-all transition duration-100 shadow-md cursor-pointer flex items-center hover:border-b-2
                  ${active ? 'bg-blue-600 text-white' : 'text-white hover:bg-white/10'}`}
              >
                {icon}
                <span>{label}</span>
              </Link>
            );
          }) :
          navLinksUnAuth.map(({ to, label, icon }) => {
            const active = isActive(to);
            return (
              <Link
                key={to}
                to={to}
                className={`font-medium px-4 py-3 rounded-lg transition-all transition duration-100 shadow-md cursor-pointer flex items-center hover:border-b-2
                  ${active ? 'bg-blue-600 text-white' : 'text-white hover:bg-white/10'}`}
              >
                {icon}
                <span>{label}</span>
              </Link>
            );
          })}

          { isAuthenticated  ?
          <>
            { verifyData &&
              <div className="relative">
                <button
                  onClick={() => {
                    setShowNotification(!showNotification);
                    setTotalUnreadCount(0);
                  }}
                  className={`font-medium px-3 py-3 transition transition-all duration-100 rounded-full cursor-pointer flex items-center hover:border-b-2
                            ${showNotification ? 'bg-blue-600 text-white' : 'text-white hover:bg-white/10'}`}
                >
                  <NotificationIcon/>
                </button>
              </div>
            }
            <div className="relative" ref={settingsRef}>
              <img
                className="cursor-pointer w-12 h-12 md:w-12 md:h-12 rounded-full object-cover hover:border-2 border-white shadow-lg transition-all duration-100 group-hover:border-blue-200"
                onClick={() => setDropdownOpen(!dropdownOpen)}
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
              
              {dropdownOpen && (
                <LogoutModal
                  onEdit={()=>{
                    setDropdownOpen(false);
                  }}
                  onSignOut={()=>{
                    setDropdownOpen(false);
                    logout();
                  }}
                  reference={dropdownRef}
                />
              )}
            </div>
          </>
          :
          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              state={{ from: location }}
              className="font-medium px-4 py-3 rounded-lg transition-all transition duration-100 shadow-md cursor-pointer flex items-center hover:border-b-2 text-white hover:bg-white/10"
            >
              Sign In
              <LogIn className="ml-2 text-xl" />
            </Link>
            <Link
              to="/registryUser"
              className="flex items-center bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 text-white font-bold px-6 py-3 rounded-[25px] shadow-lg transition duration-300 transform hover:scale-110 cursor-pointer hover:from-blue-400 hover:via-blue-500 hover:to-blue-600 hover:shadow-blue-500/50 hover:shadow-xl group"
            >
              Sign Up
              <FaUserPlus className="ml-2 bg-white text-orange-500 p-1.5 rounded-full text-2xl transition-colors duration-300 group-hover:text-blue-500" />
            </Link>
          </div>
          }
        </div>
      </div>
    </nav>
  </header>
  );
}
