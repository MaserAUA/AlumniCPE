import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';

interface EngagementPieChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
  colors: string[];
}

const EngagementPieChart: React.FC<EngagementPieChartProps> = ({ data, colors }) => {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={true}
          outerRadius={80}
          innerRadius={40}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value, name) => [`${value}%`, name]}
          contentStyle={{ 
            backgroundColor: '#fff', 
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            border: 'none' 
          }} 
        />
        <Legend 
          iconType="circle" 
          layout="vertical" 
          verticalAlign="bottom" 
          align="center"
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default EngagementPieChart;
