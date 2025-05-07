import React from 'react';
import { FcAdvertising } from "react-icons/fc";

export default function Header() {
  return (
    <div 
      id="department-section" 
      className="bg-white flex items-center justify-between py-2 shadow-md px-6"
    >
      <div className="hidden md:inline flex items-center">
        <img
          src="https://www.kmutt.ac.th/wp-content/uploads/2020/09/KMUTT_CI_Semi_Logo-normal-full-1061x1200.png"
          alt="KMUTT Logo"
          className="h-12 mr-2"
        />
        <p className="text-gray-700 font-semibold">
          Alumni Service Channels for the Department of Computer Engineering
        </p>
      </div>
      <a 
        href="https://forms.gle/5yhndBaLAUan55618" 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center gap-2 hover:bg-gray-100 px-4 py-2 rounded-lg transition-all duration-300 ease-in-out"
      >
        <FcAdvertising className="text-2xl" />
        <span className="text-gray-700 font-semibold">Website Feedback Survey</span>
      </a>
    </div>
  )
}
