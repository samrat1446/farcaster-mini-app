import React, { useEffect, useState } from 'react';

interface ProgressBarProps {
  value: number; // 0-100
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, className = '' }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayValue(value);
    }, 100);

    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium text-base-text">Neynar Score</span>
        <span className="text-sm font-bold text-base-blue">{value}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className="bg-gradient-to-r from-base-blue to-base-blue-light h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${displayValue}%` }}
        />
      </div>
    </div>
  );
};
