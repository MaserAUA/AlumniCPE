import React, { useEffect, useState, useRef } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const Event = ({ posts = [] }) => {
  const [events, setEvents] = useState([]);
  const [latestActivity, setLatestActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [currentMonth, setCurrentMonth] = useState(moment().format("MMMM YYYY"));
  const [isHovered, setIsHovered] = useState(false);
  
  const autoScrollTimer = useRef(null);
  const localizer = momentLocalizer(moment);

  // Style event function
  const eventStyleGetter = (event) => {
    const now = new Date();
    const start = new Date(event.start);
    const end = new Date(event.end);
    const isUpcoming = start > now;
    const isPast = end < now;
    const isToday = moment(start).isSame(moment(), 'day');
    
    let backgroundColor = '#3B82F6'; // blue (upcoming)
    if (isPast) {
      backgroundColor = '#9CA3AF'; // gray (past)
    }
    if (isToday) {
      backgroundColor = '#10B981'; // green (today)
    }
    
    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: isPast ? 0.7 : 0.9,
        color: 'white',
        border: 'none',
        display: 'block',
        fontWeight: '500',
      }
    };
  };
  
  // Auto scroll through images if multiple
  useEffect(() => {
    if (latestActivity && latestActivity.images && latestActivity.images.length > 1 && !isHovered) {
      autoScrollTimer.current = setInterval(() => {
        setActiveImage(prev => (prev + 1) % latestActivity.images.length);
      }, 5000);
    }
    
    return () => {
      if (autoScrollTimer.current) {
        clearInterval(autoScrollTimer.current);
      }
    };
  }, [latestActivity, activeImage, isHovered]);

  useEffect(() => {
    // Only run this effect if posts array has items
    if (posts.length === 0) {
      setLoading(false);
      return;
    }

    const now = new Date();

    // Filter past events
    const pastEvents = posts
      .filter((post) => {
        try {
          const startDate = moment(post.startDate, ["DD-MM-YYYY", "DD/MM/YYYY"]).toDate();
          return startDate < now;
        } catch (error) {
          console.error("Date parsing error:", error);
          return false;
        }
      })
      .sort((a, b) => {
        try {
          const aStartDate = moment(a.startDate, ["DD-MM-YYYY", "DD/MM/YYYY"]).toDate();
          const bStartDate = moment(b.startDate, ["DD-MM-YYYY", "DD/MM/YYYY"]).toDate();
          return bStartDate - aStartDate;
        } catch (error) {
          console.error("Date sorting error:", error);
          return 0;
        }
      });

    // Set latest activity
    setLatestActivity(pastEvents.length > 0 ? pastEvents[0] : null);

    // Map events for calendar
    const mappedEvents = posts.map((post) => {
      try {
        return {
          id: post.id || Date.now(),
          title: post.title,
          start: moment(post.startDate, ["DD-MM-YYYY", "DD/MM/YYYY"]).toDate(),
          end: moment(post.endDate, ["DD-MM-YYYY", "DD/MM/YYYY"]).add(1, "days").toDate(), // Add 1 day to cover end date
          resource: post,
        };
      } catch (error) {
        console.error("Error mapping event:", error);
        return null;
      }
    }).filter(Boolean);

    setEvents(mappedEvents);
    setLoading(false);
  }, [posts]);

  // Format date with error handling
  const formatDate = (dateStr) => {
    try {
      return moment(dateStr, ["DD-MM-YYYY", "DD/MM/YYYY"]).format("D MMM YYYY");
    } catch (error) {
      console.error("Date formatting error:", error);
      return dateStr || "Invalid date";
    }
  };

  // Handle click on calendar event
  const handleSelectEvent = (event) => {
    if (event.resource) {
      setLatestActivity(event.resource);
      setActiveImage(0); // Reset to first image
    } else {
      const selectedPost = posts.find(post => 
        post.title === event.title && 
        moment(post.startDate, ["DD-MM-YYYY", "DD/MM/YYYY"]).isSame(moment(event.start), 'day')
      );
      
      if (selectedPost) {
        setLatestActivity(selectedPost);
        setActiveImage(0);
      }
    }
    
    // Auto-scroll on mobile
    if (window.innerWidth < 1024) {
      const activityElement = document.querySelector('.card.latest-activity');
      if (activityElement) {
        activityElement.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  };
  
  // Handle navigation in calendar
  const handleNavigate = (date) => {
    setCurrentMonth(moment(date).format("MMMM YYYY"));
  };

  // Default placeholder image
  const defaultImage = "https://placehold.co/800x600/3B82F6/FFFFFF?text=CPE+Activities";
  
  // Get image source based on index
  const getImageSource = (index) => {
    if (!latestActivity || !latestActivity.images || latestActivity.images.length === 0) {
      return defaultImage;
    }
    
    const image = latestActivity.images[index];
    return typeof image === "string" ? image : URL.createObjectURL(image);
  };

  return (
    <section className="bg-gradient-to-b from-blue-300 to-blue-500 text-white py-10 px-6 relative">
      {/* Background enhancements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white opacity-10 blur-3xl"></div>
        <div className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-indigo-600 opacity-10 blur-3xl"></div>
      </div>
      
      <div className="relative z-10">
        <h1 className="text-center text-3xl font-bold mb-8 drop-shadow-md">
          <span className="inline-block animate-bounce-subtle">CPE</span> 
          <span className="inline-block animate-bounce-subtle delay-100">Events</span> 
          <span className="inline-block animate-bounce-subtle delay-200">&</span> 
          <span className="inline-block animate-bounce-subtle delay-300">Activities</span>
        </h1>
        
        <div className="flex flex-col lg:flex-row justify-between gap-8">
          {/* Latest Activities Card - EXACTLY SAME SIZE AS ORIGINAL */}
          <div className="card latest-activity w-full lg:w-1/2 bg-white shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl relative">
            <figure 
              className="overflow-hidden h-[320px] relative"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Multiple image handling with animation */}
              {latestActivity && latestActivity.images && latestActivity.images.length > 0 ? (
                <>
                  {latestActivity.images.map((image, index) => (
                    <div 
                      key={index}
                      className={`absolute inset-0 transition-opacity duration-700 ${activeImage === index ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                    >
                      <img
                        src={getImageSource(index)}
                        alt={`${latestActivity.title} - Image ${index + 1}`}
                        className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = defaultImage;
                        }}
                      />
                    </div>
                  ))}
                  
                  {/* Overlay gradient for better readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60 z-10"></div>
                  
                  {/* Image navigation dots for multiple images */}
                  {latestActivity.images.length > 1 && (
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
                      {latestActivity.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveImage(index)}
                          className={`w-2 h-2 rounded-full transition-all duration-200 ${
                            activeImage === index 
                              ? 'bg-white w-4' 
                              : 'bg-white/60 hover:bg-white/80'
                          }`}
                          aria-label={`View image ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                  
                  {/* Image counter */}
                  {latestActivity.images.length > 1 && (
                    <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full z-20">
                      {activeImage + 1} / {latestActivity.images.length}
                    </div>
                  )}
                </>
              ) : (
                <div className="relative h-full">
                  <img
                    src={defaultImage}
                    alt="Default Activity"
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60"></div>
                </div>
              )}
              
              {latestActivity && (
                <div className="absolute top-4 left-4 bg-gradient-to-r from-red-600 to-pink-600 text-white text-sm px-3 py-1 rounded-full font-medium shadow-md z-20 animate-pulse-subtle">
                  Latest Activity
                </div>
              )}
            </figure>
            
            {/* Add colorful accent to top of card */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
            
            <div className="p-6">
              <h2 className="text-2xl text-center font-bold text-blue-800 mb-3">
                {latestActivity ? latestActivity.title : "No Recent Activities"}
              </h2>
              
              {latestActivity && (
                <div className="mt-3">
                  <div className="flex items-center justify-center text-gray-600 mb-4 bg-blue-50 py-2 px-4 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{formatDate(latestActivity.startDate)} - {formatDate(latestActivity.endDate)}</span>
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                    <p className="text-gray-600 text-center">
                      {latestActivity.content || latestActivity.description || "กิจกรรมนี้ไม่มีคำอธิบายเพิ่มเติม"}
                    </p>
                  </div>
                  
                  {/* CPE Group tag if available */}
                  {latestActivity.cpeGroup && (
                    <div className="flex justify-center mt-4">
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                        {latestActivity.cpeGroup}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* React Big Calendar - EXACTLY SAME SIZE AS ORIGINAL */}
          <div className="card w-full lg:w-1/2 bg-white shadow-lg rounded-xl overflow-hidden transition-all hover:shadow-xl relative">
            {/* Add colorful accent to top of card */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
            
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-blue-800">
                  CPE Event Calendar
                </h2>
                <div className="text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full text-sm">
                  {currentMonth}
                </div>
              </div>
              
              <div className="mb-4 flex justify-end gap-4">
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-blue-500 mr-1 animate-pulse-subtle"></span>
                  <span className="text-xs text-gray-600">Upcoming</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-green-500 mr-1 animate-pulse-subtle"></span>
                  <span className="text-xs text-gray-600">Today</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-gray-400 mr-1"></span>
                  <span className="text-xs text-gray-600">Past</span>
                </div>
              </div>
              
              {!loading ? (
                <div className="rounded-lg border border-gray-200 overflow-hidden" style={{ color: "black" }}>
                  <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 400 }}
                    className="bg-white calendar-fix"
                    eventPropGetter={eventStyleGetter}
                    onSelectEvent={handleSelectEvent}
                    onNavigate={handleNavigate}
                    popup
                  />
                </div>
              ) : (
                <div className="flex justify-center items-center h-[400px] bg-gray-50 rounded-lg">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  <p className="ml-3 text-gray-500">Loading calendar...</p>
                </div>
              )}
              
              {/* Empty state for no events */}
              {events.length === 0 && !loading && (
                <div className="mt-4 p-3 bg-blue-50 text-blue-600 rounded-lg text-center text-sm">
                  No events scheduled yet. Create an event to see it on the calendar!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
     {/* Custom styles for calendar fixes - BLACK NUMBERS & ANIMATIONS */}
<style>{`
  /* Fix calendar display issues */
  .calendar-fix .rbc-header {
    font-weight: bold !important;
    color: black !important;
    padding: 4px 0 !important;
    font-size: 14px !important;
  }
  
  .calendar-fix .rbc-date-cell {
    font-size: 14px !important;
    color: black !important;
    font-weight: 500 !important;
    padding: 4px !important;
  }
  
  .calendar-fix .rbc-toolbar {
    margin-bottom: 10px !important;
    padding: 0 4px !important;
  }
  
  .calendar-fix .rbc-toolbar-label {
    font-size: 16px !important;
    font-weight: bold !important;
    color: black !important;
  }
  
  .calendar-fix .rbc-toolbar button {
    color: black !important;
    font-weight: 500 !important;
  }
  
  .calendar-fix .rbc-month-view, 
  .calendar-fix .rbc-time-view, 
  .calendar-fix .rbc-agenda-view {
    border: 1px solid #e5e7eb !important;
  }
  
  .calendar-fix .rbc-month-row + .rbc-month-row {
    border-top: 1px solid #e5e7eb !important;
  }
  
  .calendar-fix .rbc-day-bg + .rbc-day-bg {
    border-left: 1px solid #e5e7eb !important;
  }
  
  .calendar-fix .rbc-off-range-bg {
    background-color: #f3f4f6 !important;
  }
  
  .calendar-fix .rbc-off-range {
    color: #9ca3af !important;
  }
  
  .calendar-fix .rbc-today {
    background-color: rgba(59, 130, 246, 0.1) !important;
  }
  
  /* Fix event styling */
  .calendar-fix .rbc-event {
    padding: 2px 5px !important;
    font-size: 12px !important;
    transition: transform 0.2s ease !important;
  }
  
  .calendar-fix .rbc-event:hover {
    transform: translateY(-1px) !important;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1) !important;
    z-index: 10 !important;
  }
  
  /* Ensure calendar fits correctly */
  .calendar-fix .rbc-calendar,
  .calendar-fix .rbc-month-view {
    width: 100% !important;
  }
  
  /* Custom animations */
  @keyframes pulse-subtle {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
  
  @keyframes bounce-subtle {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-3px); }
  }
  
  .animate-pulse-subtle {
    animation: pulse-subtle 3s infinite;
  }
  
  .animate-bounce-subtle {
    animation: bounce-subtle 2s ease-in-out infinite;
  }
  
  .delay-100 {
    animation-delay: 0.1s;
  }
  
  .delay-200 {
    animation-delay: 0.2s;
  }
  
  .delay-300 {
    animation-delay: 0.3s;
  }
`}</style>
    </section>
  );
};

export default Event;