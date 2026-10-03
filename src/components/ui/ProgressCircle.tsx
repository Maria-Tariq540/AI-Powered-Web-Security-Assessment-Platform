import React from 'react';

interface ProgressCircleProps {
  progress: number; // 0 to 100
  size?: number; // diameter in pixels
  strokeWidth?: number;
  statusText?: string;
  subtitle?: string;
  className?: string;
}

export const ProgressCircle: React.FC<ProgressCircleProps> = ({
  progress,
  size = 180,
  strokeWidth = 12,
  statusText = 'Scanning...',
  subtitle = 'Estimated: 2m remaining',
  className = '',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, progress)) / 100) * circumference;

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90 origin-center"
        >
          {/* Background circle track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-100"
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#progress-gradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
            fill="transparent"
          />
          <defs>
            <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
            {Math.round(progress)}%
          </span>
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider mt-0.5 animate-pulse">
            {statusText}
          </span>
        </div>
      </div>

      {subtitle && (
        <p className="mt-3 text-xs text-slate-500 font-medium">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export const ProgressBar: React.FC<{
  progress: number;
  height?: string;
  className?: string;
  color?: string;
  animated?: boolean;
}> = ({
  progress,
  height = 'h-2',
  className = '',
  color = 'bg-blue-600',
  animated = false,
}) => {
  return (
    <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${height} ${className}`}>
      <div
        className={`h-full rounded-full transition-all duration-500 ease-out ${color} ${
          animated ? 'bg-gradient-to-r from-blue-600 via-sky-400 to-blue-600 animate-pulse' : ''
        }`}
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  );
};
