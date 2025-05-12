import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useGetRegistryStat } from "../../../hooks/UseStat";

interface GenerationStats {
  generation: string;
  users_in_generation: number;
  verified_in_generation: number;
}

const UserRegistryChart = () => {
  const { data, isLoading} = useGetRegistryStat()

  if (isLoading) {
    return (<div>loading. . .</div>)
  }


  const generationStats = data.generation_stats

  const sortedData = [...generationStats].sort((a, b) => {
    const aGen = parseInt(a.generation.replace("CPE", ""));
    const bGen = parseInt(b.generation.replace("CPE", ""));
    return aGen - bGen;
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={sortedData}
        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="generation" angle={-15} textAnchor="end" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="users_in_generation" fill="#8884d8" name="Total Users" />
        <Bar dataKey="verified_in_generation" fill="#82ca9d" name="Verified Users" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default UserRegistryChart;
