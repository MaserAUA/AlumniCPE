import React, { useState, useEffect } from "react";
import WordCloud from "react-wordcloud";
import { useGetUserJob } from "../../../hooks/UseStat";

const options = {
  rotations: 2,
  rotationAngles: [-90, 0],
  fontSizes: [20, 60],
  fontFamily: "Arial, sans-serif",
  fontWeight: "bold",
  padding: 2,
  colors: ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b"],
  enableTooltip: false,
  deterministic: true,
};

const WordCloudChart = () => {
  const { data, isLoading } = useGetUserJob();
  const [selectedWord, setSelectedWord] = useState(null);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleWordClick = (word) => {
    setSelectedWord(word);
  };

  const handleClosePopup = (e) => {
    e.stopPropagation();
    setSelectedWord(null);
  };

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
    <div style={{ 
      height: "500px", 
      width: "100%",
      position: "relative"
    }}>
      <WordCloud
        words={wordCloudData}
        options={options}
        callbacks={{
          onWordClick: handleWordClick
        }}
      />
      
      {selectedWord && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "8px 12px",
            borderRadius: "6px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            zIndex: 1000,
            textAlign: "center",
            minWidth: "100px",
            maxWidth: "150px",
            animation: "fadeIn 0.2s ease-out",
            border: "1px solid #e0e0e0"
          }}
        >
          <div style={{
            position: "absolute",
            top: "-12px",
            right: "-12px",
            width: "24px",
            height: "24px",
            backgroundColor: "#ff4444",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "white",
            fontSize: "16px",
            fontWeight: "bold",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            transition: "all 0.2s ease",
            userSelect: "none"
          }}
          onClick={handleClosePopup}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "#ff0000";
            e.currentTarget.style.transform = "scale(1.1)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "#ff4444";
            e.currentTarget.style.transform = "scale(1)";
          }}
          >
            ×
          </div>
          <div style={{
            fontSize: "14px",
            fontWeight: "bold",
            color: "#333",
            marginBottom: "4px",
            wordBreak: "break-word"
          }}>
            {selectedWord.text}
          </div>
          <div style={{
            fontSize: "18px",
            fontWeight: "bold",
            color: "#1f77b4"
          }}>
            {selectedWord.value}
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translate(-50%, -60%); }
            to { opacity: 1; transform: translate(-50%, -50%); }
          }
        `}
      </style>
    </div>
  );
};

export default WordCloudChart;
