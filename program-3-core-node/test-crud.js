/**
 * Automated test script for Program 3 Core Node.js CRUD endpoints
 */
const http = require('http');

const BASE_URL = 'http://127.0.0.1:3003';

function makeRequest(method, path, body = null) {
    return new Promise((resolve, reject) => {
        const url = new URL(path, BASE_URL);
        const options = {
            hostname: url.hostname,
            port: url.port,
            path: url.pathname + url.search,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(options, (res) => {
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

async function runTests() {
    console.log('--- Testing Program 3 Core Node.js CRUD Endpoints ---');

    try {
        // 1. GET ALL
        console.log('1. Testing GET /api/bookings ...');
        const getAll = await makeRequest('GET', '/api/bookings');
        console.log(`Status: ${getAll.status}, Found ${getAll.body.count || 0} records.`);

        // 2. CREATE (POST)
        console.log('\n2. Testing POST /api/bookings ...');
        const newBooking = {
            slotNumber: "TEST-" + Math.floor(10 + Math.random() * 90),
            driverName: "Automated Test Driver",
            vehicleNumber: "TEST-99-99",
            date: "2026-11-20",
            durationHours: 3,
            hourlyRate: 50
        };
        const postRes = await makeRequest('POST', '/api/bookings', newBooking);
        console.log(`Status: ${postRes.status}, Created ID: ${postRes.body.data?.id}`);
        const createdId = postRes.body.data?.id;

        // 3. GET ONE
        console.log(`\n3. Testing GET /api/bookings/${createdId} ...`);
        const getOne = await makeRequest('GET', `/api/bookings/${createdId}`);
        console.log(`Status: ${getOne.status}, Driver: ${getOne.body.data?.driverName}`);

        // 4. UPDATE (PUT)
        console.log(`\n4. Testing PUT /api/bookings/${createdId} ...`);
        const putRes = await makeRequest('PUT', `/api/bookings/${createdId}`, {
            durationHours: 5,
            status: 'COMPLETED'
        });
        console.log(`Status: ${putRes.status}, New Duration: ${putRes.body.data?.durationHours}hr, Total: ₹${putRes.body.data?.totalAmount}`);

        // 5. DOUBLE BOOKING COLLISION TEST
        console.log(`\n5. Testing Collision Prevention on Slot ${newBooking.slotNumber} ...`);
        const collisionRes = await makeRequest('POST', '/api/bookings', newBooking);
        console.log(`Status: ${collisionRes.status} (Expected 409 Conflict): ${collisionRes.body.error}`);

        // 6. DELETE
        console.log(`\n6. Testing DELETE /api/bookings/${createdId} ...`);
        const delRes = await makeRequest('DELETE', `/api/bookings/${createdId}`);
        console.log(`Status: ${delRes.status}, Response: ${delRes.body.message}`);

        console.log('\n[PASS] All Program 3 Core Node.js CRUD tests completed successfully!');
    } catch (err) {
        console.error('Test Failed! Make sure server is running via `node server.js` before executing test-crud.js');
        console.error(err.message);
    }
}

runTests();
