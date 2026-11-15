import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function LandingPage({ setCurrentView }) {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-badge">Smart City Parking Infrastructure &bull; 2026</div>
        <h1 className="hero-heading">
          Frictionless Parking Reservations, <span className="highlight-text">Powered by Real-Time Data</span>
        </h1>
        <p className="hero-subtext">
          PARKIFY connects urban drivers with verified parking bays in real-time. Choose your hub, pick an available bay, and secure your spot in seconds without circling blocks.
        </p>

        <div className="hero-actions">
          {isAdmin ? (
            <button 
              className="btn-hero-primary" 
              onClick={() => setCurrentView('/admin/dashboard')}
            >
              Go to Admin Dashboard &rarr;
            </button>
          ) : (
            <button 
              className="btn-hero-primary" 
              onClick={() => setCurrentView('/dashboard')}
            >
              Find &amp; Book a Parking Slot &rarr;
            </button>
          )}
          
          {!isAuthenticated ? (
            <button 
              className="btn-hero-secondary"
              onClick={() => setCurrentView('/login')}
            >
              Sign In to Your Account
            </button>
          ) : (
            <button 
              className="btn-hero-secondary"
              onClick={() => setCurrentView('/my-bookings')}
            >
              View My Bookings
            </button>
          )}
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="features-section">
        <div className="section-title-wrap">
          <h2>Engineered for Modern Urban Mobility</h2>
          <p>Full stack architecture with zero double-booking tolerance</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">&#9889;</div>
            <h3>Real-Time Slot Bays</h3>
            <p>Interactive floor-by-floor occupancy matrix for Cars, Two-Wheelers, and dedicated EV fast-charging bays.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">&#128274;</div>
            <h3>Transactional Safety</h3>
            <p>Sequelize database transactions ensure atomic slot allocations and 100% guarantee against overlapping bookings.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">&#128179;</div>
            <h3>Dynamic Tariff Engine</h3>
            <p>Automated duration and rate calculation with transparent hourly breakdowns and instant booking pass generation.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">&#128200;</div>
            <h3>Executive Admin Portal</h3>
            <p>Complete management controls for parking operators: occupancy analytics, revenue metrics, slot creation and booking lifecycle controls.</p>
          </div>
        </div>
      </section>

      {/* Quick Demo Credentials Card */}
      <section className="demo-credentials-card">
        <div className="demo-content">
          <h3>Test Drive PARKIFY Instantly</h3>
          <p>Pre-seeded accounts ready for evaluation and grading:</p>
          <div className="creds-tags">
            <div className="cred-item">
              <span className="role-tag admin">Admin Operator</span>
              <code>admin@parkify.com</code> / <code>admin123</code>
            </div>
            <div className="cred-item">
              <span className="role-tag user">Standard Driver</span>
              <code>user@parkify.com</code> / <code>user123</code>
            </div>
          </div>
        </div>
        <button className="btn-demo-login" onClick={() => setCurrentView('login')}>
          Open Sign In Form
        </button>
      </section>
    </div>
  );
}
