const bcrypt = require('bcryptjs');
const { sequelize, User, ParkingLocation, ParkingSlot, Booking } = require('../models');

async function seedDatabase() {
    try {
        console.log('Synchronizing database models...');
        await sequelize.sync({ force: true });
        console.log('Database synced successfully.');

        // 1. Seed Users
        const hashedAdminPass = await bcrypt.hash('admin123', 10);
        const hashedUserPass = await bcrypt.hash('user123', 10);

        const admin = await User.create({
            name: 'Parkify Admin',
            email: 'admin@parkify.com',
            password: hashedAdminPass,
            role: 'admin',
            phone: '9876543210'
        });

        const user = await User.create({
            name: 'Vikram Mehta',
            email: 'user@parkify.com',
            password: hashedUserPass,
            role: 'user',
            phone: '9123456789'
        });

        console.log('Users seeded.');

        // 2. Seed Parking Locations
        const loc1 = await ParkingLocation.create({
            name: 'Cyber City Corporate Parking',
            address: 'DLF Phase 2, Sector 24',
            city: 'Gurugram',
            hourlyRate: 60.0,
            description: 'State of the art automated multi-level parking facility with 24/7 CCTV surveillance and EV rapid charging bays.',
            imageUrl: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80'
        });

        const loc2 = await ParkingLocation.create({
            name: 'Phoenix Grand Palladium Bay',
            address: 'Lower Parel, Senapati Bapat Marg',
            city: 'Mumbai',
            hourlyRate: 80.0,
            description: 'Centrally located luxury retail parking with valet assistance, covered basements, and premium wide vehicle bays.',
            imageUrl: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=800&q=80'
        });

        const loc3 = await ParkingLocation.create({
            name: 'Indira Gandhi Terminal 3 Hub',
            address: 'Aerocity, NH-8',
            city: 'New Delhi',
            hourlyRate: 100.0,
            description: 'Direct air terminal connectivity with automated barrier gates, license plate recognition, and express luggage lanes.',
            imageUrl: 'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=800&q=80'
        });

        console.log('Locations seeded.');

        // 3. Seed Parking Slots
        const slotsData = [
            // Loc 1 Slots
            { locationId: loc1.id, slotNumber: 'CC-01', type: 'FOUR_WHEELER', status: 'AVAILABLE', hourlyRate: 60, floor: 'Ground' },
            { locationId: loc1.id, slotNumber: 'CC-02', type: 'FOUR_WHEELER', status: 'AVAILABLE', hourlyRate: 60, floor: 'Ground' },
            { locationId: loc1.id, slotNumber: 'CC-03', type: 'EV', status: 'AVAILABLE', hourlyRate: 85, floor: 'Ground' },
            { locationId: loc1.id, slotNumber: 'CC-04', type: 'TWO_WHEELER', status: 'AVAILABLE', hourlyRate: 25, floor: 'Basement 1' },
            { locationId: loc1.id, slotNumber: 'CC-05', type: 'FOUR_WHEELER', status: 'AVAILABLE', hourlyRate: 60, floor: 'Basement 1' },
            { locationId: loc1.id, slotNumber: 'CC-06', type: 'EV', status: 'AVAILABLE', hourlyRate: 85, floor: 'Basement 1' },

            // Loc 2 Slots
            { locationId: loc2.id, slotNumber: 'PH-01', type: 'FOUR_WHEELER', status: 'AVAILABLE', hourlyRate: 80, floor: 'Level 1' },
            { locationId: loc2.id, slotNumber: 'PH-02', type: 'EV', status: 'AVAILABLE', hourlyRate: 110, floor: 'Level 1' },
            { locationId: loc2.id, slotNumber: 'PH-03', type: 'TWO_WHEELER', status: 'AVAILABLE', hourlyRate: 35, floor: 'Level 1' },
            { locationId: loc2.id, slotNumber: 'PH-04', type: 'FOUR_WHEELER', status: 'AVAILABLE', hourlyRate: 80, floor: 'Level 2' },

            // Loc 3 Slots
            { locationId: loc3.id, slotNumber: 'T3-01', type: 'FOUR_WHEELER', status: 'AVAILABLE', hourlyRate: 100, floor: 'Terminal Bay' },
            { locationId: loc3.id, slotNumber: 'T3-02', type: 'EV', status: 'AVAILABLE', hourlyRate: 130, floor: 'Terminal Bay' },
            { locationId: loc3.id, slotNumber: 'T3-03', type: 'FOUR_WHEELER', status: 'AVAILABLE', hourlyRate: 100, floor: 'Terminal Bay' }
        ];

        const createdSlots = await ParkingSlot.bulkCreate(slotsData);
        console.log(`${createdSlots.length} slots seeded.`);

        // 4. Seed Initial Booking
        const targetSlot = createdSlots[0];
        targetSlot.status = 'OCCUPIED';
        await targetSlot.save();

        await Booking.create({
            bookingCode: 'PKF-882190',
            userId: user.id,
            locationId: loc1.id,
            slotId: targetSlot.id,
            vehicleNumber: 'HR-26-BR-9901',
            vehicleType: 'FOUR_WHEELER',
            date: '2026-11-18',
            startTime: '10:00',
            durationHours: 3,
            ratePerHour: 60,
            totalAmount: 180,
            status: 'CONFIRMED'
        });

        console.log('Initial booking pass created.');
        console.log('Seeding completed successfully!');
    } catch (err) {
        console.error('Seeding error:', err);
    }
}

if (require.main === module) {
    seedDatabase().then(() => process.exit(0));
}

module.exports = seedDatabase;
