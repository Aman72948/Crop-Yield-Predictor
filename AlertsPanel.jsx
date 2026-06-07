import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  Info,
  Clock,
  ChevronRight,
  MoreVertical,
  Droplet,
  Bug,
  Wind,
  Zap
} from 'lucide-react';

const ALERTS_DATA = [
  {
    id: 1,
    title: 'Irrigation Required',
    description: 'Sector B moisture below optimal level',
    severity: 'high',
    location: 'Sector B',
    time: '2 hours ago',
    icon: Droplet,
    color: '#ef4444',
    bgColor: '#fee2e2'
  },
  {
    id: 2,
    title: 'Pest Alert',
    description: 'Aphid infestation detected in North Field',
    severity: 'high',
    location: 'North Field',
    time: '4 hours ago',
    icon: Bug,
    color: '#dc2626',
    bgColor: '#fecaca'
  },
  {
    id: 3,
    title: 'Weather Advisory',
    description: 'Heavy rainfall expected tomorrow evening',
    severity: 'medium',
    location: 'Region Wide',
    time: '6 hours ago',
    icon: Wind,
    color: '#f59e0b',
    bgColor: '#fef3c7'
  },
  {
    id: 4,
    title: 'Maintenance Due',
    description: 'Irrigation system service scheduled',
    severity: 'low',
    location: 'Sector A',
    time: '1 day ago',
    icon: Zap,
    color: '#3b82f6',
    bgColor: '#dbeafe'
  }
];

const TASKS_DATA = [
  { id: 1, title: 'Apply fertilizer', completed: false, dueDate: 'Today' },
  { id: 2, title: 'Check soil pH levels', completed: true, dueDate: 'Completed' },
  { id: 3, title: 'Schedule pest spraying', completed: false, dueDate: 'Tomorrow' },
  { id: 4, title: 'Review market rates', completed: false, dueDate: 'Tomorrow' }
];

export default function AlertsPanel() {
  const [activeTab, setActiveTab] = useState('alerts'); // 'alerts' or 'tasks'

  return (
    <div className="alerts-card">
      {/* Tab Navigation */}
      <div className="alerts-tabs">
        <button
          className={`tab-btn ${activeTab === 'alerts' ? 'active' : ''}`}
          onClick={() => setActiveTab('alerts')}
        >
          <AlertTriangle size={16} />
          <span>Live Alerts</span>
          <span className="tab-badge">4</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          <CheckCircle size={16} />
          <span>Tasks</span>
          <span className="tab-badge">3</span>
        </button>
      </div>

      {/* Alerts List */}
      {activeTab === 'alerts' && (
        <div className="alerts-list">
          {ALERTS_DATA.map((alert) => (
            <div key={alert.id} className="alert-item">
              <div
                className="alert-icon"
                style={{
                  backgroundColor: alert.bgColor,
                  color: alert.color
                }}
              >
                <alert.icon size={18} />
              </div>

              <div className="alert-content">
                <h4 className="alert-title">{alert.title}</h4>
                <p className="alert-description">{alert.description}</p>
                <div className="alert-meta">
                  <span className="alert-location">{alert.location}</span>
                  <span className="alert-time">
                    <Clock size={12} />
                    {alert.time}
                  </span>
                </div>
              </div>

              <div className={`alert-severity ${alert.severity}`} />
            </div>
          ))}
        </div>
      )}

      {/* Tasks List */}
      {activeTab === 'tasks' && (
        <div className="tasks-list">
          {TASKS_DATA.map((task) => (
            <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
              <div className="task-checkbox">
                <input
                  type="checkbox"
                  id={`task-${task.id}`}
                  defaultChecked={task.completed}
                  className="checkbox"
                />
                <label htmlFor={`task-${task.id}`} className="checkmark" />
              </div>

              <div className="task-content">
                <p className="task-title">{task.title}</p>
                <span className="task-due">{task.dueDate}</span>
              </div>

              <button className="task-menu" title="Options">
                <MoreVertical size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* View All Button */}
      <button className="alerts-view-all">
        <span>View All</span>
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
