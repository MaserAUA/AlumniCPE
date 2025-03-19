import React, { useState, useEffect } from 'react';
import { IoIosLogIn } from 'react-icons/io';
import { FiMenu, FiX } from 'react-icons/fi';
import { Link as ScrollLink } from "react-scroll";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaGraduationCap, FaCalendarAlt, FaNewspaper, FaRocket, FaPhoneAlt } from 'react-icons/fa';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      const departmentSectionHeight = document.getElementById("department-section")?.offsetHeight || 0;
      if (window.scrollY > departmentSectionHeight) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }

      // Add active section detection
      const sections = ["aboutus", "event", "new", "coming", "contact"];
      let currentSection = "";

      sections.forEach((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            currentSection = section;
          }
        }
      });

      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // สร้าง navItems ใหม่พร้อมไอคอนและสีที่ใช้เมื่อ active
  const navItems = [
    { id: "aboutus", name: "About", icon: <FaGraduationCap />, activeColor: "bg-white text-blue-600" },
    { id: "event", name: "Event", icon: <FaCalendarAlt />, activeColor: "bg-white text-blue-600" },
    { id: "new", name: "News", icon: <FaNewspaper />, activeColor: "bg-white text-blue-600" },
    { id: "coming", name: "Coming", icon: <FaRocket />, activeColor: "bg-white text-blue-600" },
    { id: "contact", name: "Contact", icon: <FaPhoneAlt />, activeColor: "bg-white text-blue-600" }
  ];

  // Animation variants
  const slideInVariants = {
    initial: { x: "-100%" },
    animate: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
    exit: { x: "-100%", transition: { duration: 0.3 } }
  };

  return (
    <header className="relative z-50 font-sans">
      {/* Top Header Section */}
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

      {/* Main Navbar Section */}
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
            <ScrollLink
              to="department-section"
              smooth={true}
              duration={500}
              className="text-2xl font-extrabold text-white p-2 rounded-full hover:rounded-lg shadow-lg border border-gray-300 outline outline-2 outline-offset-4 outline-gray-200 bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 hover:from-red-400 hover:via-orange-400 hover:to-orange-500 transition duration-300 transform hover:scale-110 cursor-pointer"
            >
              KMUTT CPE Alumni
            </ScrollLink>
          </motion.div>

          {/* Hamburger Menu Button */}
          <motion.button 
            onClick={toggleMenu} 
            className="md:hidden text-white text-3xl focus:outline-none z-50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {menuOpen ? <FiX /> : <FiMenu />}
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
                  <FiX />
                </button>

                <div className="flex flex-col space-y-4 px-6 py-8 mt-12">
                  {navItems.map((item, index) => (
                    <ScrollLink
                      key={item.id}
                      to={item.id}
                      smooth={true}
                      duration={500}
                      onClick={toggleMenu}
                      className="text-white font-medium hover:bg-white/20 px-4 py-3 rounded-lg transition duration-300 shadow-md flex items-center"
                    >
                      <span className="mr-2">{item.icon}</span>
                      <span>{item.name}</span>
                    </ScrollLink>
                  ))}
                  
                  <Link
                    to="/login"
                    className="text-2xl font-extrabold text-white p-2 rounded-full hover:rounded-lg shadow-lg hover:shadow-orange-500/50 border border-gray-300 outline outline-2 outline-offset-4 outline-gray-200 bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 hover:from-red-400 hover:via-orange-400 hover:to-orange-500 transition duration-300 transform hover:scale-110 cursor-pointer flex items-center justify-center"
                  >
                    Sign In
                    <IoIosLogIn className="ml-2 bg-white text-orange-600 p-1 rounded-full text-3xl" />
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                <ScrollLink
                  to={item.id}
                  smooth={true}
                  duration={500}
                  className={`font-medium px-4 py-3 rounded-lg transition duration-300 shadow-md cursor-pointer flex items-center
                            ${activeSection === item.id ? item.activeColor : 'text-white hover:bg-white/10'}`}
                >
                  <span className="mr-1">{item.icon}</span>
                  <span>{item.name}</span>
                </ScrollLink>
              </motion.div>
            ))}
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/login"
                className="flex items-center bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 text-white font-medium px-4 py-2 rounded-lg shadow-lg hover:bg-gradient-to-r hover:from-orange-500 hover:via-orange-600 hover:to-orange-700 hover:shadow-xl hover:scale-110 transition duration-300"
              >
                Sign In
                <IoIosLogIn className="ml-2 bg-white text-blue-600 p-1 rounded-full text-3xl" />
              </Link>
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

export default Navbar;