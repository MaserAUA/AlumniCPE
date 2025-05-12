import React from "react"
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";
import { useGetGenerationStat } from "../../hooks/UseStat";

type Props = {
  cpe?: string[];
};

export default function GenerationLineChart({cpe}) {
  const { data, isLoading } = useGetGenerationStat({cpe: cpe})

  if (isLoading) {
    return (<div>loading. . .</div>)
  }

  if (!data){
    return (<div>No Data</div>)
  }

  const categories = Array.from(
    new Set(data.flatMap((entry) => entry.generation_data.data.key))
  );

  const chartData = categories.map((category, idx) => {
    const row: any = { category };
    data.forEach((entry) => {
      const gen = entry.generation_data.gen;
      const keys = entry.generation_data.data.key;
      const values = entry.generation_data.data.value;
      const valueIndex = keys.indexOf(category);
      row[gen] = valueIndex !== -1 ? values[valueIndex] : 0;
    });
    return row;
  });

  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#00c49f", "#ff6b81"];

  return (
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Legend />
          {data.map((entry, index) => (
            <Line
              key={entry.generation_data.gen}
              type="monotone"
              dataKey={entry.generation_data.gen}
              stroke={colors[index % colors.length]}
              strokeWidth={2}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    )
}
