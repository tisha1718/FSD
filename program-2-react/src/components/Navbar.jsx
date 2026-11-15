import React from 'react';

export default function Navbar({ activeTab, setActiveTab, bookingCount }) {
  return (
    <header className="react-navbar">
      <div className="navbar-container">
        <div className="brand" onClick={() => setActiveTab('explore')} style={{ cursor: 'pointer' }}>
          <div className="brand-logo">P2</div>
          <div>
            <h1 className="brand-title">PARKIFY <span className="react-badge">React CO3</span></h1>
            <p className="brand-subtitle">Components, Props, State, Hooks &amp; Client Routing</p>
          </div>
        </div>

        <nav className="nav-tabs">
          <button 
            className={`nav-tab-btn ${activeTab === 'explore' ? 'active' : ''}`}
            onClick={() => setActiveTab('explore')}
          >
            Explore Hubs
          </button>
          <button 
            className={`nav-tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            My Bookings
            {bookingCount > 0 && <span className="tab-counter">{bookingCount}</span>}
          </button>
          <button 
            className={`nav-tab-btn ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            Architecture (CO3)
          </button>
        </nav>
      </div>
    </header>
  );
}
