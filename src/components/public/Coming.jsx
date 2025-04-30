import React, { useState, useEffect, useRef } from "react";
import moment from "moment";
import { useGetAllPosts } from "../../hooks/usePost";
import { useNavigate, useLocation } from "react-router-dom";
import { Calendar, Clock, MapPin, ExternalLink, Image, ArrowRight, X, Zap, Target } from "lucide-react";
import Swal from "sweetalert2";

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
  const startCountdown = (eventId, startDate) => {
    // Clear existing interval if any
    if (countdownIntervals.current[eventId]) {
      clearInterval(countdownIntervals.current[eventId]);
    }

    const updateCountdown = () => {
      const now = moment();
      const eventDate = moment(startDate);
      const duration = moment.duration(eventDate.diff(now));

      if (duration.asMilliseconds() <= 0) {
        clearInterval(countdownIntervals.current[eventId]);
        setCountdowns(prev => ({
          ...prev,
          [eventId]: { days: 0, hours: 0, minutes: 0, seconds: 0 }
        }));
        return;
      }

      setCountdowns(prev => ({
        ...prev,
        [eventId]: {
          days: Math.floor(duration.asDays()),
          hours: duration.hours(),
          minutes: duration.minutes(),
          seconds: duration.seconds()
        }
      }));
    };

    // Update immediately and then every second
    updateCountdown();
    countdownIntervals.current[eventId] = setInterval(updateCountdown, 1000);
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
          if (post.post_type === "announcement" && post.createdAt) {
            return moment(post.createdAt).isAfter(now);
          }
          return false;
        })
        .sort((a, b) => {
          const dateA = a.post_type === "event" ? a.start_date : a.createdAt;
          const dateB = b.post_type === "event" ? b.start_date : b.createdAt;
          return moment(dateA).diff(moment(dateB));
        });

      // Transform posts with proper formatting
      const transformedPosts = filteredPosts.map(post => {
        // Create formatted date strings for display
        const formattedStartDate = getFormattedDate(post.start_date);
        const formattedEndDate = post.end_date ? getFormattedDate(post.end_date) : null;
        const dateRange = getDateRange(post.start_date, post.end_date);
        
        // Ensure images array is always available
        const images = post.images && Array.isArray(post.images) ? post.images : [];
        
        // Handle the case where images might be a string instead of an array
        if (post.images && !Array.isArray(post.images) && typeof post.images === 'string') {
          images.push(post.images);
        }
        
        // Add a default image if none exists
        if (images.length === 0) {
          images.push("https://placehold.co/800x450/3B82F6/FFFFFF?text=Event");
        }
        
        return {
          ...post,
          title: post.title || "Event Title",
          category: post.category || "Event",
          content: post.content || "Join us for this exciting upcoming event. More details will be provided soon.",
          startDate: post.start_date,
          endDate: post.end_date,
          formattedStartDate,
          formattedEndDate,
          dateRange,
          images,
          startDateObj: post.post_type === "event" ? moment(post.start_date).toDate() : moment(post.createdAt).toDate(),
          endDateObj: post.post_type === "event" && post.end_date ? moment(post.end_date).toDate() : null,
        };
      });

      setEvents(transformedPosts);
      if (transformedPosts.length > 0 && !selectedEvent) {
        setSelectedEvent(transformedPosts[0]);
      }
      
      transformedPosts.forEach(post => {
        const targetDate = post.post_type === "event" ? post.start_date : post.createdAt;
        startCountdown(post.id, targetDate);
      });
      
      setLoading(false);
    }
  }, [isLoading, posts]);

  // Clean up intervals when component unmounts
  useEffect(() => {
    return () => {
      Object.values(countdownIntervals.current).forEach(interval => clearInterval(interval));
    };
  }, []);

  // Handle event selection
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setActiveImage(0);
  };

  // Get image source with fallback
  const getImageSource = (index) => {
    if (!selectedEvent || !selectedEvent.images || selectedEvent.images.length === 0) {
      return "https://placehold.co/800x450/3B82F6/FFFFFF?text=Event";
    }
    
    const image = selectedEvent.images[index];
    return typeof image === "string" ? image : URL.createObjectURL(image);
  };

  // Open external link
  const openExternalLink = (url) => {
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
    <div className="bg-gradient-to-br from-gray-900 to-black  text-white min-h-screen pb-16 rounded-lg rounded-lg">
      {/* Header section with gradient */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 py-8 relative overflow-hidden">
      {/* Pattern overlay */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSI+PC9yZWN0PjwvcGF0dGVybj48L2RlZnM+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSI+PC9yZWN0Pjwvc3ZnPg==')]"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold text-center tracking-tight">
          <span className="text-white">Upcoming</span>{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200">
            Events
          </span>
        </h1>
        <p className="text-center mt-4 text-white max-w-2xl mx-auto">
          Discover and join our upcoming events. Mark your calendar and don't miss out on these amazing opportunities!
        </p>
      </div>
      
      {/* Decorative bottom curve */}
      <div className="absolute -bottom-6 left-0 right-0 h-12 bg-gradient-to-br from-gray-900 to-black transform -skew-y-1"></div>
    </div>

      <div className="container mx-auto px-4 mt-8">
        <div className="grid md:grid-cols-12 gap-8">
          {/* Left column - Event gallery & details */}
          <div className="md:col-span-7">
            {/* Image gallery with improved controls */}
            <div className="relative h-[450px] rounded-xl overflow-hidden group shadow-xl shadow-blue-900/20 border border-gray-800">
              {selectedEvent?.images && selectedEvent.images.length > 0 && (
                <>
                  <img 
                    src={getImageSource(activeImage)}
                    alt={selectedEvent.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/800x450/6D28D9/FFFFFF?text=Event";
                    }}
                  />
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                  
                  {/* Image navigation buttons */}
                  {selectedEvent.images.length > 1 && (
                    <>
                      <button 
                        onClick={() => changeImage('prev')}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Previous image"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => changeImage('next')}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Next image"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </>
                  )}
                  
                  {/* Image indicators */}
                  {selectedEvent.images.length > 1 && (
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                      {selectedEvent.images.map((_, index) => (
                        <button 
                          key={index}
                          onClick={() => setActiveImage(index)}
                          className={`h-1.5 rounded-full transition-all ${index === activeImage ? 'bg-blue-500 w-8' : 'bg-white/60 w-2'}`}
                          aria-label={`View image ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                  
                  {/* Event title overlay for mobile */}
                  <div className="md:hidden absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {selectedEvent?.category && (
                        <span className="inline-block px-2 py-1 bg-blue-600 text-white text-xs font-semibold rounded">
                          {selectedEvent.category}
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl font-bold text-white">{selectedEvent?.title}</h2>
                  </div>
                </>
              )}
            </div>
            
            {/* Event basic info */}
            <div className="mt-8">
              <div className="flex flex-wrap gap-3 mb-4">
                {selectedEvent?.category && (
                  <span className="inline-block px-3 py-1.5 bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 text-white text-sm font-semibold rounded-lg">
                    {selectedEvent.category}
                  </span>
                )}
                {selectedEvent?.cpeGroup && (
                  <span className="inline-block px-3 py-1.5 bg-gray-800 text-white text-sm font-semibold rounded-lg border border-blue-500/50">
                    {selectedEvent.cpeGroup}
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white leading-tight">
                {selectedEvent?.title || "Event Title"}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-gray-300 mb-6">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-blue-400" />
                  <span>{selectedEvent?.dateRange || "N/A"}</span>
                </div>
                
                {selectedEvent?.location && (
                  <div className="flex items-center">
                    <span>{selectedEvent.location}</span>
                  </div>
                )}
              </div>
              
              {/* Event description */}
              <div className="prose prose-invert max-w-none">
                <p className="leading-relaxed text-lg text-gray-300">
                  {selectedEvent?.content || "Join us for this exciting upcoming event. More details will be provided soon."}
                </p>
              </div>
              
              {/* Buttons */}
              <div className="mt-8 flex flex-wrap gap-4">
                {selectedEvent?.link && (
                  <button
                    className="bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 hover:from-blue-400 hover:to-blue-600 text-white px-6 py-3 rounded-lg flex items-center justify-center font-medium transition transform hover:translate-y-[-2px] hover:shadow-lg shadow-blue-700/20"
                    onClick={() => openExternalLink(selectedEvent.link)}
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    Join Event
                  </button>
                )}
                
                {selectedEvent?.registration && selectedEvent.registration !== selectedEvent.link && (
                  <button
                    className="bg-transparent text-white px-6 py-3 rounded-lg border border-blue-500 hover:bg-blue-900/20 transition flex items-center justify-center font-medium transform hover:translate-y-[-2px]"
                    onClick={() => openExternalLink(selectedEvent.registration)}
                  >
                    <ExternalLink className="w-5 h-5 mr-2" />
                    Register Now
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {/* Right column - Countdown and other event details */}
          <div className="md:col-span-5">
            {/* Stylized Countdown */}
            <div className="bg-gray-900/50 backdrop-blur rounded-xl p-8 mb-8 border border-blue-500/30 shadow-lg shadow-blue-900/20 relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute -right-20 -top-20 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl"></div>
              <div className="absolute -left-20 -bottom-20 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl"></div>
              
              <h2 className="text-xl font-bold mb-6 relative">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">EVENT</span> COUNTDOWN
              </h2>
              
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="countdown-item bg-gray-800/70 backdrop-blur rounded-lg p-3 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 to-transparent"></div>
                  <div className="relative">
                    <div className="text-4xl font-bold mb-1 text-white">{countdowns[selectedEvent?.id]?.days || 0}</div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider">Days</div>
                  </div>
                </div>
                <div className="countdown-item bg-gray-800/70 backdrop-blur rounded-lg p-3 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 to-transparent"></div>
                  <div className="relative">
                    <div className="text-4xl font-bold mb-1 text-white">{countdowns[selectedEvent?.id]?.hours || 0}</div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider">Hours</div>
                  </div>
                </div>
                <div className="countdown-item bg-gray-800/70 backdrop-blur rounded-lg p-3 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 to-transparent"></div>
                  <div className="relative">
                    <div className="text-4xl font-bold mb-1 text-white">{countdowns[selectedEvent?.id]?.minutes || 0}</div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider">Mins</div>
                  </div>
                </div>
                <div className="countdown-item bg-gray-800/70 backdrop-blur rounded-lg p-3 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 to-transparent"></div>
                  <div className="relative">
                    <div className="text-4xl font-bold mb-1 text-white animate-pulse">{countdowns[selectedEvent?.id]?.seconds || 0}</div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider">Secs</div>
                  </div>
                </div>
              </div>
              
              {/* Event title for countdown */}
              <div className="mt-6 text-center p-3 bg-gray-800/50 backdrop-blur rounded-lg border border-blue-500/20">
                <div className="flex items-center justify-center gap-4">
                  {selectedEvent?.images && selectedEvent.images[0] && (
                    <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-blue-500/30">
                      <img 
                        src={selectedEvent.images[0]}
                        alt={selectedEvent.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://placehold.co/100x100/3B82F6/FFFFFF?text=Event";
                        }}
                      />
                    </div>
                  )}
                  <div>
                    <div className="text-lg font-bold">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500">
                        {selectedEvent?.title || "Event"}
                      </span>
                    </div>
                    <div className="text-gray-400 text-sm mt-1">
                      {getDateRange(selectedEvent?.startDate, selectedEvent?.endDate)}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Add URL button */}
              <div className="mt-4 text-center">
                <button
                  onClick={() => {
                    if (selectedEvent?.media && selectedEvent.media.length > 0) {
                      openExternalLink(selectedEvent.media[0]);
                    } else {
                      Swal.fire({
                        icon: "info",
                        title: "No Link Available",
                        text: "The event creator has not provided any link for this event.",
                        confirmButtonColor: "#3085d6",
                      });
                    }
                  }}
                  className="w-full py-2 px-4 rounded-lg text-center text-sm font-medium bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 text-white hover:from-blue-400 hover:to-blue-600 hover:shadow-lg shadow-blue-700/20 transition"
                >
                  Click link here
                </button>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute left-3 bottom-1/3 w-2 h-2 bg-blue-500 rounded-full animate-ping opacity-75"></div>
              <div className="absolute right-4 top-1/4 w-2 h-2 bg-cyan-500 rounded-full animate-ping opacity-75 animation-delay-500"></div>
            </div>
            
            {/* Schedule/Agenda */}
            {((selectedEvent?.agenda && selectedEvent.agenda.length > 0) || 
              (selectedEvent?.schedule && selectedEvent.schedule.length > 0)) && (
              <div className="bg-gray-900/50 backdrop-blur rounded-xl p-6 mb-8 border border-blue-500/30 relative overflow-hidden">
                <h3 className="text-xl font-bold mb-4 text-white flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-blue-400" />
                  Event Schedule
                </h3>
                
                <div className="space-y-4">
                  {/* Handle both agenda from original format and schedule from CreatePost */}
                  {(selectedEvent?.schedule || selectedEvent?.agenda || []).map((item, index) => (
                    <div 
                      key={index} 
                      className="flex relative pl-6 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gradient-to-b before:from-blue-500 before:to-transparent"
                    >
                      <div className="absolute left-0 top-1 w-2 h-2 bg-blue-500 rounded-full transform -translate-x-1/2"></div>
                      <div className="mr-4 text-blue-400 font-medium w-16 shrink-0">{item.time}</div>
                      <div>
                        <div className="font-medium text-white">{item.title}</div>
                        {item.description && <div className="text-sm mt-1 text-gray-400">{item.description}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Organizer info */}
            {(selectedEvent?.organizer || selectedEvent?.contact || 
              (selectedEvent?.eventInfo && (selectedEvent.eventInfo.organizer || 
              selectedEvent.eventInfo.contactEmail || selectedEvent.eventInfo.contactPhone))) && (
              <div className="bg-gray-900/50 backdrop-blur rounded-xl p-6 border border-blue-500/30 relative overflow-hidden">
                <h3 className="text-xl font-bold mb-4 text-white">Event Information</h3>
                
                {(selectedEvent?.organizer || selectedEvent?.eventInfo?.organizer) && (
                  <div className="flex items-start mb-4 p-3 bg-gray-800/30 rounded-lg">
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
                  </div>
                )}
                
                {/* Display contact information */}
                {(selectedEvent?.contact || selectedEvent?.eventInfo?.contactEmail || 
                  selectedEvent?.eventInfo?.contactPhone) && (
                  <div className="flex items-start mb-4 p-3 bg-gray-800/30 rounded-lg">
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
                  </div>
                )}

                {/* Created by info if available */}
                {selectedEvent?.createdBy && (
                  <div className="flex items-start p-3 bg-gray-800/30 rounded-lg">
                    <div className="w-8 h-8 bg-blue-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <span className="text-gray-400 text-xs block">Posted by:</span>
                      <div className="text-white font-medium mt-1">{selectedEvent.createdBy}</div>
                    </div>
                  </div>
                )}
                
                {/* Emoji display if available */}
                {selectedEvent?.emoji && (
                  <div className="mt-4 text-center">
                    <span className="text-4xl inline-block animate-bounce">{selectedEvent.emoji}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Coming Events Section */}
        {events.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6 text-white text-center">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500">Coming Events</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {events.map((event, index) => (
                <div 
                  key={event.id || index}
                  className={`bg-gray-800/30 backdrop-blur rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg border border-transparent ${
                    selectedEvent?.id === event.id ? 'border-blue-500 shadow-blue-500/20' : 'hover:border-blue-500/30'
                  }`}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={event.images[0]}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/800x450/3B82F6/FFFFFF?text=Event";
                      }}
                    />
                    
                    {/* Countdown overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-3">
                      <div className="flex justify-between items-center">
                        <div className="text-xs text-white">
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1 text-blue-400" />
                            <span>{event.formattedStartDate}</span>
                          </div>
                        </div>
                        <div className="text-sm font-bold flex items-center">
                          <span className="text-blue-400">{countdowns[event.id]?.days || 0}</span>
                          <span className="text-gray-400 text-xs ml-1">days left</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Category badge */}
                    {event.category && (
                      <div className="absolute top-3 right-3">
                        <span className="inline-block px-2 py-1 bg-blue-600/90 text-white text-xs font-semibold rounded">
                          {event.category}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-white line-clamp-1">{event.title}</h3>
                    
                    {event.location && (
                      <div className="flex items-start mt-2 text-sm text-gray-400">
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                    )}
                    
                    <div className="mt-4">
                      <button
                        onClick={() => handleSelectEvent(event)}
                        className={`w-full py-2 rounded-lg text-center text-sm font-medium transition ${
                          selectedEvent?.id === event.id 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-700 text-white hover:bg-blue-600/80'
                        }`}
                      >
                        {selectedEvent?.id === event.id ? 'Currently Viewing' : 'View Details'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Custom animations */}
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
      `}</style>
    </div>
  );
}

export default Coming;
