import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  FaHeart, 
  FaSearch, 
  FaNewspaper, 
  FaChevronLeft, 
  FaChevronRight, 
  FaCalendarAlt, 
  FaEye 
} from "react-icons/fa";
import { useGetAllPosts } from "../../hooks/usePost";

const New = () => {
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const postsPerPage = 3;
  const navigate = useNavigate();
  const location = useLocation();

  const { data: allPosts = [], isLoading, isError } = useGetAllPosts();

  // Initialize view data
  useEffect(() => {
    if (allPosts && allPosts.length > 0) {
      const storedViewData = localStorage.getItem("postViewData");
      let viewData = {};
      
      if (storedViewData) {
        viewData = JSON.parse(storedViewData);
      } else {
        // Create mock view data
        allPosts.forEach(post => {
          const postId = post.post_id || post.id;
          if (postId) {
            viewData[postId] = {
              totalViews: Math.floor(Math.random() * 50) + 10,
              lastViewed: new Date().toISOString()
            };
          }
        });
        localStorage.setItem("postViewData", JSON.stringify(viewData));
      }
    }
  }, [allPosts]);

  // Filter posts
  useEffect(() => {
    const timer = setTimeout(() => {
      let updatedPosts = allPosts || [];

      // Search filter
      if (searchQuery) {
        updatedPosts = updatedPosts.filter((post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (post.content && post.content.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }

      // Sort by date
      updatedPosts.sort((a, b) => {
        const dateA = new Date(a.startDate || a.start_date || 0);
        const dateB = new Date(b.startDate || b.start_date || 0);
        return dateB - dateA; // Newest first
      });

      setFilteredPosts(updatedPosts);
      setLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [allPosts, searchQuery]);

  // Pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return "No date";
    
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateStr;
    }
  };

  // Get description
  const getDescription = (post) => {
    if (post.description) return post.description;
    if (post.excerpt) return post.excerpt;
    if (post.content) {
      const maxLength = 150;
      if (post.content.length <= maxLength) return post.content;
      
      const lastSpace = post.content.substring(0, maxLength).lastIndexOf(' ');
      const truncateAt = lastSpace > 0 ? lastSpace : maxLength;
      return post.content.substring(0, truncateAt) + "...";
    }
    return "";
  };

  // Handle post click
  const handlePostClick = (post) => {
    const postId = post.post_id || post.id;
    
    // Update view count
    const viewData = JSON.parse(localStorage.getItem("postViewData") || "{}");
    const currentViews = viewData[postId]?.totalViews || 0;
    const updatedViewData = {
      ...viewData,
      [postId]: {
        totalViews: currentViews + 1,
        lastViewed: new Date().toISOString()
      }
    };
    localStorage.setItem("postViewData", JSON.stringify(updatedViewData));
    
    // Navigate to detail page
    navigate(`/news/${postId}`);
  };

  // Get likes data
  const likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "{}");

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600">
      {/* Header Section with parallax effect */}
      <div className="relative overflow-hidden py-16 md:py-24 bg-blue-600 bg-opacity-60">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-600/30 to-blue-900/50"></div>
          <div className={"absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80')] bg-cover bg-center opacity-20"}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white text-center mb-2 drop-shadow-md">
            News <span className="text-blue-200">For Public</span>
          </h1>
          <p className="text-blue-100 text-center max-w-2xl mx-auto text-lg">
            Stay updated with the latest press releases and announcements
          </p>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-blue-400 to-transparent"></div>
      </div>

      {/* Filter Bar - Only Search for Public */}
      <div className="container mx-auto px-4 -mt-8 relative z-10">
        <div className="bg-white rounded-xl shadow-2xl p-6 mb-8 transform transition-all duration-300 hover:shadow-3xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <FaNewspaper className="text-blue-600 text-xl" />
              <span className="text-lg font-medium text-blue-600 relative">
                Event News
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-500 rounded-full"></span>
              </span>
            </div>
            
            <div className="relative w-full md:w-1/3">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <FaSearch className="text-blue-500" />
              </div>
              <input
                type="text"
                placeholder="Search news..."
                className="pl-10 pr-4 py-2.5 bg-blue-50 border border-blue-200 text-gray-700 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 pb-16">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                Latest Press Releases
              </h2>
              <div className="text-sm text-gray-600">
                {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'} found
              </div>
            </div>
            
            {/* Posts Grid - Enhanced styling */}
            <div className="space-y-8">
              {isLoading || loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : currentPosts.length > 0 ? (
                currentPosts.map((post) => {
                  const postId = post.post_id || post.id;
                  const postLikedData = likedPosts[postId] || { liked: false, likeCount: 0 };
                  const viewData = JSON.parse(localStorage.getItem("postViewData") || "{}");
                  const postViews = viewData[postId]?.totalViews || 0;
                  
                  // Get date values
                  const startDate = post.startDate || post.start_date;
                  const endDate = post.endDate || post.end_date;
                  
                  return (
                    <div
                      key={postId}
                      className="group bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                      onClick={() => handlePostClick(post)}
                    >
                      <div className="md:flex">
                        {/* Image container */}
                        <div className="md:w-1/3 lg:w-1/4 h-48 md:h-auto relative overflow-hidden">
                          {post.media_urls && post.media_urls[0] ? (
                            <img
                              src={post.media_urls[0]}
                              alt={post.title}
                              className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://placehold.co/800x450/3B82F6/FFFFFF?text=News";
                              }}
                            />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                              <FaNewspaper className="text-blue-400 text-4xl" />
                            </div>
                          )}
                          
                          {/* View and Like counts */}
                          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/70 to-transparent py-2 px-3">
                            <div className="flex items-center space-x-2 text-white">
                              <FaEye className="text-blue-200" />
                              <span className="text-sm font-medium">{postViews}</span>
                            </div>
                            
                            <div className="flex items-center space-x-1">
                              <FaHeart className={`${postLikedData.liked ? "text-red-500" : "text-gray-300"}`} />
                              <span className="text-sm font-medium text-white">
                                {postLikedData.likeCount || post.likeCount || 0}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-5 md:p-6 md:flex-1 flex flex-col">
                          <div className="flex-1">
                            <div className="flex items-center mb-2 space-x-2">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {post.category || post.post_type || 'News'}
                              </span>
                            </div>
                            
                            <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                              {post.title}
                            </h3>
                            
                            <div className="text-gray-700 whitespace-pre-line leading-relaxed line-clamp-3">
                              {getDescription(post)}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                            {/* Date display */}
                            <div className="flex items-center text-sm text-gray-500">
                              <FaCalendarAlt className="mr-2 text-blue-400" />
                              <span>
                                {formatDate(startDate)} 
                                {endDate ? ` - ${formatDate(endDate)}` : ''}
                              </span>
                            </div>
                            
                            {/* External link button */}
                            {post.redirect_link && (
                              <a 
                                href={post.redirect_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center text-sm font-medium text-blue-500 hover:text-blue-700 transition-colors"
                              >
                                View Link
                                <svg className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                </svg>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="bg-blue-50 rounded-full p-6 mb-4">
                    <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No posts found</h3>
                  <p className="text-gray-500 max-w-md">
                    {searchQuery 
                      ? `No results for "${searchQuery}". Try different keywords.` 
                      : 'No posts are currently available.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pagination */}
        {filteredPosts.length > 0 && totalPages > 1 && (
          <div className="mt-10 flex justify-center">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 inline-block">
              <nav className="flex items-center space-x-1.5" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center justify-center h-10 w-10 rounded-lg text-sm transition-all duration-200 ${
                    currentPage === 1
                      ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                      : "text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  }`}
                >
                  <span className="sr-only">Previous</span>
                  <FaChevronLeft className="h-4 w-4" aria-hidden="true" />
                </button>
                
                {Array.from({ length: totalPages }, (_, index) => {
                  const pageNumber = index + 1;
                  
                  // Show limited page numbers with dots for better UI with many pages
                  if (
                    totalPages <= 5 || 
                    pageNumber === 1 || 
                    pageNumber === totalPages || 
                    Math.abs(currentPage - pageNumber) <= 1
                  ) {
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`relative inline-flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 ${
                          currentPage === pageNumber
                            ? "bg-blue-600 text-white shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                            : "text-gray-700 hover:bg-blue-50 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        }`}
                        aria-current={currentPage === pageNumber ? "page" : undefined}
                      >
                        {pageNumber}
                      </button>
                    );
                  } else if (
                    (pageNumber === 2 && currentPage > 3) ||
                    (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
                  ) {
                    return (
                      <span
                        key={pageNumber}
                        className="relative inline-flex h-10 px-1.5 items-center justify-center text-gray-500"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-gray-300 mx-0.5"></span>
                        <span className="h-1.5 w-1.5 rounded-full bg-gray-300 mx-0.5"></span>
                        <span className="h-1.5 w-1.5 rounded-full bg-gray-300 mx-0.5"></span>
                      </span>
                    );
                  }
                  return null;
                })}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center justify-center h-10 w-10 rounded-lg text-sm transition-all duration-200 ${
                    currentPage === totalPages
                      ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                      : "text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  }`}
                >
                  <span className="sr-only">Next</span>
                  <FaChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        )}

        {/* Mobile pagination indicator */}
        {filteredPosts.length > 0 && totalPages > 1 && (
          <div className="mt-4 text-center text-sm text-gray-600 md:hidden">
            <span className="bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
              Page {currentPage} of {totalPages}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default New;