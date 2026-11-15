/**
 * Minimal static & REST server for Program 1
 * Runs on pure Node.js (No Express) to fulfill HTTP GET & POST requirement
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3001;
const DATA_FILE = path.join(__dirname, 'bookings-db.json');

// Ensure data file exists
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg'
};

const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    console.log(`[Program 1 Server] ${req.method} ${url.pathname}`);

    // CORS headers for local testing
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        return res.end();
    }

    // API Routes
    if (url.pathname === '/api/locations' && req.method === 'GET') {
        const locations = [
            {
                id: "LOC-01",
                name: "Central Metro Grand Station",
                address: "Sector 14, Commercial Hub, New Delhi",
                city: "Delhi",
                hourlyRate: 50,
                totalSlots: 8,
                vehicleTypes: ["FOUR_WHEELER", "TWO_WHEELER", "EV"],
                slots: [
                    { id: "S101", number: "A-01", type: "FOUR_WHEELER", status: "AVAILABLE", rate: 50 },
                    { id: "S102", number: "A-02", type: "FOUR_WHEELER", status: "BOOKED", rate: 50 },
                    { id: "S103", number: "A-03", type: "EV", status: "AVAILABLE", rate: 70 },
                    { id: "S104", number: "A-04", type: "TWO_WHEELER", status: "AVAILABLE", rate: 25 },
                    { id: "S105", number: "A-05", type: "FOUR_WHEELER", status: "AVAILABLE", rate: 50 },
                    { id: "S106", number: "B-01", type: "TWO_WHEELER", status: "AVAILABLE", rate: 25 },
                    { id: "S107", number: "B-02", type: "EV", status: "BOOKED", rate: 70 },
                    { id: "S108", number: "B-03", type: "FOUR_WHEELER", status: "AVAILABLE", rate: 50 }
                ]
            },
            {
                id: "LOC-02",
                name: "Cyber Heights Tech Park",
                address: "Phase II, Electronic City, Bengaluru",
                city: "Bengaluru",
                hourlyRate: 60,
                totalSlots: 6,
                vehicleTypes: ["FOUR_WHEELER", "TWO_WHEELER", "EV"],
                slots: [
                    { id: "S201", number: "CP-01", type: "FOUR_WHEELER", status: "AVAILABLE", rate: 60 },
                    { id: "S202", number: "CP-02", type: "EV", status: "AVAILABLE", rate: 80 },
                    { id: "S203", number: "CP-03", type: "TWO_WHEELER", status: "BOOKED", rate: 30 },
                    { id: "S204", number: "CP-04", type: "FOUR_WHEELER", status: "AVAILABLE", rate: 60 },
                    { id: "S205", number: "CP-05", type: "TWO_WHEELER", status: "AVAILABLE", rate: 30 },
                    { id: "S206", number: "CP-06", type: "EV", status: "AVAILABLE", rate: 80 }
                ]
            },
            {
                id: "LOC-03",
                name: "Terminal 3 International Airport",
                address: "Aerocity Gateway, Mumbai",
                city: "Mumbai",
                hourlyRate: 90,
                totalSlots: 4,
                vehicleTypes: ["FOUR_WHEELER", "EV"],
                slots: [
                    { id: "S301", number: "T3-01", type: "FOUR_WHEELER", status: "AVAILABLE", rate: 90 },
                    { id: "S302", number: "T3-02", type: "FOUR_WHEELER", status: "BOOKED", rate: 90 },
                    { id: "S303", number: "T3-03", type: "EV", status: "AVAILABLE", rate: 110 },
                    { id: "S304", number: "T3-04", type: "FOUR_WHEELER", status: "AVAILABLE", rate: 90 }
                ]
            }
        ];
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(locations));
    }

    if (url.pathname === '/api/bookings' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const booking = JSON.parse(body);
                const currentData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8') || '[]');
                currentData.push(booking);
                fs.writeFileSync(DATA_FILE, JSON.stringify(currentData, null, 2));
                res.writeHead(201, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ success: true, booking }));
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: "Invalid JSON format" }));
            }
        });
        return;
    }

    // Static File Serving
    let filePath = path.join(__dirname, url.pathname === '/' ? 'index.html' : url.pathname);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 Not Found');
            } else {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end(`Server Error: ${err.code}`);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`Program 1 Server running at http://localhost:${PORT}`);
});
