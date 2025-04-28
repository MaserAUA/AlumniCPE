import React, { useState } from 'react';
import { FaEdit, FaExclamationTriangle, FaFlag, FaTimes } from "react-icons/fa";
import { Post } from "../../models/postType";
import { useReportPostForm } from '../../api/reports';
import { useAuthContext } from '../../context/auth_context';
import BaseModal from '../common/BaseModal';

interface ReportPostModalProps {
  post: Post;
  onClose: () => void;
}

const reportReasons = [
  { value: "", label: "Select a reason" },
  { value: "spam", label: "Spam content" },
  { value: "harassment", label: "Harassment" },
  { value: "hate_speech", label: "Hate speech" },
  { value: "misinformation", label: "Misinformation" },
  { value: "other", label: "Other" },
];

const ReportPostModal: React.FC<ReportPostModalProps> = ({ post, onClose }) => {
  const { userId } = useAuthContext();
  const [reportReason, setReportReason] = useState<string>("");
  const [reportDescription, setReportDescription] = useState<string>("");

  const reportPostMutation = useReportPostForm();

  const handleReportSubmit = async () => {
    if (!post) return;
    const report = {
      id: post.post_id,
      type: "post",
      category: reportReason,
      additional: reportDescription,
    };
    await reportPostMutation.mutateAsync(report);
    onClose();
    setReportReason("");
    setReportDescription("");
  };

  return (
    <BaseModal isOpen={true} onClose={onClose} size="md">
      <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              <FaFlag className="mr-2 text-red-500" />
              Report Post
            </h3>
            <div className="flex space-x-2">
              {post.author_user_id === userId && (
                <button
                  onClick={() => {
                    onClose();
                  }}
                  className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <FaEdit size={18} />
                </button>
              )}
              <button
                onClick={() => onClose()}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <FaTimes />
              </button>
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-4 flex items-start">
            <FaExclamationTriangle className="text-red-500 mr-3 mt-1 flex-shrink-0" />
            <p className="text-sm text-red-800 dark:text-red-300">
              Reports are sent to administrators for review. Abuse of the
              reporting system may result in restrictions.
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
              Reason for reporting <span className="text-red-500">*</span>
            </label>
            <select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              {reportReasons.map((reason) => (
                <option key={reason.value} value={reason.value}>
                  {reason.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
              Additional details{" "}
              <span className="text-gray-500 font-normal">(Optional)</span>
            </label>
            <textarea
              value={reportDescription}
              onChange={(e) => setReportDescription(e.target.value)}
              placeholder="Please provide more information about the issue..."
              className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            ></textarea>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleReportSubmit}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
              disabled={!reportReason}
            >
              <FaFlag className="mr-2" />
              Submit Report
            </button>
          </div>
        </div>
    </BaseModal>
  )
}

export default ReportPostModal;
