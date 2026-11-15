# Program 3: Core Node.js HTTP Server & CRUD System

**Course Outcome Covered:**
- **CO4:** Construct backend server applications using core Node.js modules (`http`, `fs`, `path`, `events`, `stream`) without web frameworks, demonstrating stream piping, non-blocking I/O, asynchronous file persistence, and RESTful routing.

---

## 1. Aim
To develop a backend HTTP server using purely standard Node.js libraries (strictly no Express), supporting complete CRUD operations on a JSON file store, input parsing, error handling, event-driven audit logging with `EventEmitter`, and file streaming via `ReadableStream.pipe()`.

---

## 2. Architecture & Modules
| Core Module | Implementation in Program 3 |
| :--- | :--- |
| `http` | Low-level request dispatcher handling GET, POST, PUT, DELETE without Express |
| `fs` / `fs.promises` | Async reads and writes to `data/bookings.json` with conflict prevention |
| `path` | Cross-platform directory path resolutions for data and public folders |
| `events` (`EventEmitter`) | Event-driven architecture dispatching `booking:created`, `booking:updated`, `booking:deleted` |
| `stream` | `fs.createReadStream().pipe()` for streaming static assets and streaming live audit logs |

---

## 3. How to Run on Windows

1. Navigate to `program-3-core-node`:
```powershell
cd program-3-core-node
```

2. Start the native HTTP server:
```powershell
node server.js
```

3. Open in browser:
```
http://localhost:3003
```

4. Run automated CRUD test suite in a second terminal:
```powershell
node test-crud.js
```
