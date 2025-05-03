import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { LogOut, Edit2 } from 'lucide-react';

const dropdownVariants = {
  hidden: { opacity: 0, y: -10, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2 } }
};

export default function LogoutModal({onEdit, onSignOut, reference}) {
  return (
    <AnimatePresence>
      <motion.div
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={dropdownVariants}
        className="absolute right-0 mt-2 w-48 bg-white rounded-xl overflow-hidden shadow-xl z-50"
      >
        <div className="py-1" ref={reference}>
          <Link
            to="/editprofile"
            onClick={onEdit}
            className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
          >
            <Edit2 size={18} className="mr-3 text-blue-500" />
            <span>Edit Profile</span>
          </Link>
          
          <hr className="my-1 border-gray-200" />
          
          <motion.button
            whileHover={{ x: 3 }}
            onClick={onSignOut}
            className="flex items-center w-full px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
          >
            <LogOut size={18} className="mr-3" />
            <span>Sign Out</span>
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
