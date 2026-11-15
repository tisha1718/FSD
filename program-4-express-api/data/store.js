const bcrypt = require('bcryptjs');

// Pre-hash password helper
const salt = bcrypt.genSaltSync(10);
const hashedAdminPass = bcrypt.hashSync('admin123', salt);
const hashedUserPass = bcrypt.hashSync('user123', salt);

const users = [
    {
        id: 'usr-admin-1',
        name: 'Parkify Admin',
        email: 'admin@parkify.com',
        password: hashedAdminPass,
        role: 'admin',
        phone: '9876543210',
        createdAt: new Date().toISOString()
    },
    {
        id: 'usr-regular-1',
        name: 'Regular Customer',
        email: 'user@parkify.com',
        password: hashedUserPass,
        role: 'user',
        phone: '9123456780',
        createdAt: new Date().toISOString()
    }
];

const locations = [
    {
        id: 'loc-01',
        name: 'Cyber Towers Mega Parking',
        address: 'Hitech City, Madhapur',
        city: 'Hyderabad',
        hourlyRate: 50,
        createdAt: new Date().toISOString()
    },
    {
        id: 'loc-02',
        name: 'Phoenix Marketcity Bay',
        address: 'Viman Nagar',
        city: 'Pune',
        hourlyRate: 60,
        createdAt: new Date().toISOString()
    }
];

const slots = [
    { id: 's-101', locationId: 'loc-01', slotNumber: 'A-01', type: 'FOUR_WHEELER', status: 'AVAILABLE', hourlyRate: 50 },
    { id: 's-102', locationId: 'loc-01', slotNumber: 'A-02', type: 'FOUR_WHEELER', status: 'AVAILABLE', hourlyRate: 50 },
    { id: 's-103', locationId: 'loc-01', slotNumber: 'EV-01', type: 'EV', status: 'AVAILABLE', hourlyRate: 75 },
    { id: 's-104', locationId: 'loc-01', slotNumber: 'B-01', type: 'TWO_WHEELER', status: 'AVAILABLE', hourlyRate: 25 },
    { id: 's-201', locationId: 'loc-02', slotNumber: 'P-01', type: 'FOUR_WHEELER', status: 'AVAILABLE', hourlyRate: 60 },
    { id: 's-202', locationId: 'loc-02', slotNumber: 'P-02', type: 'EV', status: 'AVAILABLE', hourlyRate: 85 }
];

const bookings = [
    {
        id: 'bk-5001',
        userId: 'usr-regular-1',
        locationId: 'loc-01',
        slotId: 's-101',
        slotNumber: 'A-01',
        vehicleNumber: 'TS-09-AB-1234',
        vehicleType: 'FOUR_WHEELER',
        date: '2026-11-16',
        startTime: '10:00',
        durationHours: 3,
        totalAmount: 150,
        status: 'CONFIRMED',
        createdAt: new Date().toISOString()
    }
];

module.exports = {
    users,
    locations,
    slots,
    bookings
};
