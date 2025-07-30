import React from 'react';

interface CircularProgressProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
  label?: string;
  subLabel?: string;
}

export default function CircularProgress({
  progress,
  size = 100,
  strokeWidth = 8,
  color = "stroke-blue-500 dark:stroke-blue-400",
  bgColor = "stroke-blue-200 dark:stroke-blue-900/30",
  label,
  subLabel
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;
  
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background circle */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            className={`${bgColor} transition-all duration-500`}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            fill="none"
          />
          
          {/* Progress circle with animation */}
          <circle
            className={`${color} transition-all duration-1000 ease-out`}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        
        {/* Centered percentage */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
            {progress}%
          </span>
        </div>
      </div>
      
      {/* Labels */}
      {(label || subLabel) && (
        <div className="mt-2 text-center">
          {label && <div className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{label}</div>}
          {subLabel && <div className="text-xs text-neutral-500 dark:text-neutral-400">{subLabel}</div>}
        </div>
      )}
    </div>
  );
}