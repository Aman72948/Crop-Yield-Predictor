import React from 'react';
import { 
  Landscape, 
  Thermometer, 
  Droplets, 
  Leaf,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

const METRICS = [
  {
    id: 1,
    title: 'Total Cultivated Area',
    value: '120',
    unit: 'Acres',
    icon: Landscape,
    bgColor: '#e8f5e9',
    iconColor: '#2e7d32',
    trend: '+5%',
    trendUp: true,
    status: 'Active Fields'
  },
  {
    id: 2,
    title: 'Live Weather',
    value: '28',
    unit: '°C',
    icon: Thermometer,
    bgColor: '#fff3e0',
    iconColor: '#f57c00',
    trend: 'Humid',
    trendUp: false,
    status: 'Conditions'
  },
  {
    id: 3,
    title: 'Soil Moisture Level',
    value: '62',
    unit: '%',
    icon: Droplets,
    bgColor: '#e1f5fe',
    iconColor: '#0277bd',
    trend: 'Optimal',
    trendUp: true,
    status: 'Status'
  },
  {
    id: 4,
    title: 'Crop Status',
    value: 'Healthy',
    unit: 'Primary',
    icon: Leaf,
    bgColor: '#f3e5f5',
    iconColor: '#7b1fa2',
    trend: '98%',
    trendUp: true,
    status: 'Growth Rate'
  }
];

export default function MetricCards() {
  return (
    <div className="metrics-grid">
      {METRICS.map((metric) => (
        <div key={metric.id} className="metric-card">
          {/* Card Header */}
          <div className="metric-header">
            <div 
              className="metric-icon"
              style={{ backgroundColor: metric.bgColor }}
            >
              <metric.icon size={24} style={{ color: metric.iconColor }} />
            </div>
            <h3 className="metric-title">{metric.title}</h3>
          </div>

          {/* Card Body */}
          <div className="metric-body">
            <div className="metric-value">
              <span className="metric-number">{metric.value}</span>
              <span className="metric-unit">{metric.unit}</span>
            </div>
            
            <div className="metric-footer">
              <div className={`metric-trend ${metric.trendUp ? 'up' : 'down'}`}>
                <TrendingUp size={14} />
                <span>{metric.trend}</span>
              </div>
              <p className="metric-status">{metric.status}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
