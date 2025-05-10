import React, {FC} from 'react';
import { FaEye } from 'react-icons/fa';
import { Post, ReportType } from '../../../models/postType';
import { useGetAllReport } from '../../../hooks/useAdmin'

interface ReportsTableProps {
  // reports: ReportType[];
  onView: (postId: string) => void;
  // isLoading: boolean;
  // error: string | null;
}

const ReportsTable: FC<ReportsTableProps> = ({onView}) => {
  const {data: reports, isLoading} = useGetAllReport()

  const getReasonStyle = (reason: string) => {
    switch (reason) {
      case 'spam': return 'bg-red-100 text-red-800';
      case 'harassment': return 'bg-orange-100 text-orange-800';
      case 'inappropriate': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="bg-blue-50 rounded-lg p-4 text-center">
        <p className="text-blue-600">No reports found</p>
      </div>
    );
  }

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Post</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reporter</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {reports.map((report) => (
          <tr key={report.report_id} className="hover:bg-gray-50">
            <td className="px-6 py-4">
              <div className="text-sm font-medium text-gray-900">
                {report.title}
              </div>
              <div className="text-sm text-gray-500">
                ID: {report.post_id}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">{report.reporter_username}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className={`px-2 py-1 text-xs rounded-full ${getReasonStyle(report.category)}`}>
                {report.category}
              </span>
            </td>
            <td className="px-6 py-4">
              <div className="text-sm text-gray-900 max-w-xs truncate">
                {report.additional}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className={`px-2 py-1 text-xs rounded-full ${
                report.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {report.status}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">
                {new Date(report.created_timestamp).toLocaleDateString()}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div className="flex space-x-2">
                <button
                  onClick={() => onView(report.post_id)}
                  className="text-blue-600 hover:text-blue-900"
                  title="View Post"
                >
                  <FaEye />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ReportsTable;
