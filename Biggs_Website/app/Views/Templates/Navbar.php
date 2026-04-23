<aside id="navbar" class="fixed inset-y-0 left-0 z-30 w-[290px] border-r border-slate-200 bg-white transition-all duration-300 ease-in-out md:translate-x-0 -translate-x-full md:w-[290px]">
    <div class="flex h-full flex-col">
        <!-- Header with Logo -->
        <div class="border-b border-slate-200 px-4 py-4 flex items-center justify-center">
            <a href="<?= base_url('bookings') ?>" class="flex items-center justify-center">
                <img id="navbar-logo" src="<?= base_url('assets/biggs_logo.png') ?>" alt="Logo" class="w-32">
            </a>
        </div>

        <!-- Navigation Items -->
        <div class="flex-1 overflow-y-auto px-3 py-4">
            <ul class="space-y-1">
                <li>
                    <a href="<?= base_url('bookings') ?>" class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition <?= current_url() === base_url('bookings') ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900' ?>" title="Bookings">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 flex-shrink-0">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                        </svg>
                        <span>Bookings</span>
                    </a>
                </li>
                <li>
                    <a href="<?= base_url('notifications') ?>" class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition <?= current_url() === base_url('notifications') ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900' ?>" title="Notifications">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 flex-shrink-0">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5" />
                        </svg>
                        <span>Notification</span>
                    </a>
                </li>
                <li>
                    <a href="<?= base_url('packages') ?>" class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition <?= current_url() === base_url('packages') ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900' ?>" title="Packages">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 flex-shrink-0">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5" />
                        </svg>
                        <span>Packages</span>
                    </a>
                </li>
            </ul>

            <div class="mt-5 px-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Workspace</div>
            <ul class="mt-2 space-y-1">
                <li>
                    <a href="#" class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition <?= current_url() === 'project-board' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900' ?>" title="Project board">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4 flex-shrink-0">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                        </svg>
                        <span>Project board</span>
                    </a>
                </li>
                <li>
                    <a href="#" class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition <?= current_url() === 'upcoming' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900' ?>" title="Upcoming">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4 flex-shrink-0">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                        </svg>
                        <span>Upcoming</span>
                    </a>
                </li>
                <li>
                    <a href="#" class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition <?= current_url() === 'templates' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900' ?>" title="Templates">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4 flex-shrink-0">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0 1 18 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5m0-5.25v5.25m0-5.25C6 5.004 6.504 4.5 7.125 4.5h9.75c.621 0 1.125.504 1.125 1.125m1.125 2.625h1.5m-1.5 0A1.125 1.125 0 0 1 18 7.125v-1.5m1.125 2.625c-.621 0-1.125.504-1.125 1.125v1.5m2.625-2.625c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M18 5.625v5.25M7.125 12h9.75m-9.75 0A1.125 1.125 0 0 1 6 10.875M7.125 12C6.504 12 6 12.504 6 13.125m0-2.25C6 11.496 5.496 12 4.875 12M18 10.875c0 .621-.504 1.125-1.125 1.125M18 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-12 5.25v-5.25m0 5.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125m-12 0v-1.5c0-.621.504-1.125 1.125-1.125M18 18.375v-5.25m0 5.25v-1.5c0-.621-.504-1.125-1.125-1.125M18 13.125v1.5c0 .621.504 1.125 1.125 1.125M18 13.125c0-.621.504-1.125 1.125-1.125M6 13.125v1.5c0 .621-.504 1.125-1.125 1.125M6 13.125C6 12.504 6.504 12 7.125 12m-1.5 5.25-.875-1.5m.875 1.5h10.5m0 0 .875-1.5M4.5 19.5l.875-1.5M19.5 19.5l-.875-1.5m0 0h-10.5" />
                        </svg>
                        <span>Templates</span>
                    </a>
                </li>
                <li>
                    <a href="<?= base_url('bookings') ?>" class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition <?= current_url() === 'views' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900' ?>" title="Views">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4 flex-shrink-0">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                        <span>Views</span>
                    </a>
                </li>
                <li>
                    <a href="#" class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition <?= current_url() === 'teams' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900' ?>" title="Teams">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4 flex-shrink-0">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                        </svg>
                        <span>Teams</span>
                    </a>
                </li>
            </ul>
        </div>

        <!-- Footer -->
        <div class="border-t border-slate-200 px-3 py-4">
            <div class="space-y-1">
                <a href="#" class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition <?= current_url() === 'profile' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900' ?>" title="Profile">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4 flex-shrink-0">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                    <span>Profile</span>
                </a>
                <a href="#" class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition <?= current_url() === 'settings' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900' ?>" title="Settings">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4 flex-shrink-0">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                    <span>Settings</span>
                </a>
            </div>

            <div class="mt-4 relative">
                <div class="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 shadow-sm">
                    <div class="min-w-0 flex-1">
                        <div class="truncate text-sm font-medium text-slate-900"><?= $name ?></div>
                        <div class="truncate text-xs text-slate-500">Workspace member</div>
                    </div>
                    <button type="button" id="more-btn" class="ml-auto p-1 rounded-lg hover:bg-slate-100 text-slate-600 flex-shrink-0" title="Menu">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                        </svg>
                    </button>
                </div>

                <!-- Dropdown -->
                <div id="more-dropdown"
                    class="absolute bottom-full right-0 mb-2 w-40 rounded-xl border border-slate-200 bg-white py-1 shadow-lg hidden z-50">
                    <button type="button" id="logout-btn"
                        class="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                        </svg>
                        <span>Log out</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</aside>

