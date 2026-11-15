import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

export default function MyBookingsPage({ setCurrentView }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const res = await api.getMyBookings();
      if (res.success) {
        setBookings(res.data);
      }
    } catch (err) {
      showToast('Could not load your reservations.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id, code) => {
    if (!window.confirm(`Are you sure you want to cancel booking pass #${code}?`)) return;

    try {
      const res = await api.cancelBooking(id);
      if (res.success) {
        showToast(`Pass #${code} cancelled and slot released back to available pool.`, 'info');
        loadBookings();
      }
    } catch (err) {
      showToast(err.message || 'Cancellation failed.', 'error');
    }
  };

  return (
    <div className="my-bookings-container">
      <div className="page-head-bar">
        <div>
          <h2>My Parking Passes</h2>
          <p>Active and past reservations verified through PostgreSQL database records</p>
        </div>
        <button className="btn-new-booking" onClick={() => setCurrentView('/dashboard')}>
          + Book Another Slot
        </button>
      </div>

      {loading ? (
        <div className="loading-state">Loading your parking records...</div>
      ) : bookings.length === 0 ? (
        <div className="empty-passes-card">
          <div className="empty-icon">&#128663;</div>
          <h3>No Parking Passes Found</h3>
          <p>You haven't reserved any parking bays yet. Explore hubs and book your spot now.</p>
          <button className="btn-explore-now" onClick={() => setCurrentView('/dashboard')}>
            Explore Parking Hubs
          </button>
        </div>
      ) : (
        <div className="passes-grid">
          {bookings.map(b => (
            <div key={b.id} className="pass-card">
              <div className="pass-card-top">
                <div>
                  <span className="pass-code">{b.bookingCode}</span>
                  <h3 className="pass-hub-name">{b.location?.name || 'Parking Hub'}</h3>
                  <p className="pass-address">{b.location?.address}, {b.location?.city}</p>
                </div>
                <span className={`pass-status-chip ${b.status.toLowerCase()}`}>
                  {b.status}
                </span>
              </div>

              <div className="pass-card-specs">
                <div className="spec-item">
                  <span className="spec-lbl">Reserved Bay</span>
                  <span className="spec-val highlight">{b.slot?.slotNumber || 'Bay'} ({b.vehicleType})</span>
                </div>
                <div className="spec-item">
                  <span className="spec-lbl">Vehicle Plate</span>
                  <span className="spec-val">{b.vehicleNumber}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-lbl">Schedule Date</span>
                  <span className="spec-val">{b.date} at {b.startTime}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-lbl">Duration</span>
                  <span className="spec-val">{b.durationHours} hr(s)</span>
                </div>
                <div className="spec-item">
                  <span className="spec-lbl">Hourly Rate</span>
                  <span className="spec-val">₹{b.ratePerHour}/hr</span>
                </div>
                <div className="spec-item">
                  <span className="spec-lbl">Total Paid</span>
                  <span className="spec-val price-val">₹{b.totalAmount}</span>
                </div>
              </div>

              {b.status === 'CONFIRMED' && (
                <div className="pass-card-actions">
                  <button 
                    className="btn-cancel-pass"
                    onClick={() => handleCancel(b.id, b.bookingCode)}
                  >
                    Cancel Booking &amp; Release Bay
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
