<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sign Up — BIGGS</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            brand: {
              50:  '#fef2f2',
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
      <h1 class="text-2xl font-bold tracking-tight text-slate-800">Create your account</h1>

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

      <form id="signup-form" action="<?= base_url('register') ?>" method="post" class="space-y-4">
        <?= csrf_field() ?>

      <!-- Username + Employee type -->
      <div class="grid grid-cols-2 gap-3">
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
        <div>
          <label for="employee-type" class="block mb-2 text-sm font-medium text-slate-800">Employee type</label>
          <select id="employee-type"
                  name="employee_type"
                  required
                  class="w-full px-3 py-3 text-sm text-slate-800 bg-blue-50 border border-sky-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-500 transition">
            <option value="" selected disabled>Select type</option>
            <option value="admin" <?= old('employee_type') === 'admin' ? 'selected' : '' ?>>Admin</option>
            <option value="manager" <?= old('employee_type') === 'manager' ? 'selected' : '' ?>>Manager</option>
            <option value="staff" <?= old('employee_type') === 'staff' ? 'selected' : '' ?>>Staff</option>
            <option value="cashier" <?= old('employee_type') === 'cashier' ? 'selected' : '' ?>>Cashier</option>
          </select>
        </div>
      </div>

      <!-- Assigned branch (optional) -->
      <div>
        <label for="assigned-at" class="block mb-2 text-sm font-medium text-slate-800">Assigned branch ID (optional)</label>
        <input id="assigned-at"
           name="assigned_at"
               type="number"
               min="1"
               placeholder="e.g. 1"
           value="<?= esc((string) old('assigned_at')) ?>"
               class="w-full px-3 py-3 text-sm text-slate-800 bg-blue-50 border border-sky-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-500 transition" />
      </div>

      <!-- Password -->
      <div>
        <label for="password" class="block mb-2 text-sm font-medium text-slate-800">Password</label>
        <div class="relative">
          <input id="password"
               name="password"
                 type="password"
                 placeholder="Min. 8 characters"
                 autocomplete="new-password"
                 required
                 class="w-full px-3 py-3 pr-16 text-sm text-slate-800 bg-blue-50 border border-sky-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-500 transition" />
          <button type="button"
                  id="toggle-pw"
                  aria-label="Toggle password visibility"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-slate-500 hover:text-slate-700 focus:outline-none">
            Show
          </button>
        </div>
        <!-- Strength bar -->
        <div class="mt-2 grid grid-cols-4 gap-1">
          <div class="strength-bar h-1 rounded-full bg-slate-200 transition-colors duration-300"></div>
          <div class="strength-bar h-1 rounded-full bg-slate-200 transition-colors duration-300"></div>
          <div class="strength-bar h-1 rounded-full bg-slate-200 transition-colors duration-300"></div>
          <div class="strength-bar h-1 rounded-full bg-slate-200 transition-colors duration-300"></div>
        </div>
        <p id="strength-label" class="mt-1 text-xs text-slate-400"></p>
      </div>

      <!-- Confirm Password -->
      <div>
        <label for="confirm-password" class="block mb-2 text-sm font-medium text-slate-800">Confirm password</label>
        <div class="relative">
          <input id="confirm-password"
               name="confirm_password"
                 type="password"
                 placeholder="Re-enter password"
                 autocomplete="new-password"
                 required
                 class="w-full px-3 py-3 pr-16 text-sm text-slate-800 bg-blue-50 border border-sky-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-500 transition" />
          <button type="button"
                  id="toggle-confirm-pw"
                  aria-label="Toggle confirm password visibility"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-slate-500 hover:text-slate-700 focus:outline-none">
            Show
          </button>
        </div>
      </div>

      <!-- Terms -->
      <div class="flex items-start gap-2">
        <input id="terms"
           name="terms"
           value="1"
               type="checkbox"
           <?= old('terms') ? 'checked' : '' ?>
               class="mt-0.5 w-4 h-4 border border-slate-300 rounded bg-blue-50 cursor-pointer accent-sky-500" />
        <label for="terms" class="text-sm text-slate-500 cursor-pointer leading-snug">
          I agree to the
          <a href="#" class="font-medium text-sky-900 hover:underline">Terms of Service</a>
          and
          <a href="#" class="font-medium text-sky-900 hover:underline">Privacy Policy</a>
        </label>
      </div>

      <!-- Submit -->
      <button type="submit"
              id="submit-btn"
              class="w-full py-3 px-5 text-sm font-medium text-black bg-sky-300 hover:bg-sky-400 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed">
        Create account
      </button>
      </form>

      <!-- Sign in -->
      <p class="text-sm font-light text-slate-500">
        Already have an account?
        <a href="<?= base_url('/') ?>" class="font-medium text-red-800 hover:underline">Sign in</a>
      </p>
    </div>
  </div>

<script>
$(function () {

  /* ─── Toggle password visibility ─── */
  function makeToggle(btnId, inputId) {
    $('#' + btnId).on('click', function () {
      const $input = $('#' + inputId);
      const isPassword = $input.attr('type') === 'password';
      $input.attr('type', isPassword ? 'text' : 'password');
      $(this).text(isPassword ? 'Hide' : 'Show');
    });
  }
  makeToggle('toggle-pw',         'password');
  makeToggle('toggle-confirm-pw', 'confirm-password');

  /* ─── Password strength meter ─── */
  const strengthColors = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500'];
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];

  function getStrength(pw) {
    let score = 0;
    if (pw.length >= 8)              score++;
    if (/[A-Z]/.test(pw))            score++;
    if (/[0-9]/.test(pw))            score++;
    if (/[^A-Za-z0-9]/.test(pw))    score++;
    return score; // 0–4
  }

  $('#password').on('input', function () {
    const pw    = $(this).val();
    const score = pw.length ? getStrength(pw) : 0;
    const bars  = $('.strength-bar');

    bars.each(function (i) {
      $(this).removeClass('bg-red-400 bg-orange-400 bg-yellow-400 bg-green-500 bg-slate-200');
      if (pw.length && i < score) {
        $(this).addClass(strengthColors[score - 1]);
      } else {
        $(this).addClass('bg-slate-200');
      }
    });

    $('#strength-label').text(pw.length ? strengthLabels[score - 1] || '' : '');
  });

  /* ─── Error / success banners ─── */
  function showError(msg) {
    $('#success-msg').addClass('hidden');
    $('#error-msg').text(msg).removeClass('hidden');
  }

  function clearMessages() {
    $('#error-msg').addClass('hidden').text('');
  }

  /* ─── Validation ─── */
  function validate() {
    const username     = $.trim($('#username').val());
    const employeeType = $('#employee-type').val();
    const assignedAt   = $.trim($('#assigned-at').val());
    const password     = $('#password').val();
    const confirm      = $('#confirm-password').val();
    const terms        = $('#terms').is(':checked');

    if (!username)             { showError('Username is required.');                      return false; }
    if (!employeeType)         { showError('Employee type is required.');                 return false; }
    if (!password)             { showError('Password is required.');                       return false; }
    if (password.length < 8)   { showError('Password must be at least 8 characters.');    return false; }
    if (password !== confirm)  { showError('Passwords do not match.');                     return false; }
    if (assignedAt && (!/^\d+$/.test(assignedAt) || Number(assignedAt) < 1)) {
      showError('Assigned branch ID must be a positive number.');
      return false;
    }
    if (!terms)                { showError('You must agree to the Terms of Service.');    return false; }

    clearMessages();
    return true;
  }

  /* ─── Submit handler ─── */
  $('#signup-form').on('submit', function (e) {
    if (!validate()) {
      e.preventDefault();
      return;
    }

    $('#submit-btn').prop('disabled', true).text('Creating account...');
  });

  $('#username, #employee-type, #assigned-at, #password, #confirm-password, #terms').on('input change', function () {
    clearMessages();
  });

});
</script>

</body>
</html>