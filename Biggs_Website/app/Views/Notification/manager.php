<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Notification Manager</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            brand: { DEFAULT: '#6C63FF', light: '#EEF0FF', dark: '#4B43CC' },
          },
          fontFamily: {
            sans: ['Inter', 'system-ui', 'sans-serif'],
          }
        }
      }
    }
  </script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', system-ui, sans-serif; }
    select, input, textarea { outline: none; }
    select:focus, input:focus, textarea:focus { box-shadow: 0 0 0 2px #6C63FF44; }
    .badge-everyone { background: #EEF0FF; color: #4B43CC; }
    .badge-selected { background: #FFF4E5; color: #B45309; }
    .badge-broadcast { background: #E5F6FF; color: #0369A1; }
    .status-sent { background: #ECFDF5; color: #065F46; }
    .status-scheduled { background: #FFF7ED; color: #92400E; }
    .status-cancelled { background: #FFF1F2; color: #9F1239; }
    .status-draft { background: #F1F5F9; color: #475569; }

    /* Auto-refresh indicator */
    @keyframes spin { to { transform: rotate(360deg); } }
    .spinning { animation: spin 1s linear infinite; }

    /* Pulse dot for live indicator */
    @keyframes pulse-dot {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(0.8); }
    }
    .pulse-dot { animation: pulse-dot 2s ease-in-out infinite; }

    /* Row fade-in */
    @keyframes rowFadeIn {
      from { opacity: 0; transform: translateY(4px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .row-animate { animation: rowFadeIn 0.2s ease forwards; }

    /* Countdown ring */
    .countdown-ring {
      width: 18px; height: 18px;
      border-radius: 50%;
      border: 2px solid #E5E7EB;
      border-top-color: #6C63FF;
      display: inline-block;
    }
    .countdown-ring.spinning { animation: spin 1s linear infinite; }
  </style>
</head>
<body class="bg-gray-50 min-h-screen p-6">

  <div class="max-w-5xl mx-auto space-y-5">

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-semibold text-gray-900">Manage Custom Notifications</h1>
        <p class="text-sm text-gray-400 mt-0.5">Manage and send push notifications</p>
      </div>
      <!-- Auto-refresh controls -->
      <div class="flex items-center gap-3">
        <!-- Live indicator -->
        <div class="flex items-center gap-1.5 text-xs text-gray-400">
          <span id="live_dot" class="w-2 h-2 rounded-full bg-emerald-400 pulse-dot inline-block"></span>
          <span id="refresh_status">Auto-refreshing</span>
        </div>
        <!-- Countdown -->
        <span id="countdown_badge" class="text-xs font-medium bg-brand/10 text-brand px-2.5 py-1 rounded-lg tabular-nums">30s</span>
        <!-- Manual refresh button -->
        <button id="btn_list" title="Refresh now"
          class="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition">
          <svg id="refresh_icon" class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
        <!-- Toggle auto-refresh -->
        <button id="btn_toggle_auto"
          class="rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition">
          Pause
        </button>
      </div>
    </div>

    <!-- Notification List Table -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <!-- Table toolbar -->
      <div class="flex items-center justify-between px-5 py-3 border-b border-gray-50">
        <span class="text-xs font-medium text-gray-400">Recent Notifications</span>
        <span id="row_count" class="text-xs text-gray-300">—</span>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-100">
              <th class="text-left text-xs font-medium text-gray-400 px-5 py-3">#</th>
              <th class="text-left text-xs font-medium text-gray-400 px-4 py-3">Date &amp; Time</th>
              <th class="text-left text-xs font-medium text-gray-400 px-4 py-3">Content</th>
              <th class="text-left text-xs font-medium text-gray-400 px-4 py-3">Target</th>
              <th class="text-left text-xs font-medium text-gray-400 px-4 py-3">Status</th>
              <th class="text-right text-xs font-medium text-gray-400 px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody id="notifications_table_body">
            <tr id="loading_row">
              <td colspan="6" class="text-center text-gray-400 py-10 text-sm">
                <div class="flex items-center justify-center gap-2">
                  <svg class="w-4 h-4 spinning text-brand" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Loading notifications…
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Two-panel section -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">

      <!-- Left: Create Draft -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <div>
          <h2 class="text-base font-semibold text-gray-900">Create Draft Notification</h2>
          <p class="text-xs text-gray-400 mt-0.5">Save a notification without sending</p>
        </div>

        <div class="space-y-3">
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1">Title</label>
            <input id="title" type="text" placeholder="e.g. Promo update"
              class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 transition" />
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1">Notification Content</label>
            <textarea id="body" rows="3" placeholder="Write your message here…"
              class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 resize-none transition"></textarea>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1">Target Type</label>
            <select id="target_type"
              class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 transition">
              <option value="broadcast">Everyone</option>
              <option value="selected">Selected users</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1">Scheduled At <span class="text-gray-300">(optional)</span></label>
            <input id="scheduled_at" type="text" placeholder="2026-04-10 18:30:00"
              class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 transition" />
          </div>
        </div>

        <div class="flex gap-2 pt-1">
          <button id="btn_create"
            class="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
            Save Draft
          </button>
          <button id="btn_preview_draft"
            class="flex-1 rounded-xl bg-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-dark transition">
            Preview &amp; Review
          </button>
        </div>
      </div>

      <!-- Right: Create & Send -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <div>
          <h2 class="text-base font-semibold text-gray-900">Send Notification</h2>
          <p class="text-xs text-gray-400 mt-0.5">Create and send a push notification now</p>
        </div>

        <div class="space-y-3">
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1">Notification Target</label>
            <select id="send_target_type"
              class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 transition">
              <option value="broadcast">Everyone</option>
              <option value="selected">Selected users</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1">Target Users <span class="text-gray-300">(comma-separated, if selected)</span></label>
            <input id="target_users" type="text" placeholder="04A6AD40C22A81, ABCDEF123456"
              class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 transition" />
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1">Set Date &amp; Time <span class="text-gray-300">(optional)</span></label>
            <input id="send_scheduled_at" type="text" placeholder="Leave blank to send now"
              class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 transition" />
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1">Notification Content</label>
            <textarea id="send_body" rows="3" placeholder="Write your message here…"
              class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 resize-none transition"></textarea>
          </div>
        </div>

        <div class="flex gap-2 pt-1">
          <button id="btn_send_preview"
            class="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
            Preview
          </button>
          <button id="btn_send_direct"
            class="flex-1 rounded-xl bg-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-dark transition">
            Send Notification
          </button>
        </div>
      </div>
    </div>

    <!-- Manage by ID row -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 class="text-base font-semibold text-gray-900 mb-4">Manage Existing Notification</h2>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1">Notification ID</label>
          <input id="edit_id" type="number" placeholder="e.g. 1"
            class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 transition" />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1">New Title <span class="text-gray-300">(optional)</span></label>
          <input id="edit_title" type="text" placeholder="Updated title"
            class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 transition" />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1">New Body <span class="text-gray-300">(optional)</span></label>
          <input id="edit_body" type="text" placeholder="Updated body"
            class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 transition" />
        </div>
      </div>
      <div class="flex flex-wrap gap-2 mt-4">
        <button id="btn_show"
          class="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
          View
        </button>
        <button id="btn_update"
          class="rounded-xl bg-brand/10 border border-brand/20 px-4 py-2 text-sm font-medium text-brand hover:bg-brand/20 transition">
          Update
        </button>
        <button id="btn_delete"
          class="rounded-xl bg-red-50 border border-red-100 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 transition">
          Delete
        </button>
        <button id="btn_send_existing"
          class="rounded-xl bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark transition">
          Send Existing
        </button>
      </div>
    </div>

    <!-- API Response -->
    <div id="response_card" class="hidden bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-base font-semibold text-gray-900">API Response</h2>
        <span id="status_badge" class="text-xs font-medium px-2.5 py-1 rounded-lg bg-gray-100 text-gray-500">—</span>
      </div>
      <pre id="output" class="bg-gray-950 text-green-300 rounded-xl p-4 text-xs overflow-auto max-h-60 leading-relaxed">{}</pre>
    </div>

  </div>

  <!-- Preview Modal -->
  <div id="preview_modal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 hidden p-4">
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4">
      <div class="flex items-start gap-3">
        <div class="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-brand" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <p id="preview_title" class="font-semibold text-gray-900 text-sm">Notification Preview</p>
          <p id="preview_body" class="text-gray-500 text-sm mt-1 leading-relaxed">Your message will appear here.</p>
        </div>
      </div>
      <div class="border-t border-gray-100 pt-4 text-xs text-gray-400 space-y-1">
        <div class="flex justify-between"><span>Target</span><span id="preview_target" class="font-medium text-gray-600">—</span></div>
        <div class="flex justify-between"><span>Schedule</span><span id="preview_schedule" class="font-medium text-gray-600">Send now</span></div>
      </div>
      <div class="flex gap-2 pt-1">
        <button onclick="closePreview()" class="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
          Cancel
        </button>
        <button id="preview_confirm_btn" class="flex-1 rounded-xl bg-brand py-2.5 text-sm font-medium text-white hover:bg-brand-dark transition">
          Confirm &amp; Send
        </button>
      </div>
    </div>
  </div>

  <script>
    /* ============================================================
       HELPERS
    ============================================================ */
    function setOutput(ok, label, body, httpCode) {
      $('#response_card').removeClass('hidden');
      $('#status_badge')
        .text(`${label} · ${httpCode}`)
        .attr('class', `text-xs font-medium px-2.5 py-1 rounded-lg ${ok ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`);
      $('#output').text(JSON.stringify(body, null, 2));
    }

    function parseCsv(value) {
      return value.split(',').map(v => v.trim()).filter(Boolean);
    }

    function statusClass(status) {
      const s = (status || '').toLowerCase();
      if (s === 'sent')      return 'status-sent';
      if (s === 'scheduled') return 'status-scheduled';
      if (s === 'cancelled') return 'status-cancelled';
      return 'status-draft';
    }

    function targetClass(target) {
      return target === 'broadcast' ? 'badge-everyone' : 'badge-selected';
    }

    /* ============================================================
       CORE AJAX WRAPPER  (jQuery)
    ============================================================ */
    function api(method, url, payload) {
      return $.ajax({
        method,
        url,
        contentType: 'application/json',
        dataType: 'json',
        data: payload ? JSON.stringify(payload) : undefined
      }).then(
        data  => ({ ok: true,  code: 200, body: data }),
        xhr   => ({ ok: false, code: xhr.status, body: (xhr.responseJSON || { message: xhr.statusText || 'Request failed' }) })
      );
    }

    /* ============================================================
       RENDER TABLE
    ============================================================ */
    function renderTable(rows) {
      const $tbody = $('#notifications_table_body');

      if (!Array.isArray(rows) || rows.length === 0) {
        $tbody.html('<tr><td colspan="6" class="text-center text-gray-400 py-10 text-sm">No notifications found.</td></tr>');
        $('#row_count').text('0 records');
        return;
      }

      $('#row_count').text(`${rows.length} record${rows.length !== 1 ? 's' : ''}`);

      const html = rows.map((row, i) => `
        <tr class="border-t border-gray-50 hover:bg-gray-50 transition-colors row-animate" style="animation-delay:${i * 30}ms">
          <td class="px-5 py-3.5 text-sm text-gray-400 font-medium">${i + 1}</td>
          <td class="px-4 py-3.5 text-sm text-gray-500 whitespace-nowrap">${row.created_at ? row.created_at.slice(0, 16).replace('T', ' · ') : '—'}</td>
          <td class="px-4 py-3.5 text-sm text-gray-700 max-w-xs truncate">${row.title || ''}</td>
          <td class="px-4 py-3.5">
            <span class="text-xs font-medium px-2 py-1 rounded-lg ${targetClass(row.target_type)}">${row.target_type === 'broadcast' ? 'Everyone' : 'Selected'}</span>
          </td>
          <td class="px-4 py-3.5">
            <span class="text-xs font-medium px-2 py-1 rounded-lg ${statusClass(row.status)}">${row.status || 'Draft'}</span>
          </td>
          <td class="px-5 py-3.5 text-right">
            <button onclick="quickShow(${row.notification_id})" class="text-xs font-medium text-brand hover:text-brand-dark transition-colors">View</button>
            <span class="text-gray-200 mx-1">|</span>
            <button onclick="prefillDelete(${row.notification_id})" class="text-xs font-medium text-red-400 hover:text-red-600 transition-colors">Delete</button>
          </td>
        </tr>
      `).join('');

      $tbody.html(html);
    }

    /* ============================================================
       AUTO-REFRESH LOGIC
    ============================================================ */
    const AUTO_REFRESH_INTERVAL = 30; // seconds
    let countdown        = AUTO_REFRESH_INTERVAL;
    let autoRefreshTimer = null;
    let countdownTimer   = null;
    let isAutoRefresh    = true;
    let isLoading        = false;

    function setRefreshingState(loading) {
      isLoading = loading;
      if (loading) {
        $('#refresh_icon').addClass('spinning');
        $('#refresh_status').text('Fetching…');
        $('#live_dot').removeClass('pulse-dot').css('background', '#FCD34D'); // yellow while fetching
      } else {
        $('#refresh_icon').removeClass('spinning');
        $('#refresh_status').text(isAutoRefresh ? 'Auto-refreshing' : 'Paused');
        $('#live_dot').addClass('pulse-dot').css('background', isAutoRefresh ? '#34D399' : '#9CA3AF');
      }
    }

    function updateCountdownBadge() {
      $('#countdown_badge').text(isAutoRefresh ? `${countdown}s` : '—');
    }

    function startCountdown() {
      clearInterval(countdownTimer);
      countdown = AUTO_REFRESH_INTERVAL;
      updateCountdownBadge();
      countdownTimer = setInterval(() => {
        countdown--;
        updateCountdownBadge();
        if (countdown <= 0) countdown = AUTO_REFRESH_INTERVAL;
      }, 1000);
    }

    function startAutoRefresh() {
      clearInterval(autoRefreshTimer);
      autoRefreshTimer = setInterval(refreshList, AUTO_REFRESH_INTERVAL * 1000);
      startCountdown();
    }

    function stopAutoRefresh() {
      clearInterval(autoRefreshTimer);
      clearInterval(countdownTimer);
      autoRefreshTimer = null;
      countdownTimer   = null;
      $('#countdown_badge').text('—');
      $('#refresh_status').text('Paused');
      $('#live_dot').removeClass('pulse-dot').css('background', '#9CA3AF');
    }

    /* ============================================================
       REFRESH LIST  (jQuery AJAX)
    ============================================================ */
    function refreshList() {
      if (isLoading) return;
      setRefreshingState(true);

      // Reset countdown on manual/auto trigger
      if (isAutoRefresh) startCountdown();

      $.ajax({
        method: 'GET',
        url: '/admin/notifications',
        dataType: 'json'
      })
      .done(function(data, _status, xhr) {
        setOutput(true, 'List notifications', data, xhr.status || 200);
        const rows = data && data.data ? data.data : [];
        renderTable(rows);
      })
      .fail(function(xhr) {
        const body = xhr.responseJSON || { message: xhr.statusText || 'Request failed' };
        setOutput(false, 'List notifications', body, xhr.status);
        // Keep existing table rows on failure
        if ($('#notifications_table_body tr').length === 0 || $('#loading_row').length) {
          $('#notifications_table_body').html(
            '<tr><td colspan="6" class="text-center text-gray-400 py-10 text-sm">Failed to load. Will retry automatically.</td></tr>'
          );
        }
      })
      .always(function() {
        setRefreshingState(false);
      });
    }

    /* ============================================================
       QUICK SHOW  (jQuery AJAX)
    ============================================================ */
    function quickShow(id) {
      $.ajax({ method: 'GET', url: `/admin/notifications/${id}`, dataType: 'json' })
        .done(data  => setOutput(true,  `Notification #${id}`, data, 200))
        .fail(xhr   => setOutput(false, `Notification #${id}`, xhr.responseJSON || {}, xhr.status));
    }

    function prefillDelete(id) {
      $('#edit_id').val(id);
      $('html, body').animate({ scrollTop: $('#edit_id').offset().top - 200 }, 300);
    }

    /* ============================================================
       BUTTON BINDINGS  (jQuery)
    ============================================================ */

    // Manual refresh
    $('#btn_list').on('click', refreshList);

    // Toggle auto-refresh
    $('#btn_toggle_auto').on('click', function() {
      isAutoRefresh = !isAutoRefresh;
      $(this).text(isAutoRefresh ? 'Pause' : 'Resume');
      if (isAutoRefresh) {
        startAutoRefresh();
        $('#live_dot').addClass('pulse-dot').css('background', '#34D399');
        $('#refresh_status').text('Auto-refreshing');
      } else {
        stopAutoRefresh();
      }
    });

    // Save Draft
    $('#btn_create').on('click', function() {
      const payload = {
        title:        $('#title').val().trim(),
        body:         $('#body').val().trim(),
        type:         'general',
        target_type:  $('#target_type').val(),
        scheduled_at: $('#scheduled_at').val().trim() || null,
      };
      $.ajax({ method: 'POST', url: '/admin/notifications', contentType: 'application/json', dataType: 'json', data: JSON.stringify(payload) })
        .done(data  => { setOutput(true,  'Create draft', data, 200); refreshList(); })
        .fail(xhr   =>   setOutput(false, 'Create draft', xhr.responseJSON || {}, xhr.status));
    });

    // Preview Draft
    $('#btn_preview_draft').on('click', function() {
      $('#preview_title').text($('#title').val() || 'No title');
      $('#preview_body').text($('#body').val() || 'No content.');
      $('#preview_target').text($('#target_type').val() === 'broadcast' ? 'Everyone' : 'Selected users');
      $('#preview_schedule').text($('#scheduled_at').val() || 'Save as draft');
      $('#preview_confirm_btn').off('click').on('click', function() {
        closePreview();
        $('#btn_create').trigger('click');
      });
      $('#preview_modal').removeClass('hidden');
    });

    // Send Direct
    $('#btn_send_direct').on('click', function() {
      const targetType = $('#send_target_type').val();
      const payload = {
        title:        $('#title').val().trim() || $('#send_body').val().trim().slice(0, 40),
        body:         $('#send_body').val().trim(),
        type:         'general',
        target_type:  targetType,
        target_users: targetType === 'selected' ? parseCsv($('#target_users').val()) : [],
        scheduled_at: $('#send_scheduled_at').val().trim() || null,
      };
      $.ajax({ method: 'POST', url: '/admin/notifications/send', contentType: 'application/json', dataType: 'json', data: JSON.stringify(payload) })
        .done(data  => { setOutput(true,  'Create & send', data, 200); refreshList(); })
        .fail(xhr   =>   setOutput(false, 'Send failed',   xhr.responseJSON || {}, xhr.status));
    });

    // Preview Send
    $('#btn_send_preview').on('click', function() {
      const targetType = $('#send_target_type').val();
      $('#preview_title').text('Push Notification');
      $('#preview_body').text($('#send_body').val() || 'No content.');
      $('#preview_target').text(targetType === 'broadcast' ? 'Everyone' : 'Selected users');
      $('#preview_schedule').text($('#send_scheduled_at').val() || 'Send immediately');
      $('#preview_confirm_btn').off('click').on('click', function() {
        closePreview();
        $('#btn_send_direct').trigger('click');
      });
      $('#preview_modal').removeClass('hidden');
    });

    // Send Existing
    $('#btn_send_existing').on('click', function() {
      const id         = parseInt($('#edit_id').val()) || 0;
      const targetType = $('#send_target_type').val();
      const payload    = {
        target_type:  targetType,
        target_users: targetType === 'selected' ? parseCsv($('#target_users').val()) : [],
      };
      $.ajax({ method: 'POST', url: `/admin/notifications/${id}/send`, contentType: 'application/json', dataType: 'json', data: JSON.stringify(payload) })
        .done(data  => { setOutput(true,  `Send #${id}`, data, 200); refreshList(); })
        .fail(xhr   =>   setOutput(false, `Send #${id}`, xhr.responseJSON || {}, xhr.status));
    });

    // View single
    $('#btn_show').on('click', function() {
      const id = parseInt($('#edit_id').val()) || 0;
      $.ajax({ method: 'GET', url: `/admin/notifications/${id}`, dataType: 'json' })
        .done(data  => setOutput(true,  `Show #${id}`, data, 200))
        .fail(xhr   => setOutput(false, `Show #${id}`, xhr.responseJSON || {}, xhr.status));
    });

    // Update
    $('#btn_update').on('click', function() {
      const id = parseInt($('#edit_id').val()) || 0;
      const payload = {};
      const t = $('#edit_title').val().trim();
      const b = $('#edit_body').val().trim();
      if (t) payload.title = t;
      if (b) payload.body  = b;
      $.ajax({ method: 'PATCH', url: `/admin/notifications/${id}`, contentType: 'application/json', dataType: 'json', data: JSON.stringify(payload) })
        .done(data  => { setOutput(true,  `Update #${id}`, data, 200); refreshList(); })
        .fail(xhr   =>   setOutput(false, `Update #${id}`, xhr.responseJSON || {}, xhr.status));
    });

    // Delete
    $('#btn_delete').on('click', function() {
      const id = parseInt($('#edit_id').val()) || 0;
      if (!id) return;
      $.ajax({ method: 'DELETE', url: `/admin/notifications/${id}`, dataType: 'json' })
        .done(data  => { setOutput(true,  `Delete #${id}`, data, 200); refreshList(); })
        .fail(xhr   =>   setOutput(false, `Delete #${id}`, xhr.responseJSON || {}, xhr.status));
    });

    /* ============================================================
       MODAL
    ============================================================ */
    function closePreview() {
      $('#preview_modal').addClass('hidden');
    }

    $('#preview_modal').on('click', function(e) {
      if (e.target === this) closePreview();
    });

    /* ============================================================
       GLOBAL EXPORTS (for inline onclick attrs)
    ============================================================ */
    window.quickShow     = quickShow;
    window.prefillDelete = prefillDelete;
    window.refreshList   = refreshList;
    window.closePreview  = closePreview;

    /* ============================================================
       INIT — auto-fetch on page load, then start auto-refresh
    ============================================================ */
    $(function() {
      refreshList();        // immediate first fetch
      startAutoRefresh();   // then every 30s
    });
  </script>
</body>
</html>