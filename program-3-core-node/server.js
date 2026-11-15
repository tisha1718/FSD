/**
 * PARKIFY - Program 3: Core Node.js HTTP Server (CO4)
 * Built with native HTTP, File System (fs), Path, EventEmitter & Streams.
 * STRICTLY NO EXPRESS.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');

const PORT = 3003;
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'bookings.json');
const LOG_FILE = path.join(DATA_DIR, 'audit.log');
const PUBLIC_DIR = path.join(__dirname, 'public');

// Ensure data folder and files exist
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

// 1. EVENT EMITTER FOR AUDIT & REAL-TIME EVENT STREAM
class BookingEmitter extends EventEmitter {}
const bookingEvents = new BookingEmitter();

// Audit log writer stream
const logStream = fs.createWriteStream(LOG_FILE, { flags: 'a' });

bookingEvents.on('booking:created', (data) => {
    const logEntry = `[${new Date().toISOString()}] [CREATED] ID=${data.id} Slot=${data.slotNumber} Driver=${data.driverName} Amount=₹${data.totalAmount}\n`;
    logStream.write(logEntry);
    console.log(`[EVENT: booking:created] ${logEntry.trim()}`);
});

bookingEvents.on('booking:updated', (data) => {
    const logEntry = `[${new Date().toISOString()}] [UPDATED] ID=${data.id} Status=${data.status} Duration=${data.durationHours}hr\n`;
    logStream.write(logEntry);
    console.log(`[EVENT: booking:updated] ${logEntry.trim()}`);
});

bookingEvents.on('booking:deleted', (id) => {
    const logEntry = `[${new Date().toISOString()}] [DELETED] ID=${id}\n`;
    logStream.write(logEntry);
    console.log(`[EVENT: booking:deleted] ${logEntry.trim()}`);
});

// Helper: Read bookings from JSON file (using fs.promises)
async function readBookingsFile() {
    try {
        const raw = await fs.promises.readFile(DATA_FILE, 'utf-8');
        return JSON.parse(raw || '[]');
    } catch (err) {
        return [];
    }
}

// Helper: Write bookings to JSON file
async function writeBookingsFile(data) {
    await fs.promises.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// Helper: Read request body asynchronously
function parseRequestBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
            // Protect against overly large payloads (max 1MB)
            if (body.length > 1e6) {
                req.connection.destroy();
                reject(new Error('Payload too large'));
            }
        });
        req.on('end', () => {
            try {
                if (!body.trim()) return resolve({});
                resolve(JSON.parse(body));
            } catch (err) {
                reject(new Error('Invalid JSON format'));
            }
        });
        req.on('error', reject);
    });
}

// Helper: Send JSON response
function sendJSON(res, statusCode, data) {
    res.writeHead(statusCode, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end(JSON.stringify(data));
}

// MIME types map for static files
const MIME_MAP = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.txt': 'text/plain'
};

// 2. HTTP SERVER INSTANCE
const server = http.createServer(async (req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    const pathname = parsedUrl.pathname;
    const method = req.method;

    console.log(`[Core Node Server] ${method} ${pathname}`);

    // CORS preflight
    if (method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
        return res.end();
    }

    // ==========================================
    // API ROUTING: CRUD OPERATIONS FOR BOOKINGS
    // ==========================================

    // 1. GET ALL BOOKINGS (READ)
    if (pathname === '/api/bookings' && method === 'GET') {
        try {
            const bookings = await readBookingsFile();
            const statusFilter = parsedUrl.searchParams.get('status');
            const search = parsedUrl.searchParams.get('search');

            let filtered = bookings;
            if (statusFilter) {
                filtered = filtered.filter(b => b.status.toUpperCase() === statusFilter.toUpperCase());
            }
            if (search) {
                const s = search.toLowerCase();
                filtered = filtered.filter(b => 
                    b.driverName.toLowerCase().includes(s) || 
                    b.vehicleNumber.toLowerCase().includes(s) ||
                    b.slotNumber.toLowerCase().includes(s)
                );
            }

            return sendJSON(res, 200, { success: true, count: filtered.length, data: filtered });
        } catch (err) {
            return sendJSON(res, 500, { success: false, error: 'Failed to read bookings' });
        }
    }

    // 2. GET BOOKING BY ID (READ ONE)
    const matchId = pathname.match(/^\/api\/bookings\/([A-Za-z0-9\-_]+)$/);
    if (matchId && method === 'GET') {
        const id = matchId[1];
        const bookings = await readBookingsFile();
        const found = bookings.find(b => b.id === id);

        if (!found) {
            return sendJSON(res, 404, { success: false, error: `Booking with ID ${id} not found` });
        }
        return sendJSON(res, 200, { success: true, data: found });
    }

    // 3. CREATE BOOKING (POST)
    if (pathname === '/api/bookings' && method === 'POST') {
        try {
            const payload = await parseRequestBody(req);

            // Validation
            if (!payload.slotNumber || !payload.driverName || !payload.vehicleNumber || !payload.date || !payload.durationHours) {
                return sendJSON(res, 400, {
                    success: false,
                    error: 'Missing required fields: slotNumber, driverName, vehicleNumber, date, durationHours'
                });
            }

            const bookings = await readBookingsFile();

            // Check for double booking collision on same slot and date
            const isCollision = bookings.some(b => 
                b.slotNumber === payload.slotNumber &&
                b.date === payload.date &&
                b.status === 'CONFIRMED'
            );

            if (isCollision) {
                return sendJSON(res, 409, {
                    success: false,
                    error: `Slot ${payload.slotNumber} is already booked for ${payload.date}. Double booking prevented.`
                });
            }

            const rate = Number(payload.hourlyRate) || 50;
            const duration = Number(payload.durationHours);
            const total = duration * rate;

            const newBooking = {
                id: 'NODE-' + Math.floor(1000 + Math.random() * 9000),
                slotNumber: payload.slotNumber,
                location: payload.location || 'Central Park Bay',
                driverName: payload.driverName.trim(),
                vehicleNumber: payload.vehicleNumber.trim().toUpperCase(),
                vehicleType: payload.vehicleType || 'CAR',
                date: payload.date,
                startTime: payload.startTime || '12:00',
                durationHours: duration,
                hourlyRate: rate,
                totalAmount: total,
                status: 'CONFIRMED',
                createdAt: new Date().toISOString()
            };

            bookings.unshift(newBooking);
            await writeBookingsFile(bookings);

            // Trigger EventEmitter event
            bookingEvents.emit('booking:created', newBooking);

            return sendJSON(res, 201, { success: true, message: 'Booking created successfully', data: newBooking });
        } catch (err) {
            return sendJSON(res, 400, { success: false, error: err.message });
        }
    }

    // 4. UPDATE BOOKING (PUT)
    if (matchId && method === 'PUT') {
        const id = matchId[1];
        try {
            const payload = await parseRequestBody(req);
            const bookings = await readBookingsFile();
            const index = bookings.findIndex(b => b.id === id);

            if (index === -1) {
                return sendJSON(res, 404, { success: false, error: `Booking with ID ${id} not found` });
            }

            // Update allowed fields
            const current = bookings[index];
            if (payload.status) current.status = payload.status;
            if (payload.durationHours) {
                current.durationHours = Number(payload.durationHours);
                current.totalAmount = current.durationHours * current.hourlyRate;
            }
            if (payload.driverName) current.driverName = payload.driverName;
            if (payload.vehicleNumber) current.vehicleNumber = payload.vehicleNumber.toUpperCase();
            if (payload.startTime) current.startTime = payload.startTime;

            current.updatedAt = new Date().toISOString();
            bookings[index] = current;
            await writeBookingsFile(bookings);

            // Trigger EventEmitter event
            bookingEvents.emit('booking:updated', current);

            return sendJSON(res, 200, { success: true, message: 'Booking updated successfully', data: current });
        } catch (err) {
            return sendJSON(res, 400, { success: false, error: err.message });
        }
    }

    // 5. DELETE BOOKING (DELETE)
    if (matchId && method === 'DELETE') {
        const id = matchId[1];
        try {
            const bookings = await readBookingsFile();
            const initialLength = bookings.length;
            const updated = bookings.filter(b => b.id !== id);

            if (updated.length === initialLength) {
                return sendJSON(res, 404, { success: false, error: `Booking with ID ${id} not found` });
            }

            await writeBookingsFile(updated);

            // Trigger EventEmitter event
            bookingEvents.emit('booking:deleted', id);

            return sendJSON(res, 200, { success: true, message: `Booking ${id} deleted successfully` });
        } catch (err) {
            return sendJSON(res, 500, { success: false, error: 'Failed to delete booking' });
        }
    }

    // 6. STREAM AUDIT LOGS (Demonstrates Node.js Streams)
    if (pathname === '/api/audit-logs' && method === 'GET') {
        if (!fs.existsSync(LOG_FILE)) {
            return sendJSON(res, 200, { logs: 'No audit logs generated yet.' });
        }
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        const readStream = fs.createReadStream(LOG_FILE);
        return readStream.pipe(res);
    }

    // ==========================================
    // STATIC FILE SERVING VIA STREAMS
    // ==========================================
    let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);
    const extname = path.extname(filePath).toLowerCase();
    const contentType = MIME_MAP[extname] || 'application/octet-stream';

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            return sendJSON(res, 404, { success: false, error: 'Resource not found' });
        }

        res.writeHead(200, { 'Content-Type': contentType });
        const stream = fs.createReadStream(filePath);
        stream.pipe(res);
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`=======================================================`);
    console.log(`PARKIFY - Program 3 (Core Node.js) HTTP Server Started`);
    console.log(`URL: http://localhost:${PORT}`);
    console.log(`Covers CO4: HTTP, fs, path, EventEmitter & Streams`);
    console.log(`=======================================================`);
});
