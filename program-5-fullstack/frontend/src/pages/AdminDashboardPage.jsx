import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

export default function AdminDashboardPage() {
  const [activeAdminTab, setActiveAdminTab] = useState('analytics');
  const [analytics, setAnalytics] = useState(null);
  const [locations, setLocations] = useState([]);
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Location Form State
  const [newLocName, setNewLocName] = useState('');
  const [newLocAddress, setNewLocAddress] = useState('');
  const [newLocCity, setNewLocCity] = useState('');
  const [newLocRate, setNewLocRate] = useState(50);
  const [newLocDesc, setNewLocDesc] = useState('');

  // Edit Location State
  const [editingLoc, setEditingLoc] = useState(null); // { id, name, address, city, hourlyRate, description }

  // New Slot Form State
  const [slotLocId, setSlotLocId] = useState('');
  const [slotNumber, setSlotNumber] = useState('');
  const [slotType, setSlotType] = useState('FOUR_WHEELER');
  const [slotRate, setSlotRate] = useState(50);
  const [slotFloor, setSlotFloor] = useState('Ground');

  // Edit Slot State
  const [editingSlot, setEditingSlot] = useState(null);

  const { showToast } = useToast();

  useEffect(() => {
    loadAllAdminData();
  }, []);

  const loadAllAdminData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, locsRes, bookingsRes, usersRes] = await Promise.all([
        api.getAdminAnalytics(),
        api.getLocations(),
        api.getAllBookings(),
        api.getAllUsers()
      ]);

      if (analyticsRes.success) setAnalytics(analyticsRes.data);
      if (locsRes.success) {
        setLocations(locsRes.data);
        if (locsRes.data.length > 0 && !slotLocId) setSlotLocId(locsRes.data[0].id);
        // Load all slots for the active location
        const targetLocId = slotLocId || locsRes.data[0]?.id;
        if (targetLocId) {
          loadSlotsForLocation(targetLocId);
        }
      }
      if (bookingsRes.success) setBookings(bookingsRes.data);
      if (usersRes.success) setUsers(usersRes.data);
    } catch (err) {
      showToast('Error loading administrative records.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadSlotsForLocation = async (locId) => {
    try {
      const res = await api.getSlotsByLocation(locId);
      if (res.success) setSlots(res.data);
    } catch (err) {
      console.error('Failed to load slots for loc', locId);
    }
  };

  // 1. LOCATIONS CRUD
  const handleCreateLocation = async (e) => {
    e.preventDefault();
    if (!newLocName || !newLocAddress || !newLocCity) {
      showToast('Please fill all required location fields.', 'error');
      return;
    }

    try {
      const res = await api.createLocation({
        name: newLocName,
        address: newLocAddress,
        city: newLocCity,
        hourlyRate: Number(newLocRate),
        description: newLocDesc
      });
      if (res.success) {
        showToast('New parking location created successfully!', 'success');
        setNewLocName('');
        setNewLocAddress('');
        setNewLocCity('');
        setNewLocDesc('');
        loadAllAdminData();
      }
    } catch (err) {
      showToast(err.message || 'Failed to create location', 'error');
    }
  };

  const handleUpdateLocation = async (e) => {
    e.preventDefault();
    if (!editingLoc) return;

    try {
      const res = await api.updateLocation(editingLoc.id, {
        name: editingLoc.name,
        address: editingLoc.address,
        city: editingLoc.city,
        hourlyRate: Number(editingLoc.hourlyRate),
        description: editingLoc.description
      });
      if (res.success) {
        showToast(`Location ${editingLoc.name} updated successfully!`, 'success');
        setEditingLoc(null);
        loadAllAdminData();
      }
    } catch (err) {
      showToast(err.message || 'Update failed', 'error');
    }
  };

  const handleDeleteLocation = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}? All associated slots and bookings will be removed.`)) return;

    try {
      const res = await api.deleteLocation(id);
      if (res.success) {
        showToast(`Location ${name} deleted.`, 'info');
        loadAllAdminData();
      }
    } catch (err) {
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  // 2. SLOTS CRUD
  const handleCreateSlot = async (e) => {
    e.preventDefault();
    if (!slotLocId || !slotNumber) {
      showToast('Select a location and enter slot number.', 'error');
      return;
    }

    try {
      const res = await api.createSlot({
        locationId: Number(slotLocId),
        slotNumber: slotNumber.toUpperCase(),
        type: slotType,
        hourlyRate: Number(slotRate),
        floor: slotFloor
      });
      if (res.success) {
        showToast(`Slot ${slotNumber} created successfully!`, 'success');
        setSlotNumber('');
        loadAllAdminData();
        loadSlotsForLocation(slotLocId);
      }
    } catch (err) {
      showToast(err.message || 'Failed to create slot', 'error');
    }
  };

  const handleUpdateSlot = async (e) => {
    e.preventDefault();
    if (!editingSlot) return;

    try {
      const res = await api.updateSlot(editingSlot.id, {
        slotNumber: editingSlot.slotNumber,
        type: editingSlot.type,
        status: editingSlot.status,
        hourlyRate: Number(editingSlot.hourlyRate),
        floor: editingSlot.floor
      });
      if (res.success) {
        showToast(`Slot ${editingSlot.slotNumber} updated successfully!`, 'success');
        setEditingSlot(null);
        loadAllAdminData();
        loadSlotsForLocation(slotLocId);
      }
    } catch (err) {
      showToast(err.message || 'Failed to update slot', 'error');
    }
  };

  const handleDeleteSlot = async (id, num) => {
    if (!window.confirm(`Delete slot ${num}?`)) return;

    try {
      const res = await api.deleteSlot(id);
      if (res.success) {
        showToast(`Slot ${num} deleted.`, 'info');
        loadAllAdminData();
        loadSlotsForLocation(slotLocId);
      }
    } catch (err) {
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  // 3. BOOKING STATUS OVERRIDE
  const handleStatusChange = async (bookingId, status) => {
    try {
      const res = await api.updateBookingStatus(bookingId, status);
      if (res.success) {
        showToast(`Booking #${bookingId} status updated to ${status}`, 'success');
        loadAllAdminData();
      }
    } catch (err) {
      showToast(err.message || 'Status update failed', 'error');
    }
  };

  if (loading) {
    return <div className="loading-state">Loading Executive Admin Portal...</div>;
  }

  return (
    <div className="admin-portal-container">
      {/* Top Banner */}
      <div className="admin-top-banner">
        <div>
          <h2>Executive Admin Console (/admin/dashboard)</h2>
          <p>Role-Based Access Control Active &bull; Administrator Privileges Granted</p>
        </div>
        <button className="btn-refresh-admin" onClick={loadAllAdminData}>
          &#8635; Refresh System State
        </button>
      </div>

      {/* Analytics Metric Cards */}
      {analytics && (
        <div className="admin-metrics-grid">
          <div className="metric-box">
            <span className="metric-title">Total Revenue</span>
            <span className="metric-value metric-blue">₹{analytics.totalRevenueRupees}</span>
            <span className="metric-sub">From confirmed bookings</span>
          </div>

          <div className="metric-box">
            <span className="metric-title">Occupancy Rate</span>
            <span className="metric-value metric-purple">{analytics.occupancyRatePercent}%</span>
            <span className="metric-sub">{analytics.occupiedSlots} of {analytics.totalSlots} slots occupied</span>
          </div>

          <div className="metric-box">
            <span className="metric-title">Active Passes</span>
            <span className="metric-value metric-green">{analytics.activeBookings}</span>
            <span className="metric-sub">Live active reservations</span>
          </div>

          <div className="metric-box">
            <span className="metric-title">Registered Accounts</span>
            <span className="metric-value">{analytics.totalUsers}</span>
            <span className="metric-sub">{analytics.totalLocations} Managed Hubs</span>
          </div>
        </div>
      )}

      {/* Admin Nav Tabs */}
      <div className="admin-nav-tabs">
        <button 
          className={`admin-tab-btn ${activeAdminTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveAdminTab('analytics')}
        >
          Bookings Management ({bookings.length})
        </button>
        <button 
          className={`admin-tab-btn ${activeAdminTab === 'locations' ? 'active' : ''}`}
          onClick={() => setActiveAdminTab('locations')}
        >
          Manage Locations ({locations.length})
        </button>
        <button 
          className={`admin-tab-btn ${activeAdminTab === 'slots' ? 'active' : ''}`}
          onClick={() => setActiveAdminTab('slots')}
        >
          Manage Parking Slots
        </button>
        <button 
          className={`admin-tab-btn ${activeAdminTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveAdminTab('users')}
        >
          Registered Users ({users.length})
        </button>
      </div>

      {/* Tab 1: Bookings Management */}
      {activeAdminTab === 'analytics' && (
        <section className="admin-panel-card">
          <div className="panel-head">
            <h3>System-Wide Booking Ledger</h3>
            <p>Admin oversight over all reservations across the entire platform</p>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Pass Code</th>
                  <th>Customer</th>
                  <th>Location &amp; Slot</th>
                  <th>Schedule</th>
                  <th>Paid (₹)</th>
                  <th>Status</th>
                  <th>Admin Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b.id}>
                    <td><strong>{b.bookingCode}</strong></td>
                    <td>
                      <div><strong>{b.user?.name || 'User'}</strong></div>
                      <small style={{ color: '#64748b' }}>{b.user?.email} &bull; {b.vehicleNumber}</small>
                    </td>
                    <td>
                      <div>{b.location?.name}</div>
                      <small style={{ color: '#2563eb', fontWeight: 700 }}>Slot: {b.slot?.slotNumber} ({b.vehicleType})</small>
                    </td>
                    <td>
                      <div>{b.date}</div>
                      <small style={{ color: '#64748b' }}>{b.durationHours} hr(s) from {b.startTime}</small>
                    </td>
                    <td><strong>₹{b.totalAmount}</strong></td>
                    <td>
                      <span className={`pass-status-chip ${b.status.toLowerCase()}`}>
                        {b.status}
                      </span>
                    </td>
                    <td>
                      <div className="admin-status-dropdown-wrap">
                        <select 
                          value={b.status}
                          onChange={(e) => handleStatusChange(b.id, e.target.value)}
                          className="admin-select-status"
                        >
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Tab 2: Manage Locations (Add, Edit, Delete) */}
      {activeAdminTab === 'locations' && (
        <div className="admin-locations-layout">
          {/* Add or Edit Location Form */}
          <section className="admin-panel-card">
            <h3>{editingLoc ? `Edit Location #${editingLoc.id}` : 'Add New Parking Hub'}</h3>
            <form onSubmit={editingLoc ? handleUpdateLocation : handleCreateLocation} className="admin-form">
              <div className="field-group">
                <label>Hub Name *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Prestige Tech Park Hub"
                  value={editingLoc ? editingLoc.name : newLocName}
                  onChange={(e) => editingLoc ? setEditingLoc({ ...editingLoc, name: e.target.value }) : setNewLocName(e.target.value)}
                  required
                />
              </div>

              <div className="field-group">
                <label>Address *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Outer Ring Road, Marathahalli"
                  value={editingLoc ? editingLoc.address : newLocAddress}
                  onChange={(e) => editingLoc ? setEditingLoc({ ...editingLoc, address: e.target.value }) : setNewLocAddress(e.target.value)}
                  required
                />
              </div>

              <div className="field-row">
                <div className="field-group">
                  <label>City *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Bengaluru"
                    value={editingLoc ? editingLoc.city : newLocCity}
                    onChange={(e) => editingLoc ? setEditingLoc({ ...editingLoc, city: e.target.value }) : setNewLocCity(e.target.value)}
                    required
                  />
                </div>
                <div className="field-group">
                  <label>Base Tariff (₹/hr) *</label>
                  <input 
                    type="number" 
                    value={editingLoc ? editingLoc.hourlyRate : newLocRate}
                    onChange={(e) => editingLoc ? setEditingLoc({ ...editingLoc, hourlyRate: e.target.value }) : setNewLocRate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="field-group">
                <label>Description / Features</label>
                <textarea 
                  rows="3"
                  placeholder="e.g. CCTV surveillance, covered bay, automated gates..."
                  value={editingLoc ? (editingLoc.description || '') : newLocDesc}
                  onChange={(e) => editingLoc ? setEditingLoc({ ...editingLoc, description: e.target.value }) : setNewLocDesc(e.target.value)}
                />
              </div>

              <div className="admin-form-actions">
                <button type="submit" className="btn-admin-submit">
                  {editingLoc ? 'Save Changes' : '+ Create Location'}
                </button>
                {editingLoc && (
                  <button type="button" className="btn-cancel-edit" onClick={() => setEditingLoc(null)}>
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </section>

          {/* Existing Locations Table */}
          <section className="admin-panel-card">
            <h3>Active Facilities ({locations.length})</h3>
            <div className="admin-table-wrapper">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Hub Name</th>
                    <th>City</th>
                    <th>Tariff</th>
                    <th>Slots</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {locations.map(loc => (
                    <tr key={loc.id}>
                      <td>
                        <strong>{loc.name}</strong>
                        <div><small style={{ color: '#64748b' }}>{loc.address}</small></div>
                      </td>
                      <td>{loc.city}</td>
                      <td>₹{loc.hourlyRate}/hr</td>
                      <td>{loc.availableSlots} / {loc.totalSlots} Free</td>
                      <td>
                        <div className="admin-row-actions">
                          <button 
                            className="btn-edit-sm"
                            onClick={() => {
                              setEditingLoc(loc);
                              window.scrollTo({ top: 300, behavior: 'smooth' });
                            }}
                          >
                            Edit
                          </button>
                          <button 
                            className="btn-del-sm"
                            onClick={() => handleDeleteLocation(loc.id, loc.name)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {/* Tab 3: Add & Manage Slots */}
      {activeAdminTab === 'slots' && (
        <div className="admin-slots-layout">
          {/* Provision Slot Form */}
          <section className="admin-panel-card">
            <h3>{editingSlot ? `Edit Slot #${editingSlot.id}` : 'Provision New Parking Bay'}</h3>
            <form onSubmit={editingSlot ? handleUpdateSlot : handleCreateSlot} className="admin-form max-form-width">
              <div className="field-row">
                <div className="field-group">
                  <label>Assign to Location *</label>
                  <select 
                    value={slotLocId} 
                    onChange={(e) => {
                      setSlotLocId(e.target.value);
                      loadSlotsForLocation(e.target.value);
                    }} 
                    required
                  >
                    {locations.map(l => (
                      <option key={l.id} value={l.id}>{l.name} ({l.city})</option>
                    ))}
                  </select>
                </div>

                <div className="field-group">
                  <label>Slot Bay Number *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. A-12 or EV-05"
                    value={editingSlot ? editingSlot.slotNumber : slotNumber}
                    onChange={(e) => editingSlot ? setEditingSlot({ ...editingSlot, slotNumber: e.target.value }) : setSlotNumber(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="field-row">
                <div className="field-group">
                  <label>Vehicle Bay Category</label>
                  <select 
                    value={editingSlot ? editingSlot.type : slotType} 
                    onChange={(e) => editingSlot ? setEditingSlot({ ...editingSlot, type: e.target.value }) : setSlotType(e.target.value)}
                  >
                    <option value="FOUR_WHEELER">4-Wheeler (Car/SUV)</option>
                    <option value="TWO_WHEELER">2-Wheeler (Bike)</option>
                    <option value="EV">Electric Vehicle (EV Charger)</option>
                  </select>
                </div>

                <div className="field-group">
                  <label>Floor / Level</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Basement 1 or Level 2"
                    value={editingSlot ? editingSlot.floor : slotFloor}
                    onChange={(e) => editingSlot ? setEditingSlot({ ...editingSlot, floor: e.target.value }) : setSlotFloor(e.target.value)}
                  />
                </div>

                <div className="field-group">
                  <label>Hourly Rate (₹)</label>
                  <input 
                    type="number" 
                    value={editingSlot ? editingSlot.hourlyRate : slotRate}
                    onChange={(e) => editingSlot ? setEditingSlot({ ...editingSlot, hourlyRate: e.target.value }) : setSlotRate(e.target.value)}
                    required
                  />
                </div>

                {editingSlot && (
                  <div className="field-group">
                    <label>Status</label>
                    <select 
                      value={editingSlot.status}
                      onChange={(e) => setEditingSlot({ ...editingSlot, status: e.target.value })}
                    >
                      <option value="AVAILABLE">AVAILABLE</option>
                      <option value="OCCUPIED">OCCUPIED</option>
                      <option value="MAINTENANCE">MAINTENANCE</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="admin-form-actions">
                <button type="submit" className="btn-admin-submit">
                  {editingSlot ? 'Save Slot Changes' : '+ Provision Slot Bay'}
                </button>
                {editingSlot && (
                  <button type="button" className="btn-cancel-edit" onClick={() => setEditingSlot(null)}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>

          {/* Slots Table for Selected Location */}
          <section className="admin-panel-card">
            <div className="panel-head">
              <h3>Bays in Selected Location ({slots.length})</h3>
              <p>Real-time slot status &amp; maintenance overrides</p>
            </div>

            <div className="admin-table-wrapper">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Slot No.</th>
                    <th>Type</th>
                    <th>Floor</th>
                    <th>Tariff</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {slots.map(s => (
                    <tr key={s.id}>
                      <td><strong>{s.slotNumber}</strong></td>
                      <td>{s.type.replace('_', ' ')}</td>
                      <td>{s.floor}</td>
                      <td>₹{s.hourlyRate}/hr</td>
                      <td>
                        <span className={`free-badge ${s.status === 'AVAILABLE' ? 'free-badge-green' : 'free-badge-red'}`}>
                          {s.status}
                        </span>
                      </td>
                      <td>
                        <div className="admin-row-actions">
                          <button className="btn-edit-sm" onClick={() => setEditingSlot(s)}>
                            Edit
                          </button>
                          <button className="btn-del-sm" onClick={() => handleDeleteSlot(s.id, s.slotNumber)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {slots.length === 0 && (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', color: '#64748b', padding: '1.5rem' }}>
                        No slots provisioned yet for this location.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {/* Tab 4: User Directory */}
      {activeAdminTab === 'users' && (
        <section className="admin-panel-card">
          <div className="panel-head">
            <h3>Registered User Accounts ({users.length})</h3>
            <p>Database credentials and role authorizations</p>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Phone</th>
                  <th>Registered At</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>#{u.id}</td>
                    <td><strong>{u.name}</strong></td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`role-chip ${u.role === 'admin' ? 'role-admin' : 'role-user'}`}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td>{u.phone || 'N/A'}</td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
