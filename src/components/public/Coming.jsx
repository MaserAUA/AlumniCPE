import React, { useState, useEffect, useRef } from "react";
import moment from "moment";
import { Calendar, Clock, MapPin, ExternalLink, Image, ArrowRight, X, Zap } from "lucide-react";

function Coming({ posts = [] }) {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [upcomingPost, setUpcomingPost] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomedImage, setZoomedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");
  const [upcomingPosts, setUpcomingPosts] = useState([]);
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  
  // สร้าง useRef เพื่อเก็บ interval
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!Array.isArray(posts)) {
      console.error("Invalid posts data: Expected an array.");
      return;
    }

    setLoading(true);
    
    const now = moment();
    const oneMonthFromNow = moment().add(1, 'month');
    
    // Filter posts that are in the future but within one month
    // Also handle date ranges that span into the next month
    const filteredPosts = posts
      .filter((post) => {
        // Get start and end dates - handle different date formats
        let startDate;
        let endDate;
        
        if (typeof post.startDate === 'string') {
          startDate = moment(post.startDate, ["DD-MM-YYYY", "DD/MM/YYYY", "YYYY-MM-DD", "MM/DD/YYYY"]);
        } else if (post.startDate instanceof Date) {
          startDate = moment(post.startDate);
        } else {
          return false; // Invalid date format
        }
        
        if (post.endDate) {
          if (typeof post.endDate === 'string') {
            endDate = moment(post.endDate, ["DD-MM-YYYY", "DD/MM/YYYY", "YYYY-MM-DD", "MM/DD/YYYY"]);
          } else if (post.endDate instanceof Date) {
            endDate = moment(post.endDate);
          } else {
            endDate = startDate; // Fallback to start date if end date format is invalid
          }
        } else {
          endDate = startDate; // If no end date, use start date
        }
        
        // Include if:
        // 1. Start date is in the future (after now)
        // 2. End date is within one month from now OR start date is within one month
        return (startDate.isAfter(now) && 
               (endDate.isBefore(oneMonthFromNow) || startDate.isBefore(oneMonthFromNow)));
      })
      .sort((a, b) => {
        const dateA = moment(a.startDate, ["DD-MM-YYYY", "DD/MM/YYYY", "YYYY-MM-DD", "MM/DD/YYYY"]);
        const dateB = moment(b.startDate, ["DD-MM-YYYY", "DD/MM/YYYY", "YYYY-MM-DD", "MM/DD/YYYY"]);
        return dateA.diff(dateB);
      });

    setUpcomingPosts(filteredPosts);
    
    if (filteredPosts.length > 0) {
      const nextPost = filteredPosts[0];
      setUpcomingPost(nextPost);
      setCurrentPostIndex(0);

      // Set image URL
      updateImageUrl(nextPost);
      
      // ล้าง interval เดิมถ้ามี
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      // Setup countdown timer และเก็บใน ref
      intervalRef.current = setupCountdownTimer(nextPost);
      setLoading(false);
    } else {
      setLoading(false);
    }
    
    // ทำการ cleanup เมื่อ component unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [posts]);

  // Function to update the current post
  const updateCurrentPost = (index) => {
    if (index >= 0 && index < upcomingPosts.length) {
      const post = upcomingPosts[index];
      setUpcomingPost(post);
      setCurrentPostIndex(index);
      updateImageUrl(post);
      
      // ล้าง interval เดิมก่อนสร้างใหม่
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      // สร้าง interval ใหม่
      intervalRef.current = setupCountdownTimer(post);
    }
  };

  // Function to update image URL
  const updateImageUrl = (post) => {
    const firstImage = post.images?.[0];
    if (firstImage) {
      if (firstImage instanceof File) {
        setImageUrl(URL.createObjectURL(firstImage));
      } else if (typeof firstImage === "string") {
        setImageUrl(firstImage);
      } else {
        setImageUrl("https://via.placeholder.com/800x600?text=Coming+Soon");
      }
    } else {
      setImageUrl("https://via.placeholder.com/800x600?text=Coming+Soon");
    }
  };

  // Function to setup countdown timer - แก้ไขใหม่
  const setupCountdownTimer = (post) => {
    // Handle different date formats
    let targetMoment;
    if (typeof post.startDate === 'string') {
      targetMoment = moment(post.startDate, ["DD-MM-YYYY", "DD/MM/YYYY", "YYYY-MM-DD", "MM/DD/YYYY"]);
    } else if (post.startDate instanceof Date) {
      targetMoment = moment(post.startDate);
    } else {
      console.error("Invalid date format for countdown");
      return null;
    }

    const targetDate = targetMoment.toDate().getTime();
    
    // คืนค่า interval ID เพื่อใช้สำหรับการล้างข้อมูลภายหลัง
    return setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setCountdown({ days, hours, minutes, seconds });
      } else {
        // ล้าง interval เมื่อถึงเวลาเป้าหมาย
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    }, 1000);
  };

  const handleZoom = (image) => {
    setZoomedImage(image);
    setIsZoomed(true);
    // Prevent scrolling when modal is open
    document.body.style.overflow = 'hidden';
  };

  const closeZoom = () => {
    setIsZoomed(false);
    setZoomedImage("");
    // Re-enable scrolling
    document.body.style.overflow = 'auto';
  };

  // Navigation to previous event
  const goToPreviousEvent = () => {
    if (currentPostIndex > 0) {
      updateCurrentPost(currentPostIndex - 1);
    }
  };

  // Navigation to next event
  const goToNextEvent = () => {
    if (currentPostIndex < upcomingPosts.length - 1) {
      updateCurrentPost(currentPostIndex + 1);
    }
  };

  // Format countdown numbers with leading zeros
  const formatNumber = (num) => {
    return num < 10 ? `0${num}` : num;
  };

  // Get readable date format - handling different date formats
  const getFormattedDate = (dateInput) => {
    if (!dateInput) return "";
    
    let dateObj;
    if (typeof dateInput === 'string') {
      dateObj = moment(dateInput, ["DD-MM-YYYY", "DD/MM/YYYY", "YYYY-MM-DD", "MM/DD/YYYY"]);
    } else if (dateInput instanceof Date) {
      dateObj = moment(dateInput);
    } else {
      return "Invalid date";
    }
    
    if (!dateObj.isValid()) {
      return "Invalid date";
    }
    
    return dateObj.format("dddd, MMMM D, YYYY");
  };

  // Get date range if endDate exists
  const getDateRange = (startDate, endDate) => {
    if (!endDate) return getFormattedDate(startDate);
    
    let start, end;
    
    if (typeof startDate === 'string') {
      start = moment(startDate, ["DD-MM-YYYY", "DD/MM/YYYY", "YYYY-MM-DD", "MM/DD/YYYY"]);
    } else if (startDate instanceof Date) {
      start = moment(startDate);
    } else {
      return "Invalid start date";
    }
    
    if (typeof endDate === 'string') {
      end = moment(endDate, ["DD-MM-YYYY", "DD/MM/YYYY", "YYYY-MM-DD", "MM/DD/YYYY"]);
    } else if (endDate instanceof Date) {
      end = moment(endDate);
    } else {
      return getFormattedDate(startDate);
    }
    
    if (start.isSame(end, 'day')) {
      return getFormattedDate(startDate);
    }
    
    // If same month, show range like "March 15-20, 2025"
    if (start.isSame(end, 'month') && start.isSame(end, 'year')) {
      return `${start.format("MMMM D")}-${end.format("D, YYYY")}`;
    }
    
    // Different months or years
    return `${start.format("MMMM D, YYYY")} - ${end.format("MMMM D, YYYY")}`;
  };

  // Get time remaining in text
  const getTimeRemaining = () => {
    if (countdown.days > 0) {
      return `${countdown.days} day${countdown.days !== 1 ? 's' : ''} remaining`;
    } else if (countdown.hours > 0) {
      return `${countdown.hours} hour${countdown.hours !== 1 ? 's' : ''} remaining`;
    } else {
      return `Starting soon`;
    }
  };
  
  // Convert agenda/schedule format if needed
  const getAgendaItems = () => {
    // Check if upcomingPost has an agenda array directly
    if (upcomingPost.agenda && Array.isArray(upcomingPost.agenda)) {
      return upcomingPost.agenda;
    }
    
    // Check if it has a schedule array (from CreatePost form)
    if (upcomingPost.schedule && Array.isArray(upcomingPost.schedule)) {
      return upcomingPost.schedule;
    }
    
    return [];
  };

  // Opens an external link
  const openExternalLink = (url) => {
    if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="w-full min-h-[60vh] py-16 px-4 md:px-8 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700 text-white flex flex-col relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large gradient blobs */}
        <div className="absolute top-0 left-1/4 w-72 h-72 rounded-full bg-gradient-to-r from-blue-300 to-blue-400 opacity-30 blur-3xl"></div>
        <div className="absolute -bottom-20 right-1/4 w-96 h-96 rounded-full bg-gradient-to-tr from-indigo-400 to-blue-300 opacity-30 blur-3xl"></div>
        <div className="absolute bottom-1/3 -left-10 w-80 h-80 rounded-full bg-gradient-to-b from-blue-200 to-blue-400 opacity-20 blur-3xl"></div>
        <div className="absolute top-1/3 right-0 w-64 h-64 rounded-full bg-gradient-to-bl from-indigo-300 to-blue-200 opacity-20 blur-3xl"></div>
        
        {/* Lighter accent elements */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-t from-transparent via-blue-400/10 to-transparent"></div>
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-b from-blue-300/20 to-transparent opacity-60"></div>
        
        {/* Improved animated particles */}
        <div className="particle absolute top-20 left-1/4 w-3 h-3 rounded-full bg-white opacity-30 animate-float-slow"></div>
        <div className="particle absolute top-1/3 right-1/4 w-4 h-4 rounded-full bg-white opacity-40 animate-float-medium"></div>
        <div className="particle absolute bottom-1/3 left-1/3 w-2 h-2 rounded-full bg-white opacity-35 animate-float-fast"></div>
        <div className="particle absolute bottom-1/4 right-1/3 w-3 h-3 rounded-full bg-blue-200 opacity-50 animate-float-slower"></div>
        <div className="particle absolute top-2/3 left-1/2 w-2 h-2 rounded-full bg-blue-100 opacity-40 animate-pulse-slow"></div>
        
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTR6bTAtOGMyLjIwOSAwIDQtMS43OTEgNC00cy0xLjc5MS00LTQtNC00IDEuNzkxLTQgNCAzLjc5MSA0IDQgNHptMCAxNmMtMi4yMDkgMC00IDEuNzkxLTQgNHMxLjc5MSA0IDQgNCA0LTEuNzkxIDQtNC0xLjc5MS00LTQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')]"></div>
      </div>
      
      <div className="max-w-7xl mx-auto w-full flex-grow flex flex-col relative z-10">
        {/* Enhanced header with text shadow and animation */}
        <h2 className="text-3xl md:text-5xl font-bold mb-3 text-center text-white tracking-tight drop-shadow-lg animate-fade-in-down">
          Upcoming Event
        </h2>
        <p className="text-blue-50 text-center mb-12 text-lg max-w-2xl mx-auto font-medium drop-shadow">
          Mark your calendar and don't miss out
        </p>

        {loading ? (
          <div className="flex-grow flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            <span className="ml-3 text-lg">Loading event details...</span>
          </div>
        ) : upcomingPost ? (
          <section className="grid md:grid-cols-3 gap-8">
            {/* Event Navigator for multiple events */}
            {upcomingPosts.length > 1 && (
              <div className="md:col-span-3 flex justify-between items-center mb-4">
                <button 
                  onClick={goToPreviousEvent}
                  disabled={currentPostIndex === 0}
                  className={`px-4 py-2 rounded-lg flex items-center ${currentPostIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'bg-white/10 hover:bg-white/20'}`}
                >
                  <ArrowRight className="w-5 h-5 mr-2 transform rotate-180" />
                  <span>Previous Event</span>
                </button>
                
                <div className="text-center text-blue-100">
                  <span>Event {currentPostIndex + 1} of {upcomingPosts.length}</span>
                </div>
                
                <button 
                  onClick={goToNextEvent}
                  disabled={currentPostIndex === upcomingPosts.length - 1}
                  className={`px-4 py-2 rounded-lg flex items-center ${currentPostIndex === upcomingPosts.length - 1 ? 'opacity-50 cursor-not-allowed' : 'bg-white/10 hover:bg-white/20'}`}
                >
                  <span>Next Event</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            )}

            {/* Rest of component code */}
            {/* ... */}
          </section>
        ) : (
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
        )}
      </div>

      {/* Zoom Modal with improved UI */}
      {isZoomed && (
        <div 
          className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          onClick={closeZoom}
        >
          <div 
            className="relative max-w-5xl w-full"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute -top-12 right-0 text-white hover:text-red-400 transition-colors p-2"
              onClick={closeZoom}
              aria-label="Close"
            >
              <X className="w-8 h-8" />
            </button>
            <img
              src={zoomedImage}
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
      
      {/* แก้ปัญหา jsx attribute ที่ไม่ถูกต้อง */}
      <style>{`
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
        
        @keyframes float-slower {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-10px) translateX(5px); }
          50% { transform: translateY(-5px) translateX(10px); }
          75% { transform: translateY(5px) translateX(-5px); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.1); opacity: 0.7; }
        }
        
        @keyframes fade-in-down {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes shimmer {
          100% { left: 100%; }
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
        
        .animate-float-slower {
          animation: float-slower 30s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
        
        .animate-fade-in-down {
          animation: fade-in-down 0.8s ease-out;
        }
        
        .animate-shimmer {
          animation: shimmer 1.5s forwards;
        }
      `}</style>
    </div>
  );
}

export default Coming;