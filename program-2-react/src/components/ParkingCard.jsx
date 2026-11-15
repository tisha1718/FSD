import React from 'react';

export default function ParkingCard({ hub, isSelected, onSelect }) {
  const availableCount = hub.slots.filter(s => s.status === 'AVAILABLE').length;

  return (
    <div 
      className={`hub-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(hub.id)}
    >
      <div className="hub-card-top">
        <div>
          <h3 className="hub-name">{hub.name}</h3>
          <p className="hub-address">{hub.address}</p>
        </div>
        <span className={`pill-badge ${availableCount > 0 ? 'pill-success' : 'pill-danger'}`}>
          {availableCount} Free / {hub.slots.length} Total
        </span>
      </div>

      <div className="hub-card-bottom">
        <span className="city-tag">{hub.city}</span>
        <div className="price-tag">
          From <strong>₹{hub.hourlyRate}</strong> / hr
        </div>
      </div>
    </div>
  );
}
