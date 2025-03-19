import React, { useState } from "react";
import { 
  FaUserCircle, 
  FaSearch, 
  FaTimesCircle, 
  FaEnvelope, 
  FaPhone, 
  FaIdCard, 
  FaCalendarAlt,
  FaChevronDown,
  FaFilter,
  FaSpinner
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Findmycpe = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    model: "",
    email: "",
    phone: "",
  });
  const [searchResults, setSearchResults] = useState([]);
  const [showClearButton, setShowClearButton] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [advancedSearch, setAdvancedSearch] = useState(false);

  const dummyData = [
    {
      firstName: "John",
      lastName: "Doe",
      model: "35",
      email: "johndoe@example.com",
      phone: "123-456-7890",
      status: "Active",
      lastSeen: "2024-02-18",
      department: "IT",
      graduationYear: "2021"
    },
    {
      firstName: "Jane",
      lastName: "Smith",
      model: "36",
      email: "janesmith@example.com",
      phone: "098-765-4321",
      status: "Inactive",
      lastSeen: "2024-02-15",
      department: "Computer Science",
      graduationYear: "2022"
    },
    {
      firstName: "Alice",
      lastName: "Johnson",
      model: "35",
      email: "alice@example.com",
      phone: "111-222-3333",
      status: "Active",
      lastSeen: "2024-02-19",
      department: "Cybersecurity",
      graduationYear: "2020"
    },
    {
      firstName: "Robert",
      lastName: "Williams",
      model: "37",
      email: "robert@example.com",
      phone: "444-555-6666",
      status: "Active",
      lastSeen: "2024-02-20",
      department: "Data Science",
      graduationYear: "2023"
    },
    {
      firstName: "Emily",
      lastName: "Brown",
      model: "36",
      email: "emily@example.com",
      phone: "777-888-9999",
      status: "Inactive",
      lastSeen: "2024-01-30",
      department: "Computer Engineering",
      graduationYear: "2021"
    }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    setIsSearching(true);
    setHasSearched(true);

    // Simulate API delay
    setTimeout(() => {
      const filteredData = dummyData.filter((person) => {
        return Object.keys(formData).some((key) => {
          const searchValue = formData[key].toLowerCase();
          const dataValue = person[key]?.toLowerCase();
          return searchValue !== "" && dataValue?.includes(searchValue);
        });
      });
      setSearchResults(filteredData);
      setIsSearching(false);
    }, 800);
  };

  const clearForm = (e) => {
    e.preventDefault();
    setFormData({
      firstName: "",
      lastName: "",
      model: "",
      email: "",
      phone: "",
    });
    setSearchResults([]);
    setShowClearButton(false);
    setHasSearched(false);
  };

  const getFilteredResults = () => {
    if (activeFilter === "all") return searchResults;
    return searchResults.filter(result => 
      activeFilter === "active" ? result.status === "Active" : result.status === "Inactive"
    );
  };

  const InputField = ({ name, placeholder, type = "text", icon }) => (
    <div className="relative">
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500">
        {icon}
      </div>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={formData[name]}
        onChange={(e) => {
          const { name, value } = e.target;
          setFormData((prevFormData) => {
            const newFormData = { ...prevFormData, [name]: value };
            const isAnyFieldFilled = Object.values(newFormData).some((val) => val.trim() !== "");
            setShowClearButton(isAnyFieldFilled);
            return newFormData;
          });
        }}
        autoComplete="off"
        className="w-full rounded-xl border border-gray-300 bg-white p-4 pl-12 pr-12
                 placeholder-gray-400 text-gray-700 focus:outline-none focus:ring-2 
                 focus:ring-blue-500 focus:border-transparent shadow-sm
                 transition-all duration-300 hover:shadow-md"
      />
      {name === "model" && (
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
          CPE
        </div>
      )}
    </div>
  );

  const filterOptions = [
    { value: "all", label: "All" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      } 
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 min-h-screen flex items-center justify-center p-6">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl w-full max-w-6xl p-8 lg:p-12 flex flex-col lg:flex-row items-start space-y-8 lg:space-y-0 lg:space-x-12 transition-all duration-500">
        {/* Left Section - Search Form */}
        <div className="w-full lg:w-1/2 flex flex-col items-center">
          <div className="flex items-center space-x-3 mb-8">
            <FaUserCircle size={45} className="text-blue-600" />
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Find My CPE
            </h1>
          </div>
          
          <form onSubmit={handleSearch} className="space-y-5 w-full px-4 sm:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField name="firstName" placeholder="First Name" icon={<FaUserCircle />} />
              <InputField name="lastName" placeholder="Last Name" icon={<FaUserCircle />} />
            </div>
            <InputField name="model" placeholder="Model Number" icon={<FaIdCard />} />
            
            <AnimatePresence>
              {advancedSearch && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5 overflow-hidden"
                >
                  <InputField name="email" placeholder="Email Address" type="email" icon={<FaEnvelope />} />
                  <InputField name="phone" placeholder="Phone Number" type="tel" icon={<FaPhone />} />
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setAdvancedSearch(!advancedSearch)}
                className="flex items-center text-blue-600 font-medium hover:text-blue-800 transition-colors space-x-1"
              >
                <span>{advancedSearch ? "Simple Search" : "Advanced Search"}</span>
                <FaChevronDown className={`transform transition-transform ${advancedSearch ? "rotate-180" : ""}`} />
              </button>
            </div>
            
            <div className="flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold p-4 rounded-xl
                         hover:from-blue-700 hover:to-indigo-700 transition duration-300 shadow-lg
                         flex items-center justify-center space-x-2 disabled:opacity-70"
                disabled={isSearching}
              >
                {isSearching ? (
                  <FaSpinner className="text-lg animate-spin" />
                ) : (
                  <FaSearch className="text-lg" />
                )}
                <span>{isSearching ? "Searching..." : "Search"}</span>
              </motion.button>
              
              {showClearButton && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearForm}
                  className="px-6 bg-gray-200 text-gray-700 font-semibold rounded-xl
                           hover:bg-gray-300 transition duration-300 flex items-center justify-center"
                >
                  <FaTimesCircle className="text-lg" />
                </motion.button>
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
              <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200 p-1">
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setActiveFilter(option.value)}
                    className={`px-3 py-1 text-sm font-medium rounded-md transition-colors
                              ${activeFilter === option.value 
                                ? 'bg-blue-100 text-blue-700' 
                                : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {isSearching ? (
            <div className="flex flex-col items-center justify-center py-16">
              <FaSpinner className="text-4xl text-blue-500 animate-spin mb-4" />
              <p className="text-gray-600">Searching for matches...</p>
            </div>
          ) : hasSearched ? (
            getFilteredResults().length > 0 ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar"
              >
                {getFilteredResults().map((result, index) => (
                  <motion.div
                    variants={itemVariants}
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
                      <span className={`px-3 py-1 rounded-full text-sm font-medium
                                   ${result.status === 'Active' 
                                     ? 'bg-green-100 text-green-700'
                                     : 'bg-red-100 text-red-700'}`}>
                        {result.status}
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
                          <p className="text-gray-700 font-medium">{result.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <FaCalendarAlt className="mt-0.5 text-blue-500" />
                        <div>
                          <p className="text-gray-500">Last Seen</p>
                          <p className="text-gray-700 font-medium">{result.lastSeen}</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <FaUserCircle className="mt-0.5 text-blue-500" />
                        <div>
                          <p className="text-gray-500">Department</p>
                          <p className="text-gray-700 font-medium">{result.department}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl p-8 text-center shadow-md border border-gray-100"
              >
                <img 
                  src="https://illustrations.popsy.co/amber/search-not-found.svg" 
                  alt="No results" 
                  className="w-40 h-40 mx-auto mb-4"
                />
                <h3 className="text-xl font-bold text-gray-800 mb-2">No Results Found</h3>
                <p className="text-gray-500">We couldn't find any matches for your search criteria.</p>
                <p className="text-gray-400 text-sm mt-2">Try adjusting your search terms or clearing filters.</p>
                <button
                  onClick={clearForm}
                  className="mt-4 px-4 py-2 bg-blue-100 text-blue-700 font-medium rounded-lg hover:bg-blue-200 transition-colors"
                >
                  Clear Search
                </button>
              </motion.div>
            )
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-xl p-8 text-center shadow-md border border-gray-100"
            >
              <img 
                src="https://illustrations.popsy.co/amber/detective.svg" 
                alt="Search" 
                className="w-40 h-40 mx-auto mb-4"
              />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Looking for Someone?</h3>
              <p className="text-gray-500">Fill in the search form to find CPE members.</p>
              <p className="text-gray-400 text-sm mt-2">You can search by name, model number, or contact info.</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c5d3e8;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a4b9d9;
        }
      `}</style>
    </div>
  );
};

export default Findmycpe;