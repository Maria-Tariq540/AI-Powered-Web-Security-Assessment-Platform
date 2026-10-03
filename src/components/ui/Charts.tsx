'use client';

import React, { useState } from 'react';

interface TrendDataPoint {
  date: string;
  findings: number;
  scans?: number;
}

interface TrendLineChartProps {
  data: TrendDataPoint[];
  height?: number;
}

export const TrendLineChart: React.FC<TrendLineChartProps> = ({
  data,
  height = 240,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const padding = { top: 20, right: 24, bottom: 32, left: 36 };
  const width = 600; // SVG viewBox coordinate space

  const maxVal = Math.max(...data.map((d) => d.findings), 40);
  const minVal = 0;

  const getX = (index: number) => {
    return padding.left + (index / (data.length - 1)) * (width - padding.left - padding.right);
  };

  const getY = (val: number) => {
    const range = maxVal - minVal;
    const chartHeight = height - padding.top - padding.bottom;
    return height - padding.bottom - ((val - minVal) / range) * chartHeight;
  };

  // Generate SVG path points
  const points = data.map((d, i) => `${getX(i)},${getY(d.findings)}`).join(' ');

  // Smooth SVG curve
  const createSmoothPath = () => {
    if (data.length === 0) return '';
    const d = data.map((point, i) => {
      const x = getX(i);
      const y = getY(point.findings);
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
    return d;
  };

  const linePath = createSmoothPath();
  const areaPath = `${linePath} L ${getX(data.length - 1)} ${height - padding.bottom} L ${getX(0)} ${height - padding.bottom} Z`;

  return (
    <div className="w-full relative">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible select-none"
      >
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const y = height - padding.bottom - ratio * (height - padding.top - padding.bottom);
          const val = Math.round(minVal + ratio * (maxVal - minVal));
          return (
            <g key={ratio} className="text-slate-300">
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke="#e2e8f0"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text
                x={padding.left - 8}
                y={y + 4}
                textAnchor="end"
                className="text-[10px] fill-slate-400 font-mono"
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        <path d={areaPath} fill="url(#areaGradient)" />

        {/* Line stroke */}
        <path
          d={linePath}
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points & X-Axis labels */}
        {data.map((d, i) => {
          const x = getX(i);
          const y = getY(d.findings);
          const isHovered = hoveredIdx === i;

          return (
            <g key={i}>
              {/* X-axis date label */}
              <text
                x={x}
                y={height - 8}
                textAnchor="middle"
                className="text-[10px] fill-slate-500 font-medium"
              >
                {d.date}
              </text>

              {/* Point hover guide line */}
              {isHovered && (
                <line
                  x1={x}
                  y1={padding.top}
                  x2={x}
                  y2={height - padding.bottom}
                  stroke="#94a3b8"
                  strokeDasharray="2 2"
                  strokeWidth="1"
                />
              )}

              {/* Interactive Hit Target */}
              <circle
                cx={x}
                cy={y}
                r="14"
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              />

              {/* Visible Circle Node */}
              <circle
                cx={x}
                cy={y}
                r={isHovered ? 6 : 4}
                className="transition-all duration-150 cursor-pointer"
                fill="#ffffff"
                stroke="#2563eb"
                strokeWidth={isHovered ? 3 : 2}
              />
            </g>
          );
        })}
      </svg>

      {/* Floating Tooltip */}
      {hoveredIdx !== null && (
        <div
          className="absolute z-10 bg-slate-900 text-white text-xs rounded-lg py-1.5 px-3 shadow-xl pointer-events-none transform -translate-x-1/2 -translate-y-full border border-slate-700"
          style={{
            left: `${(getX(hoveredIdx) / width) * 100}%`,
            top: `${(getY(data[hoveredIdx].findings) / height) * 100}%`,
            marginTop: '-10px',
          }}
        >
          <div className="font-semibold text-slate-200">{data[hoveredIdx].date}</div>
          <div className="text-blue-400 font-mono">
            {data[hoveredIdx].findings} Findings detected
          </div>
        </div>
      )}
    </div>
  );
};

interface DonutCategory {
  label: string;
  count: number;
  percentage: number;
  color: string;
}

export const DonutChart: React.FC<{
  categories: DonutCategory[];
  totalLabel?: string;
  totalSubtext?: string;
  size?: number;
}> = ({
  categories,
  totalLabel,
  totalSubtext = 'Total Findings',
  size = 190,
}) => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const total = categories.reduce((acc, c) => acc + c.count, 0);
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 w-full">
      {/* Donut SVG */}
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90 origin-center"
        >
          {total === 0 ? (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#e2e8f0"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
          ) : (
            categories.map((cat) => {
              if (cat.count === 0) return null;
              const slicePercent = (cat.count / total) * 100;
              const strokeDasharray = `${(slicePercent / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
              accumulatedPercent += slicePercent;

              const isHovered = hoveredCategory === cat.label;

              return (
                <circle
                  key={cat.label}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke={cat.color}
                  strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-200 cursor-pointer"
                  fill="transparent"
                  onMouseEnter={() => setHoveredCategory(cat.label)}
                  onMouseLeave={() => setHoveredCategory(null)}
                />
              );
            })
          )}
        </svg>

        {/* Center Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-2xl font-black text-slate-900 tracking-tight font-mono">
            {totalLabel || total}
          </span>
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            {totalSubtext}
          </span>
        </div>
      </div>

      {/* Legend Column */}
      <div className="flex-1 w-full space-y-2">
        {categories.map((cat) => (
          <div
            key={cat.label}
            onMouseEnter={() => setHoveredCategory(cat.label)}
            onMouseLeave={() => setHoveredCategory(null)}
            className={`flex items-center justify-between p-2 rounded-lg text-xs transition-colors cursor-pointer ${
              hoveredCategory === cat.label ? 'bg-slate-100 font-semibold' : 'hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: cat.color }}
              />
              <span className="text-slate-700">{cat.label}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono font-bold text-slate-900">{cat.count}</span>
              <span className="text-slate-400 font-mono text-[11px] w-10 text-right">
                {total > 0 ? ((cat.count / total) * 100).toFixed(0) : 0}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
