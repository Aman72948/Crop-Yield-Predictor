import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  ChevronDown, 
  LogOut,
  User,
  Settings
} from 'lucide-react';

export default function Header({ userName = "Farmer" }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [currentDate] = useState(new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }));

  return (
    <header className="dashboard-header">
      {/* Left Section */}
      <div className="header-left">
        <div className="greeting-section">
          <h1 className="greeting-text">Welcome back, {userName}! 👋</h1>
          <p className="greeting-date">{currentDate}</p>
        </div>
      </div>

      {/* Right Section */}
      <div className="header-right">
        {/* Search Bar */}
        <div className="search-container">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search crops, fields, data..."
            className="search-input"
          />
        </div>

        {/* Notifications */}
        <button className="header-icon-btn notification-btn" title="Notifications">
          <Bell size={20} />
          <span className="notification-badge">3</span>
        </button>

        {/* Profile Dropdown */}
        <div className="profile-dropdown">
          <button
            className="profile-btn"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <div className="profile-avatar">
              {userName.charAt(0).toUpperCase()}
            </div>
            <ChevronDown size={16} className={`chevron ${showProfileMenu ? 'open' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {showProfileMenu && (
            <div className="dropdown-menu">
              <div className="dropdown-header">
                <div className="dropdown-avatar">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div className="dropdown-user-info">
                  <p className="dropdown-name">{userName}</p>
                  <p className="dropdown-email">farmer@agro.local</p>
                </div>
              </div>

              <div className="dropdown-divider" />

              <div className="dropdown-items">
                <a href="#profile" className="dropdown-item">
                  <User size={16} />
                  <span>My Profile</span>
                </a>
                <a href="#settings" className="dropdown-item">
                  <Settings size={16} />
                  <span>Settings</span>
                </a>
              </div>

              <div className="dropdown-divider" />

              <button className="dropdown-item logout-item">
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
