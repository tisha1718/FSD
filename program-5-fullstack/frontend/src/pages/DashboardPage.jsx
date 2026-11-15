import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function DashboardPage({ setCurrentView }) {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('ALL');
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState('ALL');

  // Booking Modal State
  const [modalSlot, setModalSlot] = useState(null);
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [bookingDate, setBookingDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('11:00');
  const [durationHours, setDurationHours] = useState(2);
  const [submitting, setSubmitting] = useState(false);

  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      setLoading(true);
      const res = await api.getLocations();
      if (res.success) {
        setLocations(res.data);
        if (res.data.length > 0) {
          selectLocation(res.data[0]);
        }
      }
    } catch (err) {
      showToast('Could not load parking locations.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const selectLocation = async (loc) => {
    setSelectedLocation(loc);
    try {
      const res = await api.getSlotsByLocation(loc.id);
      if (res.success) {
        setSlots(res.data);
      }
    } catch (err) {
      showToast('Failed to load slots for this location.', 'error');
    }
  };

  const handleSlotClick = (slot) => {
    if (slot.status === 'OCCUPIED') {
      showToast(`Slot ${slot.slotNumber} is currently occupied. Please pick an available green bay.`, 'error');
      return;
    }

    if (!isAuthenticated) {
      showToast('Please sign in to reserve a parking bay.', 'info');
      setCurrentView('/login');
      return;
    }

    setModalSlot(slot);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!vehicleNumber.trim()) {
      showToast('Please provide your vehicle plate number.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        locationId: selectedLocation.id,
        slotId: modalSlot.id,
        vehicleNumber: vehicleNumber.trim().toUpperCase(),
        vehicleType: modalSlot.type,
        date: bookingDate,
        startTime,
        durationHours: Number(durationHours)
      };

      const res = await api.createBooking(payload);
      if (res.success) {
        showToast(`Pass Generated! Code: ${res.data.bookingCode}`, 'success');
        setModalSlot(null);
        setVehicleNumber('');
        // Refresh slots and locations to reflect updated occupancy
        selectLocation(selectedLocation);
        loadLocations();
        setCurrentView('/my-bookings');
      }
    } catch (err) {
      showToast(err.message || 'Booking collision or server error.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Filter Locations
  const cities = Array.from(new Set(locations.map(l => l.city)));
  const filteredLocations = locations.filter(loc => {
    const matchSearch = loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        loc.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        loc.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCity = cityFilter === 'ALL' || loc.city === cityFilter;
    return matchSearch && matchCity;
  });

  // Filter Slots in active location
  const filteredSlots = slots.filter(s => {
    if (vehicleTypeFilter === 'ALL') return true;
    return s.type === vehicleTypeFilter;
  });

  return (
    <div className="dashboard-container">
      {/* Top Filter Bar */}
      <section className="search-filter-banner">
        <div className="banner-title">
          <h2>Find &amp; Reserve Parking Bays</h2>
          <p>Real-time occupancy tracking backed by PostgreSQL transactions</p>
        </div>

        <div className="search-controls-grid">
          <div className="ctrl-group">
            <label>Search Hub</label>
            <input 
              type="text" 
              placeholder="e.g. Cyber City, Palladium, Terminal 3..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="ctrl-group">
            <label>City</label>
            <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)}>
              <option value="ALL">All Cities</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="ctrl-group">
            <label>Vehicle Type</label>
            <select value={vehicleTypeFilter} onChange={(e) => setVehicleTypeFilter(e.target.value)}>
              <option value="ALL">All Bays</option>
              <option value="FOUR_WHEELER">4-Wheeler (Car / SUV)</option>
              <option value="TWO_WHEELER">2-Wheeler (Bike)</option>
              <option value="EV">EV Charger Bay</option>
            </select>
          </div>
        </div>
      </section>

      {/* Main Split Grid */}
      <div className="dashboard-split-layout">
        {/* Left: Location Cards */}
        <section className="locations-column">
          <div className="col-title-bar">
            <h3>Verified Parking Hubs</h3>
            <span className="count-pill">{filteredLocations.length} Available</span>
          </div>

          {loading ? (
            <div className="loading-state">Loading verified parking hubs...</div>
          ) : filteredLocations.length === 0 ? (
            <div className="empty-state-box">No parking hubs match the query.</div>
          ) : (
            <div className="location-cards-stack">
              {filteredLocations.map(loc => {
                const isSelected = selectedLocation?.id === loc.id;
                return (
                  <div 
                    key={loc.id} 
                    className={`loc-card ${isSelected ? 'active-loc' : ''}`}
                    onClick={() => selectLocation(loc)}
                  >
                    <div className="loc-card-header">
                      <div>
                        <h4>{loc.name}</h4>
                        <p className="loc-address-text">{loc.address}</p>
                      </div>
                      <span className={`free-badge ${loc.availableSlots > 0 ? 'free-badge-green' : 'free-badge-red'}`}>
                        {loc.availableSlots} Free
                      </span>
                    </div>

                    <div className="loc-card-meta">
                      <span className="city-pill">{loc.city}</span>
                      <span className="price-text">Base: <strong>₹{loc.hourlyRate}</strong> / hr</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Right: Interactive Slot Bay Grid */}
        <section className="slots-column">
          {selectedLocation ? (
            <div className="slot-viewer-panel">
              <div className="slot-viewer-header">
                <div>
                  <h3>{selectedLocation.name} &bull; Bay Matrix</h3>
                  <p>{selectedLocation.address}, {selectedLocation.city}</p>
                </div>

                <div className="bay-legend">
                  <span className="legend-chip"><span className="chip-dot avail"></span> Available</span>
                  <span className="legend-chip"><span className="chip-dot occ"></span> Occupied</span>
                </div>
              </div>

              {filteredSlots.length === 0 ? (
                <div className="empty-state-box">No slots available matching this vehicle category.</div>
              ) : (
                <div className="bays-grid">
                  {filteredSlots.map(slot => {
                    const isAvailable = slot.status === 'AVAILABLE';
                    return (
                      <div 
                        key={slot.id} 
                        className={`bay-box ${isAvailable ? 'bay-avail' : 'bay-occ'}`}
                        onClick={() => handleSlotClick(slot)}
                      >
                        <div className="bay-top">
                          <span className="bay-num">{slot.slotNumber}</span>
                          <span className="bay-floor">{slot.floor}</span>
                        </div>
                        <div className="bay-type">{slot.type.replace('_', ' ')}</div>
                        <div className="bay-rate">₹{slot.hourlyRate}/hr</div>
                        <div className="bay-status-label">{isAvailable ? 'RESERVE' : 'OCCUPIED'}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="empty-state-box">Please select a parking hub on the left.</div>
          )}
        </section>
      </div>

      {/* Slot Reservation Modal */}
      {modalSlot && selectedLocation && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="modal-head">
              <div>
                <h3>Reserve Slot {modalSlot.slotNumber}</h3>
                <p>{selectedLocation.name} &bull; ₹{modalSlot.hourlyRate}/hour</p>
              </div>
              <button className="modal-x-btn" onClick={() => setModalSlot(null)}>&times;</button>
            </div>

            <form onSubmit={handleBookingSubmit} className="modal-form-body">
              <div className="field-group">
                <label>Vehicle Plate Registration *</label>
                <input 
                  type="text" 
                  placeholder="e.g. MH-12-AB-1234"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                  required
                />
              </div>

              <div className="field-row">
                <div className="field-group">
                  <label>Reservation Date *</label>
                  <input 
                    type="date" 
                    min={new Date().toISOString().split('T')[0]}
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    required
                  />
                </div>

                <div className="field-group">
                  <label>Arrival Time *</label>
                  <input 
                    type="time" 
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                  />
                </div>

                <div className="field-group">
                  <label>Duration (Hours) *</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="24"
                    value={durationHours}
                    onChange={(e) => setDurationHours(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Dynamic Bill Calculation */}
              <div className="tariff-breakdown-card">
                <div className="tariff-line">
                  <span>Slot Hourly Tariff:</span>
                  <span>₹{modalSlot.hourlyRate} / hr</span>
                </div>
                <div className="tariff-line">
                  <span>Reserved Duration:</span>
                  <span>{durationHours} hour(s)</span>
                </div>
                <div className="tariff-total-line">
                  <span>Total Estimated Cost:</span>
                  <span className="total-price">₹{Number(durationHours) * modalSlot.hourlyRate}</span>
                </div>
              </div>

              <div className="modal-button-row">
                <button type="button" className="btn-modal-cancel" onClick={() => setModalSlot(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn-modal-confirm" disabled={submitting}>
                  {submitting ? 'Confirming with Database...' : 'Confirm & Generate Pass'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
