import React, { useState, useCallback, useEffect } from 'react';
import { useGetAllPosts, useUpdatePost, useDeletePost } from '../../hooks/usePost';
import { useAuthContext } from '../../context/auth_context';
import { useUploadFile } from "../../hooks/useUploadFile";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import PostTable from '../../components/admin/Report/PostTable';
import ReportsTable from '../../components/admin/Report/ReportsTable';
import TabSwitcher from '../../components/admin/Report/TabSwitcher';
import { Post } from '../../models/postType';

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
  // State management
  const [activeTab, setActiveTab] = useState('posts');
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleViewPost = (post: Post | string) => {
    const postId = typeof post === 'string' ? post : post.post_id;
    if (postId) {
      navigate(`/news/${postId}`);
    }
  };



  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <TabSwitcher
        activeTab={activeTab}
        onTabChange={setActiveTab}
        filter={filter}
        onFilterChange={handleFilterChange}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        postTypeOptions={postTypeOptions}
      />

      {activeTab === 'posts' ? (
        <div className="overflow-x-auto">
          <PostTable
            filter={filter}
            searchQuery={searchQuery}
            onView={handleViewPost}
          />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <ReportsTable
            onView={handleViewPost}
          />
        </div>
      )}
    </div>
  );
};

export default AdminReports;
