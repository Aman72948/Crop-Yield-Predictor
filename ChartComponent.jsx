import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart
} from 'recharts';
import { Calendar } from 'lucide-react';

const CHART_DATA = [
  { day: 'Mon', moisture: 45, yield: 72, temp: 22 },
  { day: 'Tue', moisture: 52, yield: 75, temp: 24 },
  { day: 'Wed', moisture: 58, yield: 78, temp: 26 },
  { day: 'Thu', moisture: 62, yield: 82, temp: 25 },
  { day: 'Fri', moisture: 68, yield: 85, temp: 27 },
  { day: 'Sat', moisture: 72, yield: 88, temp: 28 },
  { day: 'Sun', moisture: 75, yield: 92, temp: 29 }
];

export default function ChartComponent() {
  return (
    <div className="chart-card">
      <div className="chart-header">
        <div>
          <h2 className="chart-title">Crop Yield & Moisture Trends</h2>
          <p className="chart-subtitle">Weekly performance analysis</p>
        </div>
        <button className="chart-date-btn">
          <Calendar size={16} />
          <span>This Week</span>
        </button>
      </div>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart
            data={CHART_DATA}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="day" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
            />
            
            {/* Bars for Yield */}
            <Bar dataKey="yield" fill="#4ade80" name="Yield (%) " radius={[8, 8, 0, 0]} />
            
            {/* Lines for Moisture and Temperature */}
            <Line 
              type="monotone" 
              dataKey="moisture" 
              stroke="#0ea5e9" 
              name="Moisture (%)"
              strokeWidth={3}
              dot={{ fill: '#0ea5e9', r: 5 }}
              activeDot={{ r: 7 }}
            />
            <Line 
              type="monotone" 
              dataKey="temp" 
              stroke="#f97316" 
              name="Temperature (°C)"
              strokeWidth={3}
              dot={{ fill: '#f97316', r: 5 }}
              activeDot={{ r: 7 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Footer Stats */}
      <div className="chart-footer">
        <div className="chart-stat">
          <span className="stat-label">Avg Yield</span>
          <span className="stat-value">82%</span>
        </div>
        <div className="chart-stat">
          <span className="stat-label">Avg Moisture</span>
          <span className="stat-value">62%</span>
        </div>
        <div className="chart-stat">
          <span className="stat-label">Avg Temp</span>
          <span className="stat-value">25°C</span>
        </div>
      </div>
    </div>
  );
}
