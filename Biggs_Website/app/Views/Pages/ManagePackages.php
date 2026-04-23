<main class="w-full min-h-screen bg-gray-100 text-gray-900">
    <div class="mx-auto max-w-full px-4 py-4 sm:px-6 lg:px-8">

        <!-- Header -->
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div class="flex items-center gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-5 w-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                    </svg>
                </div>
                <div>
                    <h1 class="text-2xl font-semibold tracking-tight text-gray-900">Packages</h1>
                </div>
            </div>
            <div class="flex flex-wrap items-center gap-2">
                <button type="button" id="add-package-btn" class="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">Add Package</button>
            </div>
        </div>

        <!-- Packages Table Area -->
        <div id="packages-container" class="mt-5 space-y-5">
            <div class="flex items-center justify-center py-12 text-gray-400 text-sm">Loading packages…</div>
        </div>
    </div>

    <!-- Add Package Modal -->
    <div id="package-modal" class="fixed inset-0 z-[10000] hidden">
        <!-- Backdrop -->
        <div id="package-modal-backdrop" class="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"></div>

        <!-- Panel -->
        <div class="relative flex min-h-full items-center justify-center p-4">
            <div id="package-modal-panel" class="relative w-full max-w-md rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200 flex flex-col max-h-[90vh]">

                <!-- Header -->
                <div class="flex items-start justify-between px-6 pt-6 pb-4 border-b border-gray-100">
                    <div>
                        <h2 id="package-modal-title" class="text-lg font-semibold text-gray-900">Add Package</h2>
                    </div>
                    <button id="package-modal-close" type="button" class="ml-4 flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <!-- Scrollable Body -->
                <div class="overflow-y-auto flex-1 px-6 py-5">

                    <!-- Error State -->
                    <div id="package-modal-error" class="hidden mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-500"></div>

                    <!-- Form -->
                    <div class="space-y-4">
                        <div>
                            <label class="block text-xs font-medium text-gray-500 mb-1">Package Name <span class="text-red-400">*</span></label>
                            <input type="text" id="pkg-name"
                                class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
                                placeholder="e.g. Standard Package" />
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-gray-500 mb-1">Details</label>
                            <textarea id="pkg-details" rows="3"
                                class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 resize-none"
                                placeholder="Package inclusions, description, etc."></textarea>
                        </div>
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block text-xs font-medium text-gray-500 mb-1">Pax Size <span class="text-red-400">*</span></label>
                                <input type="number" id="pkg-pax" min="1"
                                    class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
                                    placeholder="e.g. 10" />
                            </div>
                            <div>
                                <label class="block text-xs font-medium text-gray-500 mb-1">Price (₱) <span class="text-red-400">*</span></label>
                                <input type="number" id="pkg-price" min="0" step="0.01"
                                    class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
                                    placeholder="e.g. 5000.00" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="border-t border-gray-100 px-6 py-4 flex items-center justify-end gap-3">
                    <button type="button" id="package-modal-cancel"
                        class="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
                        Cancel
                    </button>
                    <button type="button" id="package-modal-submit"
                        class="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition disabled:opacity-50">
                        Save Package
                    </button>
                </div>

            </div>
        </div>
    </div>
</main>

