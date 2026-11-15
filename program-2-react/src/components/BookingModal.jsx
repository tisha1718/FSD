import React, { useState } from 'react';

export default function BookingModal({ slot, hub, onClose, onConfirm }) {
  const [driverName, setDriverName] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicleNo, setVehicleNo] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('14:00');
  const [duration, setDuration] = useState(2);
  const [errors, setErrors] = useState({});

  if (!slot || !hub) return null;

  const totalAmount = duration * slot.rate;

  const validate = () => {
    const errs = {};
    if (!driverName.trim() || driverName.trim().length < 3) {
      errs.driverName = 'Driver name must be at least 3 characters';
    }
    if (!/^[6-9]\d{9}$/.test(phone.trim())) {
      errs.phone = 'Enter a valid 10-digit mobile number';
    }
    if (!vehicleNo.trim() || vehicleNo.trim().length < 4) {
      errs.vehicleNo = 'Enter valid vehicle registration plate (e.g. MH12AB1234)';
    }
    if (!date) {
      errs.date = 'Select reservation date';
    }
    if (duration < 1 || duration > 24) {
      errs.duration = 'Duration must be between 1 and 24 hours';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const booking = {
      id: 'RCT-' + Math.floor(100000 + Math.random() * 900000),
      hubId: hub.id,
      hubName: hub.name,
      slotId: slot.id,
      slotNumber: slot.number,
      slotType: slot.type,
      driverName: driverName.trim(),
      phone: phone.trim(),
      vehicleNo: vehicleNo.trim().toUpperCase(),
      date,
      time,
      duration: Number(duration),
      rate: slot.rate,
      totalAmount,
      status: 'CONFIRMED',
      createdAt: new Date().toISOString()
    };

    onConfirm(booking);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <div>
            <h3>Book Slot {slot.number}</h3>
            <p>{hub.name} &bull; ₹{slot.rate}/hour</p>
          </div>
          <button className="btn-close" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Driver Full Name *</label>
            <input 
              type="text" 
              placeholder="e.g. Rahul Sharma"
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
            />
            {errors.driverName && <span className="field-err">{errors.driverName}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone Number *</label>
              <input 
                type="tel" 
                placeholder="9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              {errors.phone && <span className="field-err">{errors.phone}</span>}
            </div>

            <div className="form-group">
              <label>Vehicle Plate No. *</label>
              <input 
                type="text" 
                placeholder="MH-12-AB-1234"
                value={vehicleNo}
                onChange={(e) => setVehicleNo(e.target.value.toUpperCase())}
              />
              {errors.vehicleNo && <span className="field-err">{errors.vehicleNo}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date *</label>
              <input 
                type="date" 
                min={new Date().toISOString().split('T')[0]}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              {errors.date && <span className="field-err">{errors.date}</span>}
            </div>

            <div className="form-group">
              <label>Start Time *</label>
              <input 
                type="time" 
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Duration (Hours) *</label>
              <input 
                type="number" 
                min="1" 
                max="24"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
              {errors.duration && <span className="field-err">{errors.duration}</span>}
            </div>
          </div>

          <div className="pricing-summary-box">
            <div className="summary-line">
              <span>Hourly Rate:</span>
              <span>₹{slot.rate} / hr</span>
            </div>
            <div className="summary-line">
              <span>Duration:</span>
              <span>{duration} hour(s)</span>
            </div>
            <div className="summary-total">
              <span>Total Payable:</span>
              <span>₹{totalAmount}</span>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-submit">Confirm Reservation</button>
          </div>
        </form>
      </div>
    </div>
  );
}
