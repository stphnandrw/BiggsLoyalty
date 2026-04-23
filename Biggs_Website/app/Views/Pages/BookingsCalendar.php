<main class="min-h-screen bg-gray-100 text-gray-900">
    <div class="mx-auto max-w-full px-4 py-4 sm:px-6 lg:px-8 h-screen flex flex-col">

        <!-- Header -->
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-4">
            <div class="flex items-center gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-5 w-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                    </svg>
                </div>
                <div>
                    <h1 class="text-2xl font-semibold tracking-tight text-gray-900">Bookings Calendar</h1>
                </div>
            </div>
            <div class="flex flex-wrap items-center gap-2">
                <div class="relative inline-block">
                    <button id="viewModeBtn" type="button" class="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                        </svg>
                        <span id="viewModeText">Calendar</span>
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
                <button type="button" class="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">+ Add Booking</button>
                <button type="button" id="createSlotBtn" class="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">+ Create Slot</button>
                <button type="button" id="viewSlotsBtn" class="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">View Slots</button>
            </div>
        </div>

        <!-- Calendar Container -->
        <div class="flex-1 flex flex-col bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

            <!-- Header Bar -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-slate-50/70">
                <div>
                    <div id="headerDate" class="text-lg font-semibold text-gray-900"></div>
                    <div id="headerDay" class="text-xs text-gray-500 mt-0.5"></div>
                </div>
                <div class="flex items-center gap-2">
                    <button id="prevDay" type="button" class="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-600" title="Previous day">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    </button>
                    <button id="todayBtn" type="button" class="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700">Today</button>
                    <button id="nextDay" type="button" class="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-600" title="Next day">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </button>
                </div>
            </div>

            <!-- Timeline & Sidebar -->
            <div class="flex flex-1 overflow-hidden">

                <!-- Timeline -->
                <div id="bkTimeline" class="flex-1 overflow-y-auto">
                    <div id="bkTimelineInner" class="bg-white"></div>
                </div>

                <!-- Sidebar -->
                <div class="w-[30%] flex-shrink-0 border-l border-gray-200 overflow-y-auto bg-slate-50/50 p-4">

                    <!-- Mini Calendar -->
                    <div>
                        <div class="flex items-center justify-between mb-4">
                            <button id="miniPrev" type="button" class="inline-flex items-center justify-center w-6 h-6 rounded text-gray-600 hover:bg-gray-200">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
                            </button>
                            <span id="miniMonthLabel" class="text-sm font-semibold text-gray-900"></span>
                            <button id="miniNext" type="button" class="inline-flex items-center justify-center w-6 h-6 rounded text-gray-600 hover:bg-gray-200">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                            </button>
                        </div>
                        <div id="miniGrid" class="grid grid-cols-7 gap-1 text-center text-xs"></div>
                    </div>

                    <hr class="my-4 border-gray-200">

                    <!-- Upcoming -->
                    <div id="upcomingSection">
                        <div class="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">Upcoming</div>
                        <div id="upcomingList" class="space-y-2"></div>
                    </div>

                    <!-- Upcoming (when panel is hidden) -->
                    <div id="upcomingWhenPanelHidden"></div>

                </div>

            </div>

        </div>

    </div>

    <!-- Booking Details Modal (reuse from ManageBookings) -->
    <div id="booking-modal" class="fixed inset-0 z-[10000] hidden">
        <div id="booking-modal-backdrop" class="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"></div>
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
                <div class="overflow-y-auto flex-1 px-6 py-5">

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

                            <!-- No Customer -->
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
                        <button type="button" id="bm-reject-btn" class="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 transition">Reject</button>
                        <button type="button" id="bm-approve-btn" class="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition">Approve Booking</button>
                    </div>

                    <!-- Confirmed Actions -->
                    <div id="bm-footer-confirmed" class="hidden flex items-center justify-between gap-3">
                        <button type="button" id="bm-cancel-btn" class="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 transition">Cancel Booking</button>
                        <button type="button" id="bm-resched-btn" class="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">Reschedule</button>
                    </div>

                    <!-- Reschedule Form -->
                    <div id="bm-footer-resched" class="hidden space-y-3">
                        <p class="text-xs font-semibold uppercase tracking-widest text-gray-400">New Schedule</p>
                        <div class="space-y-3">
                            <div>
                                <label class="block text-xs text-gray-400 mb-1">New Date</label>
                                <input type="date" id="bm-resched-date" class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300" />
                            </div>
                            <div>
                                <label class="block text-xs text-gray-400 mb-1">Available Slot</label>
                                <select id="bm-resched-slot" class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300">
                                    <option value="">Select a date first</option>
                                </select>
                                <div id="bm-resched-slot-loading" class="hidden flex items-center gap-2 text-gray-400 text-xs mt-1">
                                    <svg class="animate-spin h-3 w-3 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                    </svg>
                                    Loading available slots…
                                </div>
                                <div id="bm-resched-slot-error" class="hidden text-red-500 text-xs mt-1"></div>
                            </div>
                        </div>
                        <div class="flex items-center justify-between gap-3 pt-1">
                            <button type="button" id="bm-resched-cancel-btn" class="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">Back</button>
                            <button type="button" id="bm-resched-confirm-btn" class="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition">Confirm Reschedule</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>

    <!-- Slots Manager Modal (Unified Create/View) -->
    <div id="slots-manager-modal" class="fixed inset-0 z-[10001] hidden">
        <div id="slots-manager-backdrop" class="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"></div>
        <div class="relative flex min-h-full items-center justify-center p-4">
            <div id="slots-manager-panel" class="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200 flex flex-col max-h-[90vh]">

                <!-- Header with Tabs -->
                <div class="flex items-start justify-between px-6 pt-6 pb-0 border-b border-gray-100">
                    <div>
                        <h2 class="text-lg font-semibold text-gray-900">Manage Slots</h2>
                    </div>
                    <button id="slots-manager-close" type="button" class="ml-4 flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <!-- Tab Navigation -->
                <div class="flex border-b border-gray-200 px-6">
                    <button type="button" id="sm-tab-view" class="sm-tab-btn px-4 py-3 text-sm font-medium text-blue-600 border-b-2 border-blue-600" data-tab="view">
                        View Slots
                    </button>
                    <button type="button" id="sm-tab-create" class="sm-tab-btn px-4 py-3 text-sm font-medium text-gray-700 border-b-2 border-transparent hover:text-gray-900" data-tab="create">
                        Create Slot
                    </button>
                </div>

                <!-- Body -->
                <div class="overflow-y-auto flex-1 px-6 py-5">

                    <!-- Date Picker Section (shared) -->
                    <div class="mb-6">
                        <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Select Date</p>
                        <div class="rounded-xl border border-gray-200 bg-white p-4">
                            <div class="flex items-center justify-between mb-3">
                                <button id="sm-cal-prev" type="button" class="inline-flex items-center justify-center w-6 h-6 rounded text-gray-600 hover:bg-gray-200">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
                                </button>
                                <span id="sm-cal-month" class="text-sm font-semibold text-gray-900"></span>
                                <button id="sm-cal-next" type="button" class="inline-flex items-center justify-center w-6 h-6 rounded text-gray-600 hover:bg-gray-200">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                </button>
                            </div>
                            <div id="sm-mini-grid" class="grid grid-cols-7 gap-1 text-center text-xs"></div>
                        </div>
                        <div id="sm-selected-date-display" class="text-xs text-gray-600 text-center py-2 rounded-lg bg-blue-50 border border-blue-100 mt-2">
                            No date selected
                        </div>
                    </div>

                    <!-- VIEW TAB CONTENT -->
                    <div id="sm-view-content" class="sm-tab-content">
                        <!-- Loading State -->
                        <div id="sm-view-loading" class="hidden flex items-center justify-center py-12 text-gray-400 text-sm">
                            <svg class="animate-spin h-5 w-5 mr-2 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                            </svg>
                            Loading slots…
                        </div>

                        <!-- Error State -->
                        <div id="sm-view-error" class="hidden rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-xs text-red-500 mb-3"></div>

                        <!-- Empty State -->
                        <div id="sm-view-empty" class="hidden text-center py-8 text-sm text-gray-400">
                            No slots available for the selected date
                        </div>

                        <!-- Slots List -->
                        <div id="sm-view-list" class="hidden">
                            <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Available Slots</p>
                            <div id="sm-slots-content" class="space-y-2"></div>
                        </div>
                    </div>

                    <!-- CREATE TAB CONTENT -->
                    <div id="sm-create-content" class="sm-tab-content hidden">
                        <!-- Loading State -->
                        <div id="sm-create-loading" class="hidden flex items-center justify-center py-8 text-gray-400 text-sm">
                            <svg class="animate-spin h-5 w-5 mr-2 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                            </svg>
                            Creating slot…
                        </div>

                        <!-- Error State -->
                        <div id="sm-create-error" class="hidden rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-xs text-red-500 mb-3"></div>

                        <!-- Success State -->
                        <div id="sm-create-success" class="hidden rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-xs text-green-700 mb-3">
                            Slot created successfully!
                        </div>

                        <!-- Form Content -->
                        <div id="sm-create-form" class="space-y-3">
                            <div>
                                <label class="block text-xs text-gray-400 mb-1">Start Time</label>
                                <input type="time" id="sm-time-start" class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300" />
                            </div>
                            <div>
                                <label class="block text-xs text-gray-400 mb-1">End Time</label>
                                <input type="time" id="sm-time-end" class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300" />
                            </div>
                            <div class="flex items-center gap-2 pt-1">
                                <input type="checkbox" id="sm-is-available" class="rounded" checked />
                                <label for="sm-is-available" class="text-xs text-gray-600">Available for booking</label>
                            </div>
                        </div>
                    </div>

                </div>

                <!-- Footer -->
                <div id="sm-footer" class="border-t border-gray-100 px-6 py-4 flex items-center justify-between gap-3">
                    <button type="button" id="sm-cancel-btn" class="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">Cancel</button>
                    <button type="button" id="sm-submit-btn" class="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition">Create Slot</button>
                </div>

            </div>
        </div>
    </div>

