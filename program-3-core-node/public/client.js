/**
 * Client-Side Controller for Program 3 Core Node.js CRUD
 */

const form = document.getElementById('booking-crud-form');
const formHeading = document.getElementById('form-heading');
const editingIdInput = document.getElementById('editing-id');
const slotNumberInput = document.getElementById('slot-number');
const vehicleTypeSelect = document.getElementById('vehicle-type');
const driverNameInput = document.getElementById('driver-name');
const vehicleNumberInput = document.getElementById('vehicle-number');
const bookingDateInput = document.getElementById('booking-date');
const durationHoursInput = document.getElementById('duration-hours');
const hourlyRateInput = document.getElementById('hourly-rate');
const btnSave = document.getElementById('btn-save');
const btnCancelEdit = document.getElementById('btn-cancel-edit');
const crudTbody = document.getElementById('crud-tbody');
const terminalBox = document.getElementById('audit-log-terminal');
const tableSearch = document.getElementById('table-search');
const btnRefreshLogs = document.getElementById('btn-refresh-logs');
const btnReloadTable = document.getElementById('btn-reload-table');
const toastBox = document.getElementById('toast-box');

// Set default date
bookingDateInput.value = new Date().toISOString().split('T')[0];

function showToast(msg) {
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = msg;
    toastBox.appendChild(el);
    setTimeout(() => el.remove(), 3500);
}

// 1. READ: Fetch all bookings (GET)
async function loadBookings() {
    try {
        const query = tableSearch.value.trim();
        const url = query ? `/api/bookings?search=${encodeURIComponent(query)}` : '/api/bookings';
        const res = await fetch(url);
        const data = await res.json();

        if (data.success) {
            renderTable(data.data);
        } else {
            crudTbody.innerHTML = `<tr><td colspan="7" class="text-center" style="color:red;">Failed: ${data.error}</td></tr>`;
        }
    } catch (err) {
        crudTbody.innerHTML = `<tr><td colspan="7" class="text-center" style="color:red;">Error connecting to Core Node server</td></tr>`;
    }
}

function renderTable(bookings) {
    if (!bookings || bookings.length === 0) {
        crudTbody.innerHTML = `<tr><td colspan="7" class="text-center" style="padding: 1.5rem; color: #64748b;">No bookings stored in data/bookings.json</td></tr>`;
        return;
    }

    crudTbody.innerHTML = bookings.map(b => `
        <tr>
            <td><strong>#${b.id}</strong></td>
            <td>
                <div><strong>${b.slotNumber}</strong></div>
                <small style="color: #64748b;">${b.vehicleType}</small>
            </td>
            <td>
                <div>${b.driverName}</div>
                <small style="color: #64748b;">${b.vehicleNumber}</small>
            </td>
            <td>
                <div>${b.date}</div>
                <small style="color: #64748b;">${b.durationHours} hr(s) from ${b.startTime}</small>
            </td>
            <td>
                <div><strong>₹${b.totalAmount}</strong></div>
                <small style="color: #64748b;">@ ₹${b.hourlyRate}/hr</small>
            </td>
            <td>
                <span class="status-badge ${b.status.toLowerCase()}">${b.status}</span>
            </td>
            <td>
                <div class="actions-col">
                    <button class="btn btn-sm btn-edit" onclick="startEdit('${b.id}')">Edit</button>
                    <button class="btn btn-sm btn-delete" onclick="deleteBooking('${b.id}')">Delete</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// 2. CREATE or UPDATE (POST / PUT)
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const isEdit = Boolean(editingIdInput.value);
    const id = editingIdInput.value;

    const payload = {
        slotNumber: slotNumberInput.value.trim(),
        vehicleType: vehicleTypeSelect.value,
        driverName: driverNameInput.value.trim(),
        vehicleNumber: vehicleNumberInput.value.trim().toUpperCase(),
        date: bookingDateInput.value,
        durationHours: Number(durationHoursInput.value),
        hourlyRate: Number(hourlyRateInput.value)
    };

    const url = isEdit ? `/api/bookings/${id}` : '/api/bookings';
    const method = isEdit ? 'PUT' : 'POST';

    try {
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await res.json();
        if (result.success) {
            showToast(result.message || 'Saved successfully');
            cancelEdit();
            loadBookings();
            loadAuditLogs();
        } else {
            alert(`Error: ${result.error}`);
        }
    } catch (err) {
        alert('Request failed');
    }
});

// 3. EDIT (Pre-fill Form)
window.startEdit = async function(id) {
    try {
        const res = await fetch(`/api/bookings/${id}`);
        const data = await res.json();
        if (!data.success) return alert(data.error);

        const b = data.data;
        editingIdInput.value = b.id;
        slotNumberInput.value = b.slotNumber;
        vehicleTypeSelect.value = b.vehicleType;
        driverNameInput.value = b.driverName;
        vehicleNumberInput.value = b.vehicleNumber;
        bookingDateInput.value = b.date;
        durationHoursInput.value = b.durationHours;
        hourlyRateInput.value = b.hourlyRate;

        formHeading.textContent = `Update Booking Record #${b.id} (PUT)`;
        btnSave.textContent = 'Save Changes (PUT)';
        btnCancelEdit.style.display = 'inline-block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
        alert('Failed to load record');
    }
};

function cancelEdit() {
    editingIdInput.value = '';
    form.reset();
    bookingDateInput.value = new Date().toISOString().split('T')[0];
    formHeading.textContent = 'Create New Booking Record (POST)';
    btnSave.textContent = 'Submit Record (POST)';
    btnCancelEdit.style.display = 'none';
}

btnCancelEdit.addEventListener('click', cancelEdit);

// 4. DELETE (DELETE)
window.deleteBooking = async function(id) {
    if (!confirm(`Are you sure you want to delete booking #${id} from JSON file?`)) return;

    try {
        const res = await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
        const result = await res.json();
        if (result.success) {
            showToast(result.message);
            loadBookings();
            loadAuditLogs();
        } else {
            alert(result.error);
        }
    } catch (err) {
        alert('Delete failed');
    }
};

// 5. STREAMS: Load Audit Logs
async function loadAuditLogs() {
    try {
        const res = await fetch('/api/audit-logs');
        const text = await res.text();
        terminalBox.textContent = text || 'No audit events recorded yet.';
        terminalBox.scrollTop = terminalBox.scrollHeight;
    } catch (err) {
        terminalBox.textContent = 'Could not stream audit logs.';
    }
}

// Search & Reload bindings
tableSearch.addEventListener('input', () => {
    loadBookings();
});

btnReloadTable.addEventListener('click', loadBookings);
btnRefreshLogs.addEventListener('click', loadAuditLogs);

// Initialize
loadBookings();
loadAuditLogs();
