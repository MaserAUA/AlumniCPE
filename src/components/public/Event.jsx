import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import { 
  CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Info, 
  Users,
  ExternalLink,
  History,
  Share2,
  Bell,
  Heart,
  X
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useRecentEvents } from "../../hooks/usePost";
import { formatMonth, getDaysAgo } from "../../utils/format"
import { FaNewspaper, FaFacebook, FaTwitter, FaLine, FaSearchPlus } from "react-icons/fa";

const EventsDisplay = ({ posts = [] }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [zoomedImage, setZoomedImage] = useState(null);
  
  const imageInterval = useRef(null);
  
  const navigate = useNavigate();
  const location = useLocation();

  const { data: events, isLoading } = useRecentEvents();
  
  // Set first event as selected by default when events load
  useEffect(() => {
    if (events && events.length > 0 && !selectedEvent) {
      setSelectedEvent(events[0]);
    }
  }, [events, selectedEvent]);

  // Initialize AOS animation library
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
      mirror: true,
      easing: 'ease-out-cubic'
    });
    
    return () => {
      AOS.refresh();
    };
  }, []);

  // Auto-rotate images
  useEffect(() => {
    if (selectedEvent?.media_urls?.length > 1 && !isImageHovered) {
      imageInterval.current = setInterval(() => {
        setActiveImage(prev => (prev + 1) % selectedEvent.media_urls.length);
      }, 5000);
    }
    
    return () => {
      if (imageInterval.current) {
        clearInterval(imageInterval.current);
      }
    };
  }, [selectedEvent, activeImage, isImageHovered]);

  // Handle event selection
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setActiveImage(0);
  };
  
  // Change image manually
  const changeImage = (direction) => {
    if (!selectedEvent?.media_urls || selectedEvent.media_urls.length <= 1) return;
    
    if (direction === 'next') {
      setActiveImage(prev => (prev + 1) % selectedEvent.media_urls.length);
    } else {
      setActiveImage(prev => (prev - 1 + selectedEvent.media_urls.length) % selectedEvent.media_urls.length);
    }
  };

  // Handle image zoom
  const handleImageZoom = (image) => {
    setZoomedImage(image);
  };

  // Handle zoomed image navigation
  const handleZoomedImageNavigation = (direction) => {
    if (!selectedEvent?.media_urls) return;
    
    if (direction === 'next') {
      const nextIndex = (activeImage + 1) % selectedEvent.media_urls.length;
      setActiveImage(nextIndex);
      setZoomedImage(selectedEvent.media_urls[nextIndex]);
    } else {
      const prevIndex = (activeImage - 1 + selectedEvent.media_urls.length) % selectedEvent.media_urls.length;
      setActiveImage(prevIndex);
      setZoomedImage(selectedEvent.media_urls[prevIndex]);
    }
  };
  
  // Open external link
  const openExternalLink = (url) => {
    if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
      window.open(url, '_blank');
    }
  };
  
  // Get image source
  const getImageSource = (index) => {
    if (!selectedEvent || !selectedEvent.media_urls || selectedEvent.media_urls.length === 0) {
      return "https://placehold.co/800x450/3B82F6/FFFFFF?text=Events";
    }
    
    const image = selectedEvent.media_urls[index];
    return typeof image === "string" ? image : URL.createObjectURL(image);
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black min-h-screen py-16 px-4 sm:px-6 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated CPE Logo */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-5 rounded-full overflow-hidden"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <img 
            src="https://www.cpe.kmutt.ac.th/media/home/5a61a78e-3cd5-4912-b755-93e036c96de5.png" 
            alt="CPE Logo" 
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 left-1/4 w-32 h-32 opacity-10 rounded-full overflow-hidden"
          animate={{
            y: [0, -50, 0],
            x: [0, 30, 0],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <img 
            src="https://www.cpe.kmutt.ac.th/media/home/5a61a78e-3cd5-4912-b755-93e036c96de5.png" 
            alt="CPE Logo" 
            className="w-full h-full object-cover"
          />
        </motion.div>

        <motion.div
          className="absolute bottom-20 right-1/4 w-24 h-24 opacity-10 rounded-full overflow-hidden"
          animate={{
            y: [0, 50, 0],
            x: [0, -30, 0],
            rotate: [0, -180, -360]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <img 
            src="https://www.cpe.kmutt.ac.th/media/home/5a61a78e-3cd5-4912-b755-93e036c96de5.png" 
            alt="CPE Logo" 
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Gradient Overlays */}
        <motion.div 
          className="absolute -top-64 -right-32 w-96 h-96 rounded-full bg-gray-800 opacity-30 blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.4, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-gray-700 opacity-20 blur-3xl"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.2, 0.25, 0.2]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute -bottom-48 -left-24 w-96 h-96 rounded-full bg-gray-800 opacity-20 blur-3xl"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Enhanced Floating Particles */}
        <motion.div 
          className="absolute top-20 left-1/4 w-4 h-4 rounded-full bg-gray-600 opacity-20"
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-40 right-1/4 w-3 h-3 rounded-full bg-gray-500 opacity-10"
          animate={{
            y: [0, -15, 0],
            x: [0, -10, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-20 left-1/3 w-6 h-6 rounded-full bg-gray-600 opacity-10"
          animate={{
            y: [0, -25, 0],
            x: [0, 15, 0]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
      
      {/* Zoomed Image Modal */}
      {zoomedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setZoomedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-red-400 transition-colors z-50 p-2 bg-black/30 rounded-full hover:bg-black/50"
            onClick={(e) => {
              e.stopPropagation();
              setZoomedImage(null);
            }}
          >
            <X className="text-2xl" />
          </button>

          <button
            className="absolute left-4 text-white hover:text-blue-400 transition-colors z-50 p-2 bg-black/30 rounded-full hover:bg-black/50"
            onClick={(e) => {
              e.stopPropagation();
              handleZoomedImageNavigation('prev');
            }}
          >
            <ChevronLeft className="text-2xl" />
          </button>

          <button
            className="absolute right-4 text-white hover:text-blue-400 transition-colors z-50 p-2 bg-black/30 rounded-full hover:bg-black/50"
            onClick={(e) => {
              e.stopPropagation();
              handleZoomedImageNavigation('next');
            }}
          >
            <ChevronRight className="text-2xl" />
          </button>

          <div
            className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={zoomedImage}
              alt="Enlarged view"
              className="max-w-full max-h-full object-contain animate-fade-in"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "https://placehold.co/800x600?text=Image Not Found";
              }}
            />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
              {activeImage + 1} / {selectedEvent.media_urls.length}
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header Section */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Recent Events
          </h1>
          <motion.div 
            className="w-24 h-1.5 bg-gradient-to-r from-gray-600 to-gray-400 rounded-full mx-auto mb-6"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
        </motion.div>
        
        {/* Main content grid with enhanced animations */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Event list with enhanced card design */}
          <div className="lg:col-span-5">
            <motion.div 
              className="bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-lg overflow-hidden p-5 mb-6 border border-gray-700/20"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h3 className="text-lg font-bold text-gray-200 mb-4 flex items-center">
                <History className="w-5 h-5 mr-2 text-gray-400" />
                Recent Activities
              </h3>
              
              <div className="space-y-3">
                {isLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-400"></div>
                    <span className="ml-3 text-gray-400">Loading...</span>
                  </div>
                ) : events.length > 0 ? (
                  events.map((event, index) => (
                    <motion.div
                      key={event.id || index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                        selectedEvent?.id === event.id 
                          ? 'bg-gray-700/50 border border-gray-600 shadow-md' 
                          : 'hover:bg-gray-700/30 hover:shadow-sm'
                      }`}
                      onClick={() => {
                        setSelectedEvent(event);
                      }}
                    >
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        {event.media_urls && event.media_urls[0] ? (
                          <img
                            src={event.media_urls[0]}
                            alt={event.title}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://placehold.co/100x100/1F2937/FFFFFF?text=Event";
                            }}
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                            <FaNewspaper className="text-gray-400" />
                          </div>
                        )}
                      </div>
                      
                      <div className="ml-4 flex-1">
                        <h4 className="font-medium text-gray-200 line-clamp-1">{event.title}</h4>
                        <div className="flex items-center text-sm text-gray-400 mt-1">
                          <History className="w-4 h-4 mr-1" />
                          <span>{getDaysAgo(event.startDateObj)}</span>
                        </div>
                      </div>
                      
                      {event.link && (
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            openExternalLink(event.link);
                          }}
                          className="p-2 text-gray-400 hover:text-gray-200 transition-colors"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </motion.button>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <motion.div 
                    className="text-center py-6 text-gray-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <History className="w-10 h-10 mx-auto text-gray-600 mb-2" />
                    No Last events found in the past month
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
          
          {/* Enhanced Event details section */}
          <div className="lg:col-span-7">
            <motion.div 
              className="bg-gray-800/80 backdrop-blur-lg rounded-xl overflow-hidden shadow-xl border border-gray-700/20"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {selectedEvent ? (
                <>
                  <div 
                    className="relative h-72 overflow-hidden group"
                    onMouseEnter={() => setIsImageHovered(true)}
                    onMouseLeave={() => setIsImageHovered(false)}
                  >
                    {/* Enhanced Image gallery */}
                    <AnimatePresence mode="wait">
                      {selectedEvent.media_urls && selectedEvent.media_urls.length > 0 ? (
                        <>
                          {selectedEvent.media_urls.map((image, index) => (
                            <motion.div 
                              key={index}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: activeImage === index ? 1 : 0 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.5 }}
                              className={`absolute inset-0 ${
                                activeImage === index ? 'z-10' : 'z-0'
                              }`}
                            >
                              <img
                                src={image}
                                alt={`${selectedEvent.title} - Image ${index + 1}`}
                                className="w-full h-full object-cover cursor-pointer"
                                onClick={() => handleImageZoom(image)}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "https://placehold.co/800x450/1F2937/FFFFFF?text=Events";
                                }}
                              />
                            </motion.div>
                          ))}
                          
                          {/* Enhanced Image navigation controls */}
                          {selectedEvent.media_urls.length > 1 && (
                            <>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  changeImage('prev');
                                }}
                                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 z-20"
                              >
                                <ChevronLeft className="w-5 h-5" />
                              </motion.button>
                              
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  changeImage('next');
                                }}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 z-20"
                              >
                                <ChevronRight className="w-5 h-5" />
                              </motion.button>
                              
                              {/* Enhanced Image counter */}
                              <motion.div 
                                className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full z-20"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                              >
                                {activeImage + 1} / {selectedEvent.media_urls.length}
                              </motion.div>
                              
                              {/* Enhanced Navigation dots */}
                              <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-20">
                                {selectedEvent.media_urls.map((_, index) => (
                                  <motion.button
                                    key={index}
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.8 }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActiveImage(index);
                                    }}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                      activeImage === index 
                                        ? 'bg-white w-6' 
                                        : 'bg-white/60 hover:bg-white/80'
                                    }`}
                                  />
                                ))}
                              </div>
                            </>
                          )}
                        </>
                      ) : (
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <FaNewspaper className="text-gray-400 text-4xl" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <div className="p-6">
                    <motion.h2 
                      className="text-2xl font-bold text-white mb-3"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      {selectedEvent.title}
                    </motion.h2>
                    
                    <motion.div 
                      className="bg-gray-700/50 backdrop-blur-sm p-4 rounded-lg mb-4 border border-gray-600"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                    >
                      <div className="flex items-center text-gray-200">
                        <CalendarIcon className="w-5 h-5 mr-2" />
                        <span className="font-medium">{selectedEvent.formattedStartDate} - {selectedEvent.formattedEndDate}</span>
                      </div>
                    </motion.div>
                    
                    {/* Enhanced Event tags */}
                    <motion.div 
                      className="flex flex-wrap gap-2 mb-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      {selectedEvent.category && (
                        <motion.span 
                          whileHover={{ scale: 1.05 }}
                          className="bg-gray-700 text-gray-200 text-xs font-medium px-2.5 py-1 rounded-full"
                        >
                          {selectedEvent.category}
                        </motion.span>
                      )}
                      
                      {selectedEvent.cpeGroup && (
                        <motion.span 
                          whileHover={{ scale: 1.05 }}
                          className="bg-gray-700 text-gray-200 text-xs font-medium px-2.5 py-1 rounded-full flex items-center"
                        >
                          <Users className="w-3 h-3 mr-1" />
                          {selectedEvent.cpeGroup}
                        </motion.span>
                      )}
                    </motion.div>
                    
                    {/* Enhanced Action buttons */}
                    <div className="flex flex-wrap gap-3 mt-6">
                      {selectedEvent.link && (
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => openExternalLink(selectedEvent.link)}
                          className="bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white font-medium px-4 py-2 rounded-lg shadow-md transition-all duration-300 flex items-center justify-center gap-2 flex-1"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>View Details</span>
                        </motion.button>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <motion.div 
                  className="p-8 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="bg-gray-700 inline-block p-3 rounded-full mb-4">
                    <Info className="w-6 h-6 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-200 mb-2">No Event Information</h3>
                  <p className="text-gray-400">Please select an event to view details</p>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Custom styles */}
      <style jsx>{`
        /* Custom scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1F2937;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4B5563;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6B7280;
        }
        
        /* Line clamp utilities */
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        /* Custom animations */
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes float-medium {
          0%, 100% { transform: translateY(0) translateX(0); }
          33% { transform: translateY(-10px) translateX(5px); }
          66% { transform: translateY(5px) translateX(-5px); }
        }
        
        @keyframes float-fast {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }
        
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        
        .animate-float-medium {
          animation: float-medium 12s ease-in-out infinite;
        }
        
        .animate-float-fast {
          animation: float-fast 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default EventsDisplay;