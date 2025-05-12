import React, { useState, useEffect, useRef } from 'react';
import { 
  FiUsers, FiUserPlus, FiCalendar, FiMessageSquare, 
  FiActivity, FiAlertCircle, FiArrowUp, 
  FiArrowDown, FiRefreshCw, FiBarChart2, 
  FiClock, FiDownload
} from 'react-icons/fi';
import StatsCard from '../../components/admin/Dashboard/StatsCard';
import UserGrowthChart from '../../components/admin/Dashboard/UserGrowthChart';
import PostEngagement from '../../components/admin/Dashboard/PostEngagement';
import WordCloudChart from '../../components/admin/Dashboard/WordCloudChart';
import SalaryDistribution from '../../components/admin/Dashboard/SalaryDistribution';
import UserRegistryChart from '../../components/admin/Dashboard/UserRegistryChart';
import ExportButton from '../../components/admin/Dashboard/ExportButton';
import html2canvas from 'html2canvas';
import { jsPDF } from "jspdf";

const COLORS = ['#3B82F6', '#EC4899', '#F59E0B', '#10B981'];

const AdminDashboard = () => {
  const dashboardRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);
  
  // Activity state
  const [recentActivities] = useState([
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
    // ... other activities
  ]);

  // User stats
  const [userStats] = useState({
    totalUsers: 356,
    newUsersThisMonth: 24,
    activeUsersToday: 87,
    averageSessionTime: '12 minutes',
    changeRate: 8.2
  });

  // Content stats
  const [contentStats] = useState({
    totalPosts: 128,
    postsThisMonth: 18,
    totalComments: 542,
    commentsThisMonth: 86,
    changeRate: 12.5
  });

  // Mock data for charts
  const userGrowthData = [
    { name: 'Jan', users: 210 },
    // ... other months
  ];

  const engagementData = [
    { name: 'Posts', value: 17 },
    { name: 'Comments', value: 70 },
    { name: 'Reports', value: 5 },
    { name: 'Events', value: 8 }
  ];

  const dailyActiveData = [
    { day: 'Sun', users: 62 },
    // ... other days
  ];

  const exportToPDF = async () => {
    if (!dashboardRef.current) return;
    
    try {
      setIsExporting(true);
      
      const canvas = await html2canvas(dashboardRef.current, {
        scale: 1.5,
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      
      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth * ratio, imgHeight * ratio);
      pdf.save('CPE_Alumni_Dashboard.pdf');
      
    } catch (error) {
      console.error('PDF generation error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div ref={dashboardRef} className="p-6">
      {/* Export Button */}
      <div className="flex justify-end mb-4">
        <ExportButton isExporting={isExporting} onClick={exportToPDF} />
      </div>

      {/* Stats Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Users"
          value={userStats.totalUsers}
          icon={<FiUsers className="text-blue-600 text-xl" />}
          changeRate={userStats.changeRate}
          iconBgColor="bg-blue-100"
        />
        <StatsCard
          title="New Users This Month"
          value={userStats.newUsersThisMonth}
          icon={<FiUserPlus className="text-rose-600 text-xl" />}
          additionalInfo="Last updated: Today"
          iconBgColor="bg-rose-100"
        />
        <StatsCard
          title="Active Users Today"
          value={userStats.activeUsersToday}
          icon={<FiActivity className="text-emerald-600 text-xl" />}
          additionalInfo={`Average ${userStats.averageSessionTime} per user`}
          iconBgColor="bg-emerald-100"
        />
        <StatsCard
          title="Total Posts"
          value={contentStats.totalPosts}
          icon={<FiMessageSquare className="text-purple-600 text-xl" />}
          changeRate={contentStats.changeRate}
          iconBgColor="bg-purple-100"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6 my-4">
          <h3 className="text-lg font-semibold text-slate-800 mb-6 mr-4">Alumni Position Distribution</h3>
          <WordCloudChart/>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 my-4">
          <h3 className="text-lg font-semibold text-slate-800 mb-24 mr-4">Salary Distribution</h3>
          <SalaryDistribution/>
        </div>
      </div>


      <div className="bg-white rounded-lg shadow-sm p-6 my-4 w-full h-[500px]">
        <h3 className="text-lg font-semibold text-slate-800 mb-6 mr-4">Post Engagement<span className='text-sm'> by User Generation</span></h3>
        <PostEngagement/>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 my-4 w-full h-[500px]">
        <h3 className="text-lg font-semibold text-slate-800 mb-6 mr-4">User Registry<span className='text-sm'> by User Generation</span></h3>
        <UserRegistryChart/>
      </div>

    </div>
  );
};

export default AdminDashboard;
