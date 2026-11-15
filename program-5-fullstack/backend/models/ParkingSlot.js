const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ParkingSlot = sequelize.define('ParkingSlot', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    locationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'parking_locations',
            key: 'id'
        }
    },
    slotNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('FOUR_WHEELER', 'TWO_WHEELER', 'EV'),
        defaultValue: 'FOUR_WHEELER'
    },
    status: {
        type: DataTypes.ENUM('AVAILABLE', 'OCCUPIED', 'MAINTENANCE'),
        defaultValue: 'AVAILABLE'
    },
    hourlyRate: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    floor: {
        type: DataTypes.STRING,
        defaultValue: 'Ground'
    }
}, {
    tableName: 'parking_slots',
    timestamps: true
});

module.exports = ParkingSlot;
