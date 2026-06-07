import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import MetricCards from './MetricCards';
import AnalyticsSection from './AnalyticsSection';
import '../styles/Dashboard.css';

export default function Dashboard({ userName = "Farmer" }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="dashboard-container">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      {/* Main Content */}
      <div className={`dashboard-main ${!sidebarOpen ? 'sidebar-closed' : ''}`}>
        {/* Top Header */}
        <Header userName={userName} />
        
        {/* Dashboard Content */}
        <div className="dashboard-content">
          <div className="content-wrapper">
            {/* Welcome Section */}
            <div className="welcome-section">
              <h1 className="welcome-title">Farm Overview</h1>
              <p className="welcome-subtitle">Real-time insights and analytics for optimal crop management</p>
            </div>

            {/* Metric Cards Row */}
            <MetricCards />

            {/* Analytics Section */}
            <AnalyticsSection />
          </div>
        </div>
      </div>
    </div>
  );
}
