import React, { useState, useEffect } from "react";
import Card from "./Card";
import { Search, Filter, Database, ChevronDown, Eye, X } from "lucide-react";
import SharedDataService from '../admin/SharedDataService';

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
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load data using SharedDataService on component mount and set up listener for data changes
  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      const loadData = () => {
        // Get data using SharedDataService
        const data = SharedDataService.getTableData();
        if (data.length === 0) {
          // Default data if nothing exists
          const defaultData = [
            {
              firstName: "John",
              lastName: "Doe",
              email: "john.doe@example.com",
              phoneNumber: "123-456-7890",
              studentID: "64070501001",
              favoriteSubject: "Math",
              workingCompany: "Google",
              jobPosition: "Software Engineer",
              lineOfWork: "IT",
              cpeModel: "CPE 35",
              salary: "100,000",
              nation: "USA",
              course: "Regular",
              role: "user",
              createdAt: new Date().toISOString()
            },
            {
              firstName: "Jane",
              lastName: "Smith",
              email: "jane.smith@example.com",
              phoneNumber: "098-765-4321",
              studentID: "64070501002",
              favoriteSubject: "Science",
              workingCompany: "Amazon",
              jobPosition: "Data Scientist",
              lineOfWork: "AI",
              cpeModel: "CPE 35",
              salary: "120,000",
              nation: "UK",
              course: "Regular",
              role: "user",
              createdAt: new Date().toISOString()
            },
            {
              firstName: "Alice",
              lastName: "Williams",
              email: "alice.williams@example.com",
              phoneNumber: "555-555-1234",
              studentID: "64070501003",
              favoriteSubject: "Physics",
              workingCompany: "Microsoft",
              jobPosition: "Cloud Engineer",
              lineOfWork: "Cloud",
              cpeModel: "CPE 35",
              salary: "110,000",
              nation: "Canada",
              course: "INTER",
              role: "user",
              createdAt: new Date().toISOString()
            },
            {
              firstName: "Bob",
              lastName: "Johnson",
              email: "bob.johnson@example.com",
              phoneNumber: "555-123-4567",
              studentID: "64070501004",
              favoriteSubject: "Chemistry",
              workingCompany: "Meta (Facebook)",
              jobPosition: "Full Stack Developer",
              lineOfWork: "Web",
              cpeModel: "CPE 35",
              salary: "90,000",
              nation: "Australia",
              course: "HDS",
              role: "moderator",
              createdAt: new Date().toISOString()
            },
            {
              firstName: "Charlie",
              lastName: "Brown",
              email: "charlie.brown@example.com",
              phoneNumber: "777-888-9999",
              studentID: "64070501005",
              favoriteSubject: "Music",
              workingCompany: "Tesla",
              jobPosition: "Embedded Engineer",
              lineOfWork: "IoT",
              cpeModel: "CPE 35",
              salary: "95,000",
              nation: "Germany",
              course: "RC",
              role: "admin",
              createdAt: new Date().toISOString()
            },
          ];
          // Save default data using SharedDataService
          SharedDataService.saveTableData(defaultData);
          setTableData(defaultData);
        } else {
          setTableData(data);
        }
      };
      
      // Load initial data
      loadData();
      
      // Set up listener for data changes from other components
      const unsubscribe = SharedDataService.onDataUpdated(() => {
        // Reload data when it changes
        loadData();
      });
      
      // Load user profile if exists
      const userProfileData = localStorage.getItem("userProfile");
      if (userProfileData) {
        setUserProfile(JSON.parse(userProfileData));
      }
      
      setIsLoading(false);
      
      // Clean up event listener on component unmount
      return () => unsubscribe();
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Event handlers
  const handleCPEChange = (event) => setSelectedCPE(event.target.value);
  const handleCourseChange = (event) => setSelectedCourse(event.target.value);
  const handleSearch = (event) => setSearchQuery(event.target.value.toLowerCase());

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
    const isMatchSearchQuery = Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchQuery)
    );
    return isMatchCPE && isMatchCourse && isMatchSearchQuery;
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

            <div className="mb-4">
              <input
                type="text"
                placeholder="Search by any field"
                className="input input-bordered w-full bg-white rounded-lg p-2"
                onChange={handleSearch}
              />
            </div>

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
                            className="bg-blue-600 text-white font-bold py-1 px-4 rounded-lg hover:bg-blue-700 transition-all"
                          >
                            View
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
                        No data found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
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