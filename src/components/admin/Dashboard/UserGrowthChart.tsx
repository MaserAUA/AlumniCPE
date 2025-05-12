import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts';

interface UserGrowthChartProps {
  data: Array<{
    name: string;
    users: number;
  }>;
}

const UserGrowthChart: React.FC<UserGrowthChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 20,
          left: 0,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#fff', 
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            border: 'none' 
          }} 
        />
        <Line
          type="monotone"
          dataKey="users"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }}
          activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default UserGrowthChart;
