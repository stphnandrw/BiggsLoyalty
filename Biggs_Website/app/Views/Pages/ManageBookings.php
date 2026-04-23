<main class="w-full min-h-screen bg-gray-100 text-gray-900">
    <div class="mx-auto max-w-full px-4 py-4 sm:px-6 lg:px-8">

        <!-- Header -->
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div class="flex items-center gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-sm">
                    <span class="block h-5 w-5 rounded-md border-2 border-current"></span>
                </div>
                <div>
                    <h1 class="text-2xl font-semibold tracking-tight text-gray-900">Bookings</h1>
                </div>
            </div>
            <div class="flex flex-wrap items-center gap-2">
                <div class="relative inline-block">
                    <button id="viewModeBtn" type="button" class="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 flex items-center gap-2">
                        <svg id="viewModeIcon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 12.75h2.25c.621 0 1.125.504 1.125 1.125v6.75c0 .621-.504 1.125-1.125 1.125h-2.25A1.125 1.125 0 0 1 9.75 19.875v-6.75Zm6-9h2.25A1.125 1.125 0 0 1 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125c0-.621.504-1.125 1.125-1.125Z" />
                        </svg>
                        <span id="viewModeText">Table</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                    </button>
                    <div id="viewModeDropdown" class="hidden absolute right-0 mt-2 w-40 rounded-xl border border-gray-200 bg-white shadow-lg z-50">
                        <button type="button" class="view-mode-option w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-t-xl flex items-center gap-2" data-mode="table">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 12.75h2.25c.621 0 1.125.504 1.125 1.125v6.75c0 .621-.504 1.125-1.125 1.125h-2.25A1.125 1.125 0 0 1 9.75 19.875v-6.75Zm6-9h2.25A1.125 1.125 0 0 1 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125c0-.621.504-1.125 1.125-1.125Z" />
                            </svg>
                            Table View
                        </button>
                        <button type="button" class="view-mode-option w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-b-xl flex items-center gap-2" data-mode="calendar">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                            </svg>
                            Calendar View
                        </button>
                    </div>
                </div>
                <button type="button" class="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">Add Booking</button>
            </div>
        </div>

        <!-- Bookings Table Area -->
        <div id="bookings-container" class="mt-5 space-y-5">
            <div class="flex items-center justify-center py-12 text-gray-400 text-sm">Loading bookings…</div>
        </div>


    </div>

    <!-- Booking Details Modal -->
    <div id="booking-modal" class="fixed inset-0 z-[10000] hidden">
        <!-- Backdrop -->
        <div id="booking-modal-backdrop" class="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"></div>

        <!-- Panel -->
        <div class="relative flex min-h-full items-center justify-center p-4">
            <div id="booking-modal-panel" class="relative w-full max-w-md rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200 flex flex-col max-h-[90vh]">

                <!-- Header -->
                <div class="flex items-start justify-between px-6 pt-6 pb-4 border-b border-gray-100">
                    <div>
                        <h2 class="text-lg font-semibold text-gray-900">Booking Details</h2>
                    </div>
                    <button id="booking-modal-close" type="button" class="ml-4 flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <!-- Scrollable Body -->
                <div class="overflow-y-auto flex-1 px-6 py-5 ">

                    <!-- Loading State -->
                    <div id="booking-modal-loading" class="flex items-center justify-center py-12 text-gray-400 text-sm hidden">
                        <svg class="animate-spin h-5 w-5 mr-2 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                        </svg>
                        Loading booking…
                    </div>

                    <!-- Error State -->
                    <div id="booking-modal-error" class="hidden py-8 text-center text-sm text-red-500"></div>

                    <!-- Content -->
                    <div id="booking-modal-content" class="hidden space-y-5">

                        <!-- Package Info Card -->
                        <div class="rounded-xl border border-gray-100 bg-gray-50 p-4">
                            <div class="flex items-center gap-3">
                                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-gray-200 shadow-sm text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-5 w-5">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                                    </svg>
                                </div>
                                <div class="min-w-0">
                                    <p id="bm-package-name" class="text-sm font-semibold text-gray-900 truncate">—</p>
                                    <p class="text-xs text-gray-400 mt-0.5">Package</p>
                                </div>
                                <span id="bm-status-badge" class="ml-auto inline-flex shrink-0 rounded-full px-2.5 py-1 text-xs font-medium uppercase">—</span>
                            </div>
                        </div>

                        <!-- Booking Info Section -->
                        <div>
                            <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Booking Info</p>
                            <div class="grid grid-cols-2 gap-3">
                                <div class="rounded-xl border border-gray-100 bg-white p-3">
                                    <p class="text-xs text-gray-400 mb-1">Booking ID</p>
                                    <p id="bm-booking-id" class="text-sm font-semibold text-gray-800">—</p>
                                </div>
                                <div class="rounded-xl border border-gray-100 bg-white p-3">
                                    <p class="text-xs text-gray-400 mb-1">Slot Date</p>
                                    <p id="bm-slot-date" class="text-sm font-semibold text-gray-800">—</p>
                                </div>
                                <div class="rounded-xl border border-gray-100 bg-white p-3">
                                    <p class="text-xs text-gray-400 mb-1">Time</p>
                                    <p id="bm-time" class="text-sm font-semibold text-gray-800">—</p>
                                </div>
                                <div class="rounded-xl border border-gray-100 bg-white p-3">
                                    <p class="text-xs text-gray-400 mb-1">Pax Size</p>
                                    <p id="bm-pax" class="text-sm font-semibold text-gray-800">—</p>
                                </div>
                                <div class="rounded-xl border border-gray-100 bg-white p-3">
                                    <p class="text-xs text-gray-400 mb-1">Rate / Head</p>
                                    <p id="bm-rate" class="text-sm font-semibold text-gray-800">—</p>
                                </div>
                                <div class="rounded-xl border border-gray-100 bg-white p-3">
                                    <p class="text-xs text-gray-400 mb-1">Total</p>
                                    <p id="bm-total" class="text-sm font-bold text-gray-900">—</p>
                                </div>
                            </div>
                            <!-- Note -->
                            <div id="bm-note-wrap" class="mt-3 hidden rounded-xl border border-gray-100 bg-white p-3">
                                <p class="text-xs text-gray-400 mb-1">Note</p>
                                <p id="bm-note" class="text-sm text-gray-700">—</p>
                            </div>
                        </div>

                        <!-- Customer Details -->
                        <div id="bm-customer-section">
                            <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Customer Details</p>

                            <!-- Customer Loading -->
                            <div id="bm-customer-loading" class="hidden flex items-center gap-2 text-gray-400 text-xs py-2">
                                <svg class="animate-spin h-3.5 w-3.5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                </svg>
                                Looking up customer…
                            </div>

                            <!-- Customer Error -->
                            <div id="bm-customer-error" class="hidden rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-xs text-red-500"></div>

                            <!-- Customer Card -->
                            <div id="bm-customer-card" class="hidden rounded-xl border border-gray-100 bg-gray-50 p-4">
                                <div class="flex items-center gap-3 mb-4">
                                    <div id="bm-customer-avatar" class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-sm font-bold">—</div>
                                    <div class="min-w-0">
                                        <p id="bm-customer-name" class="text-sm font-semibold text-gray-900 truncate">—</p>
                                    </div>
                                </div>
                                <div class="grid grid-cols-2 gap-2">
                                    <div class="rounded-lg bg-white border border-gray-100 px-3 py-2">
                                        <p class="text-xs text-gray-400 mb-0.5">Phone</p>
                                        <p id="bm-customer-phone" class="text-sm font-medium text-gray-700">—</p>
                                    </div>
                                    <div class="rounded-lg bg-white border border-gray-100 px-3 py-2">
                                        <p class="text-xs text-gray-400 mb-0.5">Email</p>
                                        <p id="bm-customer-email" class="text-sm font-medium text-gray-700">—</p>
                                    </div>
                                </div>
                            </div>

                            <!-- No Tag -->
                            <div id="bm-customer-no-tag" class="hidden rounded-xl border border-dashed border-gray-200 px-4 py-3 text-xs text-gray-400 text-center">
                                Customer details unavailable.
                            </div>
                        </div>

                    </div>
                </div>

                <!-- Footer -->
                <div id="booking-modal-footer" class="hidden border-t border-gray-100 px-6 py-4">
                    <!-- Pending Actions -->
                    <div id="bm-footer-pending" class="hidden flex items-center justify-between gap-3">
                        <button type="button" id="bm-reject-btn"
                            class="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 transition">
                            Reject
                        </button>
                        <button type="button" id="bm-approve-btn"
                            class="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition">
                            Approve Booking
                        </button>
                    </div>

                    <!-- Confirmed Actions -->
                    <div id="bm-footer-confirmed" class="hidden flex items-center justify-between gap-3">
                        <button type="button" id="bm-cancel-btn"
                            class="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 transition">
                            Cancel Booking
                        </button>
                        <button type="button" id="bm-resched-btn"
                            class="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
                            Reschedule
                        </button>
                    </div>

                    <!-- Reschedule Form (shown inline) -->
                    <div id="bm-footer-resched" class="hidden space-y-3">
                        <p class="text-xs font-semibold uppercase tracking-widest text-gray-400">New Schedule</p>
                        <div class="space-y-3">
                            <div>
                                <label class="block text-xs text-gray-400 mb-1">New Date</label>
                                <input type="date" id="bm-resched-date"
                                    class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300" />
                            </div>
                            <div>
                                <label class="block text-xs text-gray-400 mb-1">Available Slot</label>
                                <select id="bm-resched-slot"
                                    class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300">
                                    <option value="">Select a date first</option>
                                </select>
                                <!-- Loading state -->
                                <div id="bm-resched-slot-loading" class="hidden flex items-center gap-2 text-gray-400 text-xs mt-1">
                                    <svg class="animate-spin h-3 w-3 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                    </svg>
                                    Loading available slots…
                                </div>
                                <!-- Error state -->
                                <div id="bm-resched-slot-error" class="hidden text-red-500 text-xs mt-1"></div>
                            </div>
                        </div>
                        <div class="flex items-center justify-between gap-3 pt-1">
                            <button type="button" id="bm-resched-cancel-btn"
                                class="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
                                Back
                            </button>
                            <button type="button" id="bm-resched-confirm-btn"
                                class="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition">
                                Confirm Reschedule
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</main>
<script>
    $(function() {

        /* ─────────────── STATUS STYLES ─────────────── */
        const statusClassMap = {
            'pending': 'bg-yellow-100 text-yellow-700',
            'confirmed': 'bg-blue-100 text-blue-700',
            'completed': 'bg-green-100 text-green-700',
            'cancelled': 'bg-red-100 text-red-700',
        };


        /* ─────────────── HELPERS ─────────────── */

        function escHtml(str) {
            return $('<span>').text(str ?? '').html();
        }

        function formatDate(dateStr) {
            if (!dateStr) return '—';
            const d = new Date(dateStr);
            return isNaN(d) ? dateStr : d.toLocaleDateString('en-PH', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }

        function formatTime(timeStr) {
            if (!timeStr) return '—';
            // timeStr is "HH:MM:SS"
            const [h, m] = timeStr.split(':');
            const date = new Date();
            date.setHours(+h, +m);
            return date.toLocaleTimeString('en-PH', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
        }

        function formatCurrency(amount) {
            return '₱' + parseFloat(amount).toLocaleString('en-PH', {
                minimumFractionDigits: 2
            });
        }

        function parseNumber(value) {
            const n = parseFloat(value);
            return Number.isFinite(n) ? n : 0;
        }

        function getBookingDateTime(booking) {
            const datePart = booking.slot_date || '';
            const timePart = booking.time_start || '00:00:00';
            const dt = new Date(`${datePart}T${timePart}`);
            return isNaN(dt) ? null : dt;
        }

        const viewState = {
            search: '',
            status: 'all',
            sort: 'date_desc',
        };

        let allBookings = [];

        function getActiveFilterCount() {
            let count = 0;
            if (viewState.search.trim() !== '') count += 1;
            if (viewState.status !== 'all') count += 1;
            if (viewState.sort !== 'date_desc') count += 1;
            return count;
        }

        function getFilteredBookings() {
            const keyword = viewState.search.trim().toLowerCase();

            const filtered = allBookings.filter(function(booking) {
                const bookingStatus = (booking.status || '').toLowerCase();
                const searchBlob = [
                    booking.booking_id,
                    booking.package_name,
                    booking.customer_name,
                    booking.note,
                    booking.slot_date,
                ].join(' ').toLowerCase();

                const matchesSearch = keyword === '' || searchBlob.includes(keyword);
                const matchesStatus = viewState.status === 'all' || bookingStatus === viewState.status;

                return matchesSearch && matchesStatus;
            });

            filtered.sort(function(a, b) {
                if (viewState.sort === 'date_asc' || viewState.sort === 'date_desc') {
                    const aDate = getBookingDateTime(a);
                    const bDate = getBookingDateTime(b);
                    const aTime = aDate ? aDate.getTime() : 0;
                    const bTime = bDate ? bDate.getTime() : 0;

                    return viewState.sort === 'date_asc' ? (aTime - bTime) : (bTime - aTime);
                }

                const aTotal = parseNumber(a.price_per_head) * parseNumber(a.pax_size);
                const bTotal = parseNumber(b.price_per_head) * parseNumber(b.pax_size);

                return viewState.sort === 'total_asc' ? (aTotal - bTotal) : (bTotal - aTotal);
            });

            return filtered;
        }


        /* ─────────────── RENDER TABLE ROW ─────────────── */

        function buildTableRow(booking, index) {
            const bgClass = index % 2 === 1 ? 'bg-gray-50' : 'bg-white';
            const statusKey = (booking.status || '').toLowerCase();
            const statusCls = statusClassMap[statusKey] || 'bg-gray-100 text-gray-500';
            const totalPrice = parseNumber(booking.price_per_head) * parseNumber(booking.pax_size);

            const $tr = $(`
      <tr class="text-sm text-gray-700 ${bgClass} hover:bg-slate-50/80 transition-colors">
        <td class="px-5 py-4 font-medium text-gray-800">
          <div class="flex items-center gap-3">
            <span class="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 text-xs font-bold">#${escHtml(booking.booking_id)}</span>
            <span>${escHtml(booking.package_name)}</span>
          </div>
        </td>
        <td class="px-5 py-4">
          <div class="flex flex-col gap-0.5">
            <span class="text-gray-800 font-medium">${escHtml(formatDate(booking.slot_date))}</span>
            <span class="text-xs text-gray-400">${escHtml(formatTime(booking.time_start))} – ${escHtml(formatTime(booking.time_end))}</span>
          </div>
        </td>
        <td class="px-5 py-4">
          <span class="inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusCls}">
            ${escHtml(booking.status)}
          </span>
        </td>
        <td class="px-5 py-4 text-gray-500">
          ${escHtml(booking.pax_size)} pax
        </td>
        <td class="px-5 py-4 text-gray-500">
          ${escHtml(formatCurrency(booking.price_per_head))} / head
        </td>
        <td class="px-5 py-4 font-medium text-gray-800">
          ${escHtml(formatCurrency(totalPrice))}
        </td>
        <td class="px-5 py-4">
          <span class="font-mono text-xs text-gray-400">${escHtml(booking.customer_name || '—')}</span>
        </td>
        <td class="px-5 py-4 text-gray-400 text-xs">
          ${escHtml(booking.note || '—')}
        </td>
        <td class="relative px-5 py-4 text-right">
          <button type="button" class="view-btn inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 transition hover:bg-blue-100" aria-label="View booking details">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
            View
          </button>
        </td>
      </tr>
    `);

            return $tr;
        }

        /* ─────────────── RENDER BOOKINGS TABLE ─────────────── */

        function renderBookings() {
            const $container = $('#bookings-container').empty();
            const filteredBookings = getFilteredBookings();
            const activeFilters = getActiveFilterCount();

            if (!allBookings || allBookings.length === 0) {
                $container.html('<div class="flex items-center justify-center py-12 text-gray-400 text-sm">No bookings found.</div>');
                return;
            }

            const $section = $(`
      <section class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm min-h-[300px]">
        <div class="border-b border-gray-200 bg-slate-50/70 px-5 py-4">
          <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 class="text-base font-semibold text-gray-900">All Bookings</h2>
              <p class="text-xs text-gray-500">${filteredBookings.length} of ${allBookings.length} record${allBookings.length !== 1 ? 's' : ''}</p>
            </div>
            <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
              <div class="relative">
                <input id="booking-search" type="text" value="${escHtml(viewState.search)}" placeholder="Search booking, package, tag or note" class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 pr-9 text-sm text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 sm:w-72" />
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-slate-400">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-4.35-4.35m1.85-5.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
                </svg>
              </div>
              <select id="booking-status-filter" class="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100">
                <option value="all" ${viewState.status === 'all' ? 'selected' : ''}>All Status</option>
                <option value="pending" ${viewState.status === 'pending' ? 'selected' : ''}>Pending</option>
                <option value="confirmed" ${viewState.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                <option value="completed" ${viewState.status === 'completed' ? 'selected' : ''}>Completed</option>
                <option value="cancelled" ${viewState.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
              </select>
              <select id="booking-sort" class="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100">
                <option value="date_desc" ${viewState.sort === 'date_desc' ? 'selected' : ''}>Latest Slot</option>
                <option value="date_asc" ${viewState.sort === 'date_asc' ? 'selected' : ''}>Earliest Slot</option>
                <option value="total_desc" ${viewState.sort === 'total_desc' ? 'selected' : ''}>Highest Total</option>
                <option value="total_asc" ${viewState.sort === 'total_asc' ? 'selected' : ''}>Lowest Total</option>
              </select>
              <button id="clear-booking-filters" type="button" class="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50">
                Clear
              </button>
              <span class="inline-flex items-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm">
                Filters (${activeFilters})
              </span>
            </div>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-100">
            <thead class="bg-white">
              <tr class="text-left text-xs font-medium uppercase tracking-wide text-gray-400">
                <th class="px-5 py-3">Package</th>
                <th class="px-5 py-3">Slot</th>
                <th class="px-5 py-3">Status</th>
                <th class="px-5 py-3">Pax</th>
                <th class="px-5 py-3">Rate</th>
                <th class="px-5 py-3">Total</th>
                <th class="px-5 py-3">Customer</th>
                <th class="px-5 py-3">Note</th>
                <th class="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 bookings-tbody"></tbody>
          </table>
        </div>
      </section>
    `);

            const $tbody = $section.find('.bookings-tbody');
            if (filteredBookings.length === 0) {
                $tbody.append(`
          <tr>
            <td colspan="9" class="px-5 py-10 text-center text-sm text-slate-400">No bookings match the current filters.</td>
          </tr>
        `);
            } else {
                $.each(filteredBookings, function(index, booking) {
                    $tbody.append(buildTableRow(booking, index));
                });
            }

            $container.append($section);
        }

        /* ─────────────── AJAX FETCH ─────────────── */

        function fetchAndRenderBookings() {
            $('#bookings-container').html(
                '<div class="flex items-center justify-center py-12 text-gray-400 text-sm">Loading bookings…</div>'
            );


            $.ajax({
                url: '<?= base_url('/branches/bookings') ?>',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    branch_id: <?= session('assigned_at') ?? 0 ?>
                }),
                success: function(response) {
                    if (response.status === 'success') {
                        allBookings = Array.isArray(response.data) ? response.data : [];
                        renderBookings();
                    } else {
                        $('#bookings-container').html(
                            `<div class="py-12 text-center text-red-500 text-sm">${escHtml(response.message || 'Unexpected error.')}</div>`
                        );
                    }
                },
                error: function(xhr) {
                    console.log('Error response:', xhr.responseText);
                    console.log('Error fetching bookings:', xhr);
                    $('#bookings-container').html(
                        `<div class="py-12 text-center text-red-500 text-sm">Failed to load bookings. ${escHtml(xhr.statusText || '')}</div>`
                    );
                },
            });
        }

        $(document).on('input', '#booking-search', function() {
            viewState.search = $(this).val();
            renderBookings();
        });

        $(document).on('change', '#booking-status-filter', function() {
            viewState.status = $(this).val();
            renderBookings();
        });

        $(document).on('change', '#booking-sort', function() {
            viewState.sort = $(this).val();
            renderBookings();
        });

        $(document).on('click', '#clear-booking-filters', function() {
            viewState.search = '';
            viewState.status = 'all';
            viewState.sort = 'date_desc';
            renderBookings();
        });

        fetchAndRenderBookings();

        // Handle View button clicks on table rows
        $(document).on('click', '.view-btn', function(e) {
            e.stopPropagation();
            const bookingId = $(this).closest('tr').find('td:first span:first').text().replace('#', '');
            fetchBooking(bookingId);
        });

        /* ─────────────── BOOKING MODAL ─────────────── */

        const statusClassMap2 = {
            'pending':   'bg-yellow-100 text-yellow-700',
            'confirmed': 'bg-blue-100 text-blue-700',
            'completed': 'bg-green-100 text-green-700',
            'cancelled': 'bg-red-100 text-red-700',
            'rejected':  'bg-red-100 text-red-700',
        };

        let _activeBookingId = null;
        let _activeTagUid = null;

        function openBookingModal() {
            $('#booking-modal').removeClass('hidden');
            $('body').css('overflow', 'hidden');
        }

        function closeBookingModal() {
            $('body').css('overflow', '');
            $('#booking-modal').addClass('hidden');
            $('#booking-modal-loading, #booking-modal-error, #booking-modal-content, #booking-modal-footer').addClass('hidden');
            $('#bm-customer-card, #bm-customer-loading, #bm-customer-error, #bm-customer-no-tag').addClass('hidden');
            $('#bm-footer-pending, #bm-footer-confirmed, #bm-footer-resched').addClass('hidden');
            _activeBookingId = null;
        }

        function setModalLoading() {
            $('#booking-modal-loading').removeClass('hidden');
            $('#booking-modal-error, #booking-modal-content, #booking-modal-footer').addClass('hidden');
        }

        function setModalError(msg) {
            $('#booking-modal-loading, #booking-modal-content, #booking-modal-footer').addClass('hidden');
            $('#booking-modal-error').removeClass('hidden').text(msg || 'Failed to load booking.');
        }

        function renderFooterActions(statusKey) {
            $('#bm-footer-pending, #bm-footer-confirmed, #bm-footer-resched').addClass('hidden');

            if (statusKey === 'pending') {
                $('#bm-footer-pending').removeClass('hidden');
                $('#booking-modal-footer').removeClass('hidden');
            } else if (statusKey === 'confirmed') {
                $('#bm-footer-confirmed').removeClass('hidden');
                $('#booking-modal-footer').removeClass('hidden');
            } else {
                // completed, cancelled, rejected — no actions
                $('#booking-modal-footer').addClass('hidden');
            }
        }

        function doBookingAction(route, payload, successMsg) {
            const $btns = $('#booking-modal-footer button');
            $btns.prop('disabled', true);

            $.ajax({
                url: '<?= base_url('/branches/') ?>' + route,
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(payload),
                success: function(response) {
                    if (response.status === 'success') {
                        closeBookingModal();
                        fetchAndRenderBookings();
                        // Optional: show a toast here
                    } else {
                        alert(response.message || 'Action failed. Please try again.');
                        $btns.prop('disabled', false);
                    }
                },
                error: function(xhr) {
                    alert('Request failed: ' + (xhr.statusText || 'Unknown error'));
                    $btns.prop('disabled', false);
                }
            });
        }

        function populateModal(booking) {
            _activeBookingId = booking.booking_id;
            _activeTagUid = booking.tag_uid;
            const statusKey = (booking.status || '').toLowerCase();
            const statusCls = statusClassMap2[statusKey] || 'bg-gray-100 text-gray-500';
            const totalPrice = parseNumber(booking.price_per_head) * parseNumber(booking.pax_size);

            $('#bm-package-name').text(booking.package_name || '—');
            $('#bm-status-badge')
                .attr('class', `ml-auto inline-flex shrink-0 rounded-full px-2.5 py-1 text-xs font-medium uppercase ${statusCls}`)
                .text(booking.status || '—');
            $('#bm-booking-id').text('#' + booking.booking_id);
            $('#bm-slot-date').text(formatDate(booking.slot_date));
            $('#bm-time').text(formatTime(booking.time_start) + ' – ' + formatTime(booking.time_end));
            $('#bm-pax').text((booking.pax_size || '—') + ' pax');
            $('#bm-rate').text(formatCurrency(booking.price_per_head) + ' / head');
            $('#bm-total').text(formatCurrency(totalPrice));

            if (booking.note) {
                $('#bm-note').text(booking.note);
                $('#bm-note-wrap').removeClass('hidden');
            } else {
                $('#bm-note-wrap').addClass('hidden');
            }

            if (booking.customer_name) {
                const initial = (booking.customer_name[0] || '').toUpperCase();
                $('#bm-customer-avatar').text(initial || '?');
                $('#bm-customer-name').text(booking.customer_name || '—');
                $('#bm-customer-email').text(booking.customer_email || '—');
                $('#bm-customer-phone').text(booking.customer_phone || '—');
                $('#bm-customer-card').removeClass('hidden');
            } else {
                $('#bm-customer-no-tag').removeClass('hidden');
            }

            $('#booking-modal-loading').addClass('hidden');
            $('#booking-modal-content').removeClass('hidden');

            renderFooterActions(statusKey);
        }

        function fetchBooking(bookingId) {
            openBookingModal();
            setModalLoading();

            $.ajax({
                url: '<?= base_url('/branches/booking') ?>',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ booking_id: bookingId }),
                success: function(response) {
                    if (response.status === 'success' && response.data) {
                        populateModal(response.data);
                    } else {
                        setModalError(response.message || 'Booking not found.');
                    }
                },
                error: function(xhr) {
                    setModalError('Failed to load booking. ' + (xhr.statusText || ''));
                }
            });
        }

        /* ── Action handlers ── */

        // Approve
        $(document).on('click', '#bm-approve-btn', function() {
            if (!_activeBookingId) return;
            if (!confirm('Approve booking #' + _activeBookingId + '?')) return;
            doBookingAction('approve-booking', { booking_id: _activeBookingId });
        });

        // Reject
        $(document).on('click', '#bm-reject-btn', function() {
            if (!_activeBookingId) return;
            if (!confirm('Reject booking #' + _activeBookingId + '? This cannot be undone.')) return;
            doBookingAction('reject-booking', { booking_id: _activeBookingId });
        });

        // Cancel (confirmed → cancelled)
        $(document).on('click', '#bm-cancel-btn', function() {
            if (!_activeBookingId) return;
            if (!confirm('Cancel booking #' + _activeBookingId + '? This cannot be undone.')) return;
            doBookingAction('cancel-booking', { booking_id: _activeBookingId });
        });

        // Show reschedule form
        $(document).on('click', '#bm-resched-btn', function() {
            $('#bm-footer-confirmed').addClass('hidden');
            $('#bm-footer-resched').removeClass('hidden');
            $('#bm-resched-date').val('').focus();
            $('#bm-resched-slot').val('');
            $('#bm-resched-slot-loading, #bm-resched-slot-error').addClass('hidden');
        });

        // Fetch slots when date is selected
        $(document).on('change', '#bm-resched-date', function() {
            const selectedDate = $(this).val();
            
            if (!selectedDate) {
                $('#bm-resched-slot').html('<option value="">Select a date first</option>');
                $('#bm-resched-slot-loading, #bm-resched-slot-error').addClass('hidden');
                return;
            }

            const branchId = <?= session('assigned_at') ?? 0 ?>;

            $('#bm-resched-slot-loading').removeClass('hidden');
            $('#bm-resched-slot-error').addClass('hidden');
            $('#bm-resched-slot').html('<option value="">Loading…</option>').prop('disabled', true);

            $.ajax({
                url: '<?= base_url('/booking/slots') ?>',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    branch_id: branchId,
                    slot_date: selectedDate
                }),
                success: function(response) {
                    $('#bm-resched-slot-loading').addClass('hidden');

                    if (response.status === 'success' && response.data && Array.isArray(response.data)) {
                        const slots = response.data;
                        let optionsHtml = '<option value="">Select a slot</option>';

                        $.each(slots, function(index, slot) {
                            const slotId = slot.slot_id || slot.id;
                            const timeStr = slot.time_start ? formatTime(slot.time_start) + ' – ' + formatTime(slot.time_end) : (slot.start_time || slot.time);
                            optionsHtml += '<option value="' + escHtml(slotId) + '">' + escHtml(timeStr) + '</option>';
                        });

                        $('#bm-resched-slot').html(optionsHtml).prop('disabled', false);
                    } else {
                        $('#bm-resched-slot-error').removeClass('hidden').text(response.message || 'No slots available for this date.');
                        $('#bm-resched-slot').html('<option value="">No slots available</option>').prop('disabled', true);
                    }
                },
                error: function(xhr) {
                    $('#bm-resched-slot-loading').addClass('hidden');
                    $('#bm-resched-slot-error').removeClass('hidden').text('Failed to load slots. Please try again.');
                    $('#bm-resched-slot').html('<option value="">Failed to load</option>').prop('disabled', true);
                }
            });
        });

        // Back from reschedule form
        $(document).on('click', '#bm-resched-cancel-btn', function() {
            $('#bm-resched-date').val('');
            $('#bm-resched-slot').val('');
            $('#bm-resched-slot-loading, #bm-resched-slot-error').addClass('hidden');
            $('#bm-footer-resched').addClass('hidden');
            $('#bm-footer-confirmed').removeClass('hidden');
        });

        // Confirm reschedule
        $(document).on('click', '#bm-resched-confirm-btn', function() {
            if (!_activeBookingId) return;
            const newDate = $('#bm-resched-date').val();
            const slotId = $('#bm-resched-slot').val();

            if (!newDate) { alert('Please select a new date.'); return; }
            if (!slotId) { alert('Please select a new slot.'); return; }

            const $selectedOption = $('#bm-resched-slot option:selected');
            const slotText = $selectedOption.text();

            if (!confirm('Reschedule booking #' + _activeBookingId + ' to ' + newDate + ' (' + slotText + ')?')) return;

            doBookingAction('reschedule-booking', {
                booking_id: _activeBookingId,
                new_slot_id: slotId
            });
        });

        /* ── Close handlers ── */
        $(document).on('click', '#booking-modal-close', closeBookingModal);
        $(document).on('click', '#booking-modal-backdrop', closeBookingModal);
        $(document).on('keydown', function(e) {
            if (e.key === 'Escape') closeBookingModal();
        });

        // View button
        $(document).on('click', '.view-btn', function(e) {
            e.stopPropagation();
            const bookingId = $(this).closest('tr').find('td:first span:first').text().replace('#', '');
            fetchBooking(bookingId);
        });
    });

    /* ─────────────── VIEW MODE SWITCHER ─────────────── */
    $(function() {
        const viewModeBtn = document.getElementById('viewModeBtn');
        const viewModeDropdown = document.getElementById('viewModeDropdown');
        const viewModeOptions = document.querySelectorAll('.view-mode-option');
        
        // Toggle dropdown
        viewModeBtn.addEventListener('click', () => {
            viewModeDropdown.classList.toggle('hidden');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!viewModeBtn.contains(e.target) && !viewModeDropdown.contains(e.target)) {
                viewModeDropdown.classList.add('hidden');
            }
        });

        // Handle view mode selection
        viewModeOptions.forEach(option => {
            option.addEventListener('click', () => {
                const mode = option.dataset.mode;
                localStorage.setItem('bookingsViewMode', mode);
                window.location.href = `<?= base_url('/bookings') ?>?view=${mode}`;
            });
        });
    });
</script>