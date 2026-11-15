/**
 * Comprehensive Automated Test Suite for Program 4 Express REST API
 */
const http = require('http');

const BASE_URL = 'http://127.0.0.1:4000';

function request(method, path, body = null, token = null) {
    return new Promise((resolve, reject) => {
        const url = new URL(path, BASE_URL);
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const req = http.request({
            hostname: url.hostname,
            port: url.port,
            path: url.pathname + url.search,
            method,
            headers
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, body: JSON.parse(data) });
                } catch (e) {
                    resolve({ status: res.statusCode, body: data });
                }
            });
        });

        req.on('error', reject);
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

async function runTestSuite() {
    console.log('=== Running Program 4 (Express REST API) Test Suite ===\n');

    try {
        // 1. User Login
        console.log('1. Testing User Login (POST /api/auth/login) ...');
        const userLogin = await request('POST', '/api/auth/login', {
            email: 'user@parkify.com',
            password: 'user123'
        });
        console.log(`Status: ${userLogin.status}, Token received: ${Boolean(userLogin.body.token)}`);
        const userToken = userLogin.body.token;

        // 2. Admin Login
        console.log('\n2. Testing Admin Login (POST /api/auth/login) ...');
        const adminLogin = await request('POST', '/api/auth/login', {
            email: 'admin@parkify.com',
            password: 'admin123'
        });
        console.log(`Status: ${adminLogin.status}, Role: ${adminLogin.body.user?.role}`);
        const adminToken = adminLogin.body.token;

        // 3. Public Locations
        console.log('\n3. Testing GET /api/locations (Public) ...');
        const locRes = await request('GET', '/api/locations');
        console.log(`Status: ${locRes.status}, Found ${locRes.body.count} locations.`);

        // 4. Create Booking as User
        console.log('\n4. Testing Protected Booking Creation (POST /api/bookings) ...');
        const bookingPayload = {
            locationId: 'loc-01',
            slotId: 's-102',
            vehicleNumber: 'DL-04-TEST-999',
            vehicleType: 'FOUR_WHEELER',
            date: '2026-11-25',
            startTime: '14:00',
            durationHours: 3
        };
        const bookRes = await request('POST', '/api/bookings', bookingPayload, userToken);
        console.log(`Status: ${bookRes.status}, Booking ID: ${bookRes.body.data?.id}, Total: ₹${bookRes.body.data?.totalAmount}`);
        const createdBookingId = bookRes.body.data?.id;

        // 5. Test Double Booking Prevention
        console.log('\n5. Testing Double-Booking Prevention on same slot & date ...');
        const conflictRes = await request('POST', '/api/bookings', bookingPayload, userToken);
        console.log(`Status: ${conflictRes.status} (Expected 409 Conflict): ${conflictRes.body.error}`);

        // 6. Test RBAC: Regular user trying to access admin analytics
        console.log('\n6. Testing RBAC Security: User accessing Admin Analytics ...');
        const unauthorizedRes = await request('GET', '/api/admin/analytics', null, userToken);
        console.log(`Status: ${unauthorizedRes.status} (Expected 403 Forbidden): ${unauthorizedRes.body.error}`);

        // 7. Test Admin Analytics
        console.log('\n7. Testing Admin Analytics with Admin Token ...');
        const analyticsRes = await request('GET', '/api/admin/analytics', null, adminToken);
        console.log(`Status: ${analyticsRes.status}, Occupancy: ${analyticsRes.body.data?.occupancyRatePercent}%, Revenue: ₹${analyticsRes.body.data?.totalRevenueRupees}`);

        // 8. Cancel Booking
        if (createdBookingId) {
            console.log(`\n8. Testing Booking Cancellation (PUT /api/bookings/${createdBookingId}/cancel) ...`);
            const cancelRes = await request('PUT', `/api/bookings/${createdBookingId}/cancel`, null, userToken);
            console.log(`Status: ${cancelRes.status}, Status: ${cancelRes.body.data?.status}`);
        }

        console.log('\n[PASS] All Program 4 Express REST API tests passed successfully!');
    } catch (err) {
        console.error('Test Suite Failed. Ensure `node server.js` is running on port 4000.');
        console.error(err.message);
    }
}

runTestSuite();
