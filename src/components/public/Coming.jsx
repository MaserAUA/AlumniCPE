import React, { useState, useEffect, useRef } from "react";
import { Calendar, ExternalLink, Image } from "lucide-react";
import { FaChevronLeft, FaChevronRight, FaCalendarAlt, FaExternalLinkAlt } from "react-icons/fa";
import { useGetAllPost } from "../../api/post";

function Coming({ posts = [], navigate }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [countdowns, setCountdowns] = useState({});
  const [activeImageIndex, setActiveImageIndex] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  
  const countdownIntervals = useRef({});
  const getAllPost = useGetAllPost();
  
  // Format date in a more readable way
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return "N/A";
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return "N/A";
    }
  };
  
  useEffect(() => {
    fetchPosts();
    
    // Cleanup intervals on unmount
    return () => {
      Object.values(countdownIntervals.current).forEach(interval => clearInterval(interval));
    };
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
    
    const now = new Date();
    const filteredPosts = posts
      .filter((post) => {
        if (post.post_type === "event" && post.start_date) {
          return new Date(post.start_date) > now;
        }
        if (post.post_type === "announcement" && post.createdAt) {
          return new Date(post.createdAt) > now;
        }
        return false;
      })
      .sort((a, b) => {
        const dateA = a.post_type === "event" ? a.start_date : a.createdAt;
        const dateB = b.post_type === "event" ? b.start_date : b.createdAt;
        return new Date(dateA) - new Date(dateB);
      });

    const transformedPosts = filteredPosts.map(post => {
      // Extract media_url as a separate field for the button
      const mediaUrl = post.media_urls ? 
                      (typeof post.media_urls === 'string' ? post.media_urls : 
                       (Array.isArray(post.media_urls) && post.media_urls.length > 0 ? post.media_urls[0] : null))
                      : null;
      
      // For images array, handle both string and array formats of media_urls
      const imagesArray = post.media_urls ? 
                        (Array.isArray(post.media_urls) ? post.media_urls : [post.media_urls]) : 
                        (post.images || []);
      
      return {
        ...post,
        id: post.post_id || post.id,
        title: post.title || 'No title available',
        content: post.content || 'No description available',
        startDate: post.start_date || post.startDate,
        endDate: post.end_date || post.endDate,
        category: post.post_type === "announcement" ? "Press release" : 
                 post.post_type === "event" ? "Event News" : 
                 post.category || "News",
        images: imagesArray,
        // Store media_url and link separately
        mediaUrl: mediaUrl,
        link: post.link || null,
        formattedStartDate: formatDate(post.start_date || post.startDate),
        formattedEndDate: formatDate(post.end_date || post.endDate)
      };
    });

    setEvents(transformedPosts);
    
    // Initialize countdowns and image indices
    transformedPosts.forEach(post => {
      const targetDate = post.post_type === "event" ? post.start_date : post.createdAt;
      startCountdown(post.id, targetDate);
      setActiveImageIndex(prev => ({ ...prev, [post.id]: 0 }));
    });
    
    setLoading(false);
  };

  const startCountdown = (eventId, startDate) => {
    if (countdownIntervals.current[eventId]) {
      clearInterval(countdownIntervals.current[eventId]);
    }

    const updateCountdown = () => {
      const now = new Date();
      const eventDate = new Date(startDate);
      const diff = eventDate - now;

      if (diff <= 0) {
        clearInterval(countdownIntervals.current[eventId]);
        setCountdowns(prev => ({
          ...prev,
          [eventId]: { days: 0, hours: 0, minutes: 0, seconds: 0 }
        }));
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdowns(prev => ({
        ...prev,
        [eventId]: { days, hours, minutes, seconds }
      }));
    };

    updateCountdown();
    countdownIntervals.current[eventId] = setInterval(updateCountdown, 1000);
  };

  const nextImage = (eventId) => {
    setActiveImageIndex(prev => {
      const currentIndex = prev[eventId] || 0;
      const event = events.find(e => e.id === eventId);
      const totalImages = event?.images?.length || 1;
      const nextIndex = totalImages > 0 ? (currentIndex + 1) % totalImages : 0;
      return { ...prev, [eventId]: nextIndex };
    });
  };

  const prevImage = (eventId) => {
    setActiveImageIndex(prev => {
      const currentIndex = prev[eventId] || 0;
      const event = events.find(e => e.id === eventId);
      const totalImages = event?.images?.length || 1;
      const prevIndex = totalImages > 0 ? (currentIndex - 1 + totalImages) % totalImages : 0;
      return { ...prev, [eventId]: prevIndex };
    });
  };

  const openExternalLink = (url) => {
    if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
      window.open(url, '_blank');
    }
  };

  const nextPage = () => {
    setCurrentPage(prev => (prev + 1) % Math.ceil(events.length / 3));
  };

  const prevPage = () => {
    setCurrentPage(prev => (prev - 1 + Math.ceil(events.length / 3)) % Math.ceil(events.length / 3));
  };

  const getCurrentEvents = () => {
    const start = currentPage * 3;
    return events.slice(start, start + 3);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-800">Upcoming Events</h1>
        
        {events.length > 0 ? (
          <div className="relative">
            {/* Carousel Navigation */}
            {events.length > 3 && (
              <>
                <button
                  onClick={prevPage}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
                >
                  <FaChevronLeft className="text-blue-600" />
                </button>
                <button
                  onClick={nextPage}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
                >
                  <FaChevronRight className="text-blue-600" />
                </button>
              </>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getCurrentEvents().map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Image Carousel */}
                  <div className="relative h-48 group">
                    {event.images && event.images.length > 0 ? (
                      <>
                        <img
                          src={event.images[activeImageIndex[event.id] || 0]}
                          alt={event.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://placehold.co/800x450/3B82F6/FFFFFF?text=Event";
                          }}
                        />
                        {event.images.length > 1 && (
                          <>
                            <button
                              onClick={() => prevImage(event.id)}
                              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <FaChevronLeft />
                            </button>
                            <button
                              onClick={() => nextImage(event.id)}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <FaChevronRight />
                            </button>
                            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                              {event.images.map((_, index) => (
                                <div
                                  key={index}
                                  className={`w-2 h-2 rounded-full ${
                                    index === (activeImageIndex[event.id] || 0)
                                      ? 'bg-white'
                                      : 'bg-white/50'
                                  }`}
                                />
                              ))}
                            </div>
                          </>
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                        <FaCalendarAlt className="text-blue-400 text-4xl" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                      {event.category}
                    </div>
                  </div>

                  {/* Event Content */}
                  <div className="p-6">
                    <h2 className="text-xl font-bold mb-2 text-gray-800">{event.title}</h2>
                    
                    <div className="flex items-center text-gray-600 mb-2">
                      <FaCalendarAlt className="mr-2" />
                      <span>{formatDate(event.startDate)}</span>
                      {event.endDate && (
                        <>
                          <span className="mx-1">-</span>
                          <span>{formatDate(event.endDate)}</span>
                        </>
                      )}
                    </div>

                    {/* Show description/content */}
                    <p className="text-gray-600 mb-4 line-clamp-3">{event.content}</p>

                    {/* Countdown Timer */}
                    <div className="bg-blue-50 rounded-lg p-4 mb-4">
                      <div className="grid grid-cols-4 gap-2 text-center">
                        <div className="bg-white rounded-lg p-2 shadow-sm">
                          <div className="text-2xl font-bold text-blue-600">{countdowns[event.id]?.days || 0}</div>
                          <div className="text-xs text-gray-500">Days</div>
                        </div>
                        <div className="bg-white rounded-lg p-2 shadow-sm">
                          <div className="text-2xl font-bold text-blue-600">{countdowns[event.id]?.hours || 0}</div>
                          <div className="text-xs text-gray-500">Hours</div>
                        </div>
                        <div className="bg-white rounded-lg p-2 shadow-sm">
                          <div className="text-2xl font-bold text-blue-600">{countdowns[event.id]?.minutes || 0}</div>
                          <div className="text-xs text-gray-500">Minutes</div>
                        </div>
                        <div className="bg-white rounded-lg p-2 shadow-sm">
                          <div className="text-2xl font-bold text-blue-600">{countdowns[event.id]?.seconds || 0}</div>
                          <div className="text-xs text-gray-500">Seconds</div>
                        </div>
                      </div>
                    </div>

                    {/* Button Section */}
                    <div className="space-y-2">
                      {/* Media URL Button */}
                      {event.mediaUrl && (
                        <button
                          onClick={() => openExternalLink(event.mediaUrl)}
                          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <FaExternalLinkAlt />
                          <span>Click Here</span>
                        </button>
                      )}
                      
                      {/* Regular Link Button - Only show if different from mediaUrl */}
                      {event.link && event.link !== event.mediaUrl && (
                        <button
                          onClick={() => openExternalLink(event.link)}
                          className="w-full flex items-center justify-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors mt-2"
                        >
                          <ExternalLink size={16} />
                          <span>View Details</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Page Indicators */}
            {events.length > 3 && (
              <div className="flex justify-center mt-4 gap-2">
                {Array.from({ length: Math.ceil(events.length / 3) }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index)}
                    className={`w-3 h-3 rounded-full ${
                      currentPage === index ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <FaCalendarAlt className="text-6xl text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-600">No Upcoming Events</h2>
            <p className="text-gray-500">Check back later for new events and announcements.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Coming;