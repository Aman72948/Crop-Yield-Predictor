import React from 'react';
import { 
  BarChart3, 
  Leaf, 
  Cloud, 
  Droplets, 
  TrendingUp, 
  Settings, 
  Menu, 
  X,
  Home
} from 'lucide-react';

const MENU_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, isActive: true },
  { id: 'analytics', label: 'Crop Analytics', icon: BarChart3, isActive: false },
  { id: 'weather', label: 'Weather Forecast', icon: Cloud, isActive: false },
  { id: 'soil', label: 'Soil Health', icon: Droplets, isActive: false },
  { id: 'market', label: 'Market Rates', icon: TrendingUp, isActive: false },
  { id: 'settings', label: 'Settings', icon: Settings, isActive: false }
];

export default function Sidebar({ isOpen, setIsOpen }) {
  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        className="sidebar-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        {/* Logo Section */}
        <div className="sidebar-logo">
          <div className="logo-icon">
            <Leaf size={28} strokeWidth={2.5} />
          </div>
          {isOpen && (
            <div className="logo-text">
              <h2 className="logo-title">Agro Kalyan</h2>
              <p className="logo-subtitle">Smart Farming</p>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-nav">
          {MENU_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`nav-item ${item.isActive ? 'active' : ''}`}
              title={item.label}
            >
              <item.icon size={20} />
              {isOpen && <span className="nav-label">{item.label}</span>}
            </a>
          ))}
        </nav>

        {/* Footer Info */}
        {isOpen && (
          <div className="sidebar-footer">
            <div className="footer-info">
              <p className="footer-text">Agro Kalyan v2.0</p>
              <p className="footer-subtext">© 2024 Smart Agriculture</p>
            </div>
          </div>
        )}
      </aside>

      {/* Overlay for mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />}
    </>
  );
}
