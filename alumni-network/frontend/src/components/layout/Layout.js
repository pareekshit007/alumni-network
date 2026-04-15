import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Avatar from '../common/Avatar';
import './Layout.css';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="app-container">
      <aside className="app-sidebar">
        <div className="layout-brand">AlumniNet</div>
        <nav style={{ marginTop: '24px', flex: 1 }}>
          <NavLink to="/dashboard" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>Dashboard</NavLink>
          <NavLink to="/alumni" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>Alumni Directory</NavLink>
          <NavLink to="/jobs" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>Job Board</NavLink>
          <NavLink to="/events" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>Events</NavLink>
          <NavLink to="/messages" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>Messages</NavLink>
        </nav>
      </aside>

      <div className="app-main">
        <header className="app-header">
          <div className="topbar-user">
            <span>{user?.name}</span>
            <div className="user-dropdown">
              <button onClick={() => setDropdownOpen(!dropdownOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <Avatar src={user?.avatar} alt={user?.name} size="40px" />
              </button>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <Link to={`/profile/${user?.id}`} className="dropdown-item" onClick={() => setDropdownOpen(false)}>My Profile</Link>
                  <Link to="/edit-profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>Edit Profile</Link>
                  <button onClick={logout} className="dropdown-item" style={{ color: 'var(--danger)' }}>Logout</button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="app-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
