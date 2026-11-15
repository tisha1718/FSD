import React from 'react';

export default function BookingList({ bookings, onCancelBooking }) {
  if (bookings.length === 0) {
    return (
      <div className="empty-bookings-box">
        <h4>No Active Parking Bookings</h4>
        <p>You haven't reserved any parking bays yet. Head over to "Explore Hubs" to pick a slot.</p>
      </div>
    );
  }

  return (
    <div className="booking-list-container">
      <div className="list-header">
        <h3>My Reserved Parking Passes</h3>
        <span className="badge-count">{bookings.length} Passes</span>
      </div>

      <div className="bookings-grid">
        {bookings.map(b => (
          <div key={b.id} className="booking-pass-card">
            <div className="pass-header">
              <div>
                <span className="pass-id">#{b.id}</span>
                <h4 className="pass-hub">{b.hubName}</h4>
              </div>
              <span className={`pass-status ${b.status.toLowerCase()}`}>
                {b.status}
              </span>
            </div>

            <div className="pass-details">
              <div className="detail-item">
                <span className="detail-label">Bay Number</span>
                <span className="detail-val highlight">{b.slotNumber} ({b.slotType})</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Driver</span>
                <span className="detail-val">{b.driverName}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Vehicle</span>
                <span className="detail-val">{b.vehicleNo}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Schedule</span>
                <span className="detail-val">{b.date} at {b.time}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Duration</span>
                <span className="detail-val">{b.duration} hr(s)</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Amount Paid</span>
                <span className="detail-val price">₹{b.totalAmount}</span>
              </div>
            </div>

            {b.status === 'CONFIRMED' && (
              <div className="pass-footer">
                <button 
                  className="btn-danger-sm"
                  onClick={() => onCancelBooking(b.id)}
                >
                  Cancel Booking
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
