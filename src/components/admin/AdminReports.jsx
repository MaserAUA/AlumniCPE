import React, { useState, useCallback, useEffect } from 'react';
import { useGetAllPosts, useUpdatePost, useDeletePost } from '../../hooks/usePost';
import { FaEdit, FaTrash, FaFlag, FaExclamationTriangle, FaTimes, FaImage, FaTrashAlt, FaEye, FaCheckCircle, FaTimesCircle, FaHeart, FaRegHeart, FaComment } from 'react-icons/fa';
import { useAuthContext } from '../../context/auth_context';
import { useUploadFile } from "../../hooks/useUploadFile";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';

const postTypeOptions = [
  { value: 'event', label: 'Event' },
  { value: 'story', label: 'Story' },
  { value: 'job', label: 'Job' },
  { value: 'mentorship', label: 'Mentorship' },
  { value: 'showcase', label: 'Showcase' },
  { value: 'announcement', label: 'Announcement' },
  { value: 'discussion', label: 'Discussion' },
  { value: 'survey', label: 'Survey' },
];

const AdminReports = () => {
  const navigate = useNavigate();
  const { data: posts, isLoading, error } = useGetAllPosts();
  const updatePostMutation = useUpdatePost();
  const deletePostMutation = useDeletePost();
  const uploadFileMutation = useUploadFile();
  const [editingPost, setEditingPost] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const { role, userId, token } = useAuthContext();
  const [activeTab, setActiveTab] = useState('posts');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportingPost, setReportingPost] = useState(null);
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [reports, setReports] = useState([]);
  const [isLoadingReports, setIsLoadingReports] = useState(false);
  const [reportError, setReportError] = useState(null);

  // Configure axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, [token]);

  // Fetch reports when the reports tab is active
  useEffect(() => {
    if (activeTab === 'reports') {
      fetchReports();
    }
  }, [activeTab]);

  const fetchReports = async () => {
    setIsLoadingReports(true);
    setReportError(null);
    try {
      const response = await axios.get('https://alumni.cpe.kmutt.ac.th/api/v1/utils/report', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
      if (error.response?.status === 401) {
        Swal.fire({
          icon: 'error',
          title: 'Authentication Error',
          text: 'Please log in again to continue',
          confirmButtonText: 'OK'
        }).then(() => {
          // Redirect to login or handle token refresh here
          navigate('/login');
        });
      } else {
        setReportError(error.response?.data?.message || 'Failed to fetch reports');
      }
    } finally {
      setIsLoadingReports(false);
    }
  };



  const canEditPost = (post) => {
    return role === 'admin' || post.author_user_id === userId;
  };

  const canDeletePost = (post) => {
    return role === 'admin' || post.author_user_id === userId;
  };

  const handleEdit = (post) => {
    if (!canEditPost(post)) {
      Swal.fire({
        icon: 'error',
        title: 'Permission Denied',
        text: 'You do not have permission to edit this post'
      });
      return;
    }

    setEditingPost({
      ...post,
      start_date: post.start_date ? post.start_date.slice(0, 10) : '',
      end_date: post.end_date ? post.end_date.slice(0, 10) : '',
      media_urls: post.media_urls || [],
    });
    setImages([]);
  };

  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setEditingPost(prev => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleImageUpload = useCallback((e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newImages = Array.from(files);
      const newPreviews = newImages.map(file => URL.createObjectURL(file));

      setImages(prev => [...prev, ...newImages]);
      setEditingPost(prev => ({
        ...prev,
        media_urls: [...(prev.media_urls || []), ...newPreviews]
      }));
    }
  }, []);

  const handleRemoveImage = useCallback((index) => {
    if (!editingPost?.media_urls) return;

    const removedUrl = editingPost.media_urls[index];

    setEditingPost(prev => ({
      ...prev,
      media_urls: (prev.media_urls || []).filter((_, i) => i !== index)
    }));

    if (removedUrl?.startsWith("blob:")) {
      const previewBlobs = (editingPost.media_urls || []).filter(url => url.startsWith("blob:"));
      const blobIndex = previewBlobs.findIndex(url => url === removedUrl);
      if (blobIndex !== -1) {
        setImages(prev => prev.filter((_, i) => i !== blobIndex));
      }
    }
  }, [editingPost]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingPost) return;

    setIsSubmitting(true);

    try {
      // Prepare media URLs
      const mediaUrls = editingPost.media_urls || [];
      const previewBlobs = mediaUrls.filter(url => url?.startsWith("blob:"));
      const existingUrls = mediaUrls.filter(url => !url?.startsWith("blob:"));

      // Upload new images if any
      let uploadedUrls = [];
      if (images.length > 0) {
        const uploadedResults = await Promise.all(
          images.map(file => uploadFileMutation.mutateAsync(file))
        );
        uploadedUrls = uploadedResults.map(res => res.url);
      }

      const finalMediaUrls = [...existingUrls, ...uploadedUrls];

      // Prepare post data
      const updatedPost = {
        post_id: editingPost.post_id,
        title: editingPost.title,
        content: editingPost.content,
        post_type: editingPost.post_type,
        start_date: editingPost.start_date,
        end_date: editingPost.end_date,
        media_urls: finalMediaUrls,
        redirect_link: editingPost.redirect_link,
        visibility: editingPost.visibility,
      };

      await updatePostMutation.mutateAsync(updatedPost);
      setEditingPost(null);
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Post updated successfully',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error updating post:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to update post'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (postId) => {
    try {
      await deletePostMutation.mutateAsync(postId);
      setShowDeleteModal(false);
      setSelectedPost(null);
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Post deleted successfully',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error deleting post:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to delete post'
      });
    }
  };

  const handleViewPost = (post) => {
    if (post.post_id) {
      navigate(`/newsdetail/${post.post_id}`);
    } else {
      navigate(`/newsdetail/${post}`);
    }
  };

  const reportReasons = [
    { value: 'spam', label: 'Spam' },
    { value: 'harassment', label: 'Harassment' },
    { value: 'inappropriate', label: 'Inappropriate Content' },
    { value: 'misinformation', label: 'Misinformation' },
    { value: 'other', label: 'Other' }
  ];

  const handleReport = (post) => {
    setReportingPost(post);
    setShowReportModal(true);
  };

  const handleSubmitReport = async (e) => {
    // Prevent form submission
    e.preventDefault();
    
    if (!reportReason || !reportDescription) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please provide both reason and description for the report'
      });
      return;
    }

    try {
      const response = await axios.post('https://alumni.cpe.kmutt.ac.th/api/v1/utils/report', {
        post_id: reportingPost.post_id,
        reason: reportReason,
        description: reportDescription
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Report submitted successfully',
          timer: 1500,
          showConfirmButton: false
        });
        setShowReportModal(false);
        setReportingPost(null);
        setReportReason('');
        setReportDescription('');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      if (error.response?.status === 401) {
        Swal.fire({
          icon: 'error',
          title: 'Authentication Error',
          text: 'Please log in again to continue',
          confirmButtonText: 'OK'
        }).then(() => {
          navigate('/login');
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'Failed to submit report'
        });
      }
    }
  };

 

  // Add search filter function
  const filteredPosts = posts?.filter(post => {
    const matchesFilter = filter === 'all' || post.post_type === filter;
    const matchesSearch = searchQuery === '' || 
      post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">Error loading posts: {error.message}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <FaExclamationTriangle className="text-red-500 mr-2" />
          Admin Dashboard
        </h2>
        
        <div className="flex space-x-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('posts')}
              className={`px-4 py-2 font-medium rounded-md ${
                activeTab === 'posts'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              All Posts
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`px-4 py-2 font-medium rounded-md ${
                activeTab === 'reports'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Post Reports
            </button>
          </div>
          
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <select 
              className="bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Posts</option>
              {postTypeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {activeTab === 'posts' ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Media</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stats</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPosts?.map((post) => (
                <tr key={post.post_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                      {post.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full border ${
                      post.post_type === 'event' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                      post.post_type === 'story' ? 'bg-green-100 text-green-800 border-green-200' :
                      post.post_type === 'job' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                      'bg-gray-100 text-gray-800 border-gray-200'
                    }`}>
                      {post.post_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{post.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      <div>Start: {post.start_date || '-'}</div>
                      <div>End: {post.end_date || '-'}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {post.media_urls && post.media_urls.length > 0 ? (
                      <div className="flex gap-1">
                        {post.media_urls.map((url, index) => (
                          <img
                            key={index}
                            src={url}
                            alt={`Media ${index + 1}`}
                            className="w-10 h-10 object-cover rounded"
                          />
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400">No media</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-gray-500">
                        <FaEye className="mr-1" />
                        <span>{post.view_count || 0}</span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <FaHeart className="mr-1 text-red-500" />
                        <span>{post.like_count || 0}</span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <FaComment className="mr-1" />
                        <span>{post.comment_count || 0}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewPost(post)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Post"
                      >
                        <FaEye />
                      </button>
                      {canEditPost(post) && (
                        <button
                          onClick={() => handleEdit(post)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit Post"
                        >
                          <FaEdit />
                        </button>
                      )}
                      {canDeletePost(post) && (
                        <button
                          onClick={() => {
                            setSelectedPost(post);
                            setShowDeleteModal(true);
                          }}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Post"
                        >
                          <FaTrash />
                        </button>
                      )}
                      <button
                        onClick={() => handleReport(post)}
                        className="text-yellow-600 hover:text-yellow-900"
                        title="Report Post"
                      >
                        <FaFlag />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="overflow-x-auto">
          {isLoadingReports ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : reportError ? (
            <div className="text-red-500 text-center p-4">{reportError}</div>
          ) : reports.length === 0 ? (
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-blue-600">No reports found</p>
            </div>
          ) : (
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
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {report.post_title}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {report.post_id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{report.reporter}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        report.reason === 'spam' ? 'bg-red-100 text-red-800' :
                        report.reason === 'harassment' ? 'bg-orange-100 text-orange-800' :
                        report.reason === 'inappropriate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {report.reason}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {report.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        report.status === 'resolved' ? 'bg-green-100 text-green-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(report.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewPost({ post_id: report.post_id })}
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
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-gray-900">Confirm Delete</h3>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="text-gray-700">Are you sure you want to delete this post?</p>
                <p className="text-sm text-gray-500 mt-2">This action cannot be undone.</p>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(selectedPost.post_id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-lg font-bold text-gray-900">Edit Post</h3>
                <button
                  onClick={() => setEditingPost(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleUpdate} className="space-y-6">
                {/* Form fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={editingPost.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Post Type
                    </label>
                    <select
                      name="post_type"
                      value={editingPost.post_type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      {postTypeOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content
                  </label>
                  <textarea
                    name="content"
                    value={editingPost.content}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="start_date"
                      value={editingPost.start_date}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="end_date"
                      value={editingPost.end_date}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Images
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {(editingPost.media_urls || []).map((url, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={url}
                          alt={`Media ${idx + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <FaTrashAlt size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <label className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors">
                    <FaImage className="mr-2" /> Add Images
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      multiple
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setEditingPost(null)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </div>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && reportingPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-gray-900">Report Post</h3>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleSubmitReport} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason
                  </label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select a reason</option>
                    {reportReasons.map(reason => (
                      <option key={reason.value} value={reason.value}>
                        {reason.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Please provide more details about your report..."
                    required
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReports;
