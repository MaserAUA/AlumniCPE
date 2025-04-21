import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  FaArrowUp,
  FaCalendarAlt,
  FaChartBar,
  FaChevronLeft,
  FaChevronRight,
  FaEye,
  FaFilter,
  FaHeart,
  FaInfoCircle,
  FaNewspaper,
  FaSearch,
  FaSortAmountDown,
  FaSortAmountUp,
  FaTrophy,
} from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { IoChatbubbleEllipses } from 'react-icons/io5';
import { useGetAllPost } from "../../api/post";
import { v4 as uuidv4 } from "uuid";

const Newuser = ({ posts = [] }) => {
  const [filteredPosts, setFilteredPosts] = useState(posts);
  const [selectedCPE, setSelectedCPE] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [sortBy, setSortBy] = useState("date"); // date, views, likes
  const [sortOrder, setSortOrder] = useState("desc"); // asc, desc
  const [viewMode, setViewMode] = useState("grid"); // grid, list
  const [analyticsTab, setAnalyticsTab] = useState("views"); // views, cpe
  // Fixed: We'll store our posts in state to prevent disappearing on sort changes
  const [allPosts, setAllPosts] = useState(posts);
  const postsPerPage = viewMode === "grid" ? 3 : 5;
  const navigate = useNavigate();
  const location = useLocation();
  const section = new URLSearchParams(location.search).get("section");
  const getallpost = useGetAllPost();

  const handleChatClick = () => {
    navigate('/chatpage');
  };

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
          views: Math.floor(Math.random() * 20),
        })),
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
  getallpost.mutate(null, {
    onSuccess: (res) => {
      // ตรวจสอบว่า res.data มีอยู่จริงและเป็น array ก่อนประมวลผล
      if (res && res.data && Array.isArray(res.data)) {
        // concat posts and update both states
        const updatedPosts = [...posts, ...res.data];
        setAllPosts(updatedPosts);
        setFilteredPosts(updatedPosts);
      } else {
        // ถ้า res.data ไม่ใช่ array ให้ใช้แค่ posts เริ่มต้น
        console.log("API response data is not an array:", res);
        setAllPosts(posts);
        setFilteredPosts(posts);
      }
    },
    onError: (error) => {
      console.log("API error:", error);
      // เมื่อเกิด error ยังคงตั้งค่า posts เริ่มต้น
      setAllPosts(posts);
      setFilteredPosts(posts);
    },
  });
}, []);

  // Filter and sort posts effect - using allPosts instead of posts
  useEffect(() => {
    let updatedPosts = [...allPosts];

    // Filter by CPE
    if (selectedCPE) {
      updatedPosts = updatedPosts.filter((post) => {
        return (
          post.category === "Press release" || post.cpeGroup === selectedCPE
        );
      });
    }

    // Search filter
    if (searchQuery) {
      updatedPosts = updatedPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (post.content &&
            post.content.toLowerCase().includes(searchQuery.toLowerCase()))
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
        const likedPostsData = JSON.parse(
          localStorage.getItem("likedPosts") || "{}"
        );
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
    if (!post) return;
    // Update views when a post is clicked
    setViewData((prev) => {
      const userCPE = localStorage.getItem("userCPE") || "CPE 1"; // Default to CPE 1 if not set
      const postData = prev[post.id] || {
        totalViews: 0,
        cpeViews: Array.from({ length: 38 }, (_, i) => ({
          cpe: `CPE ${i + 1}`,
          views: 0,
        })),
      };

      // สร้าง postId ใหม่ใช้ UUID ถ้ายังไม่มี
      const postId = post.id || uuidv4();

      // Increment total views
      const updatedPostData = {
        ...postData,
        totalViews: postData.totalViews + 1,
        cpeViews: postData.cpeViews.map((cpeView) =>
          cpeView.cpe === userCPE
            ? { ...cpeView, views: cpeView.views + 1 }
            : cpeView
        ),
      };

      return { ...prev, [postId]: updatedPostData };
    });
    console.log("View details for post:", post);
    navigate(`/newsdetail`, { state: { post } });
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
    const date = new Date(dateStr);
    if (isNaN(date)) return dateStr;
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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

  // Prepare analytics data
  const prepareAnalyticsData = () => {
    // 1. Top viewed posts
    const topViewedPosts = [...allPosts]
  .filter(post => post && post.id) // กรองโพสต์ที่ไม่ถูกต้องออก
  .sort((a, b) => {
        const viewsA = viewData[a.id]?.totalViews || 0;
        const viewsB = viewData[b.id]?.totalViews || 0;
        return viewsB - viewsA;
      })
      .slice(0, 5);

    // 2. CPE group engagement
    const cpeGroupEngagement = Array.from({ length: 38 }, (_, i) => {
      const cpeName = `CPE ${i + 1}`;
      const totalViews = Object.values(viewData).reduce((sum, postData) => {
        const cpeView = postData.cpeViews.find((v) => v.cpe === cpeName);
        return sum + (cpeView?.views || 0);
      }, 0);

      return {
        name: cpeName,
        views: totalViews,
      };
    }).sort((a, b) => b.views - a.views);

    // 3. Post category distribution
    const categoryMap = {};
    allPosts.forEach((post) => {
      const category = post.category || "Uncategorized";
      if (!categoryMap[category]) {
        categoryMap[category] = 0;
      }
      categoryMap[category] += viewData[post.id]?.totalViews || 0;
    });

    const categoryDistribution = Object.entries(categoryMap).map(
      ([name, value]) => ({
        name,
        value,
      })
    );

    return {
      topViewedPosts,
      cpeGroupEngagement: cpeGroupEngagement.slice(0, 10), // Top 10 only
      categoryDistribution,
    };
  };

  const analyticsData = prepareAnalyticsData();

  // Colors for pie charts
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
  ];

  // Set user CPE without showing a test message
  const setUserCPE = (cpe) => {
    localStorage.setItem("userCPE", cpe);
  };

  // Scroll to top button
  

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-blue-400 via-blue-500 to-indigo-600">
  

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

            {/* Analytics toggle button */}
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setShowAnalytics(!showAnalytics)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                  showAnalytics
                    ? "bg-white text-blue-600"
                    : "bg-blue-700 text-white hover:bg-blue-800"
                }`}
              >
                <FaChartBar />
                <span>
                  {showAnalytics ? "Hide Analytics" : "Show Analytics"}
                </span>
              </button>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-blue-400 to-transparent"></div>
        </div>

        {/* Analytics Section */}
        {showAnalytics && (
          <div className="container mx-auto px-4 mb-8">
            <div className="bg-white rounded-xl shadow-2xl p-6 transform transition-all duration-300">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                News Analytics Dashboard
              </h2>

              {/* Tabs */}
              <div className="border-b border-gray-200 mb-6">
                <div className="flex space-x-4">
                  <button
                    onClick={() => setAnalyticsTab("views")}
                    className={`py-2 px-4 border-b-2 font-medium text-sm ${
                      analyticsTab === "views"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Top Viewed News
                  </button>
                  <button
                    onClick={() => setAnalyticsTab("cpe")}
                    className={`py-2 px-4 border-b-2 font-medium text-sm ${
                      analyticsTab === "cpe"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    CPE Group Engagement
                  </button>
                  <button
                    onClick={() => setAnalyticsTab("categories")}
                    className={`py-2 px-4 border-b-2 font-medium text-sm ${
                      analyticsTab === "categories"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Category Distribution
                  </button>
                </div>
              </div>

              {/* Analytics Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column - Chart */}
                <div className="bg-blue-50 p-4 rounded-xl">
                  <div className="h-80">
                    {analyticsTab === "views" && (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={analyticsData.topViewedPosts.map((post) => ({
                            name:
                              post.title.substring(0, 20) +
                              (post.title.length > 20 ? "..." : ""),
                            views: viewData[post.id]?.totalViews || 0,
                          }))}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="views" fill="#3B82F6" />
                        </BarChart>
                      </ResponsiveContainer>
                    )}

                    {analyticsTab === "cpe" && (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analyticsData.cpeGroupEngagement}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="views" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    )}

                    {analyticsTab === "categories" && (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={analyticsData.categoryDistribution}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={({ name, percent }) =>
                              `${name} ${(percent * 100).toFixed(0)}%`
                            }
                          >
                            {analyticsData.categoryDistribution.map(
                              (entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              )
                            )}
                          </Pie>
                          <Tooltip
                            formatter={(value) => [`${value} views`, "Views"]}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>

                {/* Right Column - Data List */}
                <div>
                  {analyticsTab === "views" && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">
                        Top Viewed News
                      </h3>
                      <div className="space-y-3">
                        {analyticsData.topViewedPosts.map((post, index) => (
                          <div
                            key={post.id}
                            className="flex items-center p-3 bg-white rounded-lg shadow-sm cursor-pointer hover:bg-blue-50"
                            onClick={() => handleViewDetails(post)}
                          >
                            <div
                              className={`w-8 h-8 flex items-center justify-center rounded-full ${
                                index < 3
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-200 text-gray-700"
                              }`}
                            >
                              {index === 0 && (
                                <FaTrophy className="text-yellow-300" />
                              )}
                              {index > 0 && index + 1}
                            </div>
                            <div className="ml-3 flex-1">
                              <h4 className="font-medium text-gray-800 line-clamp-1">
                                {post.title}
                              </h4>
                              <div className="flex items-center text-sm text-gray-500 mt-1">
                                <span className="flex items-center">
                                  <FaEye className="mr-1" />
                                  {viewData[post.id]?.totalViews || 0} views
                                </span>
                                <span className="mx-2">•</span>
                                <span className="flex items-center">
                                  <FaHeart className="mr-1 text-red-400" />
                                  {getLikeCount(post)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {analyticsTab === "cpe" && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">
                        Most Active CPE Groups
                      </h3>
                      <div className="space-y-2">
                        {analyticsData.cpeGroupEngagement
                          .slice(0, 10)
                          .map((cpeData, index) => (
                            <div
                              key={cpeData.name}
                              className="flex items-center"
                            >
                              <div className="w-6 text-right mr-2 text-gray-500">
                                {index + 1}.
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between mb-1">
                                  <span className="font-medium">
                                    {cpeData.name}
                                  </span>
                                  <span className="text-blue-600">
                                    {cpeData.views} views
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{
                                      width: `${Math.min(
                                        100,
                                        (cpeData.views /
                                          analyticsData.cpeGroupEngagement[0]
                                            .views) *
                                          100
                                      )}%`,
                                    }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {analyticsTab === "categories" && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">
                        Category Engagement
                      </h3>
                      <div className="space-y-4">
                        {analyticsData.categoryDistribution.map(
                          (category, index) => (
                            <div
                              key={category.name}
                              className="bg-white p-3 rounded-lg shadow-sm"
                            >
                              <div className="flex justify-between items-center">
                                <span
                                  className="font-medium"
                                  style={{
                                    color: COLORS[index % COLORS.length],
                                  }}
                                >
                                  {category.name}
                                </span>
                                <span className="text-gray-600">
                                  {category.value} views
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                <div
                                  className="h-2 rounded-full"
                                  style={{
                                    width: `${Math.min(
                                      100,
                                      (category.value /
                                        analyticsData.categoryDistribution[0]
                                          .value) *
                                        100
                                    )}%`,
                                    backgroundColor:
                                      COLORS[index % COLORS.length],
                                  }}
                                ></div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

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
                      Press Release
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
                      <option value="">All CPE Groups</option>
                      {Array.from({ length: 38 }, (_, i) => (
                        <option key={i} value={`CPE ${i + 1}`}>
                          CPE {i + 1}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                      <svg
                        className="w-4 h-4 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
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
                      className={`px-3 py-1.5 ${
                        sortBy === "date"
                          ? "bg-blue-600 text-white"
                          : "bg-white hover:bg-blue-50"
                      }`}
                      onClick={() => toggleSort("date")}
                    >
                      <div className="flex items-center gap-1">
                        <FaCalendarAlt />
                        <span>Date</span>
                        {sortBy === "date" &&
                          (sortOrder === "desc" ? (
                            <FaSortAmountDown size={10} />
                          ) : (
                            <FaSortAmountUp size={10} />
                          ))}
                      </div>
                    </button>
                    <button
                      className={`px-3 py-1.5 ${
                        sortBy === "views"
                          ? "bg-blue-600 text-white"
                          : "bg-white hover:bg-blue-50"
                      }`}
                      onClick={() => toggleSort("views")}
                    >
                      <div className="flex items-center gap-1">
                        <FaEye />
                        <span>Views</span>
                        {sortBy === "views" &&
                          (sortOrder === "desc" ? (
                            <FaSortAmountDown size={10} />
                          ) : (
                            <FaSortAmountUp size={10} />
                          ))}
                      </div>
                    </button>
                    <button
                      className={`px-3 py-1.5 ${
                        sortBy === "likes"
                          ? "bg-blue-600 text-white"
                          : "bg-white hover:bg-blue-50"
                      }`}
                      onClick={() => toggleSort("likes")}
                    >
                      <div className="flex items-center gap-1">
                        <FaHeart />
                        <span>Likes</span>
                        {sortBy === "likes" &&
                          (sortOrder === "desc" ? (
                            <FaSortAmountDown size={10} />
                          ) : (
                            <FaSortAmountUp size={10} />
                          ))}
                      </div>
                    </button>
                  </div>
                </div>

                <div className="flex items-center">
                  <span className="text-sm text-gray-700 mr-2">View:</span>
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        viewMode === "grid"
                          ? "bg-white shadow-sm"
                          : "text-gray-500 hover:text-gray-900"
                      }`}
                      onClick={() => setViewMode("grid")}
                    >
                      <div className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                          ></path>
                        </svg>
                        Grid
                      </div>
                    </button>
                    <button
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        viewMode === "list"
                          ? "bg-white shadow-sm"
                          : "text-gray-500 hover:text-gray-900"
                      }`}
                      onClick={() => setViewMode("list")}
                    >
                      <div className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 6h16M4 12h16M4 18h16"
                          ></path>
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
                  {selectedCPE
                    ? `${selectedCPE} News`
                    : "Latest Press Releases"}
                </h2>
                <div className="text-sm text-gray-600 flex items-center">
                  <FaEye className="mr-1" />
                  <span className="mr-2">
                  {filteredPosts.reduce(
  (sum, post) => sum + (post && post.id ? (viewData[post.id]?.totalViews || 0) : 0),
  0
)} total views
                  </span>
                  •
                  <span className="ml-2">
                    {filteredPosts.length}{" "}
                    {filteredPosts.length === 1 ? "post" : "posts"} found
                  </span>
                </div>
              </div>

              {/* Posts Grid/List */}
              {currentPosts.length > 0 ? (
                viewMode === "grid" ? (
                  // Grid View
                  <div className="space-y-8">
                    {currentPosts.map((post) => {
                       if (!post) return null;
                      const postViewData = viewData[post.id] || {
                        totalViews: 0,
                      };

                      return (
                        <div
                          key={post.id}
                          className="group bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                        >
                          <div className="md:flex">
                            {/* Fixed image container with consistent aspect ratio */}
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

                              <div className="absolute top-3 left-3 flex items-center space-x-1 bg-blue-600/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm text-white">
                                <FaEye className="text-white/90" />
                                <span className="text-sm font-medium">
                                  {postViewData.totalViews || 0}
                                </span>
                              </div>

                              {/* Changed: Display like count without making it clickable */}
                              <div className="absolute top-3 right-3 flex items-center space-x-1 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm">
                                <FaHeart className="text-red-500" />
                                <span className="text-sm font-medium text-gray-800">
                                  {getLikeCount(post)}
                                </span>
                              </div>
                            </div>

                            <div
                              className="p-5 md:p-6 md:flex-1 flex flex-col"
                              onClick={() => handleViewDetails(post)}
                            >
                              <div className="flex-1">
                                <div className="flex items-center mb-2 space-x-2">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {post.category || "News"}
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

                                <p className="text-gray-600 mb-4 line-clamp-2">
                                  {post.content || "No description available"}
                                </p>

                                {post.emoji && (
                                  <div className="text-2xl mb-2">
                                    {post.emoji}
                                  </div>
                                )}
                              </div>

                              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                                <div className="text-sm text-gray-500">
                                  {formatDate(post.startDate)}{" "}
                                  {post.endDate
                                    ? `- ${formatDate(post.endDate)}`
                                    : ""}
                                </div>

                                <span className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700">
                                  Read more
                                  <svg
                                    className="ml-1 w-5 h-5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                                      clipRule="evenodd"
                                    ></path>
                                  </svg>
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* CPE Views Mini Bar Chart (visible only in grid view) */}
                          <div className="p-3 bg-gray-50 border-t border-gray-100">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-xs font-semibold text-gray-500 uppercase">
                                CPE Group Engagement
                              </h4>
                              <span className="text-xs text-blue-600">
                                {viewData[post.id]?.cpeViews?.reduce(
                                  (sum, cpe) => sum + cpe.views,
                                  0
                                ) || 0}{" "}
                                total views
                              </span>
                            </div>
                            <div className="flex h-6">
                              {viewData[post.id]?.cpeViews
                                ?.sort((a, b) => b.views - a.views)
                                .slice(0, 8)
                                .map((cpe, index) => {
                                  if (cpe.views === 0) return null;

                                  const colors = [
                                    "bg-blue-500",
                                    "bg-indigo-500",
                                    "bg-purple-500",
                                    "bg-pink-500",
                                    "bg-red-500",
                                    "bg-orange-500",
                                    "bg-yellow-500",
                                    "bg-green-500",
                                  ];

                                  const totalViews =
                                    viewData[post.id]?.cpeViews?.reduce(
                                      (sum, cpe) => sum + cpe.views,
                                      0
                                    ) || 1;
                                  const percent =
                                    (cpe.views / totalViews) * 100;

                                  return (
                                    <div
                                      key={cpe.cpe}
                                      className={`${
                                        colors[index % colors.length]
                                      } h-full relative group cursor-pointer`}
                                      style={{ width: `${percent}%` }}
                                      title={`${cpe.cpe}: ${
                                        cpe.views
                                      } views (${percent.toFixed(1)}%)`}
                                    >
                                      <div className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap transition-opacity">
                                        {cpe.cpe}: {cpe.views} views
                                      </div>
                                    </div>
                                  );
                                })}
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
                      const postViewData = viewData[post.id] || {
                        totalViews: 0,
                      };

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
                            <div
                              className="flex-1"
                              onClick={() => handleViewDetails(post)}
                            >
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                    {post.title}
                                  </h3>
                                  <p className="mt-1 text-sm text-gray-500 line-clamp-1">
                                    {post.content || "No description available"}
                                  </p>
                                </div>
                                <div className="flex-shrink-0 flex space-x-2">
                                  <div className="flex items-center text-sm text-gray-500">
                                    <FaEye className="mr-1" />
                                    <span>{postViewData.totalViews}</span>
                                  </div>
                                  {/* Changed: Display like count without making it clickable */}
                                  <div className="flex items-center text-sm">
                                    <FaHeart className="mr-1 text-red-500" />
                                    <span>{getLikeCount(post)}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="mt-2 flex items-center text-xs text-gray-500">
                                <span className="mr-2">
                                  {formatDate(post.startDate)}{" "}
                                  {post.endDate
                                    ? `- ${formatDate(post.endDate)}`
                                    : ""}
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

                          {/* Mini chart for CPE views (table-like) */}
                          <div className="mt-2 pl-20 flex space-x-1 overflow-x-auto">
                            {viewData[post.id]?.cpeViews
                              ?.filter((cpe) => cpe.views > 0)
                              .sort((a, b) => b.views - a.views)
                              .slice(0, 5)
                              .map((cpe) => (
                                <div
                                  key={cpe.cpe}
                                  className="flex items-center text-xs bg-blue-50 px-2 py-1 rounded"
                                >
                                  <span className="font-medium text-blue-700">
                                    {cpe.cpe}
                                  </span>
                                  <span className="mx-1">•</span>
                                  <span className="text-gray-600">
                                    {cpe.views}
                                  </span>
                                </div>
                              ))}
                            {(viewData[post.id]?.cpeViews?.filter(
                              (cpe) => cpe.views > 0
                            ).length || 0) > 5 && (
                              <div className="flex items-center text-xs bg-gray-100 px-2 py-1 rounded">
                                <span className="text-gray-500">
                                  +
                                  {(viewData[post.id]?.cpeViews?.filter(
                                    (cpe) => cpe.views > 0
                                  ).length || 0) - 5}{" "}
                                  more
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="bg-blue-50 rounded-full p-6 mb-4">
                    <svg
                      className="w-12 h-12 text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No posts found
                  </h3>
                  <p className="text-gray-500 max-w-md">
                    {searchQuery
                      ? `No results for "${searchQuery}". Try different keywords.`
                      : selectedCPE
                      ? `No posts available for ${selectedCPE}. Try another group.`
                      : "No posts are currently available."}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Pagination */}
          {filteredPosts.length > 0 && totalPages > 1 && (
            <div className="mt-10 flex justify-center">
              <nav
                className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                aria-label="Pagination"
              >
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

        {/* CPE Engagement Comparison Widget */}
        <div className="container mx-auto px-4 pb-16">
          <div className="bg-white rounded-xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              CPE Engagement Comparison
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Popular with your CPE */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-2">
                    <FaEye />
                  </span>
                  Popular with {localStorage.getItem("userCPE") || "CPE 1"}
                </h3>
                <div className="space-y-2">
                  {[...allPosts]
                    .filter((post) => {
                      const userCPE =
                        localStorage.getItem("userCPE") || "CPE 1";
                      const postData = viewData[post.id];
                      if (!postData) return false;
                      const cpeView = postData.cpeViews.find(
                        (v) => v.cpe === userCPE
                      );
                      return cpeView && cpeView.views > 0;
                    })
                    .sort((a, b) => {
                      const userCPE =
                        localStorage.getItem("userCPE") || "CPE 1";
                      const aViews =
                        viewData[a.id]?.cpeViews.find((v) => v.cpe === userCPE)
                          ?.views || 0;
                      const bViews =
                        viewData[b.id]?.cpeViews.find((v) => v.cpe === userCPE)
                          ?.views || 0;
                      return bViews - aViews;
                    })
                    .slice(0, 3)
                    .map((post) => (
                      <div
                        key={post.id}
                        onClick={() => handleViewDetails(post)}
                        className="flex items-center p-2 bg-white/70 backdrop-blur-sm rounded cursor-pointer hover:bg-white"
                      >
                        <div className="w-10 h-10 flex-shrink-0 bg-blue-100 rounded flex items-center justify-center">
                          <FaNewspaper className="text-blue-500" />
                        </div>
                        <div className="ml-3 flex-1">
                          <h4 className="font-medium text-gray-900 text-sm line-clamp-1">
                            {post.title}
                          </h4>
                          <div className="text-xs text-blue-600 mt-0.5">
                            {viewData[post.id]?.cpeViews.find(
                              (v) =>
                                v.cpe ===
                                (localStorage.getItem("userCPE") || "CPE 1")
                            )?.views || 0}{" "}
                            views
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Most Popular Overall */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-4">
                <h3 className="font-semibold text-indigo-800 mb-3 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center mr-2">
                    <FaTrophy />
                  </span>
                  Most Popular Overall
                </h3>
                <div className="space-y-2">
                  {[...allPosts]
                    .sort((a, b) => {
                      const aViews = viewData[a.id]?.totalViews || 0;
                      const bViews = viewData[b.id]?.totalViews || 0;
                      return bViews - aViews;
                    })
                    .slice(0, 3)
                    .map((post) => (
                      <div
                        key={post.id}
                        onClick={() => handleViewDetails(post)}
                        className="flex items-center p-2 bg-white/70 backdrop-blur-sm rounded cursor-pointer hover:bg-white"
                      >
                        <div className="w-10 h-10 flex-shrink-0 bg-indigo-100 rounded flex items-center justify-center">
                          <FaNewspaper className="text-indigo-500" />
                        </div>
                        <div className="ml-3 flex-1">
                          <h4 className="font-medium text-gray-900 text-sm line-clamp-1">
                            {post.title}
                          </h4>
                          <div className="text-xs text-indigo-600 mt-0.5">
                            {viewData[post.id]?.totalViews || 0} total views
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Least Engaged by Your CPE */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4">
                <h3 className="font-semibold text-purple-800 mb-3 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center mr-2">
                    <FaInfoCircle />
                  </span>
                  You Might Have Missed
                </h3>
                <div className="space-y-2">
                  {[...allPosts]
                    .filter((post) => {
                      const userCPE =
                        localStorage.getItem("userCPE") || "CPE 1";
                      const postData = viewData[post.id];
                      if (!postData) return true; // Include posts with no view data
                      const cpeView = postData.cpeViews.find(
                        (v) => v.cpe === userCPE
                      );
                      return !cpeView || cpeView.views === 0;
                    })
                    .sort((a, b) => {
                      const aViews = viewData[a.id]?.totalViews || 0;
                      const bViews = viewData[b.id]?.totalViews || 0;
                      return bViews - aViews; // Show most popular first
                    })
                    .slice(0, 3)
                    .map((post) => (
                      <div
                        key={post.id}
                        onClick={() => handleViewDetails(post)}
                        className="flex items-center p-2 bg-white/70 backdrop-blur-sm rounded cursor-pointer hover:bg-white"
                      >
                        <div className="w-10 h-10 flex-shrink-0 bg-purple-100 rounded flex items-center justify-center">
                          <FaNewspaper className="text-purple-500" />
                        </div>
                        <div className="ml-3 flex-1">
                          <h4 className="font-medium text-gray-900 text-sm line-clamp-1">
                            {post.title}
                          </h4>
                          <div className="text-xs text-purple-600 mt-0.5">
                            {viewData[post.id]?.totalViews || 0} views from
                            other CPE groups
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="fixed bottom-6 right-6 z-50">
                <button
                  onClick={handleChatClick}
                  className="bg-blue-600 hover:bg-blue-700 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg transform hover:scale-105 transition-all duration-200"
                  aria-label="Open chat"
                >
                  <IoChatbubbleEllipses size={28} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Newuser;
