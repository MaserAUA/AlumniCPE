import React, { useState, useEffect, useRef } from "react";
import moment from "moment";
import { useGetAllPosts } from "../../hooks/usePost";
import { useNavigate, useLocation } from "react-router-dom";
import { Calendar, Clock, MapPin, ExternalLink, Image, ArrowRight, X, Zap, Target } from "lucide-react";
import Swal from "sweetalert2";
import { FaNewspaper } from "react-icons/fa";
import { motion } from "framer-motion";

function Coming() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [countdowns, setCountdowns] = useState({});
  
  const countdownIntervals = useRef({});
  const navigate = useNavigate();
  const { data: posts, isLoading } = useGetAllPosts();
  
  // Format date in a readable way
  const getFormattedDate = (date) => {
    if (!date) return "N/A";
    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) return "N/A";
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return "N/A";
    }
  };

  // Get a date range string
  const getDateRange = (startDate, endDate) => {
    if (!startDate) return "N/A";
    
    const startFormatted = getFormattedDate(startDate);
    if (!endDate) return startFormatted;
    
    const endFormatted = getFormattedDate(endDate);
    return `${startFormatted} - ${endFormatted}`;
  };
  
  // Start countdown for an event
  const startCountdown = (postId, startDate) => {
    // Clear existing interval if any
    if (countdownIntervals.current[postId]) {
      clearInterval(countdownIntervals.current[postId]);
    }

    const updateCountdown = () => {
      const now = moment();
      const eventDate = moment(startDate);
      const duration = moment.duration(eventDate.diff(now));

      if (duration.asMilliseconds() <= 0) {
        clearInterval(countdownIntervals.current[postId]);
        setCountdowns(prev => ({
          ...prev,
          [postId]: { days: 0, hours: 0, minutes: 0, seconds: 0 }
        }));
        return;
      }

      setCountdowns(prev => ({
        ...prev,
        [postId]: {
          days: Math.floor(duration.asDays()),
          hours: duration.hours(),
          minutes: duration.minutes(),
          seconds: duration.seconds()
        }
      }));
    };

    // Update immediately and then every second
    updateCountdown();
    countdownIntervals.current[postId] = setInterval(updateCountdown, 1000);
  };

  // Handle event selection
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setActiveImage(0);
    // Clear all existing countdowns
    Object.values(countdownIntervals.current).forEach(interval => clearInterval(interval));
    // Start countdown for the selected event using post_id
    if (event.post_id && event.start_date) {
      startCountdown(event.post_id, event.start_date);
    }
  };

  // Process posts data when loaded
  useEffect(() => {
    if (!isLoading && posts) {
      if (!Array.isArray(posts)) {
        console.error("Invalid posts data: Expected an array.");
        setLoading(false);
        return;
      }
      
      const now = moment();
      const filteredPosts = posts
        .filter((post) => {
          if (post.post_type === "event" && post.start_date) {
            return moment(post.start_date).isAfter(now);
          }
          return false;
        })
        .sort((a, b) => {
          return moment(a.start_date).diff(moment(b.start_date));
        });

      // Transform posts with proper formatting
      const transformedPosts = filteredPosts.map(post => ({
        ...post,
        title: post.title || "Event Title",
        content: post.content || "Join us for this exciting upcoming event. More details will be provided soon.",
        startDate: post.start_date,
        endDate: post.end_date,
        formattedStartDate: getFormattedDate(post.start_date),
        formattedEndDate: post.end_date ? getFormattedDate(post.end_date) : null,
        dateRange: getDateRange(post.start_date, post.end_date),
        images: post.media_urls && Array.isArray(post.media_urls) ? post.media_urls : ["https://placehold.co/800x450/3B82F6/FFFFFF?text=Event"]
      }));

      setEvents(transformedPosts);
      
      // Start countdown for all events immediately
      transformedPosts.forEach(event => {
        if (event.post_id && event.start_date) {
          startCountdown(event.post_id, event.start_date);
        }
      });
      
      // Set initial selected event
      if (transformedPosts.length > 0 && !selectedEvent) {
        setSelectedEvent(transformedPosts[0]);
      }
      
      setLoading(false);
    }
  }, [isLoading, posts]);

  // Clean up intervals when component unmounts
  useEffect(() => {
    return () => {
      Object.values(countdownIntervals.current).forEach(interval => clearInterval(interval));
    };
  }, []);

  // Get image source with fallback
  const getImageSource = (index) => {
    if (!selectedEvent || !selectedEvent.images || selectedEvent.images.length === 0) {
      return "https://placehold.co/800x450/3B82F6/FFFFFF?text=Event";
    }
    
    const image = selectedEvent.images[index];
    return typeof image === "string" ? image : URL.createObjectURL(image);
  };

  // Add this function to handle redirect link
  const handleRedirectLink = (url) => {
    if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
      window.open(url, '_blank');
    } else {
      Swal.fire({
        icon: "info",
        title: "No Link Available",
        text: "The event creator has not provided any link for this event.",
        confirmButtonColor: "#3085d6",
      });
    }
  };

  // Change active image
  const changeImage = (direction) => {
    if (!selectedEvent || !selectedEvent.images || selectedEvent.images.length <= 1) return;
    
    if (direction === 'next') {
      setActiveImage((prev) => (prev + 1) % selectedEvent.images.length);
    } else {
      setActiveImage((prev) => (prev - 1 + selectedEvent.images.length) % selectedEvent.images.length);
    }
  };

  // Loading state
  if (loading || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-black to-gray-900">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
          <p className="mt-4 text-purple-400 text-lg">Loading amazing events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black text-white min-h-screen pb-16 rounded-lg relative overflow-hidden">
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
          className="absolute -top-64 -right-32 w-96 h-96 rounded-full bg-blue-200 opacity-30 blur-3xl"
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
          className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-indigo-200 opacity-20 blur-3xl"
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
          className="absolute -bottom-48 -left-24 w-96 h-96 rounded-full bg-blue-300 opacity-20 blur-3xl"
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
          className="absolute top-20 left-1/4 w-4 h-4 rounded-full bg-blue-400 opacity-20"
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
          className="absolute top-40 right-1/4 w-3 h-3 rounded-full bg-indigo-400 opacity-10"
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
          className="absolute bottom-20 left-1/3 w-6 h-6 rounded-full bg-blue-500 opacity-10"
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

      {/* Header section with gradient */}
      <div className="bg-gradient-to-br from-gray-900 to-black py-8 relative overflow-hidden">
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSI+PC9yZWN0PjwvcGF0dGVybj48L2RlZnM+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSI+PC9yZWN0Pjwvc3ZnPg==')]"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-center tracking-tight"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.span 
              className="text-white inline-block"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Upcoming
            </motion.span>{" "}
            <motion.span 
              className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 hover:from-pink-200 hover:via-purple-200 hover:to-indigo-200 transition-all duration-500 inline-block"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
            >
              Events
            </motion.span>
          </motion.h1>
          <motion.p 
            className="text-center mt-4 text-white max-w-2xl mx-auto font-light tracking-wide"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="inline-block"
            >
              Discover and join our upcoming events.
            </motion.span>{" "}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="inline-block"
            >
              Mark your calendar and don't miss out on these amazing opportunities!
            </motion.span>
          </motion.p>
        </div>
        
        {/* Decorative bottom curve with enhanced animation */}
        <motion.div 
          className="absolute -bottom-6 left-0 right-0 h-12bg-gradient-to-br from-gray-900 to-black transform -skew-y-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        />
      </div>

      <div className="container mx-auto px-4 mt-8">
        <div className="grid md:grid-cols-12 gap-8">
          {/* Left column - Event gallery & details */}
          <div className="md:col-span-7">
            {/* Image gallery with enhanced controls */}
            <motion.div 
              className="relative h-[450px] rounded-xl overflow-hidden group shadow-xl shadow-blue-900/20 border border-gray-800 hover:shadow-2xl hover:shadow-blue-900/30 transition-all duration-300"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {selectedEvent?.media_urls && selectedEvent.media_urls.length > 0 && (
                <>
                  <img 
                    src={selectedEvent.media_urls[activeImage]}
                    alt={selectedEvent.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/800x450/3B82F6/FFFFFF?text=Event";
                    }}
                  />
                  
                  {/* Enhanced gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent group-hover:from-black/80 group-hover:via-black/40 transition-all duration-300"></div>
                  
                  {/* Enhanced image navigation buttons */}
                  {selectedEvent.media_urls.length > 1 && (
                    <>v
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => changeImage('prev')}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/70"
                        aria-label="Previous image"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => changeImage('next')}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/70"
                        aria-label="Next image"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </motion.button>
                    </>
                  )}
                  
                  {/* Enhanced image indicators */}
                  {selectedEvent.media_urls.length > 1 && (
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                      {selectedEvent.media_urls.map((_, index) => (
                        <motion.button 
                          key={index}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.8 }}
                          onClick={() => setActiveImage(index)}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            index === activeImage 
                              ? 'bg-blue-500 w-8 shadow-lg shadow-blue-500/50' 
                              : 'bg-white/60 w-2 hover:bg-white/80'
                          }`}
                          aria-label={`View image ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </motion.div>
            
            {/* Event basic info with enhanced styling */}
            <motion.div 
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="flex flex-wrap gap-3 mb-4">
                {selectedEvent?.category && (
                  <motion.span 
                    whileHover={{ scale: 1.05 }}
                    className="inline-block px-3 py-1.5 bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 text-white text-sm font-semibold rounded-lg hover:from-blue-400 hover:via-blue-500 hover:to-blue-600 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {selectedEvent.category}
                    </motion.span>
                  </motion.span>
                )}
                {selectedEvent?.cpeGroup && (
                  <motion.span 
                    whileHover={{ scale: 1.05 }}
                    className="inline-block px-3 py-1.5 bg-gray-800 text-white text-sm font-semibold rounded-lg border border-blue-500/50 hover:border-blue-500/80 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      {selectedEvent.cpeGroup}
                    </motion.span>
                  </motion.span>
                )}
              </div>
              
              <motion.h1 
                className="text-3xl md:text-4xl font-bold mb-4 text-white leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <motion.span
                  className="inline-block"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  {selectedEvent?.title || "Event Title"}
                </motion.span>
              </motion.h1>
              
              <div className="flex flex-wrap items-center gap-6 text-gray-300 mb-6">
                <motion.div 
                  className="flex items-center"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <Calendar className="w-5 h-5 mr-2 text-blue-400" />
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    {selectedEvent?.dateRange || "N/A"}
                  </motion.span>
                </motion.div>
              </div>
              
              {/* Enhanced event description */}
              <motion.div 
                className="prose prose-invert max-w-none"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <motion.p 
                  className="leading-relaxed text-lg text-gray-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  {selectedEvent?.content || "Join us for this exciting upcoming event. More details will be provided soon."}
                </motion.p>
              </motion.div>
              
              {/* Enhanced buttons */}
              <div className="mt-8 flex flex-wrap gap-4">
                {selectedEvent?.link && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 hover:from-blue-400 hover:to-blue-600 text-white px-6 py-3 rounded-lg flex items-center justify-center font-medium transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-lg shadow-blue-700/20"
                    onClick={() => handleRedirectLink(selectedEvent.link)}
                  >
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Zap className="w-5 h-5 mr-2" />
                      Join Event
                    </motion.span>
                  </motion.button>
                )}
                
                {selectedEvent?.registration && selectedEvent.registration !== selectedEvent.link && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-transparent text-white px-6 py-3 rounded-lg border border-blue-500 hover:bg-blue-900/20 transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-lg shadow-blue-700/20"
                    onClick={() => handleRedirectLink(selectedEvent.registration)}
                  >
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <ExternalLink className="w-5 h-5 mr-2" />
                      Register Now
                    </motion.span>
                  </motion.button>
                )}
              </div>
            </motion.div>
          </div>
          
          {/* Right column - Countdown and other event details */}
          <div className="md:col-span-5">
            {/* Enhanced Stylized Countdown */}
            <motion.div 
              className="bg-gray-900/50 backdrop-blur rounded-xl p-8 mb-8 border border-blue-500/30 shadow-lg shadow-blue-900/20 relative overflow-hidden hover:shadow-xl hover:shadow-blue-900/30 transition-all duration-300"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Decorative elements */}
              <div className="absolute -right-20 -top-20 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl"></div>
              <div className="absolute -left-20 -bottom-20 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl"></div>
              
              <motion.h2 
                className="text-xl font-bold mb-6 relative"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <motion.span 
                  className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-cyan-400 hover:to-blue-400 transition-all duration-500"
                  whileHover={{ scale: 1.05 }}
                >
                  EVENT
                </motion.span>{" "}
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  COUNTDOWN
                </motion.span>
              </motion.h2>
              
              <div className="grid grid-cols-4 gap-2 text-center">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="countdown-item bg-gray-800/70 backdrop-blur rounded-lg p-3 relative overflow-hidden hover:bg-gray-800/90 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 to-transparent"></div>
                  <div className="relative">
                    <motion.div 
                      className="text-4xl font-bold mb-1 text-white"
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      {countdowns[selectedEvent?.post_id]?.days || 0}
                    </motion.div>
                    <motion.div 
                      className="text-xs text-gray-400 uppercase tracking-wider"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      Days
                    </motion.div>
                  </div>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="countdown-item bg-gray-800/70 backdrop-blur rounded-lg p-3 relative overflow-hidden hover:bg-gray-800/90 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 to-transparent"></div>
                  <div className="relative">
                    <motion.div 
                      className="text-4xl font-bold mb-1 text-white"
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      {countdowns[selectedEvent?.post_id]?.hours || 0}
                    </motion.div>
                    <motion.div 
                      className="text-xs text-gray-400 uppercase tracking-wider"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                    >
                      Hours
                    </motion.div>
                  </div>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="countdown-item bg-gray-800/70 backdrop-blur rounded-lg p-3 relative overflow-hidden hover:bg-gray-800/90 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 to-transparent"></div>
                  <div className="relative">
                    <motion.div 
                      className="text-4xl font-bold mb-1 text-white"
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                    >
                      {countdowns[selectedEvent?.post_id]?.minutes || 0}
                    </motion.div>
                    <motion.div 
                      className="text-xs text-gray-400 uppercase tracking-wider"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                    >
                      Mins
                    </motion.div>
                  </div>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="countdown-item bg-gray-800/70 backdrop-blur rounded-lg p-3 relative overflow-hidden hover:bg-gray-800/90 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 to-transparent"></div>
                  <div className="relative">
                    <motion.div 
                      className="text-4xl font-bold mb-1 text-white animate-pulse"
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                    >
                      {countdowns[selectedEvent?.post_id]?.seconds || 0}
                    </motion.div>
                    <motion.div 
                      className="text-xs text-gray-400 uppercase tracking-wider"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.7 }}
                    >
                      Secs
                    </motion.div>
                  </div>
                </motion.div>
              </div>
              
              {/* Enhanced Event title for countdown */}
              <motion.div 
                className="mt-6 text-center p-3 bg-gray-800/50 backdrop-blur rounded-lg border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <div className="flex items-center justify-center gap-4">
                  {selectedEvent?.media_urls && selectedEvent.media_urls[0] && (
                    <motion.div 
                      className="w-20 h-20 rounded-lg overflow-hidden border-2 border-blue-500/30 hover:border-blue-500/50 transition-all duration-300"
                      whileHover={{ scale: 1.1 }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      <img 
                        src={selectedEvent.media_urls[0]}
                        alt={selectedEvent.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://placehold.co/100x100/3B82F6/FFFFFF?text=Event";
                        }}
                      />
                    </motion.div>
                  )}
                  <div>
                    <motion.div 
                      className="text-lg font-bold"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                    >
                      <motion.span 
                        className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 hover:from-blue-400 hover:via-blue-500 hover:to-blue-600 transition-all duration-500"
                        whileHover={{ scale: 1.05 }}
                      >
                        {selectedEvent?.title || "Event"}
                      </motion.span>
                    </motion.div>
                    <motion.div 
                      className="text-gray-400 text-sm mt-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                    >
                      {getDateRange(selectedEvent?.startDate, selectedEvent?.endDate)}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
              
              {/* Enhanced URL button */}
              <motion.div 
                className="mt-4 text-center"
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleRedirectLink(selectedEvent?.redirect_link)}
                  className="w-full py-2 px-4 rounded-lg text-center text-sm font-medium bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 text-white hover:from-blue-400 hover:to-blue-600 hover:shadow-lg shadow-blue-700/20 transition-all duration-300"
                >
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    Click link here
                  </motion.span>
                </motion.button>
              </motion.div>
              
              {/* Enhanced decorative elements */}
              <motion.div 
                className="absolute left-3 bottom-1/3 w-2 h-2 bg-blue-500 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.75, 0, 0.75]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div 
                className="absolute right-4 top-1/4 w-2 h-2 bg-cyan-500 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.75, 0, 0.75]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              />
            </motion.div>
            
            {/* Enhanced Schedule/Agenda */}
            {((selectedEvent?.agenda && selectedEvent.agenda.length > 0) || 
              (selectedEvent?.schedule && selectedEvent.schedule.length > 0)) && (
              <motion.div 
                className="bg-gray-900/50 backdrop-blur rounded-xl p-6 mb-8 border border-blue-500/30 relative overflow-hidden hover:shadow-xl hover:shadow-blue-900/30 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <motion.h3 
                  className="text-xl font-bold mb-4 text-white flex items-center"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <Clock className="w-5 h-5 mr-2 text-blue-400" />
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    Event Schedule
                  </motion.span>
                </motion.h3>
                
                <div className="space-y-4">
                  {/* Handle both agenda from original format and schedule from CreatePost */}
                  {(selectedEvent?.schedule || selectedEvent?.agenda || []).map((item, index) => (
                    <motion.div 
                      key={index} 
                      className="flex relative pl-6 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gradient-to-b before:from-blue-500 before:to-transparent hover:before:from-blue-400 hover:before:to-blue-500/50 transition-all duration-300"
                      whileHover={{ x: 5 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <div className="absolute left-0 top-1 w-2 h-2 bg-blue-500 rounded-full transform -translate-x-1/2"></div>
                      <motion.div 
                        className="mr-4 text-blue-400 font-medium w-16 shrink-0"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                      >
                        {item.time}
                      </motion.div>
                      <div>
                        <motion.div 
                          className="font-medium text-white"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                        >
                          {item.title}
                        </motion.div>
                        {item.description && (
                          <motion.div 
                            className="text-sm mt-1 text-gray-400"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.1 + 0.4 }}
                          >
                            {item.description}
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
            
            {/* Enhanced Organizer info */}
            {(selectedEvent?.organizer || selectedEvent?.contact || 
              (selectedEvent?.eventInfo && (selectedEvent.eventInfo.organizer || 
              selectedEvent.eventInfo.contactEmail || selectedEvent.eventInfo.contactPhone))) && (
              <motion.div 
                className="bg-gray-900/50 backdrop-blur rounded-xl p-6 border border-blue-500/30 relative overflow-hidden hover:shadow-xl hover:shadow-blue-900/30 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <motion.h3 
                  className="text-xl font-bold mb-4 text-white"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  Event Information
                </motion.h3>
                
                {(selectedEvent?.organizer || selectedEvent?.eventInfo?.organizer) && (
                  <motion.div 
                    className="flex items-start mb-4 p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-all duration-300"
                    whileHover={{ x: 5 }}
                  >
                    <div className="w-8 h-8 bg-blue-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <span className="text-gray-400 text-xs block">Organized by:</span>
                      <div className="text-white font-medium mt-1">
                        {selectedEvent.eventInfo?.organizer || selectedEvent.organizer}
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {/* Enhanced contact information */}
                {(selectedEvent?.contact || selectedEvent?.eventInfo?.contactEmail || 
                  selectedEvent?.eventInfo?.contactPhone) && (
                  <motion.div 
                    className="flex items-start mb-4 p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-all duration-300"
                    whileHover={{ x: 5 }}
                  >
                    <div className="w-8 h-8 bg-blue-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <span className="text-gray-400 text-xs block">Contact:</span>
                      <div className="text-white font-medium mt-1">
                        {selectedEvent.eventInfo?.contactEmail && (
                          <div>{selectedEvent.eventInfo.contactEmail}</div>
                        )}
                        {selectedEvent.eventInfo?.contactPhone && (
                          <div>{selectedEvent.eventInfo.contactPhone}</div>
                        )}
                        {!selectedEvent.eventInfo && selectedEvent.contact && (
                          <div>{selectedEvent.contact}</div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Enhanced created by info */}
                {selectedEvent?.createdBy && (
                  <motion.div 
                    className="flex items-start p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-all duration-300"
                    whileHover={{ x: 5 }}
                  >
                    <div className="w-8 h-8 bg-blue-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <span className="text-gray-400 text-xs block">Posted by:</span>
                      <div className="text-white font-medium mt-1">{selectedEvent.createdBy}</div>
                    </div>
                  </motion.div>
                )}
                
                {/* Enhanced emoji display */}
                {selectedEvent?.emoji && (
                  <motion.div 
                    className="mt-4 text-center"
                    whileHover={{ scale: 1.1 }}
                  >
                    <span className="text-4xl inline-block animate-bounce">{selectedEvent.emoji}</span>
                  </motion.div>
                )}
              </motion.div>
            )}
          </div>
        </div>
        
        {/* Enhanced Coming Events Section */}
        {events.length > 0 && (
          <motion.div 
            className="mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <motion.h2 
              className="text-2xl font-bold mb-6 text-white text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <motion.span 
                className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 hover:from-blue-400 hover:via-blue-500 hover:to-blue-600 transition-all duration-500"
                whileHover={{ scale: 1.05 }}
              >
                Coming Events
              </motion.span>
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {events.map((event, index) => (
                <motion.div 
                  key={event.post_id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className={`bg-gray-800/30 backdrop-blur rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg border border-transparent ${
                    selectedEvent?.post_id === event.post_id ? 'border-blue-500 shadow-blue-500/20' : 'hover:border-blue-500/30'
                  }`}
                >
                  <div className="relative h-48 overflow-hidden">
                    {event.media_urls && event.media_urls[0] ? (
                      <img 
                        src={event.media_urls[0]}
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://placehold.co/800x450/3B82F6/FFFFFF?text=Event";
                        }}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                        <FaNewspaper className="text-blue-400 text-4xl" />
                      </div>
                    )}
                    
                    {/* Enhanced countdown overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-3">
                      <div className="flex justify-between items-center">
                        <div className="text-xs text-white">
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1 text-blue-400" />
                            <span>{event.formattedStartDate}</span>
                          </div>
                        </div>
                        <div className="text-sm font-bold flex items-center">
                          <span className="text-blue-400">{countdowns[event.post_id]?.days || 0}</span>
                          <span className="text-gray-400 text-xs ml-1">days left</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-white line-clamp-1">{event.title}</h3>
                    
                    <div className="mt-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSelectEvent(event)}
                        className={`w-full py-2 rounded-lg text-center text-sm font-medium transition-all duration-300 ${
                          selectedEvent?.post_id === event.post_id 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-700 text-white hover:bg-blue-600/80'
                        }`}
                      >
                        {selectedEvent?.post_id === event.post_id ? 'Show Countdown' : 'View Details'}
                      </motion.button>
                      {event.redirect_link && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleRedirectLink(event.redirect_link)}
                          className="w-full mt-2 py-2 rounded-lg text-center text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-all duration-300"
                        >
                          Visit Link
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Enhanced Custom animations */}
      <style jsx>{`
        @keyframes slow-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .animate-slow-spin {
          animation: slow-spin 20s linear infinite;
        }
        
        .animation-delay-500 {
          animation-delay: 500ms;
        }
        
        .countdown-item {
          transition: all 0.3s ease;
        }
        
        .countdown-item:hover {
          transform: translateY(-5px);
        }
        
        /* For line clamping */
        .line-clamp-1 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
        }

        /* Enhanced text animations */
        @keyframes text-shimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .text-shimmer {
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.1) 0%,
            rgba(255, 255, 255, 0.3) 50%,
            rgba(255, 255, 255, 0.1) 100%
          );
          background-size: 200% 100%;
          animation: text-shimmer 3s ease infinite;
        }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }

        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default Coming;
