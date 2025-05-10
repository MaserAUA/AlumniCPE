import React from 'react';

interface TabSwitcherProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TabSwitcher: React.FC<TabSwitcherProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div>
      <button
        onClick={() => onTabChange('users')}
        className={`px-4 py-2 font-medium rounded-md ${
          activeTab === 'users'
            ? 'bg-blue-100 text-blue-700'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        All Users
      </button>
      <button
        onClick={() => onTabChange('requests')}
        className={`px-4 py-2 font-medium rounded-md ${
          activeTab === 'requests'
            ? 'bg-blue-100 text-blue-700'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        User Requests
      </button>
    </div>
  );
};

export default TabSwitcher;
