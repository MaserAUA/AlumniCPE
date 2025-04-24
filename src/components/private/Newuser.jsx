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
import { useGetAllPost } from "../../api/post";
import { v4 as uuidv4 } from 'uuid';

const Newuser = ({ posts = [] }) => {
  const [filteredPosts, setFilteredPosts] = useState(posts);
  const [selectedCPE, setSelectedCPE] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  // Removed: const [showAnalytics, setShowAnalytics] = useState(false);
  const [sortBy, setSortBy] = useState("date"); // date, views, likes
  const [sortOrder, setSortOrder] = useState("desc"); // asc, desc
  const [viewMode, setViewMode] = useState("grid"); // grid, list
  // Removed: const [analyticsTab, setAnalyticsTab] = useState("views"); // views, cpe
  // Fixed: We'll store our posts in state to prevent disappearing on sort changes
  const [allPosts, setAllPosts] = useState(posts);
  const postsPerPage = viewMode === "grid" ? 3 : 5;
  const navigate = useNavigate();
  const location = useLocation();
  const section = new URLSearchParams(location.search).get('section');
  const getallpost = useGetAllPost();
  
  // Mock view data
  const getInitialViewData = () => {
    const storedViewData = localStorage.getItem("postViewData");
    if (storedViewData) {
      return JSON.parse(storedViewData);
    }
    // Initialize with random data if not in localStorage
    return allPosts.reduce((acc, post) => {
      acc[post.id] = {
        totalViews: Math.floor(Math.random() * 100) + 20,
        cpeViews: Array.from({ length: 38 }, (_, i) => ({
          cpe: `CPE ${i + 1}`,
          views: Math.floor(Math.random() * 20)
        }))
      };
      return acc;
    }, {});
  };

  const [viewData, setViewData] = useState(getInitialViewData);

  // Save view data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("postViewData", JSON.stringify(viewData));
  }, [viewData]);
  
  useEffect(() => {
    getallpost.mutate(null,
      {
        onSuccess: (res) => {
          // Properly map API response fields to the expected structure
          const updatedPosts = [...posts, ...res.data].map(post => ({
            ...post,
            id: post.post_id || post.id, // Ensure we have an id field
            content: post.content || 'No description available',
            startDate: post.start_date || post.startDate,
            endDate: post.end_date || post.endDate,
            category: post.post_type === "announcement" ? "Press release" : 
                     post.post_type === "event" ? "Event News" : 
                     post.category || "News", // Map post_type to category
            // If we have an actual upload image array use it, otherwise use media_urls if available
            images: post.images || (post.media_urls ? [post.media_urls] : [])
          }));
          setAllPosts(updatedPosts);
          setFilteredPosts(updatedPosts);
        },
        onError: (error) => {
          console.log(error)
        }
      }
    )
  }, [])

  // Filter and sort posts effect - using allPosts instead of posts
  useEffect(() => {
    let updatedPosts = [...allPosts];

    // Filter by CPE
    if (selectedCPE) {
      updatedPosts = updatedPosts.filter((post) => {
        return post.category === "Press release" || post.cpeGroup === selectedCPE;
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
        const dateA = new Date(a.startDate || 0);
        const dateB = new Date(b.startDate || 0);
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
  }, [allPosts, selectedCPE, searchQuery, sortBy, sortOrder]);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const handleViewDetails = (post) => {
    // Update views when a post is clicked
    setViewData(prev => {
      const userCPE = localStorage.getItem("userCPE") || "CPE 1"; // Default to CPE 1 if not set
      const postData = prev[post.id] || { 
        totalViews: 0, 
        cpeViews: Array.from({ length: 38 }, (_, i) => ({
          cpe: `CPE ${i + 1}`,
          views: 0
        }))
      };
      
      // สร้าง postId ใหม่ใช้ UUID ถ้ายังไม่มี
      const postId = post.id || uuidv4();
      
      // Increment total views
      const updatedPostData = {
        ...postData,
        totalViews: postData.totalViews + 1,
        cpeViews: postData.cpeViews.map(cpeView => 
          cpeView.cpe === userCPE 
            ? { ...cpeView, views: cpeView.views + 1 } 
            : cpeView
        )
      };
      
      return { ...prev, [postId]: updatedPostData };
    });
    console.log("View details for post:", post);
    navigate(`/newsdetail`, { state: { post } });
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  
  // Helper function to get like count (for display only)
  const getLikeCount = (post) => {
    const likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "{}");
    // หาทั้งจาก id หรือ UUID 
    return likedPosts[post.id]?.likeCount || post.likeCount || 0;
  };
  
  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return "N/A"; // Check for invalid date
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
  
  // Toggle sorting order
  const toggleSort = (sortType) => {
    if (sortBy === sortType) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(sortType);
      setSortOrder("desc"); // Default to descending
    }
  };

  // Removed: prepareAnalyticsData function
  
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

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-blue-400 via-blue-500 to-indigo-600">
        <ScrollToTopButton />
        
        {/* Header Section with parallax effect */}
        <div className="relative overflow-hidden py-16 md:py-24 bg-blue-600 bg-opacity-60">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-600/30 to-indigo-900/50"></div>
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80')] bg-cover bg-center opacity-20"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <h1 className="text-5xl md:text-6xl font-extrabold text-white text-center mb-2 drop-shadow-md">
              News <span className="text-blue-200">For CPE</span>
            </h1>
            <p className="text-blue-100 text-center max-w-2xl mx-auto text-lg">
              Stay updated with the latest news, events, and announcements
            </p>
            
            {/* Analytics toggle button removed */}
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-blue-400 to-transparent"></div>
        </div>

        {/* Analytics Section removed */}

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
                      <option value="">CPE</option>
                      {Array.from({ length: 38 }, (_, i) => (
                        <option key={i} value={`CPE ${i + 1}`}>
                          CPE {i + 1}
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
                    {filteredPosts.reduce((sum, post) => sum + (viewData[post.id]?.totalViews || 0), 0)} total views
                  </span>
                  •
                  <span className="ml-2">
                    {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'} found
                  </span>
                </div>
              </div>
              
              {/* Posts Grid/List */}
              {currentPosts.length > 0 ? (
                viewMode === "grid" ? (
                  // Grid View
                  <div className="space-y-8">
                    {currentPosts.map((post) => {
                      return (
                        <div
                          key={post.id}
                          className="group bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                        >
                          <div className="md:flex">
                            {/* Image container */}
                            <div className="md:w-1/3 lg:w-1/4 h-48 md:h-auto relative overflow-hidden">
                              {post.images && post.images[0] ? (
                                <img
                                  src={
                                    post.images[0] instanceof File
                                      ? URL.createObjectURL(post.images[0])
                                      : post.images[0]
                                  }
                                  alt={post.title}
                                  className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                />
                              ) : (
                                <div className="bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center h-full">
                                  <FaNewspaper className="text-blue-400 text-4xl" />
                                </div>
                              )}
                            </div>
                            
                            <div className="p-5 md:p-6 md:flex-1 flex flex-col" onClick={() => handleViewDetails(post)}>
                              <div className="flex-1">
                                <div className="flex items-center mb-2 space-x-2">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {post.category || 'News'}
                                  </span>
                                  {post.cpeGroup && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                      {post.cpeGroup}
                                    </span>
                                  )}
                                </div>
                                
                                <h3 className="text-xl md:text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors mb-2">
                                  {post.title}
                                </h3>
                                
                                <div className="flex items-center text-sm text-gray-500">
                                  <FaCalendarAlt className="mr-1" />
                                  <span>
                                    {formatDate(post.startDate)} {post.endDate ? `- ${formatDate(post.endDate)}` : ''}
                                  </span>
                                </div>
                                
                                <div className="flex items-center justify-end mt-4 pt-4 border-t border-gray-100">
                                  <span className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700">
                                    Read more
                                    <svg className="ml-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                    </svg>
                                  </span>
                                </div>
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
                      return (
                        <div
                          key={post.id}
                          className="py-4 group hover:bg-blue-50/50 transition-colors cursor-pointer rounded-lg"
                        >
                          <div className="flex items-start gap-4">
                            {/* Thumbnail */}
                            <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden hidden sm:block">
                              {post.images && post.images[0] ? (
                                <img
                                  src={
                                    post.images[0] instanceof File
                                      ? URL.createObjectURL(post.images[0])
                                      : post.images[0]
                                  }
                                  alt={post.title}
                                  className="w-full h-full object-cover"
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
                                      {formatDate(post.startDate)} {post.endDate ? `- ${formatDate(post.endDate)}` : ''}
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
    </>
  );
};

export default Newuser;