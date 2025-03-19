import React, { useState, useEffect } from 'react';
import { FaExclamationTriangle, FaTrash, FaEdit, FaEye, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function AdminReports() {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all'); // all, pending, reviewed, dismissed
  const navigate = useNavigate();

  // Load reports from localStorage on component mount
  useEffect(() => {
    const storedReports = JSON.parse(localStorage.getItem("reportedPosts") || "[]");
    setReports(storedReports);
  }, []);

  // Filter reports based on status
  const filteredReports = reports.filter(report => {
    if (filter === 'all') return true;
    return report.status === filter;
  });

  // Update report status
  const handleUpdateStatus = (reportId, newStatus) => {
    const updatedReports = reports.map(report => 
      report.reportedAt === reportId ? { ...report, status: newStatus } : report
    );
    setReports(updatedReports);
    localStorage.setItem("reportedPosts", JSON.stringify(updatedReports));
    setShowModal(false);
  };

  // Delete report
  const handleDeleteReport = (reportId) => {
    const updatedReports = reports.filter(report => report.reportedAt !== reportId);
    setReports(updatedReports);
    localStorage.setItem("reportedPosts", JSON.stringify(updatedReports));
    setShowModal(false);
  };

  // View reported post
  const handleViewPost = (postId) => {
    // Get post data from localStorage
    const posts = JSON.parse(localStorage.getItem("posts") || "[]");
    const post = posts.find(p => p.id === postId);
    
    if (post) {
      navigate(`/newsdetail`, { state: { post } });
    } else {
      alert("Post not found. It might have been deleted.");
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge style
  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'dismissed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  // Edit post
  const handleEditPost = (postId) => {
    // Get post data from localStorage
    const posts = JSON.parse(localStorage.getItem("posts") || "[]");
    const post = posts.find(p => p.id === postId);
    
    if (post) {
      navigate(`/admin/edit-post/${postId}`, { state: { post } });
    } else {
      alert("Post not found. It might have been deleted.");
    }
  };

  // Delete post
  const handleDeletePost = (postId) => {
    // Get posts from localStorage
    const posts = JSON.parse(localStorage.getItem("posts") || "[]");
    const updatedPosts = posts.filter(p => p.id !== postId);
    
    // Update localStorage
    localStorage.setItem("posts", JSON.stringify(updatedPosts));
    
    // Update reports (mark as resolved)
    const updatedReports = reports.map(report => 
      report.postId === postId ? { ...report, status: 'reviewed', resolution: 'Post deleted' } : report
    );
    setReports(updatedReports);
    localStorage.setItem("reportedPosts", JSON.stringify(updatedReports));
    
    setShowModal(false);
    alert("Post has been deleted successfully.");
  };

  // Get translated reason
  const getReasonText = (reason) => {
    switch(reason) {
      case 'inappropriate': return 'Inappropriate content';
      case 'misinformation': return 'Misinformation';
      case 'spam': return 'Spam/Advertising';
      case 'duplicate': return 'Duplicate post';
      case 'offensive': return 'Offensive language';
      case 'other': return 'Other';
      default: return reason;
    }
  };

  // Get translated status
  const getStatusText = (status) => {
    switch(status) {
      case 'pending': return 'Pending Review';
      case 'reviewed': return 'Reviewed';
      case 'dismissed': return 'Dismissed';
      default: return status;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <FaExclamationTriangle className="text-red-500 mr-2" />
          Inappropriate Content Reports
        </h2>
        
        <div className="flex space-x-2">
          <select 
            className="bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending Review</option>
            <option value="reviewed">Reviewed</option>
            <option value="dismissed">No Issues Found</option>
          </select>
        </div>
      </div>

      {filteredReports.length === 0 ? (
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <p className="text-blue-600">No reports found in this category</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Post</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reported By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReports.map((report) => (
                <tr key={report.reportedAt} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full border ${getStatusBadge(report.status)}`}>
                      {getStatusText(report.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                      {report.postTitle}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">
                      {getReasonText(report.reason)}
                    </div>
                    {report.description && (
                      <div className="text-xs text-gray-400 mt-1 italic truncate max-w-xs">
                        "{report.description}"
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{report.reportedBy}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{formatDate(report.reportedAt)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedReport(report);
                          setShowModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                        title="Manage Report"
                      >
                        <FaEye />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for report details and actions */}
      {showModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-gray-900">Report Details</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Post</p>
                    <p className="font-medium text-gray-900">{selectedReport.postTitle}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className={`inline-flex px-2 py-1 text-xs rounded-full border ${getStatusBadge(selectedReport.status)}`}>
                      {getStatusText(selectedReport.status)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Reason</p>
                    <p className="font-medium text-gray-900">
                      {getReasonText(selectedReport.reason)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Reported By</p>
                    <p className="font-medium text-gray-900">{selectedReport.reportedBy}</p>
                  </div>
                </div>
                
                {selectedReport.description && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Additional Details</p>
                    <p className="text-gray-700 bg-white p-3 rounded border border-gray-200 text-sm mt-1">
                      {selectedReport.description}
                    </p>
                  </div>
                )}
                
                <div>
                  <p className="text-sm text-gray-500">Report Date</p>
                  <p className="font-medium text-gray-900">{formatDate(selectedReport.reportedAt)}</p>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-medium text-gray-900 mb-2">Actions</h4>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <button
                    onClick={() => handleViewPost(selectedReport.postId)}
                    className="flex items-center px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                  >
                    <FaEye className="mr-1" />
                    View Post
                  </button>
                  
                  <button
                    onClick={() => handleEditPost(selectedReport.postId)}
                    className="flex items-center px-3 py-2 bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200"
                  >
                    <FaEdit className="mr-1" />
                    Edit Post
                  </button>
                  
                  <button
                    onClick={() => handleDeletePost(selectedReport.postId)}
                    className="flex items-center px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                  >
                    <FaTrash className="mr-1" />
                    Delete Post
                  </button>
                </div>
                
                <div className="border-t border-gray-200 pt-4 flex justify-between">
                  <button
                    onClick={() => handleDeleteReport(selectedReport.reportedAt)}
                    className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900"
                  >
                    <FaTrash className="mr-1" />
                    Delete This Report
                  </button>
                  
                  <div className="space-x-2">
                    <button
                      onClick={() => handleUpdateStatus(selectedReport.reportedAt, 'dismissed')}
                      className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                    >
                      <FaTimesCircle className="mr-1" />
                      No Issues Found
                    </button>
                    
                    <button
                      onClick={() => handleUpdateStatus(selectedReport.reportedAt, 'reviewed')}
                      className="flex items-center px-3 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                    >
                      <FaCheckCircle className="mr-1" />
                      Mark as Reviewed
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminReports;