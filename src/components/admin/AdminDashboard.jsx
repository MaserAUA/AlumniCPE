import React, { useState, useEffect, useRef } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, 
  Cell, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer 
} from 'recharts';
import { 
  FiUsers, FiCalendar, FiMessageSquare, 
  FiActivity, FiAlertCircle, FiArrowUp, 
  FiArrowDown, FiRefreshCw, FiBarChart2, 
  FiClock, FiDownload
} from 'react-icons/fi';
import PostEngagement from './Dashboard/PostEngagement';
import UserRegistryChart from './Dashboard/UserRegistryChart';
import html2canvas from 'html2canvas';
import { jsPDF } from "jspdf";

function AdminDashboard() {
  const dashboardRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);
  
  // Activity state
  const [recentActivities, setRecentActivities] = useState([
    {
      id: 1,
      type: 'user',
      action: 'New member registered',
      detail: 'John Doe',
      time: '5 minutes ago',
      icon: <FiUsers className="text-emerald-500" />,
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200'
    },
    {
      id: 2,
      type: 'post',
      action: 'New post created',
      detail: 'CPE36 Alumni Reunion 2025',
      time: '30 minutes ago',
      icon: <FiMessageSquare className="text-blue-500" />,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      id: 3,
      type: 'report',
      action: 'Rule violation reported',
      detail: 'Inappropriate comment on "Graduate Registration Question" post',
      time: '2 hours ago',
      icon: <FiAlertCircle className="text-rose-500" />,
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-200'
    },
    {
      id: 4,
      type: 'event',
      action: 'New event created',
      detail: 'Annual Alumni Meeting 2025',
      time: '1 day ago',
      icon: <FiCalendar className="text-purple-500" />,
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      id: 5,
      type: 'system',
      action: 'System update',
      detail: 'User profile system updated',
      time: '2 days ago',
      icon: <FiRefreshCw className="text-amber-500" />,
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200'
    }
  ]);

  // User stats
  const [userStats, setUserStats] = useState({
    totalUsers: 356,
    newUsersThisMonth: 24,
    activeUsersToday: 87,
    averageSessionTime: '12 minutes',
    changeRate: 8.2 // Percentage change from last month
  });

  // Content stats
  const [contentStats, setContentStats] = useState({
    totalPosts: 128,
    postsThisMonth: 18,
    totalComments: 542,
    commentsThisMonth: 86,
    changeRate: 12.5 // Percentage change from last month
  });

  // Mock user growth data for charts
  const userGrowthData = [
    { name: 'Jan', users: 210 },
    { name: 'Feb', users: 230 },
    { name: 'Mar', users: 245 },
    { name: 'Apr', users: 270 },
    { name: 'May', users: 290 },
    { name: 'Jun', users: 300 },
    { name: 'Jul', users: 320 },
    { name: 'Aug', users: 340 },
    { name: 'Sep', users: 356 }
  ];

  // Mock engagement data for charts - fixed distribution to match image
  const engagementData = [
    { name: 'Posts', value: 17 },
    { name: 'Comments', value: 70 },
    { name: 'Reports', value: 5 },
    { name: 'Events', value: 8 }
  ];

  // Mock daily active users
  const dailyActiveData = [
    { day: 'Sun', users: 62 },
    { day: 'Mon', users: 85 },
    { day: 'Tue', users: 92 },
    { day: 'Wed', users: 78 },
    { day: 'Thu', users: 89 },
    { day: 'Fri', users: 95 },
    { day: 'Sat', users: 70 }
  ];

  // Colors for pie chart
  const COLORS = ['#3B82F6', '#EC4899', '#F59E0B', '#10B981'];
  
  // Function to export dashboard as PDF - FIXED VERSION
  const exportToPDF = async () => {
    if (!dashboardRef.current) return;
    
    try {
      setIsExporting(true);
      
      // Create a toast notification
      const createToast = (message, type = 'info') => {
        const toast = document.createElement('div');
        toast.className = `fixed top-4 right-4 ${type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-blue-600'} text-white px-4 py-2 rounded shadow-lg z-50`;
        toast.textContent = message;
        document.body.appendChild(toast);
        return toast;
      };
      
      // Show loading toast
      const loadingToast = createToast('Generating PDF...');
      
      // Wait for React to finish rendering updates
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Capture the dashboard element
      const dashboard = dashboardRef.current;
      
      // Set options for html2canvas
      const canvas = await html2canvas(dashboard, {
        scale: 1.5, // Reduced for performance while maintaining quality
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      // Get canvas data
      const imgData = canvas.toDataURL('image/jpeg', 0.95); // Use JPEG for smaller file size
      
      // Create PDF document of A4 size
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Calculate dimensions
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Calculate image width and height to fit the PDF page
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      
      // Calculate centered position
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10;
      
      // Add image to PDF
      pdf.addImage(imgData, 'JPEG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      
      // If the content is too tall, split across multiple pages
      if (imgHeight * ratio > pdfHeight - 20) {
        let currentPosition = 0;
        const pageHeight = pdfHeight - 20;
        
        // Reset the PDF and start over with multi-page approach
        pdf.deletePage(1);
        
        while (currentPosition < imgHeight) {
          // Add a page
          pdf.addPage();
          
          // Calculate the part of the image to capture for this page
          const heightLeft = imgHeight - currentPosition;
          
          // Add image segment to this page
          pdf.addImage(
            imgData,
            'JPEG',
            imgX,
            -currentPosition * ratio + 10,
            imgWidth * ratio,
            imgHeight * ratio
          );
          
          // Move to next segment
          currentPosition += pageHeight / ratio;
          
          // If there's still content to show, add page crossing indicator
          if (heightLeft > pageHeight / ratio) {
            pdf.setTextColor(100);
            pdf.setFontSize(8);
            pdf.text('(Continued on next page)', pdfWidth / 2, pdfHeight - 10, { align: 'center' });
          }
        }
      }
      
      // Save the PDF with a filename
      pdf.save('CPE_Alumni_Dashboard.pdf');
      
      // Remove loading toast
      document.body.removeChild(loadingToast);
      
      // Show success toast
      const successToast = createToast('PDF downloaded successfully!', 'success');
      
      // Remove success toast after 3 seconds
      setTimeout(() => {
        document.body.removeChild(successToast);
      }, 3000);
      
    } catch (error) {
      console.error('PDF generation error:', error);
      
      // Show error toast
      const errorToast = document.createElement('div');
      errorToast.className = 'fixed top-4 right-4 bg-red-600 text-white px-4 py-2 rounded shadow-lg z-50';
      errorToast.textContent = 'Failed to generate PDF. Please try again.';
      document.body.appendChild(errorToast);
      
      // Remove error toast after 3 seconds
      setTimeout(() => {
        document.body.removeChild(errorToast);
      }, 3000);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div ref={dashboardRef}>
      {/* Export to PDF Button - With enhanced UX */}
      <div className="flex justify-end mb-4">
        <button 
          onClick={exportToPDF}
          disabled={isExporting}
          className={`inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm ${
            isExporting ? 'opacity-75 cursor-not-allowed' : ''
          }`}
        >
          {isExporting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              <FiDownload className="mr-2" />
              Export to PDF
            </>
          )}
        </button>
      </div>
      <PostEngagement/>
      <UserRegistryChart/>

      {/* Stats Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Users Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-slate-500 mb-1">Total Users</h3>
              <p className="text-3xl font-bold text-slate-800">{userStats.totalUsers}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <FiUsers className="text-blue-600 text-xl" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
              <FiArrowUp className="mr-1" />
              {Math.abs(userStats.changeRate)}%
            </span>
            <span className="text-xs text-slate-500 ml-2">from last month</span>
          </div>
        </div>

        {/* New Users This Month Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-slate-500 mb-1">New Users This Month</h3>
              <p className="text-3xl font-bold text-slate-800">{userStats.newUsersThisMonth}</p>
            </div>
            <div className="bg-rose-100 p-3 rounded-lg">
              <FiUserPlus className="text-rose-600 text-xl" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-slate-500">
            <FiCalendar className="mr-1" />
            <span>Last updated: Today</span>
          </div>
        </div>

        {/* Active Users Today Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-slate-500 mb-1">Active Users Today</h3>
              <p className="text-3xl font-bold text-slate-800">{userStats.activeUsersToday}</p>
            </div>
            <div className="bg-emerald-100 p-3 rounded-lg">
              <FiActivity className="text-emerald-600 text-xl" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-slate-500">
            <FiClock className="mr-1" />
            <span>Average {userStats.averageSessionTime} per user</span>
          </div>
        </div>

        {/* Content Stats Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-slate-500 mb-1">Total Posts</h3>
              <p className="text-3xl font-bold text-slate-800">{contentStats.totalPosts}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <FiMessageSquare className="text-purple-600 text-xl" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
              <FiArrowUp className="mr-1" />
              {Math.abs(contentStats.changeRate)}%
            </span>
            <span className="text-xs text-slate-500 ml-2">from last month</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* User Growth Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-slate-800">User Growth</h3>
            <div className="flex items-center space-x-2">
              <select className="text-sm border border-slate-200 rounded-md px-2 py-1">
                <option>This Year</option>
                <option>Last Year</option>
              </select>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart
              data={userGrowthData}
              margin={{
                top: 5,
                right: 20,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  border: 'none' 
                }} 
              />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Daily Active Users */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Daily Active Users</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart
              data={dailyActiveData}
              margin={{
                top: 5,
                right: 10,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  border: 'none' 
                }} 
              />
              <Bar dataKey="users" fill="#818cf8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-slate-800">Recent Activity</h3>
            <div className="flex items-center">
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium focus:outline-none transition-colors">
                View All
              </button>
            </div>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className={`flex items-start p-3 rounded-lg ${activity.bgColor} border ${activity.borderColor}`}>
                <div className="flex-shrink-0 mr-4">
                  {activity.icon}
                </div>
                <div className="flex-grow">
                  <div className="font-medium text-slate-800">{activity.action}</div>
                  <div className="text-sm text-slate-600">{activity.detail}</div>
                  <div className="text-xs text-slate-500 mt-1">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <button className="inline-flex items-center justify-center px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              <FiBarChart2 className="mr-2" />
              View All Activity
            </button>
          </div>
        </div>

        {/* Engagement Distribution - Fixed to match image */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Engagement</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={engagementData}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={80}
                innerRadius={40}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {engagementData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name) => [`${value}%`, name]}
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  border: 'none' 
                }} 
              />
              <Legend 
                iconType="circle" 
                layout="vertical" 
                verticalAlign="bottom" 
                align="center"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// Custom FiUserPlus icon component
const FiUserPlus = (props) => {
  return (
    <svg
      stroke="currentColor"
      fill="none"
      strokeWidth="2"
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="8.5" cy="7" r="4"></circle>
      <line x1="20" y1="8" x2="20" y2="14"></line>
      <line x1="23" y1="11" x2="17" y2="11"></line>
    </svg>
  );
};

export default AdminDashboard;
