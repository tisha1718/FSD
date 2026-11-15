import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ currentView, setCurrentView }) {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setCurrentView('/');
  };

  const isActive = (view) => {
    if (view === '/' && (currentView === '/' || currentView === 'landing')) return true;
    if (view === '/dashboard' && (currentView === '/dashboard' || currentView === 'dashboard')) return true;
    if (view === '/admin/dashboard' && (currentView === '/admin/dashboard' || currentView === 'admin')) return true;
    if (view === '/my-bookings' && (currentView === '/my-bookings' || currentView === 'my-bookings')) return true;
    return currentView === view;
  };

  return (
    <header className="main-header">
      <div className="header-container">
        <div className="brand" onClick={() => setCurrentView('/')} style={{ cursor: 'pointer' }}>
          <div className="brand-logo">P5</div>
          <div>
            <h1 className="brand-text">PARKIFY</h1>
            <span className="brand-tag">
              {isAdmin ? '🛡️ Admin Console (RBAC Active)' : 'Smart Parking &bull; CO6'}
            </span>
          </div>
        </div>

        {/* Dynamic Navigation Menus Based on Role */}
        <nav className="header-nav">
          <button 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
            onClick={() => setCurrentView('/')}
          >
            Home
          </button>
          
          {/* Normal User & Guest view: User Dashboard / Find Parking */}
          <button 
            className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
            onClick={() => setCurrentView('/dashboard')}
          >
            Find Parking
          </button>

          {/* Normal User & Admin: My Bookings */}
          {isAuthenticated && (
            <button 
              className={`nav-link ${isActive('/my-bookings') ? 'active' : ''}`}
              onClick={() => setCurrentView('/my-bookings')}
            >
              My Bookings
            </button>
          )}

          {/* ADMIN ONLY NAV LINK: Hidden from regular users */}
          {isAuthenticated && isAdmin && (
            <button 
              className={`nav-link admin-nav-link ${isActive('/admin/dashboard') ? 'active' : ''}`}
              onClick={() => setCurrentView('/admin/dashboard')}
            >
              Admin Dashboard
            </button>
          )}
        </nav>

        <div className="header-auth">
          {isAuthenticated ? (
            <div className="user-profile-menu">
              <button 
                className="user-pill-btn"
                onClick={() => setCurrentView('/profile')}
                title="View Profile"
              >
                <span className="avatar-circle">{user.name?.charAt(0).toUpperCase() || 'U'}</span>
                <span className="user-name-text">{user.name?.split(' ')[0]}</span>
                {isAdmin ? (
                  <span className="admin-chip">ADMIN</span>
                ) : (
                  <span className="user-chip">USER</span>
                )}
              </button>
              <button className="btn-logout" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-btns-group">
              <button className="btn-login-header" onClick={() => setCurrentView('/login')}>
                Log In
              </button>
              <button className="btn-register-header" onClick={() => setCurrentView('/register')}>
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
