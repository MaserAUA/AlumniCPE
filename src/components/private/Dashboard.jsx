import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { 
  FaChartLine, 
  FaEye, 
  FaEyeSlash, 
  FaPlay, 
  FaPause, 
  FaRandom,
  FaChartBar,
  FaDatabase
} from "react-icons/fa";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

// Mock SharedDataService if it doesn't exist yet
if (typeof window !== 'undefined' && !window.SharedDataService) {
  window.SharedDataService = {
    getTableData: () => [],
    saveTableData: () => {},
    onDataUpdated: (callback) => { return () => {}; }
  };
}

const AnimatedDashboard = () => {
  const sections = ["Company", "Job Position", "Line of Work"];
  const [cpe1, setCpe1] = useState("CPE 1");
  const [cpe2, setCpe2] = useState("CPE 36");
  const [currentPointIndex, setCurrentPointIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [visibleDatasets, setVisibleDatasets] = useState({
    [cpe1]: true,
    [cpe2]: true,
  });
  const [theme, setTheme] = useState("blue"); // blue, purple, green, gradient
  const [animationSpeed, setAnimationSpeed] = useState(800); // milliseconds
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [speedLevel, setSpeedLevel] = useState(2); // 1:slowest, 4:fastest
  const [showTooltip, setShowTooltip] = useState(false);

  // Function to try to get SharedDataService or use a mock
  const getSharedService = () => {
    if (typeof window !== 'undefined') {
      return window.SharedDataService || {
        getTableData: () => [],
        saveTableData: () => {},
        onDataUpdated: (callback) => { return () => {}; }
      };
    }
    return {
      getTableData: () => [],
      saveTableData: () => {},
      onDataUpdated: (callback) => { return () => {}; }
    };
  };

  // Load data on component mount
  useEffect(() => {
    const loadData = () => {
      setIsLoading(true);
      
      try {
        // Try to get data from SharedDataService first
        const SharedDataService = getSharedService();
        const data = SharedDataService.getTableData();
        if (data && data.length > 0) {
          setTableData(data);
          setIsLoading(false);
          return;
        }
      } catch (error) {
        console.log("SharedDataService not available, using mock data");
      }
      
      // Default data if nothing exists in the service
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
          cpeModel: "CPE 1",
          salary: "100,000",
          nation: "USA",
          course: "Regular",
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
          cpeModel: "CPE 1",
          salary: "120,000",
          nation: "UK",
          course: "Regular",
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
          cpeModel: "CPE 36",
          salary: "110,000",
          nation: "Canada",
          course: "INTER",
        },
        {
          firstName: "Bob",
          lastName: "Johnson",
          email: "bob.johnson@example.com",
          phoneNumber: "555-123-4567",
          studentID: "64070501004",
          favoriteSubject: "Chemistry",
          workingCompany: "Meta",
          jobPosition: "Full Stack Developer",
          lineOfWork: "Web Development",
          cpeModel: "CPE 36",
          salary: "90,000",
          nation: "Australia",
          course: "HDS",
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
          cpeModel: "CPE 1",
          salary: "95,000",
          nation: "Germany",
          course: "RC",
        },
        {
          firstName: "David",
          lastName: "Miller",
          email: "david.miller@example.com",
          phoneNumber: "444-333-2222",
          studentID: "64070501006",
          favoriteSubject: "Biology",
          workingCompany: "Apple",
          jobPosition: "Product Manager",
          lineOfWork: "Management",
          cpeModel: "CPE 36",
          salary: "130,000",
          nation: "Japan",
          course: "Regular",
        },
        {
          firstName: "Emily",
          lastName: "Wilson",
          email: "emily.wilson@example.com",
          phoneNumber: "222-333-4444",
          studentID: "64070501007",
          favoriteSubject: "Art",
          workingCompany: "Netflix",
          jobPosition: "UX Designer",
          lineOfWork: "Design",
          cpeModel: "CPE 1",
          salary: "105,000",
          nation: "France",
          course: "INTER",
        },
        {
          firstName: "Frank",
          lastName: "Garcia",
          email: "frank.garcia@example.com",
          phoneNumber: "666-777-8888",
          studentID: "64070501008",
          favoriteSubject: "Economics",
          workingCompany: "Google",
          jobPosition: "Data Analyst",
          lineOfWork: "Data",
          cpeModel: "CPE 36",
          salary: "98,000",
          nation: "Spain",
          course: "HDS",
        },
        {
          firstName: "Grace",
          lastName: "Martinez",
          email: "grace.martinez@example.com",
          phoneNumber: "111-222-3333",
          studentID: "64070501009",
          favoriteSubject: "History",
          workingCompany: "IBM",
          jobPosition: "Backend Developer",
          lineOfWork: "Software Development",
          cpeModel: "CPE 1",
          salary: "115,000",
          nation: "Mexico",
          course: "RC",
        },
        {
          firstName: "Henry",
          lastName: "Lee",
          email: "henry.lee@example.com",
          phoneNumber: "999-888-7777",
          studentID: "64070501010",
          favoriteSubject: "Geography",
          workingCompany: "Salesforce",
          jobPosition: "Sales Engineer",
          lineOfWork: "Sales",
          cpeModel: "CPE 36",
          salary: "125,000",
          nation: "South Korea",
          course: "Regular",
        },
      ];
      
      setTableData(defaultData);
      
      // Try to save default data to SharedDataService
      try {
        const SharedDataService = getSharedService();
        SharedDataService.saveTableData(defaultData);
      } catch (error) {
        console.log("SharedDataService not available for saving");
      }
      
      setIsLoading(false);
    };
    
    // Load data
    loadData();
    
    // Try to set up listener for data changes from other components
    try {
      const SharedDataService = getSharedService();
      const unsubscribe = SharedDataService.onDataUpdated(() => {
        // Reload data when it changes
        loadData();
      });
      
      return () => {
        try {
          unsubscribe();
        } catch (error) {
          console.log("Error unsubscribing from SharedDataService");
        }
      };
    } catch (error) {
      console.log("SharedDataService onDataUpdated not available");
    }
  }, []);

  // Filter data based on selected CPE models
  const filteredData = tableData.filter(
    (item) => item.cpeModel === cpe1 || item.cpeModel === cpe2
  );

  // Get colors based on theme
  const getColors = () => {
    switch(theme) {
      case 'purple':
        return {
          primary: { border: 'rgb(124, 58, 237)', background: 'rgba(124, 58, 237, 0.5)' },
          secondary: { border: 'rgb(236, 72, 153)', background: 'rgba(236, 72, 153, 0.5)' },
          accent: 'from-violet-600 to-fuchsia-700'
        };
      case 'green':
        return {
          primary: { border: 'rgb(5, 150, 105)', background: 'rgba(5, 150, 105, 0.5)' },
          secondary: { border: 'rgb(245, 158, 11)', background: 'rgba(245, 158, 11, 0.5)' },
          accent: 'from-emerald-600 to-teal-700'
        };
      case 'gradient':
        return {
          primary: { border: 'rgb(88, 28, 135)', background: 'rgba(88, 28, 135, 0.5)' },
          secondary: { border: 'rgb(190, 24, 93)', background: 'rgba(190, 24, 93, 0.5)' },
          accent: 'from-indigo-800 via-purple-800 to-pink-800'
        };
      case 'blue':
      default:
        return {
          primary: { border: 'rgb(53, 162, 235)', background: 'rgba(53, 162, 235, 0.5)' },
          secondary: { border: 'rgb(255, 99, 132)', background: 'rgba(255, 99, 132, 0.5)' },
          accent: 'from-blue-600 to-indigo-700'
        };
    }
  };

  const colors = getColors();

  // Get maximum number of points across all charts
  const getMaxPointsCount = () => {
    let maxPoints = 0;
    
    sections.forEach(section => {
      const getFieldBySection = (item) => {
        switch (section) {
          case "Company":
            return item.workingCompany;
          case "Job Position":
            return item.jobPosition;
          case "Line of Work":
            return item.lineOfWork;
          default:
            return "";
        }
      };
      
      // Get unique labels for the section
      const labels = Array.from(
        new Set(filteredData.map((item) => getFieldBySection(item)))
      );
      
      maxPoints = Math.max(maxPoints, labels.length);
    });
    
    return maxPoints || 1; // Ensure at least 1 to avoid division by zero
  };

  // Prepare chart data
  const prepareChartData = (section) => {
    const getFieldBySection = (item) => {
      switch (section) {
        case "Company":
          return item.workingCompany;
        case "Job Position":
          return item.jobPosition;
        case "Line of Work":
          return item.lineOfWork;
        default:
          return "";
        }
    };

    // Get unique labels for the section
    const labels = Array.from(
      new Set(filteredData.map((item) => getFieldBySection(item)))
    );

    // Count occurrences for each CPE model
    const datasets = [cpe1, cpe2].map((cpe, index) => {
      const counts = labels.map(
        (label) =>
          filteredData.filter(
            (item) =>
              getFieldBySection(item) === label && item.cpeModel === cpe
          ).length
      );

      // Only show data up to current animation point
      const visibleDataPoints = counts.map((count, i) => {
        if (i <= currentPointIndex) {
          return count;
        }
        return null; // null will create a gap in the line
      });

      return {
        label: cpe,
        data: visibleDataPoints,
        borderColor: index === 0 ? colors.primary.border : colors.secondary.border,
        backgroundColor: index === 0 ? colors.primary.background : colors.secondary.background,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 9,
        borderWidth: 3,
        borderDash: index === 1 ? [] : [],
        hidden: !visibleDatasets[cpe],
        pointBackgroundColor: index === 0 ? colors.primary.border : colors.secondary.border,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointShadowOffsetX: 1,
        pointShadowOffsetY: 1,
        pointShadowBlur: 5,
        pointShadowColor: 'rgba(0, 0, 0, 0.3)',
      };
    });

    return {
      labels,
      datasets,
    };
  };

  // Reset visibility when CPE changes
  useEffect(() => {
    setVisibleDatasets({
      [cpe1]: true,
      [cpe2]: true,
    });
  }, [cpe1, cpe2]);

  // Point-by-point animation effect
  useEffect(() => {
    if (isAnimating && !isPaused) {
      const maxPoints = getMaxPointsCount();
      
      const interval = setInterval(() => {
        setCurrentPointIndex(prevIndex => {
          const nextIndex = prevIndex + 1;
          
          if (nextIndex >= maxPoints) {
            clearInterval(interval);
            setIsAnimating(false);
            return maxPoints - 1;
          }
          
          return nextIndex;
        });
      }, animationSpeed);

      return () => clearInterval(interval);
    }
  }, [isAnimating, isPaused, animationSpeed]);

  // Start animation when CPE selection changes
  useEffect(() => {
    setCurrentPointIndex(0);
    setIsAnimating(true);
    setIsPaused(false);
  }, [cpe1, cpe2]);

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 600, // faster animation for each point
      easing: 'easeOutQuart',
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
          font: {
            size: 12,
            weight: 'bold',
          },
          color: '#4B5563',
        },
        grid: {
          color: 'rgba(156, 163, 175, 0.2)',
        },
      },
      x: {
        ticks: {
          font: {
            size: 12,
            weight: 'bold',
          },
          color: '#4B5563',
        },
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false, // Hide default legend as we'll create our own
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleFont: {
          size: 13,
          weight: 'bold',
        },
        bodyFont: {
          size: 12,
        },
        padding: 12,
        cornerRadius: 8,
        boxPadding: 6,
        displayColors: true,
        callbacks: {
          label: function(context) {
            const value = context.parsed.y;
            if (value === null) return "";
            const dataIndex = context.dataIndex;
            const datasetIndex = context.datasetIndex;
            const label = context.dataset.label;
            return `${label}: ${Math.round(value)}`;
          }
        }
      },
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    elements: {
      line: {
        cubicInterpolationMode: 'monotone',
      }
    },
    transitions: {
      active: {
        animation: {
          duration: 400
        }
      }
    }
  };

  // Handle CPE selection change
  const handleCpe1Change = (e) => {
    setCpe1(e.target.value);
  };

  const handleCpe2Change = (e) => {
    setCpe2(e.target.value);
  };

  // Restart animation
  const handleRestartAnimation = () => {
    setCurrentPointIndex(0);
    setIsAnimating(true);
    setIsPaused(false);
  };

  // Toggle animation pause
  const togglePause = () => {
    if (!isAnimating && isPaused) {
      // If animation completed and paused, restart
      handleRestartAnimation();
    } else {
      setIsPaused(!isPaused);
    }
  };

  // Toggle dataset visibility
  const toggleDatasetVisibility = (cpe) => {
    setVisibleDatasets(prev => ({
      ...prev,
      [cpe]: !prev[cpe]
    }));
  };

  // Change theme
  const changeTheme = () => {
    const themes = ['blue', 'purple', 'green', 'gradient'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  // Change animation speed
  const changeAnimationSpeed = () => {
    const speeds = [1200, 800, 500, 300];
    const currentIndex = speeds.indexOf(animationSpeed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    setAnimationSpeed(speeds[nextIndex]);
    setSpeedLevel(nextIndex + 1);
  };

  // Get the speed label
  const getSpeedLabel = () => {
    const labels = ["Slow", "Normal", "Fast", "Very Fast"];
    return labels[speedLevel - 1];
  };

  // Count by type and CPE model
  const getAnalyticsCounts = () => {
    const totalStudents = tableData.length;
    const totalCpe1 = tableData.filter(item => item.cpeModel === cpe1).length;
    const totalCpe2 = tableData.filter(item => item.cpeModel === cpe2).length;
    
    // Count by course
    const courses = ["Regular", "INTER", "HDS", "RC"];
    const courseCounts = {};
    
    courses.forEach(course => {
      courseCounts[course] = {
        [cpe1]: tableData.filter(item => item.cpeModel === cpe1 && item.course === course).length,
        [cpe2]: tableData.filter(item => item.cpeModel === cpe2 && item.course === course).length
      };
    });
    
    return {
      totalStudents,
      totalCpe1,
      totalCpe2,
      courseCounts
    };
  };

  const analytics = getAnalyticsCounts();

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      ) : (
        <>
          {/* Header Section */}
          <div className={`bg-gradient-to-r ${colors.accent} text-white p-6 rounded-xl shadow-lg mb-8 text-center w-full md:w-3/4 mx-auto transform transition-all duration-500 hover:scale-[1.01] hover:shadow-xl`}>
            <div className="flex items-center justify-center gap-2 mb-2">
              <FaChartBar className="text-2xl" />
              <h1 className="text-3xl font-bold tracking-tight">Interactive Data Dashboard</h1>
            </div>
            <p className="mt-3 opacity-80 font-light text-lg">
              Visualizing student data with animated progressive line charts
            </p>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                <div className="text-sm opacity-70">Total Students</div>
                <div className="text-2xl font-bold">{analytics.totalStudents}</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                <div className="text-sm opacity-70">{cpe1} Students</div>
                <div className="text-2xl font-bold">{analytics.totalCpe1}</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                <div className="text-sm opacity-70">{cpe2} Students</div>
                <div className="text-2xl font-bold">{analytics.totalCpe2}</div>
              </div>
            </div>
          </div>

          {/* Controls Section */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 bg-white p-6 rounded-xl shadow-md w-full md:w-3/4 mx-auto backdrop-blur-sm bg-white/90 border border-gray-100">
            <div className="flex flex-wrap items-center gap-4 justify-center sm:justify-start">
              <div className="flex items-center gap-3">
                <label className="text-gray-700 font-medium">First CPE:</label>
                <select
                  value={cpe1}
                  onChange={handleCpe1Change}
                  className="p-2 rounded-lg bg-white text-gray-700 font-semibold shadow-sm border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {Array.from({ length: 38 }, (_, i) => (
                    <option key={i} value={`CPE ${i + 1}`}>
                      CPE {i + 1}
                    </option>
                  ))}
                </select>
              </div>
              
              <span className="text-lg font-bold flex items-center mx-2">vs</span>
              
              <div className="flex items-center gap-3">
                <label className="text-gray-700 font-medium">Second CPE:</label>
                <select
                  value={cpe2}
                  onChange={handleCpe2Change}
                  className="p-2 rounded-lg bg-white text-gray-700 font-semibold shadow-sm border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {Array.from({ length: 38 }, (_, i) => (
                    <option key={i} value={`CPE ${i + 1}`}>
                      CPE {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 justify-center sm:justify-end">
              <button
                onClick={togglePause}
                className={`px-4 py-2 rounded-lg shadow text-white transition-all duration-300 transform active:scale-95 flex items-center gap-2 ${
                  isPaused ? "bg-green-600 hover:bg-green-700" : "bg-amber-500 hover:bg-amber-600"
                }`}
              >
                {isPaused ? <FaPlay /> : <FaPause />}
                <span>{isPaused ? "Resume" : "Pause"}</span>
              </button>
              
              <button
                onClick={handleRestartAnimation}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition-all duration-300 transform active:scale-95 flex items-center gap-2"
              >
                <FaChartLine /> Replay
              </button>
              
              <button
                onClick={changeTheme}
                className="p-2 bg-gray-700 text-white rounded-lg shadow hover:bg-gray-800 transition-all duration-300 transform active:scale-95"
                title="Change theme"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </button>
              
              <button
                onClick={changeAnimationSpeed}
                className="flex items-center gap-2 px-3 py-2 bg-gray-700 text-white rounded-lg shadow hover:bg-gray-800 transition-all duration-300 transform active:scale-95"
                title="Change animation speed"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <div className="flex flex-col items-start text-xs">
                  <span>Speed</span>
                  <span className="font-bold">{getSpeedLabel()}</span>
                </div>
              </button>
            </div>
          </div>

          {/* Animation Progress & Dataset Controls */}
          <div className="w-full md:w-3/4 mx-auto mb-6 bg-white p-4 rounded-xl shadow-md backdrop-blur-sm bg-white/90 border border-gray-100">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isAnimating ? (isPaused ? "bg-amber-500" : "bg-green-500 animate-pulse") : "bg-blue-500"}`}></div>
                <p className="text-sm text-gray-600 font-medium">
                  {isAnimating 
                    ? (isPaused ? "Animation Paused" : "Displaying Data...") 
                    : "Animation Complete"}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleDatasetVisibility(cpe1)}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm border transition-all duration-300 transform hover:scale-105 ${
                      visibleDatasets[cpe1]
                        ? "bg-blue-100 border-blue-300 text-blue-700"
                        : "bg-gray-100 border-gray-300 text-gray-500"
                    }`}
                  >
                    {visibleDatasets[cpe1] ? <FaEye className="text-blue-500" /> : <FaEyeSlash />}
                    <span 
                      className="font-medium"
                      style={{ color: visibleDatasets[cpe1] ? colors.primary.border : "gray" }}
                    >
                      {cpe1}
                    </span>
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleDatasetVisibility(cpe2)}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm border transition-all duration-300 transform hover:scale-105 ${
                      visibleDatasets[cpe2]
                        ? "bg-red-100 border-red-300 text-red-700"
                        : "bg-gray-100 border-gray-300 text-gray-500"
                    }`}
                  >
                    {visibleDatasets[cpe2] ? <FaEye className="text-red-500" /> : <FaEyeSlash />}
                    <span 
                      className="font-medium"
                      style={{ color: visibleDatasets[cpe2] ? colors.secondary.border : "gray" }}
                    >
                      {cpe2}
                    </span>
                  </button>
                </div>
              </div>
            </div>
            <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ease-out ${theme === 'gradient' ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600' : `bg-${theme === 'purple' ? 'purple' : (theme === 'green' ? 'emerald' : 'blue')}-600`}`}
                style={{ 
                  width: `${isAnimating || currentPointIndex > 0
                    ? ((currentPointIndex + 1) / getMaxPointsCount()) * 100
                    : 0}%` 
                }}
              ></div>
            </div>
            <div className="flex justify-between items-center mt-1">
              <div className="text-xs text-gray-500">
                Point {currentPointIndex + 1} of {getMaxPointsCount()}
              </div>
              <div className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full flex items-center gap-1">
                <span>Animation Speed:</span>
                <span className="font-bold">{getSpeedLabel()}</span>
                <div className="w-16 h-2 bg-gray-300 rounded-full ml-1">
                  <div 
                    className={`h-2 rounded-full ${
                      speedLevel === 1 ? "bg-blue-400 w-1/4" :
                      speedLevel === 2 ? "bg-green-400 w-2/4" :
                      speedLevel === 3 ? "bg-yellow-400 w-3/4" :
                      "bg-red-400 w-full"
                    }`}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sections.map((section, index) => {
              const chartData = prepareChartData(section);
              
              return (
                <div
                  key={index}
                  className="bg-white shadow-lg rounded-xl p-6 text-center hover:shadow-xl transition-all duration-500 transform hover:scale-[1.02] backdrop-blur-sm bg-white/90 border border-gray-100"
                >
                  <h2 className="text-lg font-semibold mb-4 text-gray-800">{section}</h2>
                  
                  {/* Custom Legend */}
                  <div className="flex justify-end mb-2 gap-3">
                    {[cpe1, cpe2].map((cpe, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-1 text-xs font-medium"
                      >
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: idx === 0
                              ? colors.primary.border
                              : colors.secondary.border,
                            opacity: visibleDatasets[cpe] ? 1 : 0.3,
                          }}
                        ></div>
                        <span
                          style={{
                            color: idx === 0
                              ? colors.primary.border
                              : colors.secondary.border,
                            opacity: visibleDatasets[cpe] ? 1 : 0.5,
                          }}
                        >
                          {cpe}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Line Chart */}
                  <div className="h-64 mb-4 flex items-center justify-center overflow-hidden rounded-lg shadow-inner bg-gray-50">
                    <Line
                      data={chartData}
                      options={options}
                    />
                  </div>
                  
                  {/* Data Point Info */}
                  <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100 flex justify-between items-center">
                    <span className="font-medium">
                      {isAnimating
                        ? (isPaused ? "Paused" : "Animating...")
                        : "Complete"}
                    </span>
                    <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">
                      {chartData.labels.length} data points
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Course Distribution Section */}
          <div className="w-full md:w-3/4 mx-auto mt-8 bg-white p-6 rounded-xl shadow-md backdrop-blur-sm bg-white/90 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <FaDatabase className="text-gray-600" />
                Course Distribution
              </h2>
              <div className="flex items-center gap-3">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.primary.border }}></div>
                  <span className="text-xs ml-1 font-medium" style={{ color: colors.primary.border }}>{cpe1}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.secondary.border }}></div>
                  <span className="text-xs ml-1 font-medium" style={{ color: colors.secondary.border }}>{cpe2}</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {["Regular", "INTER", "HDS", "RC"].map((course, index) => {
                const courseData = analytics.courseCounts[course];
                const totalInCourse = courseData[cpe1] + courseData[cpe2];
                const percentage1 = totalInCourse ? Math.round((courseData[cpe1] / totalInCourse) * 100) : 0;
                const percentage2 = totalInCourse ? Math.round((courseData[cpe2] / totalInCourse) * 100) : 0;
                
                return (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-100 shadow-sm hover:shadow transition-all">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold text-gray-700">{course}</h3>
                      <span className="text-xs bg-white px-2 py-1 rounded-full border border-gray-200">
                        {totalInCourse} students
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span style={{ color: colors.primary.border }}>{cpe1}</span>
                          <span className="font-medium">{courseData[cpe1]} ({percentage1}%)</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-500"
                            style={{ 
                              width: `${percentage1}%`,
                              backgroundColor: colors.primary.border
                            }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span style={{ color: colors.secondary.border }}>{cpe2}</span>
                          <span className="font-medium">{courseData[cpe2]} ({percentage2}%)</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-500"
                            style={{ 
                              width: `${percentage2}%`,
                              backgroundColor: colors.secondary.border
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Interactive Data Dashboard • {new Date().getFullYear()}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default AnimatedDashboard;