<script>
    $(function () {

        /* ─────────────── HELPERS ─────────────── */

        function escHtml(str) {
            return $('<span>').text(str ?? '').html();
        }

        function formatCurrency(amount) {
            return '₱' + parseFloat(amount).toLocaleString('en-PH', { minimumFractionDigits: 2 });
        }

        const viewState = {
            search: '',
            sort: 'name_asc',
        };

        let allPackages = [];

        function getActiveFilterCount() {
            let count = 0;
            if (viewState.search.trim() !== '') count += 1;
            if (viewState.sort !== 'name_asc') count += 1;
            return count;
        }

        function getFilteredPackages() {
            const keyword = viewState.search.trim().toLowerCase();

            const filtered = allPackages.filter(function (pkg) {
                const blob = [pkg.package_name, pkg.details, pkg.pax_size, pkg.price].join(' ').toLowerCase();
                return keyword === '' || blob.includes(keyword);
            });

            filtered.sort(function (a, b) {
                if (viewState.sort === 'name_asc') return (a.package_name || '').localeCompare(b.package_name || '');
                if (viewState.sort === 'name_desc') return (b.package_name || '').localeCompare(a.package_name || '');
                if (viewState.sort === 'price_asc') return parseFloat(a.price) - parseFloat(b.price);
                if (viewState.sort === 'price_desc') return parseFloat(b.price) - parseFloat(a.price);
                if (viewState.sort === 'pax_asc') return parseInt(a.pax_size) - parseInt(b.pax_size);
                if (viewState.sort === 'pax_desc') return parseInt(b.pax_size) - parseInt(a.pax_size);
                return 0;
            });

            return filtered;
        }

        /* ─────────────── RENDER TABLE ROW ─────────────── */

        function buildTableRow(pkg, index) {
            const bgClass = index % 2 === 1 ? 'bg-gray-50' : 'bg-white';

            return $(`
                <tr class="text-sm text-gray-700 ${bgClass} hover:bg-slate-50/80 transition-colors">
                    <td class="px-5 py-4 font-medium text-gray-800">
                        <div class="flex items-center gap-3">
                            <span class="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 text-xs font-bold">#${escHtml(pkg.package_id)}</span>
                            <span>${escHtml(pkg.package_name)}</span>
                        </div>
                    </td>
                    <td class="px-5 py-4 text-gray-500 max-w-xs">
                        <span class="line-clamp-2">${escHtml(pkg.details || '—')}</span>
                    </td>
                    <td class="px-5 py-4 text-gray-700 font-medium">
                        ${escHtml(pkg.pax_size)} pax
                    </td>
                    <td class="px-5 py-4 font-semibold text-gray-800">
                        ${escHtml(formatCurrency(pkg.price))}
                    </td>
                    <td class="px-5 py-4 text-right">
                        <button type="button" class="delete-pkg-btn inline-flex items-center gap-2 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-100" data-id="${escHtml(pkg.package_id)}" data-name="${escHtml(pkg.package_name)}">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                            Delete
                        </button>
                    </td>
                </tr>
            `);
        }

        /* ─────────────── RENDER TABLE ─────────────── */

        function renderPackages() {
            const $container = $('#packages-container').empty();
            const filtered = getFilteredPackages();
            const activeFilters = getActiveFilterCount();

            if (!allPackages || allPackages.length === 0) {
                $container.html('<div class="flex items-center justify-center py-12 text-gray-400 text-sm">No packages found. Add your first package.</div>');
                return;
            }

            const $section = $(`
                <section class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm min-h-[300px]">
                    <div class="border-b border-gray-200 bg-slate-50/70 px-5 py-4">
                        <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <h2 class="text-base font-semibold text-gray-900">All Packages</h2>
                                <p class="text-xs text-gray-500">${filtered.length} of ${allPackages.length} record${allPackages.length !== 1 ? 's' : ''}</p>
                            </div>
                            <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                                <div class="relative">
                                    <input id="package-search" type="text" value="${escHtml(viewState.search)}" placeholder="Search package name or details" class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 pr-9 text-sm text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 sm:w-64" />
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-slate-400">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-4.35-4.35m1.85-5.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
                                    </svg>
                                </div>
                                <select id="package-sort" class="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100">
                                    <option value="name_asc" ${viewState.sort === 'name_asc' ? 'selected' : ''}>Name A–Z</option>
                                    <option value="name_desc" ${viewState.sort === 'name_desc' ? 'selected' : ''}>Name Z–A</option>
                                    <option value="price_asc" ${viewState.sort === 'price_asc' ? 'selected' : ''}>Lowest Price</option>
                                    <option value="price_desc" ${viewState.sort === 'price_desc' ? 'selected' : ''}>Highest Price</option>
                                    <option value="pax_asc" ${viewState.sort === 'pax_asc' ? 'selected' : ''}>Smallest Pax</option>
                                    <option value="pax_desc" ${viewState.sort === 'pax_desc' ? 'selected' : ''}>Largest Pax</option>
                                </select>
                                <button id="clear-package-filters" type="button" class="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50">
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
                                    <th class="px-5 py-3">Details</th>
                                    <th class="px-5 py-3">Pax Size</th>
                                    <th class="px-5 py-3">Price</th>
                                    <th class="px-5 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100 packages-tbody"></tbody>
                        </table>
                    </div>
                </section>
            `);

            const $tbody = $section.find('.packages-tbody');
            if (filtered.length === 0) {
                $tbody.append(`
                    <tr>
                        <td colspan="5" class="px-5 py-10 text-center text-sm text-slate-400">No packages match the current filters.</td>
                    </tr>
                `);
            } else {
                $.each(filtered, function (index, pkg) {
                    $tbody.append(buildTableRow(pkg, index));
                });
            }

            $container.append($section);
        }

        /* ─────────────── FETCH PACKAGES ─────────────── */

        function fetchAndRenderPackages() {
            $('#packages-container').html(
                '<div class="flex items-center justify-center py-12 text-gray-400 text-sm">Loading packages…</div>'
            );

            $.ajax({
                url: '<?= base_url('/packages') ?>',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    branch_id: <?= session('assigned_at') ?? 0 ?>
                }),
                success: function (response) {
                    if (response.status === 'success') {
                        allPackages = Array.isArray(response.data) ? response.data : [];
                        console.log('Fetched packages:', allPackages);
                        renderPackages();
                    } else {
                        $('#packages-container').html(
                            `<div class="py-12 text-center text-red-500 text-sm">${escHtml(response.message || 'Unexpected error.')}</div>`
                        );
                    }
                },
                error: function (xhr) {
                    $('#packages-container').html(
                        `<div class="py-12 text-center text-red-500 text-sm">Failed to load packages. ${escHtml(xhr.statusText || '')}</div>`
                    );
                },
            });
        }

        /* ─────────────── FILTER EVENTS ─────────────── */

        $(document).on('input', '#package-search', function () {
            viewState.search = $(this).val();
            renderPackages();
        });

        $(document).on('change', '#package-sort', function () {
            viewState.sort = $(this).val();
            renderPackages();
        });

        $(document).on('click', '#clear-package-filters', function () {
            viewState.search = '';
            viewState.sort = 'name_asc';
            renderPackages();
        });

        /* ─────────────── ADD PACKAGE MODAL ─────────────── */

        function openPackageModal() {
            $('#package-modal-error').addClass('hidden').text('');
            $('#pkg-name').val('');
            $('#pkg-details').val('');
            $('#pkg-pax').val('');
            $('#pkg-price').val('');
            $('#package-modal-submit').prop('disabled', false);
            $('#package-modal').removeClass('hidden');
            $('body').css('overflow', 'hidden');
            setTimeout(function () { $('#pkg-name').focus(); }, 100);
        }

        function closePackageModal() {
            $('#package-modal').addClass('hidden');
            $('body').css('overflow', '');
        }

        $(document).on('click', '#add-package-btn', openPackageModal);
        $(document).on('click', '#package-modal-close, #package-modal-cancel', closePackageModal);
        $(document).on('click', '#package-modal-backdrop', closePackageModal);
        $(document).on('keydown', function (e) {
            if (e.key === 'Escape') closePackageModal();
        });

        /* ─────────────── SUBMIT NEW PACKAGE ─────────────── */

        $(document).on('click', '#package-modal-submit', function () {
            const name  = $('#pkg-name').val().trim();
            const details = $('#pkg-details').val().trim();
            const pax   = $('#pkg-pax').val().trim();
            const price = $('#pkg-price').val().trim();

            $('#package-modal-error').addClass('hidden').text('');

            if (!name) {
                $('#package-modal-error').removeClass('hidden').text('Package name is required.');
                return;
            }
            if (!pax || isNaN(pax) || parseInt(pax) < 1) {
                $('#package-modal-error').removeClass('hidden').text('Please enter a valid pax size.');
                return;
            }
            if (!price || isNaN(price) || parseFloat(price) < 0) {
                $('#package-modal-error').removeClass('hidden').text('Please enter a valid price.');
                return;
            }

            const $btn = $('#package-modal-submit').prop('disabled', true).text('Saving…');

            console.log('Submitting new package:', { name, details, pax, price });
            $.ajax({
                url: '<?= base_url('/packages/add') ?>',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    branch_id:    <?= session('assigned_at') ?? 0 ?>,
                    package_name: name,
                    details:      details,
                    pax_size:     parseInt(pax),
                    price:        parseFloat(price),
                }),
                success: function (response) {
                    if (response.status === 'success') {
                        console.log(response.data);
                        closePackageModal();
                        fetchAndRenderPackages();
                    } else {
                        $('#package-modal-error').removeClass('hidden').text(response.message || 'Failed to save package.');
                        $btn.prop('disabled', false).text('Save Package');
                    }
                },
                error: function (xhr) {
                    $('#package-modal-error').removeClass('hidden').text('Request failed: ' + (xhr.statusText || 'Unknown error'));
                    $btn.prop('disabled', false).text('Save Package');
                }
            });
        });

        /* ─────────────── DELETE PACKAGE ─────────────── */

        $(document).on('click', '.delete-pkg-btn', function () {
            const pkgId   = $(this).data('id');
            const pkgName = $(this).data('name');

            if (!confirm('Delete package "' + pkgName + '"? This cannot be undone.')) return;

            const $btn = $(this).prop('disabled', true).text('Deleting…');

            $.ajax({
                url: '<?= base_url('/packages/delete') ?>',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ package_id: pkgId }),
                success: function (response) {
                    if (response.status === 'success') {
                        fetchAndRenderPackages();
                    } else {
                        alert(response.message || 'Failed to delete package.');
                        $btn.prop('disabled', false).text('Delete');
                    }
                },
                error: function (xhr) {
                    alert('Request failed: ' + (xhr.statusText || 'Unknown error'));
                    $btn.prop('disabled', false).text('Delete');
                }
            });
        });

        /* ─────────────── INIT ─────────────── */

        fetchAndRenderPackages();
    });
</script>