<!-- Mobile Menu Toggle Button -->
<button id="mobile-menu-toggle" class="md:hidden fixed left-4 top-4 z-40 p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-600">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
</button>

<!-- Mobile Menu Overlay -->
<div id="navbar-overlay" class="hidden fixed inset-0 bg-black/50 z-20 md:hidden"></div>

<style>
    /* Mobile: auto-collapse on small screens */
    @media (max-width: 768px) {
        #navbar {
            -translate: -100%;
        }

        #navbar.mobile-open {
            -translate: 0;
        }

        #navbar-overlay.visible {
            display: block;
        }
    }
</style>

<script>
    $(function() {
        const $navbar = $('#navbar');
        const $mobileMenuToggle = $('#mobile-menu-toggle');
        const $overlay = $('#navbar-overlay');
        const $moreBtn = $('#more-btn');
        const $moreDropdown = $('#more-dropdown');

        // Mobile: Open menu
        $mobileMenuToggle.on('click', function(e) {
            e.stopPropagation();
            $navbar.addClass('mobile-open');
            $overlay.addClass('visible');
        });

        // Mobile: Close menu
        function closeMobileMenu() {
            $navbar.removeClass('mobile-open');
            $overlay.removeClass('visible');
        }

        // Close when clicking overlay
        $overlay.on('click', closeMobileMenu);

        // Close when clicking a nav link on mobile
        $navbar.find('a').on('click', function() {
            if (window.innerWidth <= 768) {
                closeMobileMenu();
            }
        });

        // Close more dropdown when clicking outside
        $(document).on('click', function(e) {
            if (!$(e.target).closest('#more-btn, #more-dropdown').length) {
                $moreDropdown.addClass('hidden');
            }
        });

        $moreBtn.on('click', function(e) {
            e.stopPropagation();
            $moreDropdown.toggleClass('hidden');
        });

        // Logout
        $('#logout-btn').on('click', function() {
            localStorage.removeItem('auth_token');

            $.ajax({
                url: '<?= base_url('/logout') ?>',
                method: 'POST',
                success: function() {
                    window.location.href = '<?= base_url('/') ?>';
                },
            });
        });
    });
</script>