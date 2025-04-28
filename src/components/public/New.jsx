import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaHeart, FaSearch, FaNewspaper, FaChevronLeft, FaChevronRight, FaCalendarAlt } from "react-icons/fa";
import { useGetAllPosts } from "../../hooks/usePost";

const New = () => {
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  // const [allPosts, setAllPosts] = useState(posts); // เพิ่ม state เพื่อเก็บโพสต์ทั้งหมด
  const postsPerPage = 3;
  const navigate = useNavigate();
  const location = useLocation();

  const { data: allPosts = [] , isLoading, isError } = useGetAllPosts();

  useEffect(() => {
    const timer = setTimeout(() => {
      let updatedPosts = allPosts || [];

      // Only show press releases for public users
      // updatedPosts = updatedPosts.filter((post) =>
      //   post.category === "Press release" || !post.cpeGroup
      // );

      // Search filter
      if (searchQuery) {
        updatedPosts = updatedPosts.filter((post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setFilteredPosts(updatedPosts);
      setLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [allPosts, searchQuery]);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    // window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Get like data from localStorage
  const likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "{}");
  
  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    if (isNaN(date)) return dateStr;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

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
                Press Releases
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
            
            {/* Posts Grid */}
            <div className="space-y-8">
              {isLoading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : currentPosts.length > 0 ? (
                currentPosts.map((post) => {
                  const postLikedData = likedPosts[post.post_id] || { liked: false, likeCount: 0 };
                  
                  return (
                    <div
                      key={post.post_id}
                      className="group bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl cursor-default"
                      onClick={()=>{navigate(`/news/${post.post_id}`);}}
                    >
                      <div className="md:flex">
                        <div className="md:w-1/3 lg:w-1/4 relative overflow-hidden">
                          {post.images && post.images[0] ? (
                            <div className="aspect-w-16 aspect-h-10 md:aspect-h-full">
                              <img
                                src={
                                  post.images[0] instanceof File
                                    ? URL.createObjectURL(post.images[0])
                                    : post.images[0]
                                }
                                alt={post.title}
                                className="object-cover w-full h-full"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "https://via.placeholder.com/800x600?text=News";
                                }}
                              />
                            </div>
                          ) : (
                            <div className="aspect-w-16 aspect-h-10 md:aspect-h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                              <FaNewspaper className="text-blue-400 text-4xl" />
                            </div>
                          )}
                          
                          <div className="absolute top-3 right-3 flex items-center space-x-1 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm">
                            <FaHeart className="text-gray-400" />
                            <span className="text-sm font-medium text-gray-800">
                              {postLikedData.likeCount || post.likeCount || 0}
                            </span>
                          </div>
                        </div>
                        
                        <div className="p-5 md:p-6 md:flex-1 flex flex-col">
                          <div className="flex-1">
                            <div className="flex items-center mb-2 space-x-2">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {post.category || 'News'}
                              </span>
                            </div>
                            
                            <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                              {post.title}
                            </h3>
                            
                            <p className="text-gray-600 mb-4">
                              {post.content || 'No description available'}
                            </p>
                            
                            {post.emoji && (
                              <div className="text-2xl mb-2">{post.emoji}</div>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                            <div className="text-sm text-gray-500">
                              {formatDate(post.startDate)} {post.endDate ? `- ${formatDate(post.endDate)}` : ''}
                            </div>
                            
                            <span className="inline-flex items-center text-sm font-medium text-gray-400">
                              Unlocked for all
                              <svg className="ml-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 116 0z" clipRule="evenodd"></path>
                              </svg>
                            </span>
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
                      : 'No press releases are currently available.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pagination */}
        {filteredPosts.length > 0 && totalPages > 1 && (
          <div className="mt-10 flex justify-center">
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center rounded-l-md px-3 py-2 text-gray-600 ring-1 ring-inset ring-gray-300 focus:outline-offset-0 ${
                  currentPage === 1
                    ? "bg-gray-100 cursor-not-allowed"
                    : "bg-white hover:bg-blue-50 focus:z-20"
                }`}
              >
                <span className="sr-only">Previous</span>
                <FaChevronLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              
              {Array.from({ length: totalPages }, (_, index) => {
                // Show limited pages for better UI when there are many pages
                if (
                  totalPages <= 7 ||
                  index === 0 ||
                  index === totalPages - 1 ||
                  Math.abs(currentPage - (index + 1)) <= 1
                ) {
                  return (
                    <button
                      key={index}
                      onClick={() => handlePageChange(index + 1)}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-medium focus:z-20 ${
                        currentPage === index + 1
                          ? "z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                          : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-blue-50 focus:outline-offset-0"
                      }`}
                    >
                      {index + 1}
                    </button>
                  );
                } else if (
                  (index === 1 && currentPage > 3) ||
                  (index === totalPages - 2 && currentPage < totalPages - 2)
                ) {
                  return (
                    <span
                      key={index}
                      className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0"
                    >
                      ...
                    </span>
                  );
                }
                return null;
              })}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center rounded-r-md px-3 py-2 text-gray-600 ring-1 ring-inset ring-gray-300 focus:outline-offset-0 ${
                  currentPage === totalPages
                    ? "bg-gray-100 cursor-not-allowed"
                    : "bg-white hover:bg-blue-50 focus:z-20"
                }`}
              >
                <span className="sr-only">Next</span>
                <FaChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default New;
