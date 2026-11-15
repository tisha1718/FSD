const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ParkingLocation = sequelize.define('ParkingLocation', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false
    },
    hourlyRate: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 50.0
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'parking_locations',
    timestamps: true
});

module.exports = ParkingLocation;
