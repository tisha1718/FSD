const sequelize = require('../config/database');
const User = require('./User');
const ParkingLocation = require('./ParkingLocation');
const ParkingSlot = require('./ParkingSlot');
const Booking = require('./Booking');

// User <-> Booking Associations
User.hasMany(Booking, { foreignKey: 'userId', as: 'bookings', onDelete: 'CASCADE' });
Booking.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// ParkingLocation <-> ParkingSlot Associations
ParkingLocation.hasMany(ParkingSlot, { foreignKey: 'locationId', as: 'slots', onDelete: 'CASCADE' });
ParkingSlot.belongsTo(ParkingLocation, { foreignKey: 'locationId', as: 'location' });

// ParkingLocation <-> Booking Associations
ParkingLocation.hasMany(Booking, { foreignKey: 'locationId', as: 'bookings', onDelete: 'CASCADE' });
Booking.belongsTo(ParkingLocation, { foreignKey: 'locationId', as: 'location' });

// ParkingSlot <-> Booking Associations
ParkingSlot.hasMany(Booking, { foreignKey: 'slotId', as: 'bookings', onDelete: 'CASCADE' });
Booking.belongsTo(ParkingSlot, { foreignKey: 'slotId', as: 'slot' });

module.exports = {
    sequelize,
    User,
    ParkingLocation,
    ParkingSlot,
    Booking
};
