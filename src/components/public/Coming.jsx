import React, { useState, useEffect, useRef } from "react";
import moment from "moment";
import { useGetAllPost } from "../../api/post";
import { useNavigate, useLocation } from "react-router-dom";
import { Calendar, Clock, MapPin, ExternalLink, Image, ArrowRight, X, Zap, Target } from "lucide-react";

function Coming({ posts = [] }) {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [countdowns, setCountdowns] = useState({});
  
  const imageInterval = useRef(null);
  const countdownIntervals = useRef({});
  
  const navigate = useNavigate();
  const location = useLocation();
  const getAllPost = useGetAllPost();
  
  useEffect(() => {
    fetchPosts();
  }, []);
  
  const fetchPosts = () => {
    setLoading(true);
    getAllPost.mutate(null, {
      onSuccess: (res) => {
        if (res && res.data && Array.isArray(res.data)) {
          processUpcomingEvents(res.data);
        } else {
          console.error("API response data is not an array:", res);
          setLoading(false);
        }
      },
      onError: (error) => {
        console.error("Failed to fetch posts:", error);
        setLoading(false);
      }
    });
  };
  
  const processUpcomingEvents = (posts) => {
    if (!Array.isArray(posts)) {
      console.error("Invalid posts data: Expected an array.");
      setLoading(false);
      return;
    }
    
    const now = moment();
    const filteredPosts = posts
      .filter((post) => {
        // For events, check if start date is in the future
        if (post.post_type === "event" && post.start_date) {
          return moment(post.start_date).isAfter(now);
        }
        // For announcements, check if created date is in the future
        if (post.post_type === "announcement" && post.createdAt) {
          return moment(post.createdAt).isAfter(now);
        }
        return false;
      })
      .sort((a, b) => {
        // Sort by start date for events, created date for announcements
        const dateA = a.post_type === "event" ? a.start_date : a.createdAt;
        const dateB = b.post_type === "event" ? b.start_date : b.createdAt;
        return moment(dateA).diff(moment(dateB));
      });

    // Transform posts to include additional data
    const transformedPosts = filteredPosts.map(post => ({
      ...post,
      startDateObj: post.post_type === "event" ? moment(post.start_date).toDate() : moment(post.createdAt).toDate(),
      endDateObj: post.post_type === "event" && post.end_date ? moment(post.end_date).toDate() : null,
      formattedStartDate: post.post_type === "event" ? getFormattedDate(post.start_date) : getFormattedDate(post.createdAt),
      formattedEndDate: post.post_type === "event" && post.end_date ? getFormattedDate(post.end_date) : null,
      daysUntil: post.post_type === "event" ? calculateDaysUntil(post.start_date) : calculateDaysUntil(post.createdAt)
    }));

    setEvents(transformedPosts);
    if (transformedPosts.length > 0 && !selectedEvent) {
      setSelectedEvent(transformedPosts[0]);
    }
    
    // Initialize countdowns for all events
    transformedPosts.forEach(post => {
      const targetDate = post.post_type === "event" ? post.start_date : post.createdAt;
      startCountdown(post.id, targetDate);
    });
    
    setLoading(false);
  };

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

  useEffect(() => {
    return () => {
      // Cleanup intervals on unmount
      Object.values(countdownIntervals.current).forEach(interval => clearInterval(interval));
    };
  }, []);

  const calculateDaysUntil = (date) => {
    const now = moment();
    const eventDate = moment(date);
    return eventDate.diff(now, 'days');
  };

  const getFormattedDate = (date) => {
    if (!date) return "";
    return moment(date).format("dddd, MMMM D, YYYY");
  };

  const getDateRange = (startDate, endDate) => {
    if (!startDate) return "";
    
    const startMoment = moment(startDate, ["DD-MM-YYYY", "DD/MM/YYYY"]);
    const startDay = startMoment.format('DD');
    const startMonth = startMoment.format('MM');
    
    if (!endDate) return `${startDay}.${startMonth}`;
    
    const endMoment = moment(endDate, ["DD-MM-YYYY", "DD/MM/YYYY"]);
    const endDay = endMoment.format('DD');
    const endMonth = endMoment.format('MM');
    
    return `${startDay}.${startMonth}-${endDay}.${endMonth}`;
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setActiveImage(0);
  };

  const openExternalLink = (url) => {
    if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
      window.open(url, '_blank');
    }
  };

  const getImageSource = (index) => {
    if (!selectedEvent || !selectedEvent.images || selectedEvent.images.length === 0) {
      return "https://placehold.co/800x450/3B82F6/FFFFFF?text=Event";
    }
    
    const image = selectedEvent.images[index];
    return typeof image === "string" ? image : URL.createObjectURL(image);
  };

  // Style choice
  const useStyle1 = true;

  if (useStyle1) {
    if (loading) {
      return (
        <div className="flex justify-center items-center min-h-screen bg-black">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      );
    }
    
    return (
      <div className="bg-black text-white min-h-screen overflow-hidden relative">
        {/* Background vinyl record */}
        <div className="absolute -left-1/4 top-0 w-1/2 h-full opacity-20 pointer-events-none">
          <div className="relative w-full h-full">
            <div className="absolute w-full h-full rounded-full border-[20px] border-blue-600 animate-slow-spin"></div>
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/3 rounded-full bg-blue-600"></div>
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/6 h-1/6 rounded-full bg-black"></div>
          </div>
        </div>

        {/* Side text */}
        <div className="absolute right-0 top-0 h-full w-24 flex items-center justify-center pointer-events-none">
          <h2 className="text-9xl font-bold transform -rotate-90 whitespace-nowrap text-blue-600 opacity-70">{selectedEvent?.category?.toUpperCase() || "EVENT"}</h2>
        </div>

        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="grid md:grid-cols-12 gap-8">
            {/* Left side - Image gallery */}
            <div className="md:col-span-7" data-aos="fade-right">
              <div className="relative h-[500px] overflow-hidden rounded-lg bg-gray-900 group">
                {selectedEvent?.images && selectedEvent.images.length > 0 && (
                  <div className="h-full relative">
                    <img 
                      src={getImageSource(activeImage)}
                      alt={selectedEvent.title}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => handleSelectEvent(selectedEvent)}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/800x600?text=Image+Unavailable";
                      }}
                    />
                    
                    {/* Image indicators */}
                    {selectedEvent.images.length > 1 && (
                      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                        {selectedEvent.images.map((_, index) => (
                          <div 
                            key={index}
                            className={`w-2 h-2 rounded-full ${index === activeImage ? 'bg-blue-600 w-6' : 'bg-white/60'}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Event basic info */}
              <div className="mt-6 mb-8">
                <div className="flex flex-wrap gap-3 mb-4">
                  {selectedEvent?.category && (
                    <span className="inline-block px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded">
                      {selectedEvent.category}
                    </span>
                  )}
                  {selectedEvent?.cpeGroup && (
                    <span className="inline-block px-3 py-1 bg-black text-white text-sm font-semibold rounded border border-blue-600">
                      {selectedEvent.cpeGroup}
                    </span>
                  )}
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white leading-tight">
                  {selectedEvent?.title || "Event Title"}
                </h1>
                
                <div className="flex flex-wrap items-center gap-6 text-gray-300">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                    <span>{selectedEvent?.formattedStartDate}</span>
                  </div>
                  
                  {selectedEvent?.location && (
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-blue-500" />
                      <span>{selectedEvent.location}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Event description */}
              <div className="prose prose-invert max-w-none">
                <p className="leading-relaxed text-lg">
                  {selectedEvent?.content || "Join us for this exciting upcoming event. More details will be provided soon."}
                </p>
              </div>
              
              {/* Buttons */}
              <div className="mt-8 flex flex-wrap gap-4">
                {selectedEvent?.link && (
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded flex items-center justify-center font-medium transition transform hover:scale-105"
                    onClick={() => openExternalLink(selectedEvent.link)}
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    Join Event
                  </button>
                )}
                
                {selectedEvent?.registration && selectedEvent.registration !== selectedEvent.link && (
                  <button
                    className="bg-black text-white px-6 py-3 rounded border border-blue-600 hover:bg-blue-900/20 transition flex items-center justify-center font-medium"
                    onClick={() => openExternalLink(selectedEvent.registration)}
                  >
                    Register Now
                  </button>
                )}
              </div>
            </div>
            
            {/* Right side - Countdown and details */}
            <div className="md:col-span-5">
              {/* Stylized Countdown */}
              <div 
                className="bg-neutral-900 rounded-lg p-8 mb-8 border-l-4 border-blue-600 relative overflow-hidden"
              >
                {/* Background decoration */}
                <div className="absolute -right-12 -top-12 w-40 h-40 bg-blue-600/10 rounded-full blur-xl"></div>
                <div className="absolute -left-12 -bottom-12 w-40 h-40 bg-blue-600/10 rounded-full blur-xl"></div>
                
                <h2 className="text-2xl font-bold mb-6 inline-block bg-black px-4 py-1">
                  <span className="text-blue-600">EVENT</span> STARTING:
                </h2>
                
                <div className="flex justify-between items-center text-center">
                  <div className="countdown-item">
                    <div className="text-5xl font-bold mb-1">{countdowns[selectedEvent?.id]?.days || 0}</div>
                    <div className="text-sm text-gray-400">Days</div>
                  </div>
                  <div className="text-4xl font-bold text-blue-600">:</div>
                  <div className="countdown-item">
                    <div className="text-5xl font-bold mb-1">{countdowns[selectedEvent?.id]?.hours || 0}</div>
                    <div className="text-sm text-gray-400">Hours</div>
                  </div>
                  <div className="text-4xl font-bold text-blue-600">:</div>
                  <div className="countdown-item">
                    <div className="text-5xl font-bold mb-1">{countdowns[selectedEvent?.id]?.minutes || 0}</div>
                    <div className="text-sm text-gray-400">Minutes</div>
                  </div>
                  <div className="text-4xl font-bold text-blue-600">:</div>
                  <div className="countdown-item">
                    <div className="text-5xl font-bold mb-1 animate-pulse">{countdowns[selectedEvent?.id]?.seconds || 0}</div>
                    <div className="text-sm text-gray-400">Seconds</div>
                  </div>
                </div>
                
                {/* Festival dates highlight */}
                <div className="mt-8 text-center">
                  <div className="text-lg font-bold uppercase">
                    <span className="text-white">{selectedEvent?.cpeGroup || "EVENT"}</span> 
                    <span className="block md:inline ml-2 text-blue-600">COUNTDOWN</span>
                  </div>
                  <div className="mt-1 text-2xl md:text-3xl font-extrabold text-white">
                    {selectedEvent?.title?.split(' ')[0] || "EVENT"} <span className="text-blue-600">{getDateRange(selectedEvent?.startDate, selectedEvent?.endDate)}</span>
                  </div>
                </div>
                
                {/* Pulsing circle decoration */}
                <div className="absolute -left-3 bottom-1/3 w-2 h-2 bg-blue-600 rounded-full animate-ping opacity-75"></div>
                <div className="absolute left-[90%] top-[20%] w-2 h-2 bg-blue-600 rounded-full animate-ping opacity-75 animation-delay-500"></div>
              </div>
              
              {/* Schedule/Agenda */}
              {((selectedEvent?.agenda && selectedEvent.agenda.length > 0) || 
                (selectedEvent?.schedule && selectedEvent.schedule.length > 0)) && (
                <div className="bg-neutral-900 rounded-lg p-6 mb-8">
                  <h3 className="text-xl font-bold mb-4 border-l-4 border-blue-600 pl-3">Event Schedule</h3>
                  <div className="space-y-4">
                    {/* Handle both agenda from original format and schedule from CreatePost */}
                    {(selectedEvent?.schedule || selectedEvent?.agenda || []).map((item, index) => (
                      <div 
                        key={index} 
                        className="flex relative pl-6 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gradient-to-b before:from-blue-600 before:to-transparent"
                      >
                        <div className="absolute left-0 top-1 w-2 h-2 bg-blue-600 rounded-full transform -translate-x-1/2"></div>
                        <div className="mr-4 text-blue-500 font-medium w-20 shrink-0">{item.time}</div>
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
                <div className="bg-neutral-900 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4 border-l-4 border-blue-600 pl-3">Event Information</h3>
                  
                  {(selectedEvent?.organizer || selectedEvent?.eventInfo?.organizer) && (
                    <div className="mb-4">
                      <span className="text-gray-400 text-sm block mb-1">Organized by:</span>
                      <div className="text-white font-medium">
                        {selectedEvent.eventInfo?.organizer || selectedEvent.organizer}
                      </div>
                    </div>
                  )}
                  
                  {/* Display contact information from either structure */}
                  {(selectedEvent?.contact || selectedEvent?.eventInfo?.contactEmail || 
                    selectedEvent?.eventInfo?.contactPhone) && (
                    <div className="mb-4">
                      <span className="text-gray-400 text-sm block mb-1">Contact:</span>
                      <div className="text-white font-medium">
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
                  )}

                  {/* Created by info if available */}
                  {selectedEvent.createdBy && (
                    <div className="mb-4">
                      <span className="text-gray-400 text-sm block mb-1">Posted by:</span>
                      <div className="text-white font-medium">{selectedEvent.createdBy}</div>
                    </div>
                  )}
                  
                  {/* Emoji display if available */}
                  {selectedEvent.emoji && (
                    <div className="mt-2 flex items-center">
                      <span className="text-3xl mr-3">{selectedEvent.emoji}</span>
                      <span className="text-gray-400 text-sm">Event Emoji</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Image Zoom Modal */}
        {selectedEvent && (
          <div 
            className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
            onClick={() => handleSelectEvent(null)}
          >
            <div 
              className="relative max-w-5xl w-full"
              onClick={e => e.stopPropagation()}
            >
              <button
                className="absolute -top-12 right-0 text-white hover:text-blue-400 transition-colors p-2"
                onClick={() => handleSelectEvent(null)}
                aria-label="Close"
              >
                <X className="w-8 h-8" />
              </button>
              <img
                src={getImageSource(activeImage)}
                alt="Enlarged view"
                className="max-w-full max-h-[85vh] object-contain mx-auto rounded-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/800x600?text=Unable+to+Load+Image";
                }}
              />
            </div>
          </div>
        )}
        
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
        `}</style>
      </div>
    );
  }
  
  // Style 2: Modern Blue theme
  else {
    if (loading) {
      return (
        <div className="flex justify-center items-center min-h-screen bg-blue-600">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      );
    }
    
    if (!selectedEvent) {
      return (
        <div className="w-full min-h-[60vh] py-16 px-4 md:px-8 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white flex flex-col relative overflow-hidden">
          <div className="flex-grow flex items-center justify-center">
            <div className="bg-white/10 backdrop-blur-sm p-12 rounded-2xl border border-white/20 text-center max-w-2xl w-full mx-auto shadow-xl">
              <Calendar className="w-24 h-24 mx-auto text-white/50" />
              <h3 className="text-2xl md:text-3xl font-bold mt-6">No upcoming events</h3>
              <p className="mt-3 text-blue-100 text-lg">Check back later for future events</p>
              <button className="mt-6 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
                View Past Events
              </button>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="w-full min-h-[60vh] py-16 px-4 md:px-8 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white flex flex-col relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-blue-400 opacity-20 blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-indigo-500 opacity-20 blur-3xl"></div>
          <div className="absolute bottom-1/4 left-0 w-72 h-72 rounded-full bg-white opacity-5 blur-3xl"></div>
          
          {/* Animated particles */}
          <div className="particle absolute top-20 left-1/4 w-3 h-3 rounded-full bg-white opacity-20 animate-float-slow"></div>
          <div className="particle absolute top-1/3 right-1/4 w-4 h-4 rounded-full bg-white opacity-30 animate-float-medium"></div>
          <div className="particle absolute bottom-1/3 left-1/3 w-2 h-2 rounded-full bg-white opacity-25 animate-float-fast"></div>
        </div>
        
        <div className="max-w-7xl mx-auto w-full flex-grow flex flex-col relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-2 text-center">
            Upcoming Event
          </h2>
          <p className="text-blue-100 text-center mb-12 text-lg">
            Mark your calendar and don't miss out
          </p>

          <section className="grid md:grid-cols-3 gap-8">
            {/* Featured Event */}
            <div className="md:col-span-2 bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden transform hover:shadow-2xl transition duration-300 border border-white/20">
              <div className="relative overflow-hidden h-80">
                <img
                  src={getImageSource(activeImage)}
                  alt={selectedEvent.title}
                  className="w-full h-full object-cover transition duration-700 hover:scale-105 cursor-pointer"
                  onClick={() => handleSelectEvent(selectedEvent)}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/800x600?text=Coming+Soon";
                  }}
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent flex flex-col justify-end p-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="inline-block px-3 py-1.5 bg-blue-600 text-white text-sm font-semibold rounded-full">
                      {selectedEvent?.formattedStartDate}
                    </span>
                    {selectedEvent?.category && (
                      <span className="inline-block px-3 py-1.5 bg-blue-500/50 text-white text-sm font-semibold rounded-full backdrop-blur-sm">
                        {selectedEvent.category}
                      </span>
                    )}
                    {selectedEvent?.cpeGroup && (
                      <span className="inline-block px-3 py-1.5 bg-blue-500/50 text-white text-sm font-semibold rounded-full backdrop-blur-sm">
                        {selectedEvent.cpeGroup}
                      </span>
                    )}
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-white leading-tight">{selectedEvent.title}</h3>
                  <div className="flex flex-col md:flex-row md:items-center text-gray-200 mt-3 space-y-2 md:space-y-0 md:space-x-4">
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-blue-300" />
                      <span>{selectedEvent?.formattedStartDate}</span>
                    </div>
                    
                    {selectedEvent?.location && (
                      <div className="flex items-center">
                        <MapPin className="w-5 h-5 mr-2 text-blue-300" />
                        <span>{selectedEvent.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Tabs for different content */}
              <div className="border-b border-white/20">
                <div className="flex">
                  <button 
                    className={`px-5 py-3 font-medium text-sm focus:outline-none ${
                      activeImage === 0 
                        ? 'text-white border-b-2 border-white' 
                        : 'text-blue-200 hover:text-white'
                    }`}
                    onClick={() => setActiveImage(0)}
                  >
                    Event Details
                  </button>
                  
                  {(selectedEvent.agenda?.length > 0 || selectedEvent.schedule?.length > 0) && (
                    <button 
                      className={`px-5 py-3 font-medium text-sm focus:outline-none ${
                        activeImage === 1 
                          ? 'text-white border-b-2 border-white' 
                          : 'text-blue-200 hover:text-white'
                      }`}
                      onClick={() => setActiveImage(1)}
                    >
                      Agenda
                    </button>
                  )}
                  
                  {selectedEvent.images.length > 1 && (
                    <button 
                      className={`px-5 py-3 font-medium text-sm focus:outline-none ${activeImage === 2 
                        ? 'text-white border-b-2 border-white' 
                        : 'text-blue-200 hover:text-white'
                      }`}
                      onClick={() => setActiveImage(2)}
                    >
                      Gallery
                    </button>
                  )}
                </div>
              </div>
              
              <div className="p-6">
                {activeImage === 0 && (
                  <div className="text-blue-100">
                    <p className="leading-relaxed">
                      {selectedEvent?.content || "Join us for this exciting upcoming event. More details will be provided soon."}
                    </p>
                    {selectedEvent.speakers && selectedEvent.speakers.length > 0 && (
                      <div className="mt-6">
                        <h4 className="font-semibold text-white mb-2">Featured Speakers:</h4>
                        <ul className="list-disc list-inside">
                          {selectedEvent.speakers.map((speaker, index) => (
                            <li key={index}>{speaker}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {(selectedEvent.emoji && selectedEvent.emoji !== "") && (
                      <div className="mt-6 flex items-center">
                        <div className="bg-blue-600/30 rounded-full p-4 mr-3">
                          <span className="text-3xl">{selectedEvent.emoji}</span>
                        </div>
                        <span className="text-blue-200 text-sm">Event Emoji</span>
                      </div>
                    )}
                    {selectedEvent.link && (
                      <div className="mt-6">
                        <button 
                          onClick={() => openExternalLink(selectedEvent.link)}
                          className="inline-flex items-center text-white bg-blue-600/70 hover:bg-blue-600/90 px-4 py-2 rounded-lg transition-colors"
                        >
                          <span>View Event Details</span>
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
                
                {activeImage === 1 && (
                  <div className="text-blue-100">
                    <ul className="space-y-4">
                      {/* Use agenda, schedule or empty array */}
                      {(selectedEvent.agenda || selectedEvent.schedule || []).map((item, index) => (
                        <li key={index} className="flex">
                          <div className="mr-4 text-blue-300 font-medium">{item.time}</div>
                          <div>
                            <div className="font-medium text-white">{item.title}</div>
                            {item.description && <div className="text-sm mt-1">{item.description}</div>}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {activeImage === 2 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {selectedEvent.images.map((image, index) => (
                      <div
                        key={index}
                        className="relative bg-white/10 rounded-lg overflow-hidden aspect-square shadow-lg transform hover:scale-105 transition duration-300 cursor-pointer group"
                        onClick={() => setActiveImage(index)}
                      >
                        <img
                          src={image}
                          alt={`${selectedEvent.title} - Gallery ${index + 1}`}
                          className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/400/3B82F6/FFFFFF?text=Image";
                          }}
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <Image className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Countdown Section with custom design */}
            <div className="bg-gradient-to-br from-blue-600/40 to-blue-800/40 backdrop-blur-md p-6 rounded-2xl border border-white/20 flex flex-col justify-between shadow-xl">
              <div>
                <h3 className="text-3xl text-center font-bold text-white mb-2">
                  Event Countdown
                </h3>
                <p className="text-center text-blue-200 mb-6">
                  {selectedEvent?.formattedStartDate}
                </p>
              </div>

              <div className="grid grid-cols-4 gap-3 text-center">
                <div className="bg-white/10 backdrop-blur p-3 rounded-lg border border-white/10 shadow-lg">
                  <span className="block text-4xl md:text-5xl font-extrabold text-white">{countdowns[selectedEvent?.id]?.days || 0}</span>
                  <span className="text-sm text-blue-200 font-medium">DAYS</span>
                </div>
                <div className="bg-white/10 backdrop-blur p-3 rounded-lg border border-white/10 shadow-lg">
                  <span className="block text-4xl md:text-5xl font-extrabold text-white">{countdowns[selectedEvent?.id]?.hours || 0}</span>
                  <span className="text-sm text-blue-200 font-medium">HOURS</span>
                </div>
                <div className="bg-white/10 backdrop-blur p-3 rounded-lg border border-white/10 shadow-lg">
                  <span className="block text-4xl md:text-5xl font-extrabold text-white">{countdowns[selectedEvent?.id]?.minutes || 0}</span>
                  <span className="text-sm text-blue-200 font-medium">MINS</span>
                </div>
                <div className="bg-white/10 backdrop-blur p-3 rounded-lg border border-white/10 shadow-lg">
                  <span className="block text-4xl md:text-5xl font-extrabold text-white">{countdowns[selectedEvent?.id]?.seconds || 0}</span>
                  <span className="text-sm text-blue-200 font-medium">SECS</span>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                {selectedEvent.link && (
                  <button
                    className="w-full bg-gradient-to-r from-blue-400 to-blue-600 text-white px-6 py-3.5 rounded-lg shadow-lg hover:shadow-blue-500/30 transform hover:scale-105 transition duration-300 flex items-center justify-center font-medium"
                    onClick={() => openExternalLink(selectedEvent.link)}
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    Join Event
                  </button>
                )}
                
                {/* Add registration button if registration link exists and is different from main link */}
                {selectedEvent.registration && selectedEvent.registration !== selectedEvent.link && (
                  <button
                    className="w-full bg-white/10 backdrop-blur-sm text-white px-6 py-3.5 rounded-lg border border-white/20 hover:bg-white/20 transition duration-300 flex items-center justify-center font-medium"
                    onClick={() => openExternalLink(selectedEvent.registration)}
                  >
                    Register Now
                  </button>
                )}
              </div>
              
              {/* Event meta information - handle both formats */}
              {(selectedEvent.organizer || selectedEvent.contact || selectedEvent.createdBy || selectedEvent.endDate ||
                (selectedEvent.eventInfo && (selectedEvent.eventInfo.organizer || 
                  selectedEvent.eventInfo.contactEmail || selectedEvent.eventInfo.contactPhone))) && (
                <div className="mt-8 bg-white/10 rounded-lg p-4">
                  {/* Organizer info */}
                  {(selectedEvent.organizer || selectedEvent.eventInfo?.organizer) && (
                    <div className="mb-2">
                      <span className="text-blue-200 text-sm">Organized by:</span>
                      <div className="text-white font-medium">
                        {selectedEvent.eventInfo?.organizer || selectedEvent.organizer}
                      </div>
                    </div>
                  )}
                  
                  {/* Contact info */}
                  {(selectedEvent.contact || selectedEvent.eventInfo?.contactEmail || 
                    selectedEvent.eventInfo?.contactPhone) && (
                    <div className="mb-2">
                      <span className="text-blue-200 text-sm">Contact:</span>
                      <div className="text-white font-medium">
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
                  )}
                  
                  {/* Created by info if available */}
                  {selectedEvent.createdBy && (
                    <div className="mb-2">
                      <span className="text-blue-200 text-sm">Posted by:</span>
                      <div className="text-white font-medium">{selectedEvent.createdBy}</div>
                    </div>
                  )}
                  
                  {/* Event date range */}
                  {selectedEvent.endDate && (
                    <div className="mb-2">
                      <span className="text-blue-200 text-sm">Event period:</span>
                      <div className="text-white font-medium">
                        {getDateRange(selectedEvent.startDate, selectedEvent.endDate)}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        </div>
      
        {/* Custom animations */}
        <style jsx>{`
          @keyframes float-slow {
            0%, 100% { transform: translateY(0) translateX(0); }
            25% { transform: translateY(-15px) translateX(10px); }
            50% { transform: translateY(0) translateX(15px); }
            75% { transform: translateY(10px) translateX(5px); }
          }
          
          @keyframes float-medium {
            0%, 100% { transform: translateY(0) translateX(0); }
            33% { transform: translateY(-20px) translateX(15px); }
            66% { transform: translateY(15px) translateX(-15px); }
          }
          
          @keyframes float-fast {
            0%, 100% { transform: translateY(0) translateX(0); }
            50% { transform: translateY(-25px) translateX(-15px); }
          }
          
          .animate-float-slow {
            animation: float-slow 25s ease-in-out infinite;
          }
          
          .animate-float-medium {
            animation: float-medium 20s ease-in-out infinite;
          }
          
          .animate-float-fast {
            animation: float-fast 15s ease-in-out infinite;
          }
        `}</style>
        
        {/* Image Zoom Modal */}
        {selectedEvent && (
          <div 
            className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
            onClick={() => handleSelectEvent(null)}
          >
            <div 
              className="relative max-w-5xl w-full"
              onClick={e => e.stopPropagation()}
            >
              <button
                className="absolute -top-12 right-0 text-white hover:text-blue-400 transition-colors p-2"
                onClick={() => handleSelectEvent(null)}
                aria-label="Close"
              >
                <X className="w-8 h-8" />
              </button>
              <img
                src={getImageSource(activeImage)}
                alt="Enlarged view"
                className="max-w-full max-h-[85vh] object-contain mx-auto rounded-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/800x600?text=Unable+to+Load+Image";
                }}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Coming;