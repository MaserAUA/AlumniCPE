import React, { useState, useEffect, useCallback } from "react";
import Card from "./Card";
import { Search, Filter, Database, ChevronDown, Eye, X } from "lucide-react";
import { authApi, API_CONFIG } from '../auth/api/authApi';
import { useAuth } from '../auth/AuthContext';

function Table() {
  // Course options with "All" included
  const sidebarItems = ["All", "Regular", "INTER", "HDS", "RC"];
  const tableHeaders = [
    "First Name",
    "Last Name",
    "Email",
    "Phone Number",
    "Student ID",
    "Favorite Subject",
    "Working Company",
    "Job Position",
    "Line of Work",
    "CPE Model",
    "Salary",
    "Nation",
    "Course",
    "Action",
  ];

  // State
  const [tableData, setTableData] = useState([]);
  const [selectedCPE, setSelectedCPE] = useState("CPE 35");
  const [selectedCourse, setSelectedCourse] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInputValue, setSearchInputValue] = useState("");
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Debounce search function
  const debounce = (func, delay) => {
    let timeoutId;
    return function(...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  };

  // API search function
  const performApiSearch = useCallback(async (query) => {
    if (!query || query.trim() === "") {
      // Load normal data if search query is empty
      loadAlumniData();
      return;
    }

    try {
      setIsSearching(true);
      setError(null);
      
      const response = await authApi.user.getByFulltext(query);
      
      if (response && Array.isArray(response)) {
        // Map API results to match our data structure
        const formattedResults = response.map(result => ({
          firstName: result.first_name || 'N/A',
          lastName: result.last_name || 'N/A',
          email: result.email || 'N/A',
          phoneNumber: result.phone_number || 'N/A',
          studentID: result.student_id || 'N/A',
          favoriteSubject: result.favorite_subject || 'N/A',
          workingCompany: result.company || 'N/A',
          jobPosition: result.position || 'N/A',
          lineOfWork: result.line_of_work || 'N/A',
          cpeModel: result.cpe_model || selectedCPE,
          salary: result.salary || 'N/A',
          nation: result.nation || 'N/A',
          course: result.course || 'Regular',
          role: result.role || 'user',
          createdAt: result.created_at || new Date().toISOString()
        }));
        
        setTableData(formattedResults);
      } else {
        setTableData([]);
        setError("No search results found");
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
      setTableData([]);
      setError("Failed to perform search. Please try again later.");
    } finally {
      setIsSearching(false);
    }
  }, [selectedCPE]);

  // Create debounced search function
  const debouncedSearch = useCallback(
    debounce((query) => {
      setSearchQuery(query);
      performApiSearch(query);
    }, 500),
    [performApiSearch]
  );

  // Handle search input change
  const handleSearchInputChange = (event) => {
    const value = event.target.value;
    setSearchInputValue(value);
    debouncedSearch(value.toLowerCase());
  };
  
  // Function to load alumni data from API
  const loadAlumniData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const filterParams = {
        cpeModel: selectedCPE,
        course: selectedCourse !== "All" ? selectedCourse : undefined
      };
      
      // Get user data from API
      const response = await authApi.user.getByFilter(filterParams);
      
      if (response && Array.isArray(response)) {
        // Map API results to match our data structure
        const formattedResults = response.map(result => ({
          firstName: result.first_name || 'N/A',
          lastName: result.last_name || 'N/A',
          email: result.email || 'N/A',
          phoneNumber: result.phone_number || 'N/A',
          studentID: result.student_id || 'N/A',
          favoriteSubject: result.favorite_subject || 'N/A',
          workingCompany: result.company || 'N/A',
          jobPosition: result.position || 'N/A',
          lineOfWork: result.line_of_work || 'N/A',
          cpeModel: result.cpe_model || selectedCPE,
          salary: result.salary || 'N/A',
          nation: result.nation || 'N/A',
          course: result.course || 'Regular',
          role: result.role || 'user',
          createdAt: result.created_at || new Date().toISOString()
        }));
        
        setTableData(formattedResults);
      } else {
        setTableData([]);
        setError("No data available at the moment");
      }
    } catch (error) {
      console.error("Error loading alumni data:", error);
      setTableData([]);
      setError("Failed to load data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Load data when component mounts or when selectedCPE/selectedCourse changes
  useEffect(() => {
    // Load data from API
    loadAlumniData();
    
    // Load user profile
    const fetchUserProfile = async () => {
      try {
        if (user) {
          const profileData = await authApi.auth.getProfile();
          if (profileData) {
            setUserProfile(profileData);
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        // Fallback to localStorage if API fails
        const userProfileData = localStorage.getItem("userProfile");
        if (userProfileData) {
          setUserProfile(JSON.parse(userProfileData));
        }
      }
    };
    
    fetchUserProfile();
  }, [selectedCPE, selectedCourse, user]);

  // Event handlers
  const handleCPEChange = (event) => setSelectedCPE(event.target.value);
  
  const handleCourseChange = (event) => {
    setSelectedCourse(event.target.value);
    // Reset search if course changes
    if (searchQuery) {
      setSearchInputValue("");
      setSearchQuery("");
      loadAlumniData();
    }
  };

  const openPopup = (person) => {
    setSelectedPerson(person);
    setShowPopup(true);
  };

  const closePopup = () => setShowPopup(false);

  // Helper function to display values with privacy protection
  const displayValue = (row, fieldName) => {
    if (!row[fieldName]) return "N/A"; 
    if (userProfile && row.studentID === userProfile.studentID) {
      // Check for privacy settings
      if (userProfile.privacySettings?.[fieldName] === true) {
        return "N/A";
      }
    }
    return row[fieldName];
  };

  // Map table headers to data fields
  const fieldMap = {
    "First Name": "firstName",
    "Last Name": "lastName",
    "Email": "email",
    "Phone Number": "phoneNumber",
    "Student ID": "studentID",
    "Favorite Subject": "favoriteSubject",
    "Working Company": "workingCompany",
    "Job Position": "jobPosition",
    "Line of Work": "lineOfWork",
    "CPE Model": "cpeModel",
    "Salary": "salary",
    "Nation": "nation",
    "Course": "course",
  };

  // Filter data based on selected CPE, course, and search query
  const filteredData = tableData.filter((row) => {
    const isMatchCPE = row.cpeModel === selectedCPE;
    const isMatchCourse = selectedCourse === "All" ? true : row.course === selectedCourse;
    
    // If we're using API search, don't filter by search query again
    return isMatchCPE && isMatchCourse;
  });

  // Calculate counts for sidebar
  const courseCounts = sidebarItems.map((course) => {
    if (course === "All") {
      return {
        course,
        count: tableData.filter((row) => row.cpeModel === selectedCPE).length,
      };
    } else {
      return {
        course,
        count: tableData.filter(
          (row) => row.cpeModel === selectedCPE && row.course === course
        ).length,
      };
    }
  });

  // Render function for error state
  const renderError = () => (
    <div className="flex flex-col items-center justify-center my-8 p-8 bg-red-50 rounded-lg border border-red-200">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Data</h3>
      <p className="text-red-600 text-center">{error}</p>
      <button 
        onClick={loadAlumniData}
        className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-medium rounded-md transition-colors"
      >
        Try Again
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 p-4">
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - KEEPING THE NEW DESIGN */}
          <div className="w-full lg:w-1/4 bg-white bg-opacity-95 shadow-xl rounded-2xl overflow-hidden">
            <div className="bg-blue-600 text-white p-4">
              <div className="flex items-center gap-2">
                <Database size={20} />
                <h2 className="text-xl font-bold">Course Summary</h2>
              </div>
              <p className="text-blue-100 text-sm mt-1">
                {selectedCPE} • {filteredData.length} students
              </p>
            </div>
            
            <div className="p-4">
              {courseCounts.map((item, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedCourse(item.course)}
                  className={`flex justify-between items-center p-3 rounded-xl mb-2 cursor-pointer transition-all duration-200 ${
                    selectedCourse === item.course
                      ? "bg-blue-100 text-blue-800 font-semibold shadow-md"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {item.course === "All" ? (
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    ) : item.course === "Regular" ? (
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    ) : item.course === "INTER" ? (
                      <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                    ) : item.course === "HDS" ? (
                      <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                    )}
                    {item.course}
                  </span>
                  <span className="bg-white px-2 py-1 rounded-lg text-sm">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Table - REVERTING TO ORIGINAL DESIGN */}
          <div className="w-full lg:w-3/4 bg-white shadow-lg p-4 rounded-lg">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-800">
                {selectedCPE} ({selectedCourse})
              </h2>
              <div className="flex flex-wrap gap-4 w-full lg:w-auto">
                <select
                  className="select select-bordered bg-blue-100 text-blue-700 font-semibold rounded-lg p-2 w-full lg:w-auto"
                  value={selectedCPE}
                  onChange={handleCPEChange}
                >
                  {Array.from({ length: 38 }, (_, i) => (
                    <option key={i} value={`CPE ${i + 1}`}>
                      CPE {i + 1}
                    </option>
                  ))}
                </select>
                <select
                  className="select select-bordered bg-gray-100 text-gray-700 font-semibold rounded-lg p-2 w-full lg:w-auto"
                  value={selectedCourse}
                  onChange={handleCourseChange}
                >
                  {sidebarItems.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-4 relative">
              <div className="flex items-center">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search by any field"
                    className="input input-bordered w-full bg-white rounded-lg p-2 pl-10"
                    value={searchInputValue}
                    onChange={handleSearchInputChange}
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  {isSearching && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  )}
                  {searchInputValue && (
                    <button 
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      onClick={() => {
                        setSearchInputValue("");
                        setSearchQuery("");
                        loadAlumniData();
                      }}
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              </div>
              {searchQuery && (
                <div className="text-sm text-gray-500 mt-1 flex items-center">
                  <span className="mr-1">Searching for:</span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium">
                    {searchQuery}
                  </span>
                  <span className="ml-2">{filteredData.length} results found</span>
                </div>
              )}
            </div>

            {error ? (
              renderError()
            ) : (
              <div className="overflow-x-auto">
                <table className="table min-w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-blue-500 text-white">
                      {tableHeaders.map((header) => (
                        <th
                          key={header}
                          className="px-4 py-2 text-left text-sm font-medium"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.length > 0 ? (
                      filteredData.map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-blue-50">
                          {tableHeaders.slice(0, -1).map((header) => {
                            const fieldName = fieldMap[header];
                            return (
                              <td
                                key={header}
                                className="px-4 py-2 border border-gray-300 text-gray-700 text-sm"
                              >
                                {displayValue(row, fieldName)}
                              </td>
                            );
                          })}
                          {/* Action column */}
                          <td className="px-4 py-2 border border-gray-300 text-center">
                            <button
                              onClick={() => openPopup(row)}
                              className="bg-blue-600 text-white font-bold py-1 px-4 rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center mx-auto"
                            >
                              <Eye size={16} className="mr-1" /> View
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={tableHeaders.length}
                          className="px-4 py-2 text-center text-gray-500"
                        >
                          {isSearching ? "Searching..." : "No data found"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Popup Section for Card - KEEPING ORIGINAL FUNCTIONALITY */}
      {showPopup && selectedPerson && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl relative w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            {/* Close button */}
            <button
              onClick={closePopup}
              className="absolute top-4 right-4 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-all shadow-md"
            >
              &times;
            </button>
            {/* Send onClose to Card */}
            <Card data={selectedPerson} onClose={closePopup} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Table;