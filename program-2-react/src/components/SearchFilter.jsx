import React from 'react';

export default function SearchFilter({ 
  searchTerm, 
  setSearchTerm, 
  cityFilter, 
  setCityFilter, 
  typeFilter, 
  setTypeFilter,
  availableCities
}) {
  return (
    <div className="search-filter-card">
      <div className="filter-item search-bar">
        <label>Search Hubs or Area</label>
        <input 
          type="text" 
          placeholder="e.g. Phoenix Mall, Whitefield, Delhi..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="filter-item">
        <label>Filter by City</label>
        <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)}>
          <option value="ALL">All Cities</option>
          {availableCities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      <div className="filter-item">
        <label>Vehicle Bay</label>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="ALL">All Vehicle Types</option>
          <option value="CAR">4-Wheeler (Car)</option>
          <option value="BIKE">2-Wheeler (Bike)</option>
          <option value="EV">Electric Vehicle (EV Charger)</option>
        </select>
      </div>

      {(searchTerm || cityFilter !== 'ALL' || typeFilter !== 'ALL') && (
        <div className="filter-reset-wrapper">
          <button 
            className="btn-clear-filters"
            onClick={() => {
              setSearchTerm('');
              setCityFilter('ALL');
              setTypeFilter('ALL');
            }}
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
