import React, { useEffect, useState } from "react";
import { Link as ScrollLink } from "react-scroll";
import { FaGraduationCap, FaCalendarAlt, FaNewspaper, FaRocket, FaPhoneAlt } from "react-icons/fa";

const navItems = [
  { id: "aboutus", name: "About", icon: <FaGraduationCap /> },
  { id: "event", name: "Event", icon: <FaCalendarAlt /> },
  { id: "new", name: "News", icon: <FaNewspaper /> },
  { id: "coming", name: "Coming", icon: <FaRocket /> },
  { id: "contact", name: "Contact", icon: <FaPhoneAlt /> },
];

const SideProgressBar = () => {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      navItems.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(id);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <aside className="fixed top-1/3 left-0 z-10 flex flex-col gap-4 px-2 py-4 bg-white/90 shadow-md rounded-r-lg backdrop-blur-md">
      {navItems.map(({ id, name, icon }) => (
        <ScrollLink
          key={id}
          to={id}
          smooth={true}
          duration={500}
          className={`flex items-center px-2 py-2 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer 
            ${activeSection === id ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-blue-100"}`}
        >
          <span className="text-lg">{icon}</span>
          <span className={`hidden md:inline ml-2`}>
            {name}
          </span>
        </ScrollLink>
      ))}
    </aside>
  );
};

export default SideProgressBar;
