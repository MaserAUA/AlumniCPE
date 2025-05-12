import React from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
//   ResponsiveContainer,
// } from "recharts";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useGetSalaryStat } from "../../../hooks/UseStat";

interface SalaryEntry {
  salary_min: number;
  salary_max: number;
}


const SalaryDistribution = () => {
  const { data, isLoading } = useGetSalaryStat()

  if (isLoading) {
    return (<div>loading. . .</div>)
  }

  // Step 1: Convert to single average value per entry
  const salaries = data.map(({ salary_min, salary_max }) => {
    if (salary_min === -1) return salary_max;
    if (salary_max === -1) return salary_min;
    return (salary_min + salary_max) / 2;
  });

  const salaryBuckets: Record<number, number> = {};
  salaries.forEach((salary) => {
    const bucket = Math.floor(salary / 10000) * 10000;
    salaryBuckets[bucket] = (salaryBuckets[bucket] || 0) + 1;
  });

  // Convert to chart format and sort by bucket
  const chartData = Object.entries(salaryBuckets)
    .map(([bucket, count]) => ({
      salary: Number(bucket),
      count,
    }))
    .sort((a, b) => a.salary - b.salary);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="salary"
          tickFormatter={(value) => `฿${(value / 1000).toFixed(0)}k`}
        />
        <YAxis allowDecimals={false} />
        <Tooltip formatter={(value: number) => `${value} people`} />
        <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SalaryDistribution;
