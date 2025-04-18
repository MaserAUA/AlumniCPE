import React, { useState } from "react";
import { 
  FaUserCircle, 
  FaSearch, 
  FaTimesCircle, 
  FaEnvelope, 
  FaPhone, 
  FaIdCard
} from "react-icons/fa";

const Findmycpe = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    model: "",
    email: "",
    phone: "",
  });
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const dummyData = [
    {
      firstName: "John",
      lastName: "Doe",
      model: "35",
      email: "johndoe@example.com",
      phone: "1234567890",
      department: "IT",
      lastSeen: "2024-03-15"
    },
    {
      firstName: "Jane",
      lastName: "Smith",
      model: "36",
      email: "janesmith@example.com",
      phone: "0987654321",
      department: "Computer Science",
      lastSeen: "2024-03-20"
    },
    {
      firstName: "Alice",
      lastName: "Johnson",
      model: "35",
      email: "alice@example.com",
      phone: "1112223333",
      department: "Cybersecurity",
      lastSeen: "2024-03-25"
    },
    {
      firstName: "Robert",
      lastName: "Williams",
      model: "37",
      email: "robert@example.com",
      phone: "4445556666",
      department: "Data Science",
      lastSeen: "2024-03-22"
    },
    {
      firstName: "Emily",
      lastName: "Brown",
      model: "36",
      email: "emily@example.com",
      phone: "7778889999",
      department: "Computer Engineering",
      lastSeen: "2024-03-10"
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setIsSearching(true);
    setHasSearched(true);

    // เพิ่มหน่วงเวลาเล็กน้อยเพื่อแสดงสถานะกำลังค้นหา
    setTimeout(() => {
      const filteredData = dummyData.filter((person) =>
        Object.keys(formData).some((key) =>
          formData[key].toLowerCase() === ""
            ? false
            : person[key]?.toLowerCase().includes(formData[key].toLowerCase())
        )
      );
      setSearchResults(filteredData);
      setIsSearching(false);
    }, 600);
  };

  const clearForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      model: "",
      email: "",
      phone: "",
    });
    setSearchResults([]);
    setHasSearched(false);
  };

  // ตรวจสอบว่ามีข้อมูลในฟอร์มหรือไม่
  const isFormEmpty = Object.values(formData).every(val => val === "");

  return (
    <div className="bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 min-h-screen flex items-center justify-center p-6">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl w-full max-w-6xl p-8 lg:p-10 flex flex-col lg:flex-row items-center lg:items-start space-y-8 lg:space-y-0 lg:space-x-12">
        {/* Left Section - Search Form */}
        <div className="w-full lg:w-1/2 flex flex-col items-center">
          <div className="flex items-center space-x-3 mb-8">
            <FaUserCircle size={45} className="text-blue-600" />
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Find My CPE
            </h1>
          </div>
          
          <form className="space-y-6 w-full px-4 sm:px-8" onSubmit={handleSearch}>
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500">
                <FaUserCircle />
              </div>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-gray-300 bg-white p-4 pl-12
                       placeholder-gray-400 text-gray-700 focus:outline-none focus:ring-2 
                       focus:ring-blue-500 focus:border-transparent shadow-sm
                       transition-all duration-300 hover:shadow-md"
              />
            </div>
            
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500">
                <FaUserCircle />
              </div>
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-gray-300 bg-white p-4 pl-12
                       placeholder-gray-400 text-gray-700 focus:outline-none focus:ring-2 
                       focus:ring-blue-500 focus:border-transparent shadow-sm
                       transition-all duration-300 hover:shadow-md"
              />
            </div>
            
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500">
                <FaIdCard />
              </div>
              <input
                type="text"
                name="model"
                placeholder="Model Number"
                value={formData.model}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-gray-300 bg-white p-4 pl-12 pr-12
                       placeholder-gray-400 text-gray-700 focus:outline-none focus:ring-2 
                       focus:ring-blue-500 focus:border-transparent shadow-sm
                       transition-all duration-300 hover:shadow-md"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                CPE
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500">
                <FaEnvelope />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-gray-300 bg-white p-4 pl-12
                       placeholder-gray-400 text-gray-700 focus:outline-none focus:ring-2 
                       focus:ring-blue-500 focus:border-transparent shadow-sm
                       transition-all duration-300 hover:shadow-md"
              />
            </div>
            
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500">
                <FaPhone />
              </div>
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-gray-300 bg-white p-4 pl-12
                       placeholder-gray-400 text-gray-700 focus:outline-none focus:ring-2 
                       focus:ring-blue-500 focus:border-transparent shadow-sm
                       transition-all duration-300 hover:shadow-md"
              />
            </div>
            
            <div className="flex space-x-4">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold p-4 rounded-xl
                         hover:from-blue-700 hover:to-indigo-700 transition duration-300 shadow-lg
                         flex items-center justify-center space-x-2 disabled:opacity-70"
                disabled={isSearching}
              >
                {isSearching ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <FaSearch className="text-lg" />
                )}
                <span>{isSearching ? "Searching..." : "Search"}</span>
              </button>
              
              {!isFormEmpty && (
                <button
                  type="button"
                  onClick={clearForm}
                  className="px-6 bg-gray-200 text-gray-700 font-semibold rounded-xl
                           hover:bg-gray-300 transition duration-300 flex items-center justify-center"
                >
                  <FaTimesCircle className="text-lg" />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right Section - Search Results */}
        <div className="w-full lg:w-1/2 bg-gray-50/90 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
              <FaSearch className="text-blue-600" />
              <span>Search Results</span>
            </h2>
            
            {searchResults.length > 0 && (
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {searchResults.length} Found
              </span>
            )}
          </div>
          
          {isSearching ? (
            <div className="flex flex-col items-center justify-center py-16">
              <svg className="animate-spin h-12 w-12 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-gray-600">Searching for matches...</p>
            </div>
          ) : hasSearched ? (
            searchResults.length > 0 ? (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {searchResults.map((result, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-xl shadow-md border border-gray-100 
                             hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">
                          {result.firstName} {result.lastName}
                        </h3>
                        <p className="text-gray-500 flex items-center mt-1">
                          <FaIdCard className="mr-2 text-blue-500" />
                          CPE Model: {result.model}
                        </p>
                      </div>
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                        Active
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-start space-x-2">
                        <FaEnvelope className="mt-0.5 text-blue-500" />
                        <div>
                          <p className="text-gray-500">Email</p>
                          <p className="text-gray-700 font-medium">{result.email}</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <FaPhone className="mt-0.5 text-blue-500" />
                        <div>
                          <p className="text-gray-500">Phone</p>
                          <p className="text-gray-700 font-medium">
                            {result.phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')}
                          </p>
                        </div>
                      </div>
                      {result.department && (
                        <div className="flex items-start space-x-2">
                          <FaUserCircle className="mt-0.5 text-blue-500" />
                          <div>
                            <p className="text-gray-500">Department</p>
                            <p className="text-gray-700 font-medium">{result.department}</p>
                          </div>
                        </div>
                      )}
                      {result.lastSeen && (
                        <div className="flex items-start space-x-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mt-0.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <div>
                            <p className="text-gray-500">Last Seen</p>
                            <p className="text-gray-700 font-medium">{result.lastSeen}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-8 text-center shadow-md border border-gray-100">
                <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No Results Found</h3>
                <p className="text-gray-500">We couldn't find any matches for your search criteria.</p>
                <p className="text-gray-400 text-sm mt-2">Try adjusting your search terms.</p>
                <button
                  onClick={clearForm}
                  className="mt-4 px-4 py-2 bg-blue-100 text-blue-700 font-medium rounded-lg hover:bg-blue-200 transition-colors"
                >
                  Clear Search
                </button>
              </div>
            )
          ) : (
            <div className="bg-white rounded-xl p-8 text-center shadow-md border border-gray-100">
              <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Looking for Someone?</h3>
              <p className="text-gray-500">Fill in the search form to find CPE members.</p>
              <p className="text-gray-400 text-sm mt-2">You can search by name, model number, or contact info.</p>
            </div>
          )}
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        *::-webkit-scrollbar {
          width: 8px;
        }
        *::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        *::-webkit-scrollbar-thumb {
          background: #c5d3e8;
          border-radius: 10px;
        }
        *::-webkit-scrollbar-thumb:hover {
          background: #a4b9d9;
        }
      `}</style>
    </div>
  );
};

export default Findmycpe;