import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Aboutus from './Aboutus';
import Event from './Event';
import New from './New';
import Coming from './Coming';
import Contact from './Contact';
import { motion, useScroll, useTransform } from 'framer-motion';

function Homepage({ section }) {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("");
  const [scrollY, setScrollY] = useState(0);
  
  // สร้าง ref สำหรับแต่ละ section
  const aboutRef = useRef(null);
  const eventRef = useRef(null);
  const newRef = useRef(null);
  const comingRef = useRef(null);
  const contactRef = useRef(null);
  
  // ใช้ useScroll hook จาก framer-motion
  const { scrollYProgress } = useScroll();
  
  // จัดการการเลื่อนไปยัง section ที่ระบุเมื่อโหลดหน้า
  useEffect(() => {
    if (section) {
      const sectionElement = document.getElementById(section);
      if (sectionElement) {
        sectionElement.scrollIntoView({ behavior: 'smooth' });
      } else {
        console.warn(`Section "${section}" not found`);
      }
    }
  }, [section]);

  // ตรวจจับการเลื่อนหน้าจอ
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      // ตรวจสอบว่ากำลังมองส่วนไหนอยู่
      const sections = ["aboutus", "event", "new", "coming", "contact"];
      let current = "";
      
      const viewportHeight = window.innerHeight;
      const scrollPosition = window.scrollY + (viewportHeight * 0.4);
      
      sections.forEach((sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            current = sectionId;
          }
        }
      });
      
      if (current !== activeSection) {
        setActiveSection(current);
      }
    };

    window.addEventListener("scroll", handleScroll);
    // ทำการตรวจสอบครั้งแรกเมื่อโหลดหน้า
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeSection]);

  // คำนวณค่า transform สำหรับการเลื่อนแบบ parallax
  const aboutY = useTransform(scrollYProgress, [0, 0.25], [0, -50]);
  const eventY = useTransform(scrollYProgress, [0.15, 0.4], [50, 0]);
  const newY = useTransform(scrollYProgress, [0.35, 0.6], [50, 0]);
  const comingY = useTransform(scrollYProgress, [0.55, 0.8], [50, 0]);
  const contactY = useTransform(scrollYProgress, [0.75, 1], [50, 0]);

  return (
    <div className="overflow-hidden bg-blue-500">
      <Header activeSection={activeSection} />
      
      <section 
        id="aboutus" 
        ref={aboutRef}
        className="py-16 bg-blue-500 min-h-screen flex items-center relative"
      >
        <div className="absolute inset-0 bg-blue-400 opacity-30 z-0">
          <motion.div 
            className="bg-pattern w-full h-full"
            style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "30px 30px" }}
            animate={{ 
              backgroundPosition: ["0px 0px", "30px 30px"],
              transition: { repeat: Infinity, duration: 10, ease: "linear" }
            }}
          />
        </div>
        
        <div className="container mx-auto px-4 w-full max-w-6xl relative z-10">
          <motion.div 
            className="bg-white rounded-3xl shadow-lg p-8"
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.19, 1.0, 0.22, 1.0] }}
            viewport={{ once: false, margin: "-100px" }}
            style={{ y: aboutY }}
          >
            <Aboutus />
          </motion.div>
        </div>
      </section>
      
      <section 
        id="event" 
        ref={eventRef}
        className="py-16 bg-blue-500 min-h-screen flex items-center relative"
      >
        <div className="absolute inset-0 overflow-hidden opacity-30 z-0">
          <motion.div 
            className="absolute inset-0 bg-blue-400"
            animate={{ 
              backgroundImage: ["linear-gradient(0deg, #3b82f6 0%, #60a5fa 100%)", "linear-gradient(120deg, #3b82f6 0%, #60a5fa 100%)"],
              transition: { repeat: Infinity, repeatType: "reverse", duration: 8, ease: "easeInOut" }
            }}
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.19, 1.0, 0.22, 1.0] }}
            viewport={{ once: false, margin: "-100px" }}
            style={{ y: eventY }}
          >
            <Event />
          </motion.div>
        </div>
      </section>
      
      <section 
        id="new" 
        ref={newRef}
        className="py-16 bg-blue-500 min-h-screen flex items-center relative"
      >
        <div className="absolute inset-0 bg-blue-600 opacity-20 z-0">
          <motion.div 
            className="h-full w-full"
            animate={{
              background: [
                "radial-gradient(circle at 50% 50%, rgba(37, 99, 235, 0) 0%, rgba(37, 99, 235, 0.2) 50%, rgba(37, 99, 235, 0) 100%)",
                "radial-gradient(circle at 70% 20%, rgba(37, 99, 235, 0) 0%, rgba(37, 99, 235, 0.2) 50%, rgba(37, 99, 235, 0) 100%)"
              ],
              transition: { repeat: Infinity, repeatType: "reverse", duration: 15, ease: "easeInOut" }
            }}
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.19, 1.0, 0.22, 1.0] }}
            viewport={{ once: false, margin: "-100px" }}
            style={{ y: newY }}
          >
           <New />
          </motion.div>
        </div>
      </section>
      
      <section id="coming" ref={comingRef} className="py-16 bg-blue-500 min-h-screen flex items-center relative" >
        <div className="absolute inset-0 overflow-hidden z-0">
          <motion.div 
            className="absolute top-0 left-0 right-0 bottom-0"
            style={{ 
              backgroundImage: "linear-gradient(135deg, rgba(59, 130, 246, 0.2) 25%, transparent 25%, transparent 50%, rgba(59, 130, 246, 0.2) 50%, rgba(59, 130, 246, 0.2) 75%, transparent 75%, transparent)",
              backgroundSize: "40px 40px"
            }}
            animate={{ 
              backgroundPosition: ["0px 0px", "40px 40px"],
              transition: { repeat: Infinity, duration: 10, ease: "linear" }
            }}
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.19, 1.0, 0.22, 1.0] }}
            viewport={{ once: false, margin: "-100px" }}
            style={{ y: comingY }}
          >
           <Coming />
          </motion.div>
        </div>
      </section>
      
      <section 
        id="contact" 
        ref={contactRef}
        className="py-16 bg-blue-500 min-h-screen flex items-center relative"
      >
        <div className="absolute inset-0 bg-blue-400 opacity-20 z-0">
          <motion.div 
            className="absolute bottom-0 w-full h-1/2"
            initial={{ background: "linear-gradient(to top, rgba(59, 130, 246, 0.3), transparent)" }}
            animate={{ 
              height: ["50%", "60%", "50%"],
              transition: { repeat: Infinity, duration: 8, ease: "easeInOut" }
            }}
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.19, 1.0, 0.22, 1.0] }}
            viewport={{ once: false, margin: "-100px" }}
            style={{ y: contactY }}
          >
            <Contact />
          </motion.div>
        </div>
      </section>
      
      {/* ปุ่ม Scroll to Top */}
      <motion.button
        className="fixed bottom-8 right-8 bg-white text-blue-600 p-3 rounded-full shadow-lg z-50"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: scrollY > 300 ? 1 : 0,
          scale: scrollY > 300 ? 1 : 0.8,
        }}
        transition={{ duration: 0.3 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        whileHover={{ scale: 1.1, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)" }}
        whileTap={{ scale: 0.9 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </motion.button>
    </div>
  );
}

export default Homepage;
