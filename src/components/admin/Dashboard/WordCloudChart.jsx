import React from "react";
import WordCloud from "react-wordcloud";
import { useGetUserJob } from "../../../hooks/UseStat";

const options = {
  rotations: 2,
  rotationAngles: [-90, 0],
  fontSizes: [14, 50],
};

const WordCloudChart = () => {
  const { data, isLoading } = useGetUserJob()

  if (isLoading) {
    return (<div>loading. . .</div>)
  }
  const wordCountMap = new Map();

  data.forEach(({ position }) => {
    const key = position.trim().toLowerCase();
    wordCountMap.set(key, (wordCountMap.get(key) || 0) + 1);
  });

  const wordCloudData = Array.from(wordCountMap.entries()).map(
    ([text, value]) => ({
      text,
      value,
    })
  );

  return (
    <div style={{ height: "500px", width: "100%" }}>
      <WordCloud
        words={wordCloudData}
        options={options}
      />
    </div>
  );
};

export default WordCloudChart;
