import React, { useState, useRef } from 'react';
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
import { useGetAcitivityStat } from '../../hooks/UseStat';
import { useRecentEvents } from '../../hooks/usePost';
import moment from 'moment';

const AdminDashboard = () => {
  const dashboardRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);
  const { data: activityData, isLoading: activityLoading } = useGetAcitivityStat();
  const { data: recentEvents, isLoading: eventsLoading } = useRecentEvents();
  
  // Get latest event info
  const latestEvent = recentEvents?.[0];
  const latestEventTime = latestEvent?.startDateObj ? moment(latestEvent.startDateObj).fromNow() : 'No recent events';

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

  if (activityLoading || eventsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div ref={dashboardRef} className="p-6">
      {/* Export Button */}
      <div className="flex justify-end mb-4">
        <ExportButton isExporting={isExporting} onClick={exportToPDF} />
      </div>

      {/* Stats Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Active Users"
          value={activityData?.user_count || 0}
          icon={<FiUsers className="text-blue-600 text-xl" />}
          iconBgColor="bg-blue-100"
          additionalInfo="Users active today"
        />
        <StatsCard
          title="Alumni"
          value={activityData?.alumni_count || 0}
          icon={<FiUserPlus className="text-rose-600 text-xl" />}
          additionalInfo="Total registered alumni"
          iconBgColor="bg-rose-100"
        />
        <StatsCard
          title="Events"
          value={activityData?.event_count || 0}
          icon={<FiActivity className="text-emerald-600 text-xl" />}
          additionalInfo={`Latest event: ${latestEventTime}`}
          iconBgColor="bg-emerald-100"
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
