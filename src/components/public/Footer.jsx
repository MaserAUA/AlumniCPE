import React from "react";
import { motion } from "framer-motion";

function Footer() {
  return (
    <footer className="bg-blue-500 relative overflow-hidden">
      {/* พื้นหลังเคลื่อนไหว */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <motion.div 
          className="absolute top-0 left-0 right-0 h-16"
          initial={{ opacity: 0.5 }}
          animate={{ 
            opacity: [0.3, 0.7, 0.3],
            y: [0, 5, 0]
          }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          style={{ 
            backgroundImage: "linear-gradient(0deg, transparent, rgba(255,255,255,0.1), transparent)"
          }}
        />
      </div>

      <div className="w-full max-w-screen-xl mx-auto px-4 py-8 relative z-10">
        {/* Simple divider ตกแต่งให้สวยขึ้น */}
        <div className="my-6 relative">
          <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-white/90 w-6 h-6 rotate-45 rounded-sm"></div>
          <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-blue-500 w-4 h-4 rotate-45 rounded-sm"></div>
          <div className="border-t border-white/30"></div>
        </div>

        {/* Copyright section - ตกแต่งมากขึ้น */}
        <motion.div 
          className="text-center space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-white text-lg sm:text-xl font-semibold">
            © 2024 Copyright
          </div>
          <div className="text-blue-100 text-sm sm:text-base max-w-md mx-auto">
            <span className="font-medium">Department of Computer Engineering</span>
            <br />
            <span className="tracking-wide">King Mongkut's University of Technology Thonburi</span>
            <br />
            <span className="text-xs opacity-80">All Rights Reserved</span>
          </div>
        </motion.div>

        {/* ตกแต่งด้วยองค์ประกอบเพิ่มเติม */}
        <div className="flex justify-center mt-4">
          <div className="flex space-x-2 opacity-70">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;