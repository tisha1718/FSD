const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Booking = sequelize.define('Booking', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    bookingCode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    locationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'parking_locations',
            key: 'id'
        }
    },
    slotId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'parking_slots',
            key: 'id'
        }
    },
    vehicleNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    vehicleType: {
        type: DataTypes.ENUM('FOUR_WHEELER', 'TWO_WHEELER', 'EV'),
        defaultValue: 'FOUR_WHEELER'
    },
    date: {
        type: DataTypes.STRING, // YYYY-MM-DD
        allowNull: false
    },
    startTime: {
        type: DataTypes.STRING, // HH:MM
        allowNull: false
    },
    durationHours: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 2
    },
    ratePerHour: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    totalAmount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('CONFIRMED', 'CANCELLED', 'COMPLETED'),
        defaultValue: 'CONFIRMED'
    }
}, {
    tableName: 'bookings',
    timestamps: true
});

module.exports = Booking;
