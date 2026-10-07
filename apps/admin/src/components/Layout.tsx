import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckCircle, AlertTriangle, Briefcase, Settings, LogOut, Bell } from 'lucide-react';
import './Layout.css';

export default function Layout() {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Verifications', path: '/verifications', icon: CheckCircle },
    { name: 'Disputes', path: '/disputes', icon: AlertTriangle },
    { name: 'Services Catalog', path: '/services', icon: Briefcase },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="layout-container">
      <aside className="sidebar glass-panel">
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo-box">T</div>
            <h1 className="logo-text">Trip<span className="gradient-text">ly</span></h1>
          </div>
          <p className="admin-badge">Admin Portal</p>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <item.icon className="nav-icon" size={20} />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="nav-link logout-btn">
            <LogOut className="nav-icon" size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar glass-panel">
          <div className="search-bar">
            <input type="text" placeholder="Search users, jobs, disputes..." />
          </div>
          <div className="topbar-actions">
            <button className="icon-btn">
              <Bell size={20} />
              <span className="badge-indicator"></span>
            </button>
            <div className="user-profile">
              <div className="avatar">A</div>
              <div className="user-info">
                <span className="user-name">Admin User</span>
                <span className="user-role">Superadmin</span>
              </div>
            </div>
          </div>
        </header>

        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
