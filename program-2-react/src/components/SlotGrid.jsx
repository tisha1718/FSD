import React from 'react';

export default function SlotGrid({ hub, selectedSlot, onSelectSlot, typeFilter }) {
  if (!hub) {
    return (
      <div className="empty-panel">
        <p>Select a parking location above to view live slot availability.</p>
      </div>
    );
  }

  const filteredSlots = hub.slots.filter(s => {
    if (typeFilter === 'ALL') return true;
    return s.type === typeFilter;
  });

  return (
    <div className="slot-grid-panel">
      <div className="slot-panel-header">
        <div>
          <h3>{hub.name} &bull; Real-Time Bays</h3>
          <p>{hub.address}</p>
        </div>
        <div className="slot-indicators">
          <span className="indicator"><span className="dot dot-avail"></span> Available</span>
          <span className="indicator"><span className="dot dot-selected"></span> Selected</span>
          <span className="indicator"><span className="dot dot-occ"></span> Occupied</span>
        </div>
      </div>

      {filteredSlots.length === 0 ? (
        <div className="empty-panel">
          <p>No slots found matching the selected vehicle category.</p>
        </div>
      ) : (
        <div className="slots-grid">
          {filteredSlots.map(slot => {
            const isSelected = selectedSlot && selectedSlot.id === slot.id;
            const isOccupied = slot.status === 'OCCUPIED';

            let slotClass = 'slot-item';
            if (isOccupied) slotClass += ' slot-occupied';
            else if (isSelected) slotClass += ' slot-selected';
            else slotClass += ' slot-available';

            return (
              <div 
                key={slot.id}
                className={slotClass}
                onClick={() => !isOccupied && onSelectSlot(slot, hub)}
              >
                <div className="slot-num">{slot.number}</div>
                <div className="slot-badge">{slot.type}</div>
                <div className="slot-floor">{slot.floor}</div>
                <div className="slot-price">₹{slot.rate}/hr</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
