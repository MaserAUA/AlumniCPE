import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts';

interface DailyActiveUsersChartProps {
  data: Array<{
    day: string;
    users: number;
  }>;
}

const DailyActiveUsersChart: React.FC<DailyActiveUsersChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 10,
          left: 0,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#fff', 
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            border: 'none' 
          }} 
        />
        <Bar dataKey="users" fill="#818cf8" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default DailyActiveUsersChart;
