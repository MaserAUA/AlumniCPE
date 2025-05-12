import React from 'react';
import { IconType } from 'react-icons';

interface ActivityItemProps {
  action: string;
  detail: string;
  time: string;
  icon: React.ReactNode;
  bgColor: string;
  borderColor: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({
  action,
  detail,
  time,
  icon,
  bgColor,
  borderColor
}) => {
  return (
    <div className={`flex items-start p-3 rounded-lg ${bgColor} border ${borderColor}`}>
      <div className="flex-shrink-0 mr-4">
        {icon}
      </div>
      <div className="flex-grow">
        <div className="font-medium text-slate-800">{action}</div>
        <div className="text-sm text-slate-600">{detail}</div>
        <div className="text-xs text-slate-500 mt-1">{time}</div>
      </div>
    </div>
  );
};

export default ActivityItem;
