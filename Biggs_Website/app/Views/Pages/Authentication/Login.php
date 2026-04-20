<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Sign In — BIGGS</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        brand: {
                            50: '#fef2f2',
                            100: '#fee2e2',
                            500: '#ef4444',
                            600: '#dc2626',
                            700: '#b91c1c'
                        }
                    }
                }
            }
        };
    </script>
</head>

<body class="min-h-screen flex items-center justify-center px-4 py-6 bg-slate-900"
    style="background-image: url('/images/background.jpg'); background-size: cover; background-position: center;">

    <?php
    $validationErrors = session('validation_errors') ?? [];
    $successMessage = session('success');
    $firstError = !empty($validationErrors) ? reset($validationErrors) : null;
    ?>

    <!-- Overlay -->
    <div class="fixed inset-0 bg-black bg-opacity-20 pointer-events-none z-0"></div>

    <!-- Card -->
    <div class="relative z-10 w-full max-w-md bg-white bg-opacity-60 border border-black border-opacity-10 rounded-lg shadow-md">

        <!-- Logo -->
        <div class="flex justify-center pt-3">
            <img src="<?= base_url('assets/biggs_logo.png') ?>" alt="BIGGS logo" class="w-48 h-auto" />
        </div>

        <!-- Body -->
        <div class="p-6 sm:p-8 space-y-4">
            <h1 class="text-2xl font-bold tracking-tight text-slate-800">Sign in to your account</h1>

            <!-- Error -->
            <div id="error-msg"
                role="alert"
                aria-live="assertive"
                class="<?= $firstError ? '' : 'hidden' ?> text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2"><?= esc((string) $firstError) ?></div>

            <!-- Success -->
            <div id="success-msg"
                role="status"
                aria-live="polite"
                class="<?= $successMessage ? '' : 'hidden' ?> text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2"><?= esc((string) $successMessage) ?></div>

            <form id="login-form" action="<?= base_url('login') ?>" method="post" class="space-y-4">
                <?= csrf_field() ?>

                <!-- Username -->
                <div>
                    <label for="username" class="block mb-2 text-sm font-medium text-slate-800">Username</label>
                    <input id="username"
                        name="username"
                        type="text"
                        placeholder="employee.username"
                        autocomplete="username"
                        required
                        value="<?= esc((string) old('username')) ?>"
                        class="w-full px-3 py-3 text-sm text-slate-800 bg-blue-50 border border-sky-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-500 transition" />
                </div>

                <!-- Password -->
                <div>
                    <label for="password" class="block mb-2 text-sm font-medium text-slate-800">Password</label>
                    <div class="relative">
                        <input id="password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            autocomplete="current-password"
                            required
                            class="w-full px-3 py-3 pr-16 text-sm text-slate-800 bg-blue-50 border border-sky-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-500 transition" />
                        <button type="button"
                            id="toggle-pw"
                            aria-label="Toggle password visibility"
                            class="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-slate-500 hover:text-slate-700 focus:outline-none">
                            Show
                        </button>
                    </div>
                </div>

                <!-- Remember + Forgot -->
                <!-- <div class="flex items-center justify-between">
                    <label class="flex items-center gap-2 text-sm text-slate-500 cursor-pointer select-none">
                        <input id="remember"
                            type="checkbox"
                            class="w-4 h-4 border border-slate-300 rounded bg-blue-50 cursor-pointer" />
                        Remember me
                    </label>
                    <a href="#" class="text-sm font-medium text-sky-900 hover:underline">Forgot password?</a>
                </div> -->

                <!-- Submit -->
                <button type="submit"
                    id="submit-btn"
                    class="w-full py-3 px-5 text-sm font-medium text-black bg-sky-300 hover:bg-sky-400 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed">
                    Sign in
                </button>
            </form>

            <!-- Sign up -->
            <p class="text-sm font-light text-slate-500">
                Don't have an account yet?
                <a href="<?= base_url('signup') ?>" class="font-medium text-red-800 hover:underline">Sign up</a>
            </p>
        </div>
    </div>

    <script>
        $(function() {

            /* ─── Toggle password visibility ─── */
            $('#toggle-pw').on('click', function() {
                const $input = $('#password');
                const isPassword = $input.attr('type') === 'password';
                $input.attr('type', isPassword ? 'text' : 'password');
                $(this).text(isPassword ? 'Hide' : 'Show');
            });

            /* ─── Show / hide error message ─── */
            function showError(msg) {
                $('#success-msg').text('').addClass('hidden');
                $('#error-msg').text(msg).removeClass('hidden');
            }

            function clearError() {
                $('#error-msg').text('').addClass('hidden');
            }

            /* ─── Basic client-side validation ─── */
            function validate() {
                const username = $.trim($('#username').val());
                const password = $('#password').val();
                if (!username) {
                    showError('Username is required.');
                    return false;
                }
                if (!password) {
                    showError('Password is required.');
                    return false;
                }
                clearError();
                return true;
            }

            /* ─── Submit handler ─── */
            $('#login-form').on('submit', function(e) {
                if (!validate()) {
                    e.preventDefault();
                    return;
                }

                $('#submit-btn').prop('disabled', true).text('Signing in...');
            });

            $('#username, #password').on('input', function() {
                clearError();
            });

        });
    </script>

</body>

</html>