</main>

<script>
$(function() {

    /* ─────────────── STATUS COLORS ─────────────── */
    const STATUS_COLORS = {
        pending:   { bg: '#fef3c7', color: '#92400e', dot: '#d97706' },
        confirmed: { bg: '#dbeafe', color: '#1e3a8a', dot: '#3b82f6' },
        completed: { bg: '#dcfce7', color: '#14532d', dot: '#22c55e' },
        cancelled: { bg: '#fee2e2', color: '#7f1d1d', dot: '#ef4444' },
    };

    const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

    let selectedDate = new Date();
    let miniMonth    = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    const today      = new Date();
    const ROW_H = 60; // px per hour
    let allBookings = [];

    /* ─────────────── HELPERS ─────────────── */
    function isSameDay(a, b) {
        return a.getFullYear() === b.getFullYear() &&
               a.getMonth()    === b.getMonth()    &&
               a.getDate()     === b.getDate();
    }

    function dateKey(d) {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const date = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${date}`;
    }

    function parseDateKey(s) {
        const p = s.split('-');
        return new Date(+p[0], +p[1]-1, +p[2]);
    }

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
            minimumFractionDigits: 0
        });
    }

    function durationPx(start, end) {
        const [sh, sm] = start.split(':');
        const [eh, em] = end.split(':');
        const mins = (+eh * 60 + +em) - (+sh * 60 + +sm);
        return Math.max(36, (mins / 60) * ROW_H);
    }

    function getBookingsForDate(d) {
        const k = dateKey(d);
        return allBookings.filter(b => b.slot_date === k);
    }

    function getDatesWithBookings() {
        const set = {};
        allBookings.forEach(b => { set[b.slot_date] = true; });
        return set;
    }

    function parseNumber(value) {
        const n = parseFloat(value);
        return Number.isFinite(n) ? n : 0;
    }

    /* ─────────────── RENDER HEADER ─────────────── */
    function renderHeader() {
        document.getElementById('headerDate').textContent =
            MONTHS[selectedDate.getMonth()] + ' ' + selectedDate.getDate() + ', ' + selectedDate.getFullYear();
        document.getElementById('headerDay').textContent = DAYS[selectedDate.getDay()];
    }

    /* ─────────────── RENDER TIMELINE ─────────────── */
    function renderTimeline() {
        const inner    = document.getElementById('bkTimelineInner');
        inner.innerHTML = '';
        const bookings = getBookingsForDate(selectedDate);

        for (let h = 7; h < 24; h++) {
            const row   = document.createElement('div');
            row.className = 'flex border-b border-gray-100';
            row.style.minHeight = ROW_H + 'px';

            const label = document.createElement('div');
            label.className = 'w-14 flex-shrink-0 px-3 py-2 text-right text-xs font-medium text-gray-500 border-r border-gray-100';
            if (h === 0)       label.textContent = '12AM';
            else if (h < 12)   label.textContent = h + 'AM';
            else if (h === 12) label.textContent = '12PM';
            else               label.textContent = (h - 12) + 'PM';

            const content = document.createElement('div');
            content.className = 'flex-1 relative';
            content.style.minHeight = ROW_H + 'px';

            bookings.forEach(b => {
                const [bh] = b.time_start.split(':');
                if (+bh !== h) return;

                const ev   = document.createElement('div');
                ev.className = 'absolute left-2 right-2 rounded-lg p-2 cursor-pointer text-xs text-white overflow-hidden';
                const sc   = STATUS_COLORS[b.status] || STATUS_COLORS.pending;
                const dpx  = durationPx(b.time_start, b.time_end);
                const totalPrice = parseNumber(b.price_per_head) * parseNumber(b.pax_size);

                ev.style.cssText = [
                    'background:' + sc.bg,
                    'color:' + sc.color,
                    'top:4px',
                    'height:' + (dpx - 8) + 'px',
                ].join(';');

                ev.innerHTML =
                    '<div class="font-semibold truncate">' + escHtml(b.package_name) + '</div>' +
                    '<div class="text-xs opacity-80 mt-1 truncate">' +
                        formatTime(b.time_start) + ' – ' + formatTime(b.time_end) +
                    '</div>' +
                    '<div class="text-xs opacity-80 truncate">' +
                        b.pax_size + ' pax · ' + formatCurrency(totalPrice) +
                    '</div>';

                ev.addEventListener('click', () => fetchBooking(b.booking_id));
                content.appendChild(ev);
            });

            row.appendChild(label);
            row.appendChild(content);
            inner.appendChild(row);
        }

        // Scroll to 8AM
        document.getElementById('bkTimeline').scrollTop = 0;
    }

    /* ─────────────── RENDER MINI CALENDAR ─────────────── */
    function renderMiniCal() {
        document.getElementById('miniMonthLabel').textContent =
            MONTHS[miniMonth.getMonth()] + ' ' + miniMonth.getFullYear();

        const grid = document.getElementById('miniGrid');
        grid.innerHTML = '';

        ['S','M','T','W','T','R','S'].forEach(d => {
            const el = document.createElement('div');
            el.className = 'text-sm font-semibold text-gray-500 py-1';
            el.textContent = d;
            grid.appendChild(el);
        });

        const firstDay  = new Date(miniMonth.getFullYear(), miniMonth.getMonth(), 1);
        const lastDay   = new Date(miniMonth.getFullYear(), miniMonth.getMonth() + 1, 0);
        const startDow  = firstDay.getDay();
        const withBk    = getDatesWithBookings();

        for (let i = 0; i < startDow; i++) {
            const prev = new Date(firstDay);
            prev.setDate(prev.getDate() - (startDow - i));
            addMiniDay(grid, prev, true, withBk);
        }
        for (let d = 1; d <= lastDay.getDate(); d++) {
            addMiniDay(grid, new Date(miniMonth.getFullYear(), miniMonth.getMonth(), d), false, withBk);
        }
        const remaining = (7 - ((startDow + lastDay.getDate()) % 7)) % 7;
        for (let i = 1; i <= remaining; i++) {
            const next = new Date(lastDay);
            next.setDate(next.getDate() + i);
            addMiniDay(grid, next, true, withBk);
        }
    }

    function addMiniDay(grid, d, other, withBk) {
        const el = document.createElement('div');
        let className = 'h-12 flex items-center justify-center rounded text-sm cursor-pointer relative transition ';
        if (other) className += 'text-gray-400';
        else className += 'text-gray-700 hover:bg-gray-200';

        el.className = className;
        el.textContent = d.getDate();

        if (withBk[dateKey(d)] && !other) {
            const dot = document.createElement('span');
            dot.className = 'absolute bottom-0.5 w-1 h-1 rounded-full';
            dot.style.background = '#5046e4';
            el.appendChild(dot);
        }

        if (isSameDay(d, today) && !other) el.classList.add('font-bold', 'bg-gray-500');
        if (isSameDay(d, selectedDate)) {
            el.classList.add('bg-blue-600', 'text-white', 'font-bold');
        }

        const captured = new Date(d);
        el.addEventListener('click', () => {
            selectedDate = captured;
            miniMonth    = new Date(captured.getFullYear(), captured.getMonth(), 1);
            renderAll();
        });
        grid.appendChild(el);
    }

    /* ─────────────── RENDER UPCOMING ─────────────── */
    function renderUpcoming() {
        const list = document.getElementById('upcomingList');
        list.innerHTML = '';

        const upcoming = allBookings
            .filter(b => {
                const bd = parseDateKey(b.slot_date);
                return bd > selectedDate && !isSameDay(bd, selectedDate);
            })
            .sort((a, b) => a.slot_date.localeCompare(b.slot_date) || a.time_start.localeCompare(b.time_start))
            .slice(0, 5);

        if (!upcoming.length) {
            const el = document.createElement('div');
            el.className = 'text-xs text-gray-500 text-center py-3';
            el.textContent = 'No upcoming bookings';
            list.appendChild(el);
            return;
        }

        upcoming.forEach(b => {
            const sc   = STATUS_COLORS[b.status] || STATUS_COLORS.pending;
            const item = document.createElement('div');
            item.className = 'p-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 cursor-pointer transition text-xs';
            item.innerHTML =
                '<div class="font-semibold text-gray-900 flex items-center gap-2 truncate">' +
                    '<span class="inline-block w-2 h-2 rounded-full" style="background:' + sc.dot + '"></span>' +
                    '<span class="truncate">' + escHtml(b.package_name) + '</span>' +
                '</div>' +
                '<div class="text-gray-500 text-xs mt-1">' + b.slot_date + ' · ' + formatTime(b.time_start) + '</div>';
            item.addEventListener('click', () => {
                selectedDate = parseDateKey(b.slot_date);
                miniMonth    = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
                renderAll();
            });
            list.appendChild(item);
        });
    }

    /* ─────────────── FETCH BOOKINGS ─────────────── */
    function fetchAllBookings() {
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
                    renderAll();
                }
            },
            error: function() {
                console.error('Failed to load bookings');
            }
        });
    }

    /* ─────────────── BOOKING MODAL ─────────────── */
    const statusClassMap = {
        'pending':   'bg-yellow-100 text-yellow-700',
        'confirmed': 'bg-blue-100 text-blue-700',
        'completed': 'bg-green-100 text-green-700',
        'cancelled': 'bg-red-100 text-red-700',
        'rejected':  'bg-red-100 text-red-700',
    };

    let _activeBookingId = null;

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
            $('#booking-modal-footer').addClass('hidden');
        }
    }

    function doBookingAction(route, payload) {
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
                    fetchAllBookings();
                } else {
                    alert(response.message || 'Action failed. Please try again.');
                    $btns.prop('disabled', false);
                }
            },
            error: function() {
                alert('Request failed');
                $btns.prop('disabled', false);
            }
        });
    }

    function populateModal(booking) {
        _activeBookingId = booking.booking_id;
        const statusKey = (booking.status || '').toLowerCase();
        const statusCls = statusClassMap[statusKey] || 'bg-gray-100 text-gray-500';
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
            error: function() {
                setModalError('Failed to load booking.');
            }
        });
    }

    /* ─────────────── RENDER ALL ─────────────── */
    function renderAll() {
        renderHeader();
        renderTimeline();
        renderMiniCal();
        renderUpcoming();
    }

    /* ─────────────── EVENT LISTENERS ─────────────── */
    document.getElementById('prevDay').addEventListener('click', () => {
        selectedDate = new Date(selectedDate);
        selectedDate.setDate(selectedDate.getDate() - 1);
        miniMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
        renderAll();
    });

    document.getElementById('nextDay').addEventListener('click', () => {
        selectedDate = new Date(selectedDate);
        selectedDate.setDate(selectedDate.getDate() + 1);
        miniMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
        renderAll();
    });

    document.getElementById('todayBtn').addEventListener('click', () => {
        selectedDate = new Date(today);
        miniMonth    = new Date(today.getFullYear(), today.getMonth(), 1);
        renderAll();
    });

    document.getElementById('miniPrev').addEventListener('click', () => {
        miniMonth = new Date(miniMonth.getFullYear(), miniMonth.getMonth() - 1, 1);
        renderMiniCal();
    });

    document.getElementById('miniNext').addEventListener('click', () => {
        miniMonth = new Date(miniMonth.getFullYear(), miniMonth.getMonth() + 1, 1);
        renderMiniCal();
    });

    /* ─────────────── MODAL ACTIONS ─────────────── */
    $(document).on('click', '#bm-approve-btn', function() {
        if (!_activeBookingId) return;
        if (!confirm('Approve booking #' + _activeBookingId + '?')) return;
        doBookingAction('approve-booking', { booking_id: _activeBookingId });
    });

    $(document).on('click', '#bm-reject-btn', function() {
        if (!_activeBookingId) return;
        if (!confirm('Reject booking #' + _activeBookingId + '?')) return;
        doBookingAction('reject-booking', { booking_id: _activeBookingId });
    });

    $(document).on('click', '#bm-cancel-btn', function() {
        if (!_activeBookingId) return;
        if (!confirm('Cancel booking #' + _activeBookingId + '?')) return;
        doBookingAction('cancel-booking', { booking_id: _activeBookingId });
    });

    $(document).on('click', '#bm-resched-btn', function() {
        $('#bm-footer-confirmed').addClass('hidden');
        $('#bm-footer-resched').removeClass('hidden');
        $('#bm-resched-date').val('').focus();
        $('#bm-resched-slot').val('');
        $('#bm-resched-slot-loading, #bm-resched-slot-error').addClass('hidden');
    });

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
                    $('#bm-resched-slot-error').removeClass('hidden').text(response.message || 'No slots available.');
                    $('#bm-resched-slot').html('<option value="">No slots available</option>').prop('disabled', true);
                }
            },
            error: function() {
                $('#bm-resched-slot-loading').addClass('hidden');
                $('#bm-resched-slot-error').removeClass('hidden').text('Failed to load slots.');
                $('#bm-resched-slot').html('<option value="">Failed to load</option>').prop('disabled', true);
            }
        });
    });

    $(document).on('click', '#bm-resched-cancel-btn', function() {
        $('#bm-resched-date').val('');
        $('#bm-resched-slot').val('');
        $('#bm-resched-slot-loading, #bm-resched-slot-error').addClass('hidden');
        $('#bm-footer-resched').addClass('hidden');
        $('#bm-footer-confirmed').removeClass('hidden');
    });

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

    $(document).on('click', '#booking-modal-close', closeBookingModal);
    $(document).on('click', '#booking-modal-backdrop', closeBookingModal);
    $(document).on('keydown', function(e) {
        if (e.key === 'Escape') closeBookingModal();
    });

    /* ─────────────── VIEW MODE SWITCHER ─────────────── */
    const viewModeBtn = document.getElementById('viewModeBtn');
    const viewModeDropdown = document.getElementById('viewModeDropdown');
    const viewModeOptions = document.querySelectorAll('.view-mode-option');
    
    viewModeBtn.addEventListener('click', () => {
        viewModeDropdown.classList.toggle('hidden');
    });

    document.addEventListener('click', (e) => {
        if (!viewModeBtn.contains(e.target) && !viewModeDropdown.contains(e.target)) {
            viewModeDropdown.classList.add('hidden');
        }
    });

    viewModeOptions.forEach(option => {
        option.addEventListener('click', () => {
            const mode = option.dataset.mode;
            localStorage.setItem('bookingsViewMode', mode);
            window.location.href = `<?= base_url('/bookings') ?>?view=${mode}`;
        });
    });

    /* ─────────────── SLOTS MANAGER MODAL (UNIFIED) ─────────────── */
    let smSelectedDate = null;
    let smCalMonth = new Date();
    let smAllSlots = [];
    let smCurrentTab = 'view'; // 'view' or 'create'

    function openSlotsManagerModal(initialTab = 'view') {
        document.getElementById('slots-manager-modal').classList.remove('hidden');
        $('body').css('overflow', 'hidden');
        smCurrentTab = initialTab;
        smSelectedDate = new Date();
        smCalMonth = new Date(smSelectedDate.getFullYear(), smSelectedDate.getMonth(), 1);
        
        // Reset form
        document.getElementById('sm-time-start').value = '';
        document.getElementById('sm-time-end').value = '';
        document.getElementById('sm-is-available').checked = true;
        document.getElementById('sm-create-error').classList.add('hidden');
        document.getElementById('sm-create-success').classList.add('hidden');
        document.getElementById('sm-create-loading').classList.add('hidden');
        document.getElementById('sm-create-form').classList.remove('hidden');
        
        renderSlotsManagerCal();
        switchSlotsManagerTab(initialTab);
        
        if (initialTab === 'view') {
            fetchSlotsManagerForDate(dateKey(smSelectedDate));
        }
    }

    function closeSlotsManagerModal() {
        $('body').css('overflow', '');
        document.getElementById('slots-manager-modal').classList.add('hidden');
        smSelectedDate = null;
        smAllSlots = [];
    }

    function switchSlotsManagerTab(tab) {
        smCurrentTab = tab;
        
        // Update button styles
        document.querySelectorAll('.sm-tab-btn').forEach(btn => {
            btn.classList.remove('border-blue-600', 'text-blue-600');
            btn.classList.add('border-transparent', 'text-gray-700');
        });
        document.getElementById(`sm-tab-${tab}`).classList.remove('border-transparent', 'text-gray-700');
        document.getElementById(`sm-tab-${tab}`).classList.add('border-blue-600', 'text-blue-600');
        
        // Update content visibility
        document.querySelectorAll('.sm-tab-content').forEach(el => el.classList.add('hidden'));
        if (tab === 'view') {
            document.getElementById('sm-view-content').classList.remove('hidden');
            document.getElementById('sm-footer').style.display = 'none';
            fetchSlotsManagerForDate(dateKey(smSelectedDate));
        } else {
            document.getElementById('sm-create-content').classList.remove('hidden');
            document.getElementById('sm-footer').style.display = 'flex';
        }
    }

    function renderSlotsManagerCal() {
        document.getElementById('sm-cal-month').textContent = MONTHS[smCalMonth.getMonth()] + ' ' + smCalMonth.getFullYear();
        const grid = document.getElementById('sm-mini-grid');
        grid.innerHTML = '';

        ['S','M','T','W','T','R','S'].forEach(d => {
            const el = document.createElement('div');
            el.className = 'text-sm font-semibold text-gray-500 py-1';
            el.textContent = d;
            grid.appendChild(el);
        });

        const firstDay = new Date(smCalMonth.getFullYear(), smCalMonth.getMonth(), 1);
        const lastDay = new Date(smCalMonth.getFullYear(), smCalMonth.getMonth() + 1, 0);
        const startDow = firstDay.getDay();

        for (let i = 0; i < startDow; i++) {
            const prev = new Date(firstDay);
            prev.setDate(prev.getDate() - (startDow - i));
            addSlotsManagerDay(grid, prev, true);
        }
        for (let d = 1; d <= lastDay.getDate(); d++) {
            addSlotsManagerDay(grid, new Date(smCalMonth.getFullYear(), smCalMonth.getMonth(), d), false);
        }
        const remaining = (7 - ((startDow + lastDay.getDate()) % 7)) % 7;
        for (let i = 1; i <= remaining; i++) {
            const next = new Date(lastDay);
            next.setDate(next.getDate() + i);
            addSlotsManagerDay(grid, next, true);
        }
    }

    function addSlotsManagerDay(grid, d, other) {
        const el = document.createElement('div');
        let className = 'h-12 flex items-center justify-center rounded text-sm cursor-pointer relative transition ';
        if (other) className += 'text-gray-400';
        else className += 'text-gray-700 hover:bg-gray-200';

        el.className = className;
        el.textContent = d.getDate();

        if (isSameDay(d, today) && !other) el.classList.add('font-bold', 'ring-1', 'ring-gray-400');
        if (smSelectedDate && isSameDay(d, smSelectedDate)) {
            el.classList.add('bg-blue-600', 'text-white', 'font-bold');
        }

        const captured = new Date(d);
        el.addEventListener('click', () => {
            smSelectedDate = captured;
            const dateStr = dateKey(captured);
            document.getElementById('sm-selected-date-display').textContent = formatDate(dateStr);
            renderSlotsManagerCal();
            
            if (smCurrentTab === 'view') {
                fetchSlotsManagerForDate(dateStr);
            }
        });
        grid.appendChild(el);
    }

    function fetchSlotsManagerForDate(slotDate) {
        const branchId = <?= session('assigned_at') ?? 0 ?>;
        document.getElementById('sm-view-loading').classList.remove('hidden');
        document.getElementById('sm-view-error').classList.add('hidden');
        document.getElementById('sm-view-empty').classList.add('hidden');
        document.getElementById('sm-view-list').classList.add('hidden');

        $.ajax({
            url: '<?= base_url('/booking/slots') ?>',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                branch_id: branchId,
                slot_date: slotDate
            }),
            success: function(response) {
                document.getElementById('sm-view-loading').classList.add('hidden');
                if (response.status === 'success' && response.data && Array.isArray(response.data)) {
                    smAllSlots = response.data;
                    if (smAllSlots.length === 0) {
                        document.getElementById('sm-view-empty').classList.remove('hidden');
                    } else {
                        renderSlotsManagerTable();
                    }
                } else {
                    document.getElementById('sm-view-error').classList.remove('hidden').textContent = response.message || 'Failed to load slots.';
                }
            },
            error: function() {
                document.getElementById('sm-view-loading').classList.add('hidden');
                document.getElementById('sm-view-error').classList.remove('hidden').textContent = 'Failed to load slots.';
            }
        });
    }

    function renderSlotsManagerTable() {
        const content = document.getElementById('sm-slots-content');
        content.innerHTML = '';

        smAllSlots.forEach(slot => {
            const item = document.createElement('div');
            item.className = 'flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition';
            
            const timeStr = formatTime(slot.time_start) + ' – ' + formatTime(slot.time_end);
            const statusBadge = slot.is_available === 1 || slot.is_available === '1' ? 
                '<span class="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">Available</span>' :
                '<span class="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">Unavailable</span>';
            
            const slotId = slot.slot_id || slot.id;
            item.innerHTML = 
                '<div class="flex-1">' +
                    '<p class="text-sm font-medium text-gray-900">' + escHtml(timeStr) + '</p>' +
                    '<p class="text-xs text-gray-500 mt-1">' + statusBadge + '</p>' +
                '</div>' +
                '<div class="flex items-center gap-2">' +
                    '<button type="button" class="sm-toggle-btn rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition" data-slot-id="' + slotId + '" data-is-available="' + (slot.is_available === 1 || slot.is_available === '1' ? 1 : 0) + '">' +
                        (slot.is_available === 1 || slot.is_available === '1' ? 'Make Unavailable' : 'Make Available') +
                    '</button>' +
                    '<button type="button" class="sm-delete-btn rounded-lg border border-red-300 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 transition" data-slot-id="' + slotId + '">Delete</button>' +
                '</div>';
            
            content.appendChild(item);
        });

        document.getElementById('sm-view-list').classList.remove('hidden');
    }

    function deleteSlotsManagerSlot(slotId) {
        if (!confirm('Delete this slot?')) return;

        $.ajax({
            url: '<?= base_url('/booking/delete-slot') ?>',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ slot_id: slotId }),
            success: function(response) {
                if (response.status === 'success') {
                    if (smSelectedDate) {
                        fetchSlotsManagerForDate(dateKey(smSelectedDate));
                    }
                } else {
                    alert(response.message || 'Failed to delete slot.');
                }
            },
            error: function(xhr) {
                let errorMsg = 'Failed to delete slot.';
                if (xhr.responseJSON && xhr.responseJSON.message) {
                    errorMsg = xhr.responseJSON.message;
                }
                alert(errorMsg);
            }
        });
    }

    function toggleSlotsManagerAvailability(slotId, currentAvailability) {
        const newAvailability = currentAvailability === 1 ? 0 : 1;

        $.ajax({
            url: '<?= base_url('/booking/update-slot-availability') ?>',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ 
                slot_id: slotId,
                is_available: newAvailability
            }),
            success: function(response) {
                if (response.status === 'success') {
                    if (smSelectedDate) {
                        fetchSlotsManagerForDate(dateKey(smSelectedDate));
                    }
                } else {
                    alert(response.message || 'Failed to update slot.');
                }
            },
            error: function(xhr) {
                let errorMsg = 'Failed to update slot.';
                if (xhr.responseJSON && xhr.responseJSON.message) {
                    errorMsg = xhr.responseJSON.message;
                }
                alert(errorMsg);
            }
        });
    }

    function validateCreateSlot() {
        if (!smSelectedDate) {
            document.getElementById('sm-create-error').classList.remove('hidden');
            document.getElementById('sm-create-error').textContent = 'Please select a slot date.';
            return false;
        }
        const timeStart = document.getElementById('sm-time-start').value;
        const timeEnd = document.getElementById('sm-time-end').value;

        if (!timeStart) {
            document.getElementById('sm-create-error').classList.remove('hidden');
            document.getElementById('sm-create-error').textContent = 'Please select a start time.';
            return false;
        }
        if (!timeEnd) {
            document.getElementById('sm-create-error').classList.remove('hidden');
            document.getElementById('sm-create-error').textContent = 'Please select an end time.';
            return false;
        }
        if (timeStart >= timeEnd) {
            document.getElementById('sm-create-error').classList.remove('hidden');
            document.getElementById('sm-create-error').textContent = 'Start time must be before end time.';
            return false;
        }
        return true;
    }

    function submitCreateSlot() {
        document.getElementById('sm-create-error').classList.add('hidden');
        if (!validateCreateSlot()) return;

        const slotDate = dateKey(smSelectedDate);
        const timeStart = document.getElementById('sm-time-start').value;
        const timeEnd = document.getElementById('sm-time-end').value;
        const isAvailable = document.getElementById('sm-is-available').checked ? 1 : 0;
        const branchId = <?= session('assigned_at') ?? 0 ?>;

        document.getElementById('sm-create-form').classList.add('hidden');
        document.getElementById('sm-create-loading').classList.remove('hidden');

        $.ajax({
            url: '<?= base_url('/booking/create-slot') ?>',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                branch_id: branchId,
                slot_date: slotDate,
                time_start: timeStart,
                time_end: timeEnd,
                is_available: isAvailable
            }),
            success: function(response) {
                document.getElementById('sm-create-loading').classList.add('hidden');
                if (response.status === 'success') {
                    document.getElementById('sm-create-success').classList.remove('hidden');
                    setTimeout(() => {
                        closeSlotsManagerModal();
                        fetchAllBookings();
                    }, 1500);
                } else {
                    document.getElementById('sm-create-error').classList.remove('hidden');
                    document.getElementById('sm-create-error').textContent = response.message || 'Failed to create slot.';
                    document.getElementById('sm-create-form').classList.remove('hidden');
                }
            },
            error: function(xhr) {
                document.getElementById('sm-create-loading').classList.add('hidden');
                let errorMsg = 'Failed to create slot.';
                if (xhr.responseJSON && xhr.responseJSON.message) {
                    errorMsg = xhr.responseJSON.message;
                }
                document.getElementById('sm-create-error').classList.remove('hidden');
                document.getElementById('sm-create-error').textContent = errorMsg;
                document.getElementById('sm-create-form').classList.remove('hidden');
            }
        });
    }

    // Event listeners
    document.getElementById('createSlotBtn').addEventListener('click', () => openSlotsManagerModal('create'));
    document.getElementById('viewSlotsBtn').addEventListener('click', () => openSlotsManagerModal('view'));
    document.getElementById('sm-cancel-btn').addEventListener('click', closeSlotsManagerModal);
    document.getElementById('sm-submit-btn').addEventListener('click', submitCreateSlot);
    document.getElementById('slots-manager-close').addEventListener('click', closeSlotsManagerModal);
    document.getElementById('slots-manager-backdrop').addEventListener('click', closeSlotsManagerModal);
    
    // Tab navigation
    document.getElementById('sm-tab-view').addEventListener('click', () => switchSlotsManagerTab('view'));
    document.getElementById('sm-tab-create').addEventListener('click', () => switchSlotsManagerTab('create'));
    
    // Calendar navigation
    document.getElementById('sm-cal-prev').addEventListener('click', () => {
        smCalMonth = new Date(smCalMonth.getFullYear(), smCalMonth.getMonth() - 1, 1);
        renderSlotsManagerCal();
    });
    document.getElementById('sm-cal-next').addEventListener('click', () => {
        smCalMonth = new Date(smCalMonth.getFullYear(), smCalMonth.getMonth() + 1, 1);
        renderSlotsManagerCal();
    });

    $(document).on('keydown', function(e) {
        if (e.key === 'Escape') {
            closeBookingModal();
            closeSlotsManagerModal();
        }
    });

    $(document).on('click', '.sm-delete-btn', function() {
        const slotId = $(this).data('slot-id');
        deleteSlotsManagerSlot(slotId);
    });

    $(document).on('click', '.sm-toggle-btn', function() {
        const slotId = $(this).data('slot-id');
        const currentAvailability = $(this).data('is-available');
        toggleSlotsManagerAvailability(slotId, currentAvailability);
    });

    // Initialize
    fetchAllBookings();
});
</script>
