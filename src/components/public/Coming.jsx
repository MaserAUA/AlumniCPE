import React, { useState, useEffect } from "react";
import moment from "moment";
import { useGetAllPost } from "../../api/post";
import { useNavigate, useLocation } from "react-router-dom";
import { Calendar, Clock, MapPin, ExternalLink, Image, ArrowRight, X, Zap, Target } from "lucide-react";
  function Coming({ posts = [] }) {
      // State variables จากโค้ดเดิม
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
  const [galleryImages, setGalleryImages] = useState([]);
  
  // เพิ่ม hooks ที่จำเป็น
  const navigate = useNavigate();
  const location = useLocation();
  const getAllPost = useGetAllPost();
  
  // ดึงข้อมูลโพสต์ทั้งหมดโดยใช้ useGetAllPost
  useEffect(() => {
    fetchPosts();
  }, []);
  
  // ฟังก์ชันสำหรับดึงข้อมูลโพสต์
  const fetchPosts = () => {
    setLoading(true);
    getAllPost.mutate(null, {
      onSuccess: (res) => {
        if (res && res.data && Array.isArray(res.data)) {
          // เมื่อได้ข้อมูลมาแล้ว ส่งต่อไปยังฟังก์ชัน processUpcomingEvents
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
  
  // ฟังก์ชันสำหรับประมวลผลอีเวนต์ที่กำลังจะมาถึง (แยกมาจาก useEffect เดิม)
  const processUpcomingEvents = (posts) => {
    if (!Array.isArray(posts)) {
      console.error("Invalid posts data: Expected an array.");
      setLoading(false);
      return;
    }
    
    const now = moment();
    const filteredPosts = posts
      .filter((post) => moment(post.startDate, ["DD-MM-YYYY", "DD/MM/YYYY"]).isAfter(now))
      .sort((a, b) =>
        moment(a.startDate, ["DD-MM-YYYY", "DD/MM/YYYY"]).diff(moment(b.startDate, ["DD-MM-YYYY", "DD/MM/YYYY"]))
      );

    if (filteredPosts.length > 0) {
      const nextPost = filteredPosts[0];
      
      // Transform the data structure from CreatePost format if needed
      const transformedPost = {
        ...nextPost,
        // Convert schedule items to agenda if needed
        agenda: nextPost.schedule || nextPost.agenda || [],
        // Add contact info from eventInfo if available
        contact: nextPost.eventInfo ? 
          (nextPost.eventInfo.contactEmail || nextPost.eventInfo.contactPhone || '') : 
          (nextPost.contact || ''),
        // Use venue as location if available
        location: nextPost.eventInfo?.venue || nextPost.location || '',
        // Get organizer info
        organizer: nextPost.eventInfo?.organizer || nextPost.organizer || '',
      };
      
      setUpcomingPost(transformedPost);

      // จัดการรูปภาพ
      if (nextPost.images && nextPost.images.length > 0) {
        const firstImage = nextPost.images[0];
        if (firstImage instanceof File) {
          setImageUrl(URL.createObjectURL(firstImage));
        } else if (typeof firstImage === "string") {
          setImageUrl(firstImage);
        } else {
          setImageUrl("https://via.placeholder.com/800x600?text=Coming+Soon");
        }
        
        // Set all images for gallery
        const allImages = nextPost.images.map(img => {
          if (img instanceof File) {
            return URL.createObjectURL(img);
          } else if (typeof img === "string") {
            return img;
          }
          return "https://via.placeholder.com/800x600?text=Image";
        });
        
        setGalleryImages(allImages);
      } else {
        setImageUrl("https://via.placeholder.com/800x600?text=Coming+Soon");
        setGalleryImages([]);
      }

      // ตั้งค่านับถอยหลัง
      const targetDate = moment(nextPost.startDate, ["DD-MM-YYYY", "DD/MM/YYYY"]).toDate().getTime();
      const interval = setInterval(() => {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((difference % (1000 * 60)) / 1000);
          setCountdown({ days, hours, minutes, seconds });
        } else {
          clearInterval(interval);
        }
      }, 1000);

      setLoading(false);
      // เก็บ interval เพื่อล้างเมื่อ unmount
      return () => clearInterval(interval);
    } else {
      setLoading(false);
    }
  };
  
  // จัดการการรีเฟรชข้อมูล (ถ้ามี refresh state)
  useEffect(() => {
    if (location.state?.refresh) {
      fetchPosts();
      // ล้าง state เพื่อป้องกันการรีเฟรชไม่สิ้นสุด
      navigate(location.pathname, { replace: true });
    }
  }, [location]);

  // ส่วนที่เหลือของโค้ดยังคงเหมือนเดิม
  const handleZoom = (image) => {
    setZoomedImage(image);
    setIsZoomed(true);
    document.body.style.overflow = 'hidden';
  };

  const closeZoom = () => {
    setIsZoomed(false);
    setZoomedImage("");
    document.body.style.overflow = 'auto';
  };

  const formatNumber = (num) => {
    return num < 10 ? `0${num}` : num;
  };

  const getFormattedDate = (dateString) => {
    return moment(dateString, ["DD-MM-YYYY", "DD/MM/YYYY"]).format("dddd, MMMM D, YYYY");
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

  const getTimeRemaining = () => {
    if (countdown.days > 0) {
      return `${countdown.days} day${countdown.days !== 1 ? 's' : ''} remaining`;
    } else if (countdown.hours > 0) {
      return `${countdown.hours} hour${countdown.hours !== 1 ? 's' : ''} remaining`;
    } else {
      return `Starting soon`;
    }
  };

  const openExternalLink = (url) => {
    if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
      window.open(url, '_blank');
    }
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
            <h2 className="text-9xl font-bold transform -rotate-90 whitespace-nowrap text-blue-600 opacity-70">{upcomingPost?.category?.toUpperCase() || "EVENT"}</h2>
          </div>

          <div className="container mx-auto px-4 py-12 relative z-10">
            <div className="grid md:grid-cols-12 gap-8">
              {/* Left side - Image gallery */}
              <div className="md:col-span-7" data-aos="fade-right">
                <div className="relative h-[500px] overflow-hidden rounded-lg bg-gray-900 group">
                  {upcomingPost?.images && upcomingPost.images.length > 0 && (
                    <div className="h-full relative">
                      <img 
                        src={imageUrl}
                        alt={upcomingPost.title}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => handleZoom(imageUrl)}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/800x600?text=Image+Unavailable";
                        }}
                      />
                      
                      {/* Image indicators */}
                      {galleryImages.length > 1 && (
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                          {galleryImages.map((_, index) => (
                            <div 
                              key={index}
                              className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-blue-600 w-6' : 'bg-white/60'}`}
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
                    {upcomingPost?.category && (
                      <span className="inline-block px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded">
                        {upcomingPost.category}
                      </span>
                    )}
                    {upcomingPost?.cpeGroup && (
                      <span className="inline-block px-3 py-1 bg-black text-white text-sm font-semibold rounded border border-blue-600">
                        {upcomingPost.cpeGroup}
                      </span>
                    )}
                  </div>
                  
                  <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white leading-tight">
                    {upcomingPost?.title || "Event Title"}
                  </h1>
                  
                  <div className="flex flex-wrap items-center gap-6 text-gray-300">
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                      <span>{getFormattedDate(upcomingPost?.startDate)}</span>
                    </div>
                    
                    {upcomingPost?.location && (
                      <div className="flex items-center">
                        <MapPin className="w-5 h-5 mr-2 text-blue-500" />
                        <span>{upcomingPost.location}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Event description */}
                <div className="prose prose-invert max-w-none">
                  <p className="leading-relaxed text-lg">
                    {upcomingPost?.content || "Join us for this exciting upcoming event. More details will be provided soon."}
                  </p>
                </div>
                
                {/* Buttons */}
                <div className="mt-8 flex flex-wrap gap-4">
                  {upcomingPost?.link && (
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded flex items-center justify-center font-medium transition transform hover:scale-105"
                      onClick={() => openExternalLink(upcomingPost.link)}
                    >
                      <Zap className="w-5 h-5 mr-2" />
                      Join Event
                    </button>
                  )}
                  
                  {upcomingPost?.registration && upcomingPost.registration !== upcomingPost.link && (
                    <button
                      className="bg-black text-white px-6 py-3 rounded border border-blue-600 hover:bg-blue-900/20 transition flex items-center justify-center font-medium"
                      onClick={() => openExternalLink(upcomingPost.registration)}
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
                      <div className="text-5xl font-bold mb-1">{formatNumber(countdown.days)}</div>
                      <div className="text-sm text-gray-400">Days</div>
                    </div>
                    <div className="text-4xl font-bold text-blue-600">:</div>
                    <div className="countdown-item">
                      <div className="text-5xl font-bold mb-1">{formatNumber(countdown.hours)}</div>
                      <div className="text-sm text-gray-400">Hours</div>
                    </div>
                    <div className="text-4xl font-bold text-blue-600">:</div>
                    <div className="countdown-item">
                      <div className="text-5xl font-bold mb-1">{formatNumber(countdown.minutes)}</div>
                      <div className="text-sm text-gray-400">Minutes</div>
                    </div>
                    <div className="text-4xl font-bold text-blue-600">:</div>
                    <div className="countdown-item">
                      <div className="text-5xl font-bold mb-1 animate-pulse">{formatNumber(countdown.seconds)}</div>
                      <div className="text-sm text-gray-400">Seconds</div>
                    </div>
                  </div>
                  
                  {/* Festival dates highlight */}
                  <div className="mt-8 text-center">
                    <div className="text-lg font-bold uppercase">
                      <span className="text-white">{upcomingPost?.cpeGroup || "EVENT"}</span> 
                      <span className="block md:inline ml-2 text-blue-600">COUNTDOWN</span>
                    </div>
                    <div className="mt-1 text-2xl md:text-3xl font-extrabold text-white">
                      {upcomingPost?.title?.split(' ')[0] || "EVENT"} <span className="text-blue-600">{getDateRange(upcomingPost?.startDate, upcomingPost?.endDate)}</span>
                    </div>
                  </div>
                  
                  {/* Pulsing circle decoration */}
                  <div className="absolute -left-3 bottom-1/3 w-2 h-2 bg-blue-600 rounded-full animate-ping opacity-75"></div>
                  <div className="absolute left-[90%] top-[20%] w-2 h-2 bg-blue-600 rounded-full animate-ping opacity-75 animation-delay-500"></div>
                </div>
                
                {/* Schedule/Agenda */}
                {((upcomingPost?.agenda && upcomingPost.agenda.length > 0) || 
                  (upcomingPost?.schedule && upcomingPost.schedule.length > 0)) && (
                  <div className="bg-neutral-900 rounded-lg p-6 mb-8">
                    <h3 className="text-xl font-bold mb-4 border-l-4 border-blue-600 pl-3">Event Schedule</h3>
                    <div className="space-y-4">
                      {/* Handle both agenda from original format and schedule from CreatePost */}
                      {(upcomingPost?.schedule || upcomingPost?.agenda || []).map((item, index) => (
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
                {(upcomingPost?.organizer || upcomingPost?.contact || 
                  (upcomingPost?.eventInfo && (upcomingPost.eventInfo.organizer || 
                    upcomingPost.eventInfo.contactEmail || upcomingPost.eventInfo.contactPhone))) && (
                  <div className="bg-neutral-900 rounded-lg p-6">
                    <h3 className="text-xl font-bold mb-4 border-l-4 border-blue-600 pl-3">Event Information</h3>
                    
                    {(upcomingPost?.organizer || upcomingPost?.eventInfo?.organizer) && (
                      <div className="mb-4">
                        <span className="text-gray-400 text-sm block mb-1">Organized by:</span>
                        <div className="text-white font-medium">
                          {upcomingPost.eventInfo?.organizer || upcomingPost.organizer}
                        </div>
                      </div>
                    )}
                    
                    {/* Display contact information from either structure */}
                    {(upcomingPost?.contact || upcomingPost?.eventInfo?.contactEmail || 
                      upcomingPost?.eventInfo?.contactPhone) && (
                      <div className="mb-4">
                        <span className="text-gray-400 text-sm block mb-1">Contact:</span>
                        <div className="text-white font-medium">
                          {upcomingPost.eventInfo?.contactEmail && (
                            <div>{upcomingPost.eventInfo.contactEmail}</div>
                          )}
                          {upcomingPost.eventInfo?.contactPhone && (
                            <div>{upcomingPost.eventInfo.contactPhone}</div>
                          )}
                          {!upcomingPost.eventInfo && upcomingPost.contact && (
                            <div>{upcomingPost.contact}</div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Created by info if available */}
                    {upcomingPost.createdBy && (
                      <div className="mb-4">
                        <span className="text-gray-400 text-sm block mb-1">Posted by:</span>
                        <div className="text-white font-medium">{upcomingPost.createdBy}</div>
                      </div>
                    )}
                    
                    {/* Emoji display if available */}
                    {upcomingPost.emoji && (
                      <div className="mt-2 flex items-center">
                        <span className="text-3xl mr-3">{upcomingPost.emoji}</span>
                        <span className="text-gray-400 text-sm">Event Emoji</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Image Zoom Modal */}
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
                  className="absolute -top-12 right-0 text-white hover:text-blue-400 transition-colors p-2"
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
      
      if (!upcomingPost) {
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
                    src={imageUrl}
                    alt={upcomingPost.title}
                    className="w-full h-full object-cover transition duration-700 hover:scale-105 cursor-pointer"
                    onClick={() => handleZoom(imageUrl)}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/800x600?text=Coming+Soon";
                    }}
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent flex flex-col justify-end p-6">
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="inline-block px-3 py-1.5 bg-blue-600 text-white text-sm font-semibold rounded-full">
                        {getTimeRemaining()}
                      </span>
                      {upcomingPost?.category && (
                        <span className="inline-block px-3 py-1.5 bg-blue-500/50 text-white text-sm font-semibold rounded-full backdrop-blur-sm">
                          {upcomingPost.category}
                        </span>
                      )}
                      {upcomingPost?.cpeGroup && (
                        <span className="inline-block px-3 py-1.5 bg-blue-500/50 text-white text-sm font-semibold rounded-full backdrop-blur-sm">
                          {upcomingPost.cpeGroup}
                        </span>
                      )}
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold text-white leading-tight">{upcomingPost.title}</h3>
                    <div className="flex flex-col md:flex-row md:items-center text-gray-200 mt-3 space-y-2 md:space-y-0 md:space-x-4">
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 mr-2 text-blue-300" />
                        <span>{getFormattedDate(upcomingPost.startDate)}</span>
                      </div>
                      
                      {upcomingPost?.location && (
                        <div className="flex items-center">
                          <MapPin className="w-5 h-5 mr-2 text-blue-300" />
                          <span>{upcomingPost.location}</span>
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
                        activeTab === 'details' 
                          ? 'text-white border-b-2 border-white' 
                          : 'text-blue-200 hover:text-white'
                      }`}
                      onClick={() => setActiveTab('details')}
                    >
                      Event Details
                    </button>
                    
                    {(upcomingPost.agenda?.length > 0 || upcomingPost.schedule?.length > 0) && (
                      <button 
                        className={`px-5 py-3 font-medium text-sm focus:outline-none ${
                          activeTab === 'agenda' 
                            ? 'text-white border-b-2 border-white' 
                            : 'text-blue-200 hover:text-white'
                        }`}
                        onClick={() => setActiveTab('agenda')}
                      >
                        Agenda
                      </button>
                    )}
                    
                    {galleryImages.length > 1 && (
                      <button 
                        className={`px-5 py-3 font-medium text-sm focus:outline-none ${activeTab === 'gallery' 
                          ? 'text-white border-b-2 border-white' 
                          : 'text-blue-200 hover:text-white'
                        }`}
                        onClick={() => setActiveTab('gallery')}
                      >
                        Gallery
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="p-6">
                  {activeTab === 'details' && (
                    <div className="text-blue-100">
                      <p className="leading-relaxed">
                        {upcomingPost?.content || "Join us for this exciting upcoming event. More details will be provided soon."}
                      </p>
                      {upcomingPost.speakers && upcomingPost.speakers.length > 0 && (
                        <div className="mt-6">
                          <h4 className="font-semibold text-white mb-2">Featured Speakers:</h4>
                          <ul className="list-disc list-inside">
                            {upcomingPost.speakers.map((speaker, index) => (
                              <li key={index}>{speaker}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {(upcomingPost.emoji && upcomingPost.emoji !== "") && (
                        <div className="mt-6 flex items-center">
                          <div className="bg-blue-600/30 rounded-full p-4 mr-3">
                            <span className="text-3xl">{upcomingPost.emoji}</span>
                          </div>
                          <span className="text-blue-200 text-sm">Event Emoji</span>
                        </div>
                      )}
                      {upcomingPost.link && (
                        <div className="mt-6">
                          <button 
                            onClick={() => openExternalLink(upcomingPost.link)}
                            className="inline-flex items-center text-white bg-blue-600/70 hover:bg-blue-600/90 px-4 py-2 rounded-lg transition-colors"
                          >
                            <span>View Event Details</span>
                            <ExternalLink className="w-4 h-4 ml-2" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {activeTab === 'agenda' && (
                    <div className="text-blue-100">
                      <ul className="space-y-4">
                        {/* Use agenda, schedule or empty array */}
                        {(upcomingPost.agenda || upcomingPost.schedule || []).map((item, index) => (
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
                  
                  {activeTab === 'gallery' && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {galleryImages.map((image, index) => (
                        <div
                          key={index}
                          className="relative bg-white/10 rounded-lg overflow-hidden aspect-square shadow-lg transform hover:scale-105 transition duration-300 cursor-pointer group"
                          onClick={() => handleZoom(image)}
                        >
                          <img
                            src={image}
                            alt={`${upcomingPost.title} - Gallery ${index + 1}`}
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
                    {getFormattedDate(upcomingPost.startDate)}
                  </p>
                </div>

                <div className="grid grid-cols-4 gap-3 text-center">
                  <div className="bg-white/10 backdrop-blur p-3 rounded-lg border border-white/10 shadow-lg">
                    <span className="block text-4xl md:text-5xl font-extrabold text-white">{formatNumber(countdown.days)}</span>
                    <span className="text-sm text-blue-200 font-medium">DAYS</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur p-3 rounded-lg border border-white/10 shadow-lg">
                    <span className="block text-4xl md:text-5xl font-extrabold text-white">{formatNumber(countdown.hours)}</span>
                    <span className="text-sm text-blue-200 font-medium">HOURS</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur p-3 rounded-lg border border-white/10 shadow-lg">
                    <span className="block text-4xl md:text-5xl font-extrabold text-white">{formatNumber(countdown.minutes)}</span>
                    <span className="text-sm text-blue-200 font-medium">MINS</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur p-3 rounded-lg border border-white/10 shadow-lg">
                    <span className="block text-4xl md:text-5xl font-extrabold text-white">{formatNumber(countdown.seconds)}</span>
                    <span className="text-sm text-blue-200 font-medium">SECS</span>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  {upcomingPost.link && (
                    <button
                      className="w-full bg-gradient-to-r from-blue-400 to-blue-600 text-white px-6 py-3.5 rounded-lg shadow-lg hover:shadow-blue-500/30 transform hover:scale-105 transition duration-300 flex items-center justify-center font-medium"
                      onClick={() => openExternalLink(upcomingPost.link)}
                    >
                      <Zap className="w-5 h-5 mr-2" />
                      Join Event
                    </button>
                  )}
                  
                  {/* Add registration button if registration link exists and is different from main link */}
                  {upcomingPost.registration && upcomingPost.registration !== upcomingPost.link && (
                    <button
                      className="w-full bg-white/10 backdrop-blur-sm text-white px-6 py-3.5 rounded-lg border border-white/20 hover:bg-white/20 transition duration-300 flex items-center justify-center font-medium"
                      onClick={() => openExternalLink(upcomingPost.registration)}
                    >
                      Register Now
                    </button>
                  )}
                </div>
                
                {/* Event meta information - handle both formats */}
                {(upcomingPost.organizer || upcomingPost.contact || upcomingPost.createdBy || upcomingPost.endDate ||
                  (upcomingPost.eventInfo && (upcomingPost.eventInfo.organizer || 
                    upcomingPost.eventInfo.contactEmail || upcomingPost.eventInfo.contactPhone))) && (
                  <div className="mt-8 bg-white/10 rounded-lg p-4">
                    {/* Organizer info */}
                    {(upcomingPost.organizer || upcomingPost.eventInfo?.organizer) && (
                      <div className="mb-2">
                        <span className="text-blue-200 text-sm">Organized by:</span>
                        <div className="text-white font-medium">
                          {upcomingPost.eventInfo?.organizer || upcomingPost.organizer}
                        </div>
                      </div>
                    )}
                    
                    {/* Contact info */}
                    {(upcomingPost.contact || upcomingPost.eventInfo?.contactEmail || 
                      upcomingPost.eventInfo?.contactPhone) && (
                      <div className="mb-2">
                        <span className="text-blue-200 text-sm">Contact:</span>
                        <div className="text-white font-medium">
                          {upcomingPost.eventInfo?.contactEmail && (
                            <div>{upcomingPost.eventInfo.contactEmail}</div>
                          )}
                          {upcomingPost.eventInfo?.contactPhone && (
                            <div>{upcomingPost.eventInfo.contactPhone}</div>
                          )}
                          {!upcomingPost.eventInfo && upcomingPost.contact && (
                            <div>{upcomingPost.contact}</div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Created by info if available */}
                    {upcomingPost.createdBy && (
                      <div className="mb-2">
                        <span className="text-blue-200 text-sm">Posted by:</span>
                        <div className="text-white font-medium">{upcomingPost.createdBy}</div>
                      </div>
                    )}
                    
                    {/* Event date range */}
                    {upcomingPost.endDate && (
                      <div className="mb-2">
                        <span className="text-blue-200 text-sm">Event period:</span>
                        <div className="text-white font-medium">
                          {getDateRange(upcomingPost.startDate, upcomingPost.endDate)}
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
                  className="absolute -top-12 right-0 text-white hover:text-blue-400 transition-colors p-2"
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
        </div>
      );
    }
  }

  export default Coming;