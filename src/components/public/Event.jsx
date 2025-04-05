import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import { 
  CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Clock, 
  Info, 
  X,
  Users,
  ExternalLink
} from "lucide-react";

const EventsDisplay = ({ posts = [] }) => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showCalendarPopup, setShowCalendarPopup] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const imageInterval = useRef(null);
  
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
  
  // Process events data when posts change
  useEffect(() => {
    if (posts.length === 0) {
      setLoading(false);
      return;
    }
    
    // Process and format the events data
    const formattedEvents = posts.map(post => {
      const startDate = new Date(post.startDate?.replace(/(\d{2})[/-](\d{2})[/-](\d{4})/, "$2/$1/$3") || new Date());
      const endDate = new Date(post.endDate?.replace(/(\d{2})[/-](\d{2})[/-](\d{4})/, "$2/$1/$3") || new Date());
      
      return {
        ...post,
        startDateObj: startDate,
        endDateObj: endDate,
        formattedStartDate: formatDate(startDate),
        formattedEndDate: formatDate(endDate),
        month: startDate.getMonth(),
        year: startDate.getFullYear(),
        day: startDate.getDate()
      };
    });
    
    // Sort events by date (most recent first)
    const sortedEvents = formattedEvents.sort((a, b) => a.startDateObj - b.startDateObj);
    
    setEvents(sortedEvents);
    if (sortedEvents.length > 0 && !selectedEvent) {
      setSelectedEvent(sortedEvents[0]);
    }
    
    setLoading(false);
  }, [posts]);
  
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
  
  // Format date helper function
  const formatDate = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date)) return "";
    
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };
  
  // Format time helper function
  const formatTime = (timeString) => {
    if (!timeString) return "";
    return timeString;
  };
  
  // Handle event selection
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setActiveImage(0);
  };
  
  // Toggle calendar popup
  const toggleCalendarPopup = () => {
    setShowCalendarPopup(!showCalendarPopup);
  };
  
  // Navigate between months in calendar
  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };
  
  // Get calendar grid for current month
  const getCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Day of week for the first day (0-6, 0 is Sunday)
    const firstDayOfWeek = firstDay.getDay();
    
    // Total days in month
    const daysInMonth = lastDay.getDate();
    
    // Days from previous month to fill the first row
    const prevMonthDays = firstDayOfWeek;
    
    // Calculate days from next month needed to complete the grid
    const totalCells = Math.ceil((prevMonthDays + daysInMonth) / 7) * 7;
    const nextMonthDays = totalCells - (prevMonthDays + daysInMonth);
    
    // Create calendar grid
    const calendarDays = [];
    
    // Previous month days
    const prevMonth = new Date(year, month, 0);
    const prevMonthLastDay = prevMonth.getDate();
    
    for (let i = prevMonthDays - 1; i >= 0; i--) {
      calendarDays.push({
        day: prevMonthLastDay - i,
        currentMonth: false,
        date: new Date(year, month - 1, prevMonthLastDay - i)
      });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      calendarDays.push({
        day: i,
        currentMonth: true,
        date: new Date(year, month, i),
        isToday: new Date(year, month, i).toDateString() === new Date().toDateString()
      });
    }
    
    // Next month days
    for (let i = 1; i <= nextMonthDays; i++) {
      calendarDays.push({
        day: i,
        currentMonth: false,
        date: new Date(year, month + 1, i)
      });
    }
    
    return calendarDays;
  };
  
  // Get events for a specific day
  const getEventsForDay = (date) => {
    if (!date) return [];
    
    return events.filter(event => {
      const eventStart = event.startDateObj;
      const eventEnd = event.endDateObj;
      
      // Check if the provided date falls between event start and end dates
      return date >= eventStart && date <= eventEnd;
    });
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
  
  // Format month year for calendar display
  const formatMonthYear = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date)) return "";
    
    const options = { year: 'numeric', month: 'long' };
    return date.toLocaleDateString('en-US', options);
  };
  
  // Get image source
  const getImageSource = (index) => {
    if (!selectedEvent || !selectedEvent.images || selectedEvent.images.length === 0) {
      return "https://placehold.co/800x450/3B82F6/FFFFFF?text=Events";
    }
    
    const image = selectedEvent.images[index];
    return typeof image === "string" ? image : URL.createObjectURL(image);
  };
  
  // Format month for display
  const formatMonth = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date)) return "";
    
    const options = { month: 'short' };
    return date.toLocaleDateString('en-US', options);
  };
  
  // The days of the week in English
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
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
            Interesting Events
          </h1>
          <div className="w-24 h-1.5 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full mx-auto mb-6"></div>
        </div>
        
        {/* Events section */}
        <div className="flex justify-between items-start mb-8">
          <div data-aos="fade-right" data-aos-delay="100">
            <h2 className="text-2xl font-bold text-blue-700 inline-flex items-center">
              <span className="bg-blue-100 p-1.5 rounded-lg mr-2">
                <CalendarIcon className="w-5 h-5 text-blue-700" />
              </span>
              Events and Activities
            </h2>
          </div>
          
          <button 
            onClick={toggleCalendarPopup}
            className="text-blue-600 font-medium hover:text-blue-800 transition-all duration-300 flex items-center gap-1 group"
            data-aos="fade-left"
            data-aos-delay="200"
          >
            All Events
            <ChevronRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
        
        {/* Main content grid - Modified layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* List of upcoming events - Now full width on the left */}
          <div className="lg:col-span-5">
            <div 
              className="bg-white rounded-xl shadow-lg overflow-hidden p-5 mb-6"
              data-aos="fade-up"
              data-aos-delay="400"  
            >
              <h3 className="text-lg font-bold text-blue-800 mb-4 flex items-center">
                <CalendarIcon className="w-5 h-5 mr-2 text-blue-600" />
                Upcoming Events
              </h3>
              
              <div className="space-y-3">
                {loading ? (
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
                      <div className="bg-blue-600 text-white rounded-lg p-3 flex flex-col items-center justify-center min-w-[60px]">
                        <span className="text-xl font-bold">{event.day}</span>
                        <span className="text-xs">{formatMonth(event.startDateObj)}</span>
                      </div>
                      
                      <div className="ml-4 flex-1">
                        <h4 className="font-medium text-gray-800 line-clamp-1">{event.title}</h4>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span className="line-clamp-1">{event.location || "Onsite: N/A"}</span>
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
                    <CalendarIcon className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                    No upcoming events found
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
                    <div className="absolute top-3 left-3 bg-blue-600 text-white text-sm font-medium px-3 py-1 rounded-full shadow-lg z-20">
                      Latest Event
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
                        {selectedEvent.content || selectedEvent.description || "No additional details for this event"}
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
                          <span>Go to Event Link</span>
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
      
      {/* Calendar popup - Modified with white background */}
      <AnimatePresence>
        {showCalendarPopup && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={toggleCalendarPopup}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={toggleCalendarPopup}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="p-6">
                <h2 className="text-2xl font-bold text-center text-blue-800 mb-6">Events Calendar</h2>
                
                <div className="bg-white rounded-xl overflow-hidden shadow-xl border border-gray-200">
                  <div className="bg-blue-600 px-4 py-3 flex justify-between items-center text-white">
                    <button 
                      className="text-white hover:text-blue-200 transition-colors p-1"
                      onClick={() => navigateMonth(-1)}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <h3 className="font-medium text-lg">{formatMonthYear(currentMonth)}</h3>
                    <button 
                      className="text-white hover:text-blue-200 transition-colors p-1"
                      onClick={() => navigateMonth(1)}  
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {/* Calendar header with days of week */}
                  <div className="grid grid-cols-7 text-center py-2 border-b border-gray-200">
                    {daysOfWeek.map((day, index) => (
                      <div key={index} className="text-sm font-medium text-gray-700">
                        {day.slice(0, 3)}
                      </div>
                    ))}
                  </div>
                  
                  {/* Calendar grid */}
                  <div className="grid grid-cols-7 gap-px">
                    {getCalendarDays().map((day, index) => {
                      const dayEvents = getEventsForDay(day.date);
                      
                      return (
                        <div 
                          key={index} 
                          className={`min-h-[100px] p-1 relative border border-gray-100 ${
                            !day.currentMonth ? 'bg-gray-50 text-gray-500' : 
                            day.isToday ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className={`text-sm font-medium p-1 ${day.isToday ? 'bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center' : ''}`}>
                            {day.day}
                          </div>
                          
                          <div className="pt-6">
                            {/* Event items for this day */}
                            {dayEvents.slice(0, 3).map((event, eventIndex) => (
                              <div 
                                key={`${event.id}-${eventIndex}`}
                                onClick={() => {
                                  handleSelectEvent(event);
                                  toggleCalendarPopup();
                                }}
                                className="bg-blue-400 hover:bg-blue-500 text-white text-xs p-1 rounded mb-1 cursor-pointer truncate shadow-sm"
                              >
                                <div className="font-bold truncate">{event.title}</div>
                                {event.time && (
                                  <div className="text-[10px]">{formatTime(event.time)}</div>
                                )}
                              </div>
                            ))}
                            
                            {/* Show count if more events */}
                            {dayEvents.length > 3 && (
                              <div className="text-[10px] bg-gray-200 text-gray-700 rounded px-1 text-center font-medium">
                                +{dayEvents.length - 3} more
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
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
      `}</style>    </div>
    );
  };
  
  export default EventsDisplay;