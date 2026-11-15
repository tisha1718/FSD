import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import SearchFilter from './components/SearchFilter';
import ParkingCard from './components/ParkingCard';
import SlotGrid from './components/SlotGrid';
import BookingModal from './components/BookingModal';
import BookingList from './components/BookingList';
import StatsSummary from './components/StatsSummary';
import { INITIAL_HUBS } from './data/mockParking';

export default function App() {
  const [activeTab, setActiveTab] = useState('explore');
  const [hubs, setHubs] = useState(() => {
    const saved = localStorage.getItem('parkify_react_hubs');
    return saved ? JSON.parse(saved) : INITIAL_HUBS;
  });

  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('parkify_react_bookings');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedHubId, setSelectedHubId] = useState(INITIAL_HUBS[0]?.id || null);
  const [modalData, setModalData] = useState(null); // { slot, hub }
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [toast, setToast] = useState(null);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('parkify_react_hubs', JSON.stringify(hubs));
  }, [hubs]);

  useEffect(() => {
    localStorage.setItem('parkify_react_bookings', JSON.stringify(bookings));
  }, [bookings]);

  const showToast = (msg, type = 'info') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSelectSlot = (slot, hub) => {
    setModalData({ slot, hub });
  };

  const handleConfirmBooking = (newBooking) => {
    // 1. Add booking
    setBookings(prev => [newBooking, ...prev]);

    // 2. Mark slot occupied in hub
    setHubs(prevHubs => prevHubs.map(h => {
      if (h.id === newBooking.hubId) {
        return {
          ...h,
          slots: h.slots.map(s => s.id === newBooking.slotId ? { ...s, status: 'OCCUPIED' } : s)
        };
      }
      return h;
    }));

    setModalData(null);
    showToast(`Booking #${newBooking.id} confirmed! Slot ${newBooking.slotNumber} reserved.`, 'success');
  };

  const handleCancelBooking = (bookingId) => {
    const target = bookings.find(b => b.id === bookingId);
    if (!target) return;

    if (!window.confirm(`Are you sure you want to cancel booking #${bookingId}?`)) return;

    // 1. Mark booking cancelled
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'CANCELLED' } : b));

    // 2. Free up slot
    setHubs(prevHubs => prevHubs.map(h => {
      if (h.id === target.hubId) {
        return {
          ...h,
          slots: h.slots.map(s => s.id === target.slotId ? { ...s, status: 'AVAILABLE' } : s)
        };
      }
      return h;
    }));

    showToast(`Booking #${bookingId} cancelled. Bay released.`, 'info');
  };

  const availableCities = Array.from(new Set(hubs.map(h => h.city)));

  const filteredHubs = hubs.filter(h => {
    const matchSearch = h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        h.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCity = cityFilter === 'ALL' || h.city === cityFilter;
    return matchSearch && matchCity;
  });

  const selectedHub = hubs.find(h => h.id === selectedHubId) || filteredHubs[0];

  return (
    <div className="react-app-container">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        bookingCount={bookings.filter(b => b.status === 'CONFIRMED').length}
      />

      <main className="content-wrapper">
        <StatsSummary hubs={hubs} bookings={bookings} />

        {activeTab === 'explore' && (
          <div className="explore-view">
            <SearchFilter 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              cityFilter={cityFilter}
              setCityFilter={setCityFilter}
              typeFilter={typeFilter}
              setTypeFilter={setTypeFilter}
              availableCities={availableCities}
            />

            <div className="hub-layout-grid">
              <section className="hubs-column">
                <div className="col-header">
                  <h3>Parking Destinations</h3>
                  <span>{filteredHubs.length} found</span>
                </div>
                <div className="hubs-cards-list">
                  {filteredHubs.map(hub => (
                    <ParkingCard 
                      key={hub.id}
                      hub={hub}
                      isSelected={hub.id === (selectedHub?.id)}
                      onSelect={(id) => setSelectedHubId(id)}
                    />
                  ))}
                  {filteredHubs.length === 0 && (
                    <div className="empty-panel">No locations match your query.</div>
                  )}
                </div>
              </section>

              <section className="slots-column">
                <SlotGrid 
                  hub={selectedHub}
                  selectedSlot={modalData?.slot}
                  onSelectSlot={handleSelectSlot}
                  typeFilter={typeFilter}
                />
              </section>
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <BookingList 
            bookings={bookings} 
            onCancelBooking={handleCancelBooking} 
          />
        )}

        {activeTab === 'about' && (
          <div className="about-panel">
            <h3>Program 2: React Component Architecture (CO3)</h3>
            <p>This application demonstrates modular functional component design, declarative state flow, and pure React event lifecycles:</p>
            <ul>
              <li><strong>Functional Components &amp; JSX:</strong> Decomposition into Navbar, ParkingCard, SlotGrid, BookingModal, StatsSummary, and SearchFilter.</li>
              <li><strong>Props &amp; State Management:</strong> Unidirectional data flow from root App component down to child components with callback handlers.</li>
              <li><strong>useState &amp; useEffect:</strong> Reactive slot state tracking, filter adjustments, and persistent synchronization to LocalStorage.</li>
              <li><strong>Conditional Rendering:</strong> Dynamic rendering based on active tabs, modal states, loading and empty state fallbacks.</li>
              <li><strong>Form Control &amp; Validation:</strong> Controlled inputs with inline regex error feedback and real-time total computation.</li>
            </ul>
          </div>
        )}
      </main>

      {modalData && (
        <BookingModal 
          slot={modalData.slot}
          hub={modalData.hub}
          onClose={() => setModalData(null)}
          onConfirm={handleConfirmBooking}
        />
      )}

      {toast && (
        <div className={`app-toast toast-${toast.type}`}>
          {toast.msg}
        </div>
      )}

      <footer className="react-footer">
        PARKIFY React Application &bull; Program 2 (CO3: React Component Architecture &amp; State Management)
      </footer>
    </div>
  );
}
