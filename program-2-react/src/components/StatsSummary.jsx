import React from 'react';

export default function StatsSummary({ hubs, bookings }) {
  const totalSlots = hubs.reduce((acc, h) => acc + h.slots.length, 0);
  const occupiedSlots = hubs.reduce(
    (acc, h) => acc + h.slots.filter(s => s.status === 'OCCUPIED').length, 
    0
  );
  const freeSlots = totalSlots - occupiedSlots;
  const totalRevenue = bookings.reduce((acc, b) => acc + (b.status === 'CONFIRMED' ? b.totalAmount : 0), 0);

  return (
    <div className="stats-row">
      <div className="stat-card">
        <span className="stat-label">Total Parking Bays</span>
        <span className="stat-number">{totalSlots}</span>
      </div>
      <div className="stat-card">
        <span className="stat-label">Available Now</span>
        <span className="stat-number stat-green">{freeSlots}</span>
      </div>
      <div className="stat-card">
        <span className="stat-label">Currently Occupied</span>
        <span className="stat-number stat-orange">{occupiedSlots}</span>
      </div>
      <div className="stat-card">
        <span className="stat-label">Active Bookings Value</span>
        <span className="stat-number stat-blue">₹{totalRevenue}</span>
      </div>
    </div>
  );
}
