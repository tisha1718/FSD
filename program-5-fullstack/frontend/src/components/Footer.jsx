import React from 'react';

export default function Footer({ setCurrentView }) {
  return (
    <footer className="main-footer">
      <div className="footer-container">
        <div className="footer-left">
          <div className="footer-brand">
            <span className="footer-logo">P5</span>
            <h3>PARKIFY</h3>
          </div>
          <p>
            Smart Parking Management &amp; Slot Booking System. Built with React, Express, PostgreSQL &amp; Sequelize for Course Outcome 6 (CO6).
          </p>
        </div>

        <div className="footer-links">
          <h4>Navigation</h4>
          <button onClick={() => setCurrentView('landing')}>Home</button>
          <button onClick={() => setCurrentView('dashboard')}>Find Parking</button>
          <button onClick={() => setCurrentView('my-bookings')}>My Bookings</button>
          <button onClick={() => setCurrentView('admin')}>Admin Console</button>
        </div>

        <div className="footer-meta">
          <h4>System Spec</h4>
          <p>&bull; Frontend: React 18, Vite, Context API</p>
          <p>&bull; Backend: Node.js, Express REST API</p>
          <p>&bull; Database: PostgreSQL / Sequelize ORM</p>
          <p>&bull; Security: JWT Bearer &amp; Bcrypt</p>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} PARKIFY Technologies. Academic &amp; Portfolio Project. All rights reserved.
      </div>
    </footer>
  );
}
