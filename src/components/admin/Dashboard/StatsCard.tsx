import React from 'react';
import { IconType } from 'react-icons';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  changeRate?: number;
  additionalInfo?: string;
  iconBgColor: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  changeRate,
  additionalInfo,
  iconBgColor
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-slate-500 mb-1">{title}</h3>
          <p className="text-3xl font-bold text-slate-800">{value}</p>
        </div>
        <div className={`${iconBgColor} p-3 rounded-lg`}>
          {icon}
        </div>
      </div>
      {changeRate !== undefined && (
        <div className="mt-4 flex items-center">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            changeRate >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
          }`}>
            {changeRate >= 0 ? (
              <FiArrowUp className="mr-1" />
            ) : (
              <FiArrowDown className="mr-1" />
            )}
            {Math.abs(changeRate)}%
          </span>
          <span className="text-xs text-slate-500 ml-2">from last month</span>
        </div>
      )}
      {additionalInfo && (
        <div className="mt-4 flex items-center text-xs text-slate-500">
          {additionalInfo}
        </div>
      )}
    </div>
  );
};

export default StatsCard;
