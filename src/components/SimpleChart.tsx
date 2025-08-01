import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface ChartData {
  [key: string]: any;
}

interface SimpleBarChartProps {
  data: ChartData[];
  bars: Array<{
    dataKey: string;
    fill: string;
  }>;
  height?: number;
}

interface SimpleLineChartProps {
  data: ChartData[];
  lines: Array<{
    dataKey: string;
    stroke: string;
  }>;
  height?: number;
}

export const SimpleBarChart: React.FC<SimpleBarChartProps> = ({ 
  data, 
  bars, 
  height = 300 
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        {bars.map((bar, index) => (
          <Bar 
            key={index}
            dataKey={bar.dataKey} 
            fill={bar.fill} 
            radius={4} 
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export const SimpleLineChart: React.FC<SimpleLineChartProps> = ({ 
  data, 
  lines, 
  height = 300 
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        {lines.map((line, index) => (
          <Line 
            key={index}
            type="monotone" 
            dataKey={line.dataKey} 
            stroke={line.stroke} 
            strokeWidth={3}
            dot={{ fill: line.stroke, strokeWidth: 2, r: 4 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};