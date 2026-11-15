import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function UnauthorizedPage({ setCurrentView }) {
  const { user } = useAuth();

  return (
    <div className="unauthorized-page-container">
      <div className="unauthorized-card">
        <div className="shield-icon">&#128737;</div>
        <div className="error-code-badge">HTTP 403 FORBIDDEN</div>
        <h2>Access Denied: Admin Privilege Required</h2>
        <p>
          You are currently signed in as <strong>{user?.name || 'User'}</strong> (<code>{user?.email || 'N/A'}</code>) with role <strong>"{user?.role || 'user'}"</strong>.
        </p>
        <p className="sub-explanation">
          The <code>/admin/dashboard</code> console contains restricted controls (user directories, full database ledgers, revenue financials, and inventory modifications) accessible only by verified administrators.
        </p>

        <div className="unauthorized-actions">
          <button 
            className="btn-unauthorized-primary"
            onClick={() => setCurrentView('/dashboard')}
          >
            &larr; Return to User Dashboard
          </button>
          <button 
            className="btn-unauthorized-secondary"
            onClick={() => setCurrentView('/my-bookings')}
          >
            View My Bookings
          </button>
        </div>
      </div>
    </div>
  );
}
