import React from 'react';
import ChartComponent from './ChartComponent';
import AlertsPanel from './AlertsPanel';

export default function AnalyticsSection() {
  return (
    <div className="analytics-section">
      {/* Charts Row */}
      <div className="analytics-grid">
        {/* Chart - 60% width */}
        <div className="chart-container">
          <ChartComponent />
        </div>

        {/* Alerts Panel - 40% width */}
        <div className="alerts-container">
          <AlertsPanel />
        </div>
      </div>
    </div>
  );
}
