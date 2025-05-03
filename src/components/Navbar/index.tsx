import React, { useState, useEffect, useRef } from 'react';
// import { useRouter } from "next/router";
import { IoIosLogIn } from 'react-icons/io';
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
import { useQueryClient } from "@tanstack/react-query";
import Header from "./Header"
import NotificationDropdown from "./NotificationDropdown";
import LogoutModal from "./LogoutModal";
import MobileMenu from "./MobileMenu";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../context/auth_context';
import { useGetUserById } from '../../hooks/useUser';
import { useAuth } from '../../hooks/useAuth';

const navLinksAuth = [
  { to: "/homeuser", label: "Home", icon: <Home className="mr-1" /> },
  { to: "/alumni", label: "Alumni", icon: <Users className="mr-1" /> },
  { to: "/newsuser", label: "News", icon: <Newspaper className="mr-1" /> },
  { to: "/createpost", label: "Create Post", icon: <FolderPlus className="mr-1" /> },
];

const navLinksUnAuth= [
  { to: "/", label: "Home", icon: <Home className="mr-1" /> },
  { to: "/alumni", label: "Alumni", icon: <Users className="mr-1" /> },
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

  const settingsRef = useRef(null);

  // const router = useRouter();
  const [isSticky, setIsSticky] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
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
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  // const unreadCount = notifications.filter(n => !n.read).length;

  if (isLoadingUser || isLoadingAuth) {
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
          Alumni CPE KMUTT
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
            onClose={()=>setShowMobileMenu(!showMobileMenu)}
            onShowSignOut={()=>setShowSignOut(!showSignOut)}
            onShowNotification={()=>setShowNotification(!showNotification)}
            showNotification={showNotification}
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
            <div className="relative">
              {
                // <button
                //   onClick={() => setShowNotification(!showNotification)}
                //   className={`font-medium px-3 py-3 transition transition-all duration-100 rounded-full cursor-pointer flex items-center hover:border-b-2
                //             ${showNotification ? 'bg-blue-600 text-white' : 'text-white hover:bg-white/10'}`}
                // >
                //   <NotificationIcon className="mr-1" />
                //   {showNotification && (
                //     <NotificationDropdown
                //       notifications={""}
                //       onClose={()=>setShowNotification(!showNotification)}
                //     />
                //   )}
                // </button>
              }

            </div>
          
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
          <Link
            to="/login"
            state={{ from: location }}
            className="flex items-center bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 text-white font-medium px-4 py-2 rounded-lg shadow-lg hover:bg-gradient-to-r hover:from-orange-500 hover:via-orange-600 hover:to-orange-700 hover:shadow-xl hover:scale-110 transition duration-300"
          >
            Sign In
            <IoIosLogIn className="ml-2 bg-white text-blue-600 p-1 rounded-full text-3xl" />
          </Link>
          }
        </div>
      </div>
    </nav>
  </header>
  );
}
