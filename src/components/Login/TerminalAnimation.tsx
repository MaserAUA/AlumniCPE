import React from "react";

const TerminalAnimation = ({ visibleLines }) => (
  <div className="font-mono text-sm h-64 overflow-auto w-full terminal-container">
    <div className="text-green-400 mb-4"># CPE KMUTT Authentication System</div>
    <div className="space-y-3">
      {visibleLines.map((line, index) => (
        <div key={index} className="flex">
          <span className={`${line.color}`}>{line.text}</span>
          {index === visibleLines.length - 1 && (
            <span className="animate-pulse ml-1">_</span>
          )}
        </div>
      ))}
    </div>
  </div>
);

export default TerminalAnimation;
