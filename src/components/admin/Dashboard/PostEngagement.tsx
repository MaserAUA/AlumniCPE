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
import { useGetPostUserStat } from "../../../hooks/UseStat";

interface EngagementData {
  view_user_gen: { key: string[]; value: number[] };
  like_user_gen: { key: string[]; value: number[] };
  comment_user_gen: { key: string[]; value: number[] };
}


const PostEngagement = () => {
  const { data, isLoading } = useGetPostUserStat()

  const aggregation: Record<
    string,
    { generation: string; views: number; likes: number; comments: number }
  > = {};

  const addToAggregation = (
    userGen: { key: string[]; value: number[] },
    type: "views" | "likes" | "comments"
  ) => {
    userGen.key.forEach((gen, i) => {
      if (!aggregation[gen]) {
        aggregation[gen] = { generation: gen, views: 0, likes: 0, comments: 0 };
      }
      aggregation[gen][type] += userGen.value[i] || 0;
    });
  };

  if (isLoading) {
    return (<div>loading. . .</div>)
  }
  // console.log(data)

  data.forEach((item) => {
    addToAggregation(item.view_user_gen, "views");
    addToAggregation(item.like_user_gen, "likes");
    addToAggregation(item.comment_user_gen, "comments");
  });

  const chartData = Object.values(aggregation);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="generation" angle={-15} textAnchor="end" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="views" fill="#8884d8" name="Views" />
        <Bar dataKey="likes" fill="#82ca9d" name="Likes" />
        <Bar dataKey="comments" fill="#ffc658" name="Comments" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default PostEngagement;
