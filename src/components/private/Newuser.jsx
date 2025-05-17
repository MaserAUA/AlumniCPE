import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  FaHeart, 
  FaSearch, 
  FaNewspaper, 
  FaFilter, 
  FaChevronLeft, 
  FaChevronRight,
  FaEye,
  FaInfoCircle,
  FaCalendarAlt,
  FaTrophy,
  FaArrowUp,
  FaSortAmountDown,
  FaSortAmountUp
} from "react-icons/fa";
import { useGetAllPosts } from "../../hooks/usePost";
import { v4 as uuidv4 } from 'uuid';

const Newuser = () => {
  const {data: posts, isLoading } = useGetAllPosts();

  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedCPE, setSelectedCPE] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("date"); // date, views, likes
  const [sortOrder, setSortOrder] = useState("desc"); // asc, desc
  const [viewMode, setViewMode] = useState("grid"); // grid, list
  // Fixed: We'll store our posts in state to prevent disappearing on sort changes
  const [allPosts, setAllPosts] = useState([]);
  
  const postsPerPage = viewMode === "grid" ? 5 : 5;
  const navigate = useNavigate();
  const location = useLocation();
  const section = new URLSearchParams(location.search).get('section');
  const getallpost = useGetAllPosts();
  
  const postTypeOptions = [
    { value: 'event', label: 'Event' },
    { value: 'story', label: 'Story' },
    { value: 'job', label: 'Job' },
    { value: 'mentorship', label: 'Mentorship' },
    { value: 'showcase', label: 'Showcase' },
    { value: 'announcement', label: 'Announcement' },
    { value: 'discussion', label: 'Discussion' },
    { value: 'survey', label: 'Survey' },
  ];
  
  // Initialize filteredPosts with posts when they load
  useEffect(() => {
    if (posts) {
      setFilteredPosts(posts);
      setAllPosts(posts);
    }
  }, [posts]);

  // Filter and sort posts effect - using allPosts instead of posts
  useEffect(() => {
    if (!posts) return;
    
    let updatedPosts = [...posts];

    // Filter by post type
    if (selectedCPE) {
      updatedPosts = updatedPosts.filter((post) => {
        return post.post_type === selectedCPE;
      });
    }

    // Search filter
    if (searchQuery) {
      updatedPosts = updatedPosts.filter((post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.content && post.content.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Sorting
    updatedPosts.sort((a, b) => {
      if (sortBy === "date") {
        // Handle both startDate and start_date formats
        const dateAString = a.startDate || a.start_date || '';
        const dateBString = b.startDate || b.start_date || '';
        
        const dateA = dateAString ? new Date(dateAString) : new Date(0);
        const dateB = dateBString ? new Date(dateBString) : new Date(0);
        
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      } else if (sortBy === "views") {
        const viewsA = viewData[a.id]?.totalViews || 0;
        const viewsB = viewData[b.id]?.totalViews || 0;
        return sortOrder === "asc" ? viewsA - viewsB : viewsB - viewsA;
      } else if (sortBy === "likes") {
        const likedPostsData = JSON.parse(localStorage.getItem("likedPosts") || "{}");
        const likesA = likedPostsData[a.id]?.likeCount || a.likeCount || 0;
        const likesB = likedPostsData[b.id]?.likeCount || b.likeCount || 0;
        return sortOrder === "asc" ? likesA - likesB : likesB - likesA;
      }
      return 0;
    });

    setFilteredPosts(updatedPosts);
    setCurrentPage(1); // Reset to first page when filters change
  }, [posts, selectedCPE, searchQuery, sortBy, sortOrder]);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const handleViewDetails = (post) => {
    
    // Navigate to the detail page
    navigate(`/news/${post.post_id || post.id}`);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };
  
  // Format date properly
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    
    try {
      // Handle various date formats
      let date;
      
      // Check if it's in DD/MM/YYYY format
      if (typeof dateStr === 'string' && dateStr.includes('/')) {
        const parts = dateStr.split('/');
        if (parts.length === 3) {
          // Assuming DD/MM/YYYY format
          date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
        } else {
          date = new Date(dateStr);
        }
      } else {
        date = new Date(dateStr);
      }
      
      if (isNaN(date.getTime())) return "N/A"; // Check for invalid date
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error, dateStr);
      return "N/A";
    }
  };
  
  // Toggle sorting order
  const toggleSort = (sortType) => {
    if (sortBy === sortType) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(sortType);
      setSortOrder("desc"); // Default to descending
    }
  };
  
  // Set user CPE without showing a test message
  const setUserCPE = (cpe) => {
    localStorage.setItem("userCPE", cpe);
  };

  // Scroll to top button
  const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      };

      window.addEventListener('scroll', toggleVisibility);
      return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    };

    return (
      isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all z-50"
          aria-label="Scroll to top"
        >
          <FaArrowUp />
        </button>
      )
    );
  };

  // Determine if we're still loading
  const isDataLoading = isLoading || !posts;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600">
        <ScrollToTopButton />
        
        {/* Header Section with parallax effect */}
        <div className="relative overflow-hidden py-16 md:py-24 bg-blue-600 bg-opacity-60">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-600/30 to-indigo-900/50"></div>
            <div className={"absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80')] bg-cover bg-center opacity-20"}></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <h1 className="text-5xl md:text-6xl font-extrabold text-white text-center mb-2 drop-shadow-md">
              News <span className="text-blue-200">For CPE</span>
            </h1>
            <p className="text-blue-100 text-center max-w-2xl mx-auto text-lg">
              Stay updated with the latest news, events, and announcements
            </p>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-blue-400 to-transparent"></div>
        </div>

        {/* Filter Bar */}
        <div className="container mx-auto px-4 relative z-10 mb-8">
          <div className="bg-white rounded-xl shadow-2xl p-6 transform transition-all duration-300 hover:shadow-3xl">
            <div className="flex flex-col space-y-6">
              {/* Top row - CPE filter & Search */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 w-full md:w-auto">
                  <div className="flex items-center gap-2">
                    <FaNewspaper className="text-blue-600 text-xl" />
                    <button
                      className={`text-lg font-medium transition-all duration-300 relative ${
                        !selectedCPE 
                          ? "text-blue-600" 
                          : "text-gray-600 hover:text-blue-600"
                      }`}
                      onClick={() => setSelectedCPE("")}
                    >
                      Event News
                      {!selectedCPE && (
                        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-500 rounded-full"></span>
                      )}
                    </button>
                  </div>
                  
                  <div className="relative w-full md:w-auto">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <FaFilter className="text-blue-500" />
                    </div>
                    <select
                      className="pl-10 pr-10 py-2.5 bg-blue-50 border border-blue-200 text-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent appearance-none w-full md:w-auto"
                      onChange={(e) => setSelectedCPE(e.target.value)}
                      value={selectedCPE}
                    >
                      <option value="">All Types</option>
                      {postTypeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>
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
              
              {/* Bottom row - Sorting & View mode */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <span>Sort by:</span>
                  <div className="flex rounded-lg overflow-hidden border border-gray-200">
                    <button
                      className={`px-3 py-1.5 ${sortBy === "date" ? "bg-blue-600 text-white" : "bg-white hover:bg-blue-50"}`}
                      onClick={() => toggleSort("date")}
                    >
                      <div className="flex items-center gap-1">
                        <FaCalendarAlt />
                        <span>Date</span>
                        {sortBy === "date" && (
                          sortOrder === "desc" ? <FaSortAmountDown size={10} /> : <FaSortAmountUp size={10} />
                        )}
                      </div>
                    </button>
                    {/* Commented out views and likes sort buttons
                    <button
                      className={`px-3 py-1.5 ${sortBy === "views" ? "bg-blue-600 text-white" : "bg-white hover:bg-blue-50"}`}
                      onClick={() => toggleSort("views")}
                    >
                      <div className="flex items-center gap-1">
                        <FaEye />
                        <span>Views</span>
                        {sortBy === "views" && (
                          sortOrder === "desc" ? <FaSortAmountDown size={10} /> : <FaSortAmountUp size={10} />
                        )}
                      </div>
                    </button>
                    <button
                      className={`px-3 py-1.5 ${sortBy === "likes" ? "bg-blue-600 text-white" : "bg-white hover:bg-blue-50"}`}
                      onClick={() => toggleSort("likes")}
                    >
                      <div className="flex items-center gap-1">
                        <FaHeart />
                        <span>Likes</span>
                        {sortBy === "likes" && (
                          sortOrder === "desc" ? <FaSortAmountDown size={10} /> : <FaSortAmountUp size={10} />
                        )}
                      </div>
                    </button>
                    */}
                  </div>
                </div>
                
                <div className="flex items-center">
                  <span className="text-sm text-gray-700 mr-2">View:</span>
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        viewMode === "grid" ? "bg-white shadow-sm" : "text-gray-500 hover:text-gray-900"
                      }`}
                      onClick={() => setViewMode("grid")}
                    >
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                        </svg>
                        Grid
                      </div>
                    </button>
                    <button
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        viewMode === "list" ? "bg-white shadow-sm" : "text-gray-500 hover:text-gray-900"
                      }`}
                      onClick={() => setViewMode("list")}
                    >
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                        List
                      </div>
                    </button>
                  </div>
                </div>
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
                  {selectedCPE ? `${selectedCPE} News` : 'Latest Press Releases'}
                </h2>
                <div className="text-sm text-gray-600 flex items-center">
                  <FaEye className="mr-1" />
                  <span className="mr-2">
                    {filteredPosts.reduce((sum, post) => sum + (post.views_count || 0), 0)} total views
                  </span>
                  •
                  <span className="ml-2">
                    {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'} found
                  </span>
                </div>
              </div>
              
              {/* Loading State */}
              {isDataLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : currentPosts.length > 0 ? (
                viewMode === "grid" ? (
                  // Grid View
                  <div className="space-y-8">
                    {currentPosts.map((post) => {
                      const startDateValue = post.startDate || post.start_date;
                      const endDateValue = post.endDate || post.end_date;
                      
                      return (
                        <div
                          key={post.post_id || post.id}
                          onClick={() => handleViewDetails(post)}
                          className="group bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
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
                              
                              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/70 to-transparent py-2 px-3">
                                <div className="flex items-center space-x-2 text-white">
                                  <FaEye className="text-blue-200" />
                                  <span className="text-sm font-medium">{post.views_count || 0}</span>
                                </div>
                                
                                <div className="flex items-center space-x-1">
                                  <FaHeart className={`${post.has_liked ? "text-red-500" : "text-gray-300"}`} />
                                  <span className="text-sm font-medium text-white">
                                    {post.likes_count || 0}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="p-5 md:p-6 md:flex-1 flex flex-col">
                              <div className="flex-1">
                                <div className="flex items-center mb-2 space-x-2">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {post.post_type || 'News'}
                                  </span>
                                </div>
                                
                                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                                  {post.title}
                                </h3>
                                
                                <div className="text-gray-700 whitespace-pre-line leading-relaxed line-clamp-3">
                                  {post.content}
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                                {/* Date display */}
                                <div className="flex items-center text-sm text-gray-500">
                                  <FaCalendarAlt className="mr-2 text-blue-400" />
                                  <span>
                                    {formatDate(startDateValue)} 
                                    {endDateValue ? ` - ${formatDate(endDateValue)}` : ''}
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
                    })}
                  </div>
                ) : (
                  // List View
                  <div className="divide-y divide-gray-200">
                    {currentPosts.map((post) => {
                      const startDateValue = post.startDate || post.start_date;
                      const endDateValue = post.endDate || post.end_date;
                      
                      return (
                        <div
                          key={post.id || post.post_id}
                          className="py-4 group hover:bg-blue-50/50 transition-colors cursor-pointer rounded-lg"
                        >
                          <div className="flex items-start gap-4">
                            {/* Thumbnail */}
                            <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden hidden sm:block">
                              {post.media_urls && post.media_urls[0] ? (
                                <img
                                  src={post.media_urls[0]}
                                  alt={post.title}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://placehold.co/100x100/3B82F6/FFFFFF?text=News";
                                  }}
                                />
                              ) : (
                                <div className="bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center h-full">
                                  <FaNewspaper className="text-blue-400" />
                                </div>
                              )}
                            </div>
                            
                            {/* Content */}
                            <div className="flex-1" onClick={() => handleViewDetails(post)}>
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                    {post.title}
                                  </h3>
                                  <div className="mt-2 flex items-center text-xs text-gray-500">
                                    <span className="mr-2">
                                      {formatDate(startDateValue)} {endDateValue ? `- ${formatDate(endDateValue)}` : ''}
                                    </span>
                                    {post.category && (
                                      <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 mr-1">
                                        {post.category}
                                      </span>
                                    )}
                                    {post.cpeGroup && (
                                      <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                                        {post.cpeGroup}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )
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
                      : selectedCPE 
                        ? `No posts available for ${selectedCPE}. Try another group.` 
                        : 'No posts are currently available.'}
                  </p>
                </div>
              )}
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
                    // Always show first page, last page, current page, and pages adjacent to current
                    if (
                      totalPages <= 5 || // Show all if 5 or fewer pages
                      pageNumber === 1 || // Always show first page
                      pageNumber === totalPages || // Always show last page
                      Math.abs(currentPage - pageNumber) <= 1 // Show pages adjacent to current
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
                      // Show ellipsis but avoid duplicate ellipses
                      // Show ellipsis after page 1 if current page is > 3
                      (pageNumber === 2 && currentPage > 3) ||
                      // Show ellipsis before last page if current page is < totalPages - 2
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

          {/* Mobile pagination indicator - shows on smaller screens */}
          {filteredPosts.length > 0 && totalPages > 1 && (
            <div className="mt-4 text-center text-sm text-gray-600 md:hidden">
              <span className="bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                Page {currentPage} of {totalPages}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Newuser;
