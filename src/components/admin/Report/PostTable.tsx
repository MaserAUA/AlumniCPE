import React, { useState } from 'react';
import { useGetAllPosts, useUpdatePost, useDeletePost } from '../../../hooks/usePost';
import { FaEdit, FaTrash, FaFlag, FaEye, FaHeart, FaComment } from 'react-icons/fa';
import DeletePostModal from '../../../components/NewsDetails/DeletePostModal';
import EditPostModal from '../../../components/NewsDetails/EditPostModal';
import { Post } from '../../../models/postType';
import { useAuthContext } from '../../../context/auth_context';
import { useNavigate } from 'react-router-dom';

interface PostTableProps {
  filter: string;
  searchQuery: string;
  onView: (post: Post) => void;
}

const PostTable: React.FC<PostTableProps> = ({
  filter,
  searchQuery,
  onView,
}) => {
  const { role, userId } = useAuthContext();
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [selectedPost, setSelectedPost] = useState<Post>({
    post_id: "",
    title: "",
    content: "",
    media_urls: [],
    redirect_link: "",
    post_type: "",
    start_date: "",
    end_date: "",
    created_timestmap: "",
    has_liked: false,
    likes_count: 0,
    views_count: 0,
    comments_count: 0,
    author_user_id: "",
  });
  const navigate = useNavigate();
  const { data: posts, isLoading, error } = useGetAllPosts();

  const getPostTypeStyle = (postType: string) => {
    switch (postType) {
      case 'event': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'story': return 'bg-green-100 text-green-800 border-green-200';
      case 'job': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">Error loading posts: {error.message}</div>;
  }

  const filteredPosts = posts.filter(post => {
    const matchesFilter = filter === 'all' || post.post_type === filter;
    const matchesSearch = searchQuery === '' || 
      post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <>
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
        {filteredPosts.map((post) => (
          <tr key={post.post_id} className="hover:bg-gray-50">
            <td className="px-6 py-4">
              <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                {post.title}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className={`px-2 py-1 text-xs rounded-full border ${getPostTypeStyle(post.post_type)}`}>
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
                  <span>{post.views_count || 0}</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <FaHeart className="mr-1 text-red-500" />
                  <span>{post.likes_count || 0}</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <FaComment className="mr-1" />
                  <span>{post.comments_count || 0}</span>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div className="flex space-x-2">
                <button
                  onClick={() => onView(post)}
                  className="text-blue-600 hover:text-blue-900"
                  title="View Post"
                >
                  <FaEye />
                </button>
                <button
                  onClick={() => {
                      setSelectedPost(post);
                      setShowEditModal(true)
                  }}
                  className="text-blue-600 hover:text-blue-900"
                  title="Edit Post"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => {
                    setSelectedPost(post);
                    setShowDeleteModal(true)
                  }}
                  className="text-red-600 hover:text-red-900"
                  title="Delete Post"
                >
                  <FaTrash />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    { showEditModal && (
      <EditPostModal
        post={selectedPost}
        onClose={()=>{
          setShowEditModal(false)
        }}
      />
    )}
    { showDeleteModal && (
      <DeletePostModal
        post={selectedPost}
        onClose={()=>{
          setShowDeleteModal(false);
        }}
      />
    )}
    </>
  );
};

export default PostTable;
