import React from 'react';

interface CombinedProgressRingProps {
  progressValues: number[];
  colors: string[];
  size?: number;
  strokeWidths?: number[];
  label?: string;
  subLabel?: string;
  goalLabels?: string[];
}

export default function CombinedProgressRing({
  progressValues,
  colors,
  size = 120,
  strokeWidths = [8, 8, 8],
  label,
  subLabel,
  goalLabels = ["Academic", "Robotics", "Project"]
}: CombinedProgressRingProps) {
  // Calculate the average progress for the center display
  const averageProgress = Math.round(
    progressValues.reduce((acc, curr) => acc + curr, 0) / progressValues.length
  );
  
  // Create multiple rings with different radii
  const rings = progressValues.map((progress, index) => {
    const strokeWidth = strokeWidths[index] || 8;
    // Adjust radius to create concentric circles with spacing
    const radiusOffset = index * (strokeWidth + 2);
    const radius = (size - strokeWidth) / 2 - radiusOffset;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (progress / 100) * circumference;
    
    return {
      radius,
      circumference,
      offset,
      progress,
      color: colors[index] || 'stroke-blue-500',
      strokeWidth
    };
  });
  
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90">
          {/* Background circles */}
          {rings.map((ring, index) => (
            <circle
              key={`bg-${index}`}
              className={`${ring.color.split(' ')[0]} opacity-20 dark:opacity-30 transition-all duration-500`}
              cx={size / 2}
              cy={size / 2}
              r={ring.radius}
              strokeWidth={ring.strokeWidth}
              fill="none"
            />
          ))}
          
          {/* Progress circles with animation */}
          {rings.map((ring, index) => (
            <circle
              key={`progress-${index}`}
              className={`${ring.color} transition-all duration-1000 ease-out`}
              cx={size / 2}
              cy={size / 2}
              r={ring.radius}
              strokeWidth={ring.strokeWidth}
              strokeLinecap="round"
              fill="none"
              strokeDasharray={ring.circumference}
              strokeDashoffset={ring.offset}
              style={{ animationDelay: `${index * 300}ms` }}
            />
          ))}
        </svg>
        
        {/* Centered percentage */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
            {averageProgress}%
          </span>
        </div>
      </div>
      
      {/* Labels only, no legend */}
      <div className="mt-2 text-center">
        {label && <div className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{label}</div>}
        {subLabel && <div className="text-xs text-neutral-500 dark:text-neutral-400">{subLabel}</div>}
      </div>
    </div>
  );
}