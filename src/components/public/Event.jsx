import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
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
  History
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useRecentEvents } from "../../api/post";
import { formatMonth, getDaysAgo } from "../../utils/format"

const EventsDisplay = ({ posts = [] }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  
  const imageInterval = useRef(null);
  
  const navigate = useNavigate();
  const location = useLocation();

  const { data: events, isLoading } = useRecentEvents();
  
  
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
    if (selectedEvent?.images?.length > 1 && !isImageHovered) {
      imageInterval.current = setInterval(() => {
        setActiveImage(prev => (prev + 1) % selectedEvent.images.length);
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
    if (!selectedEvent?.images || selectedEvent.images.length <= 1) return;
    
    if (direction === 'next') {
      setActiveImage(prev => (prev + 1) % selectedEvent.images.length);
    } else {
      setActiveImage(prev => (prev - 1 + selectedEvent.images.length) % selectedEvent.images.length);
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
    if (!selectedEvent || !selectedEvent.images || selectedEvent.images.length === 0) {
      return "https://placehold.co/800x450/3B82F6/FFFFFF?text=Events";
    }
    
    const image = selectedEvent.images[index];
    return typeof image === "string" ? image : URL.createObjectURL(image);
  };

  return (
    <div className="bg-gradient-to-br from-white via-blue-50 to-blue-100 min-h-screen py-16 px-4 sm:px-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-64 -right-32 w-96 h-96 rounded-full bg-blue-200 opacity-30 blur-3xl"></div>
        <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-indigo-200 opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-48 -left-24 w-96 h-96 rounded-full bg-blue-300 opacity-20 blur-3xl"></div>
        
        {/* Animated floating particles */}
        <div className="absolute top-20 left-1/4 w-4 h-4 rounded-full bg-blue-400 opacity-20 animate-float-slow"></div>
        <div className="absolute top-40 right-1/4 w-3 h-3 rounded-full bg-indigo-400 opacity-10 animate-float-medium"></div>
        <div className="absolute bottom-20 left-1/3 w-6 h-6 rounded-full bg-blue-500 opacity-10 animate-float-fast"></div>
      </div>
      
      <div className="max-w-7xl mx-auto">
        {/* Header section */}
        <div className="text-center mb-12" data-aos="fade-down">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-800 mb-4 tracking-tight">
            Recent Events
          </h1>
          <div className="w-24 h-1.5 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full mx-auto mb-6"></div>
        </div>
        
        {/* Main content grid - Modified layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* List of recent events - Now full width on the left */}
          <div className="lg:col-span-5">
            <div 
              className="bg-white rounded-xl shadow-lg overflow-hidden p-5 mb-6"
              data-aos="fade-up"
              data-aos-delay="400"  
            >
              <h3 className="text-lg font-bold text-blue-800 mb-4 flex items-center">
                <History className="w-5 h-5 mr-2 text-blue-600" />
                Recent Activities
              </h3>
              
              <div className="space-y-3">
                {isLoading ? 
                  (
                    <div className="flex justify-center items-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                      <span className="ml-3 text-gray-600">Loading...</span>
                    </div>
                  ) : events.length > 0 ? (
                  events.map((event, index) => (
                    <motion.div
                      key={event.id || index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedEvent?.id === event.id 
                          ? 'bg-blue-50 border border-blue-200' 
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleSelectEvent(event)}
                    >
                      <div className="bg-gray-600 text-white rounded-lg p-3 flex flex-col items-center justify-center min-w-[60px]">
                        <span className="text-xl font-bold">{event.day}</span>
                        <span className="text-xs">{formatMonth(event.startDateObj)}</span>
                      </div>
                      
                      <div className="ml-4 flex-1">
                        <h4 className="font-medium text-gray-800 line-clamp-1">{event.title}</h4>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span className="line-clamp-1">{event.location || "No location specified"}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <History className="w-4 h-4 mr-1" />
                          <span>{getDaysAgo(event.startDateObj)}</span>
                        </div>
                        <div className="line-clamp-2 text-sm text-gray-600 mt-2">
                          {event.description || event.content || "No additional details available"}
                        </div>
                      </div>
                      
                      {event.link && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            openExternalLink(event.link);
                          }}
                          className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </button>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <History className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                    No Last events found in the past month
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Event details (right side - enlarged) */}
          <div className="lg:col-span-7">
            <div 
              className="bg-white rounded-xl overflow-hidden shadow-xl"
              data-aos="fade-left"
              data-aos-delay="300"
            >
              {selectedEvent ? (
                <>
                  <div 
                    className="relative h-72 overflow-hidden group"
                    onMouseEnter={() => setIsImageHovered(true)}
                    onMouseLeave={() => setIsImageHovered(false)}
                  >
                    {/* Image gallery */}
                    {selectedEvent.images && selectedEvent.images.length > 0 ? (
                      <>
                        {selectedEvent.images.map((image, index) => (
                          <div 
                            key={index}
                            className={`absolute inset-0 transition-opacity duration-1000 ${
                              activeImage === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
                            }`}
                          >
                            <img
                              src={getImageSource(index)}
                              alt={`${selectedEvent.title} - Image ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://placehold.co/800x450/3B82F6/FFFFFF?text=Events";
                              }}
                            />
                          </div>
                        ))}
                        
                        {/* Image navigation controls */}
                        {selectedEvent.images.length > 1 && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                changeImage('prev');
                              }}
                              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20"
                            >
                              <ChevronLeft className="w-5 h-5" />
                            </button>
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                changeImage('next');
                              }}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20"
                            >
                              <ChevronRight className="w-5 h-5" />
                            </button>
                            
                            {/* Image counter */}
                            <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full z-20">
                              {activeImage + 1} / {selectedEvent.images.length}
                            </div>
                            
                            {/* Navigation dots */}
                            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-20">
                              {selectedEvent.images.map((_, index) => (
                                <button
                                  key={index}
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
                        
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent z-10"></div>
                      </>
                    ) : (
                      <img
                        src="https://placehold.co/800x450/3B82F6/FFFFFF?text=Events"
                        alt="Event placeholder"
                        className="w-full h-full object-cover"
                      />
                    )}
                    
                    {/* Event label */}
                    <div className="absolute top-3 left-3 bg-gray-600 text-white text-sm font-medium px-3 py-1 rounded-full shadow-lg z-20">
                      {getDaysAgo(selectedEvent.startDateObj)}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-blue-800 mb-3">{selectedEvent.title}</h2>
                    
                    <div className="bg-blue-50 p-4 rounded-lg mb-4">
                      <div className="flex items-center text-blue-700 mb-3">
                        <CalendarIcon className="w-5 h-5 mr-2" />
                        <span className="font-medium">{selectedEvent.formattedStartDate} - {selectedEvent.formattedEndDate}</span>
                      </div>
                      
                      {selectedEvent.location && (
                        <div className="flex items-center text-blue-700">
                          <MapPin className="w-5 h-5 mr-2" />
                          <span>{selectedEvent.location}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mb-5 max-h-36 overflow-y-auto pr-2 custom-scrollbar">
                      <p className="text-gray-600">
                        {selectedEvent.content || selectedEvent.description || "No additional details available for this event"}
                      </p>
                    </div>
                    
                    {/* Event tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {selectedEvent.category && (
                        <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-1 rounded-full">
                          {selectedEvent.category}
                        </span>
                      )}
                      
                      {selectedEvent.cpeGroup && (
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full flex items-center">
                          <Users className="w-3 h-3 mr-1" />
                          {selectedEvent.cpeGroup}
                        </span>
                      )}
                    </div>
                    
                    {/* Event link button */}
                    {selectedEvent.link && (
                      <div className="flex justify-center mt-4">
                        <button 
                          onClick={() => openExternalLink(selectedEvent.link)}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow-md transition-colors flex items-center justify-center gap-2 w-full"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>View Details</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="p-8 text-center">
                  <div className="bg-blue-100 inline-block p-3 rounded-full mb-4">
                    <Info className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-blue-800 mb-2">No Event Information</h3>
                  <p className="text-gray-600">Please select an event to view details</p>
                </div>
              )}
            </div>
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
          background: #f1f5f9;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #94a3b8;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #64748b;
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
