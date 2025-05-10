import React from 'react';

interface TabSwitcherProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  filter: string;
  onFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  postTypeOptions: { value: string; label: string }[];
}

const TabSwitcher: React.FC<TabSwitcherProps> = ({
  activeTab,
  onTabChange,
  filter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  postTypeOptions,
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-bold text-gray-800 flex items-center">
        <span className="text-red-500 mr-2">⚠️</span>
        Admin Dashboard
      </h2>
      
      <div className="flex space-x-4">
        <div className="flex space-x-2">
          <button
            onClick={() => onTabChange('posts')}
            className={`px-4 py-2 font-medium rounded-md ${
              activeTab === 'posts'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            All Posts
          </button>
          <button
            onClick={() => onTabChange('reports')}
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
            onChange={onSearchChange}
            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <select 
            className="bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm"
            value={filter}
            onChange={onFilterChange}
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
  );
};

export default TabSwitcher;
