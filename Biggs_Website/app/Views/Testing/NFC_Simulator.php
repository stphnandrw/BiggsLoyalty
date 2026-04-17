<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>NFC Simulator</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css" />
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            mono: ['"JetBrains Mono"', 'Consolas', 'monospace'],
            sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
          },
          colors: {
            navy: {
              950: '#050d1f',
              900: '#0a1628',
              800: '#0f2040',
              700: '#162b58',
            },
            blue: {
              neon: '#3d8eff',
              soft: '#a8c8ff',
            },
          },
          keyframes: {
            pulse_ring: {
              '0%, 100%': {
                opacity: '0.6',
                transform: 'scale(1)'
              },
              '50%': {
                opacity: '0.2',
                transform: 'scale(1.6)'
              },
            },
            scan_line: {
              '0%': {
                transform: 'translateY(-100%)'
              },
              '100%': {
                transform: 'translateY(100%)'
              },
            },
            fade_in: {
              from: {
                opacity: '0',
                transform: 'translateY(6px)'
              },
              to: {
                opacity: '1',
                transform: 'translateY(0)'
              },
            },
          },
          animation: {
            pulse_ring: 'pulse_ring 1.8s ease-in-out infinite',
            scan_line: 'scan_line 1.6s linear infinite',
            fade_in: 'fade_in 0.35s ease forwards',
          },
        },
      },
    };
  </script>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
  <style>
    body {
      font-family: 'DM Sans', system-ui, sans-serif;
    }

    .nfc-chip {
      position: relative;
      width: 56px;
      height: 56px;
    }

    .nfc-chip::before,
    .nfc-chip::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 50%;
      border: 2px solid #3d8eff;
      animation: pulse_ring 1.8s ease-in-out infinite;
    }

    .nfc-chip::after {
      animation-delay: 0.6s;
    }

    .scan-overlay {
      position: relative;
      overflow: hidden;
    }

    .scan-overlay.scanning::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent, #3d8eff, transparent);
      animation: scan_line 1.6s linear infinite;
    }

    pre code.hljs {
      border-radius: 0.75rem;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12.5px;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      display: inline-block;
    }

    .fade-in {
      animation: fade_in 0.35s ease forwards;
    }

    ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }

    ::-webkit-scrollbar-track {
      background: transparent;
    }

    ::-webkit-scrollbar-thumb {
      background: #1d2d50;
      border-radius: 3px;
    }
  </style>
</head>

<body class="min-h-screen bg-navy-950 text-white p-4 sm:p-8">

  <!-- Background grid -->
  <div class="fixed inset-0 pointer-events-none"
    style="background-image: linear-gradient(rgba(61,142,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(61,142,255,0.04) 1px, transparent 1px); background-size: 40px 40px;"></div>
  <!-- Glow blob -->
  <div class="fixed top-0 right-0 w-96 h-96 pointer-events-none rounded-full"
    style="background: radial-gradient(circle, rgba(61,142,255,0.12) 0%, transparent 70%); transform: translate(30%, -30%);"></div>

  <div class="relative max-w-2xl mx-auto flex flex-col gap-5">

    <!-- Header -->
    <div class="flex items-center gap-4 pt-2 pb-1 fade-in">
      <!-- NFC Icon -->
      <div class="nfc-chip flex items-center justify-center">
        <div class="w-9 h-9 rounded-full bg-navy-800 border border-blue-neon/40 flex items-center justify-center z-10">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3d8eff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 12V4H4v16h8" />
            <path d="M16 19h6" />
            <path d="M19 16v6" />
          </svg>
        </div>
      </div>
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-white">NFC Simulator</h1>
        <p class="text-sm text-blue-soft/60 font-mono mt-0.5">Tap-flow simulation without physical hardware</p>
      </div>
    </div>

    <!-- Tag Input Card -->
    <div class="rounded-2xl bg-navy-900 border border-white/[0.07] p-6 shadow-xl fade-in scan-overlay" id="scan-card" style="animation-delay:0.08s">
      <div class="flex items-center gap-2 mb-5">
        <span class="status-dot bg-blue-neon animate-pulse"></span>
        <h2 class="text-base font-semibold tracking-wide uppercase text-blue-soft/80 text-xs font-mono">Tag Lookup</h2>
      </div>

      <div class="mb-4">
        <label for="scan_tag_uid" class="block text-xs font-mono text-blue-soft/50 mb-2 tracking-widest uppercase">Tag UID</label>
        <div class="flex gap-3">
          <input
            type="text"
            id="scan_tag_uid"
            value="04A6AD40C22A81"
            class="flex-1 bg-navy-800 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-white placeholder-white/20 focus:outline-none focus:border-blue-neon/60 focus:ring-1 focus:ring-blue-neon/30 transition"
            placeholder="e.g. 04A6AD40C22A81" />
          <button
            id="scan-btn"
            class="flex items-center gap-2 bg-blue-neon hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm px-5 py-3 rounded-xl transition-all duration-200 whitespace-nowrap shadow-lg shadow-blue-neon/20">
            <svg id="btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <span id="btn-label">Check Status</span>
          </button>
        </div>
        <p class="text-xs text-white/30 mt-2 font-mono">Validates the tag UID, then checks pending redemption vouchers.</p>
      </div>

      <!-- Status Bar -->
      <div id="status-bar" class="hidden items-center gap-2 text-sm font-medium mt-4 py-2.5 px-4 rounded-xl border fade-in">
        <span id="status-dot-inner" class="status-dot"></span>
        <span id="status-text"></span>
        <span id="status-code" class="ml-auto font-mono text-xs opacity-60"></span>
      </div>
    </div>

    <!-- Output Card -->
    <div class="rounded-2xl bg-navy-900 border border-white/[0.07] p-6 shadow-xl fade-in" style="animation-delay:0.16s">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <span class="status-dot bg-white/20"></span>
          <h2 class="text-xs font-mono font-semibold tracking-widest uppercase text-white/40">Response</h2>
        </div>
        <button id="copy-btn" class="hidden text-xs font-mono text-blue-neon/70 hover:text-blue-neon transition px-3 py-1.5 rounded-lg border border-blue-neon/20 hover:border-blue-neon/50">
          Copy JSON
        </button>
      </div>
      <pre id="scan-output" class="rounded-xl text-sm min-h-[120px] max-h-96 overflow-auto"><code class="language-json hljs" style="background:#0a1628;">// No request sent yet.</code></pre>
    </div>

  </div>

  <script>
    const $scanBtn = $('#scan-btn');
    const $btnLabel = $('#btn-label');
    const $btnIcon = $('#btn-icon');
    const $tagUid = $('#scan_tag_uid');
    const $statusBar = $('#status-bar');
    const $statusText = $('#status-text');
    const $statusCode = $('#status-code');
    const $statusDot = $('#status-dot-inner');
    const $output = $('#scan-output');
    const $copyBtn = $('#copy-btn');
    const $scanCard = $('#scan-card');

    let lastJson = null;

    function setStatus(ok, label, code) {
      $statusBar.removeClass('hidden').addClass('flex');
      $statusText.text(label);
      $statusCode.text('HTTP ' + code);

      if (ok) {
        $statusBar.attr('class', 'flex items-center gap-2 text-sm font-medium mt-4 py-2.5 px-4 rounded-xl border border-green-500/30 bg-green-500/10 text-green-400 fade-in');
        $statusDot.attr('class', 'status-dot bg-green-400');
      } else {
        $statusBar.attr('class', 'flex items-center gap-2 text-sm font-medium mt-4 py-2.5 px-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 fade-in');
        $statusDot.attr('class', 'status-dot bg-red-400');
      }
    }

    function setLoading(label) {
      $statusBar.removeClass('hidden').addClass('flex');
      $statusBar.attr('class', 'flex items-center gap-2 text-sm font-medium mt-4 py-2.5 px-4 rounded-xl border border-blue-neon/30 bg-blue-neon/10 text-blue-neon fade-in');
      $statusDot.attr('class', 'status-dot bg-blue-neon animate-pulse');
      $statusText.text(label);
      $statusCode.text('');
    }

    function renderOutput(data) {
      lastJson = JSON.stringify(data, null, 2);
      $output.html('<code class="language-json">' + lastJson.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</code>');
      $output.find('code').each(function(i, el) {
        hljs.highlightElement(el);
      });
      $copyBtn.removeClass('hidden');
    }

    function setSpinner(loading) {
      if (loading) {
        $scanCard.addClass('scanning');
        $btnIcon.html('<svg class="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>');
        $btnLabel.text('Checking…');
        $scanBtn.prop('disabled', true);
      } else {
        $scanCard.removeClass('scanning');
        $btnIcon.html('<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>');
        $btnLabel.text('Check Status');
        $scanBtn.prop('disabled', false);
      }
    }

    $scanBtn.on('click', function() {
          const tagUid = $tagUid.val().trim();
          if (!tagUid) {
            setStatus(false, 'Tag UID is required.', '—');
            return;
          }

          setSpinner(true);
          setLoading('Validating tag UID…');

          $.ajax({ //Check Tag UID
            url: '/user/checkTagUID',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
              tag_uid: tagUid
            }),
            success: function(tagBody, _status, xhr) {
              setLoading('Loading voucher redemption state…');

              $.ajax({ //Check pending redemption voucher for this tag UID
                  url: '/user/checkOnProcessVoucher',
                  method: 'POST',
                  contentType: 'application/json',
                  data: JSON.stringify({
                    tag_uid: tagUid
                  }),
                  success: function(voucherBody, _s2, xhr2) {
                    const pendingVoucherId = voucherBody.data ? voucherBody.data.claimed_voucher_id : null;

                    $.ajax({ //If there's a pending redemption voucher, attempt to finalize it
                        url: '/user/endRedeemVoucher',
                        method: 'POST',
                        contentType: 'application/json',
                        data: JSON.stringify({
                          tag_uid: tagUid,
                          claimed_voucher_id: pendingVoucherId
                        }),
                        success: function(finalBody, _s3, xhr3) {
                          const combined = {
                            tag_check: tagBody,
                            pending_voucher: voucherBody,
                            redemption_result: finalBody,
                          };
                          setStatus(true, 'Tag and voucher status fetched successfully', xhr3.status);
                          renderOutput(combined);
                          setSpinner(false);
                        },
                        error: function(xhr3) {
                          let errBody;
                          try {
                            errBody = JSON.parse(xhr3.responseText);
                          } catch (e) {
                            errBody = {
                              message: 'Invalid JSON from server'
                            };
                          }
                          const combined = {
                            tag_check: tagBody,
                            pending_voucher: voucherBody,
                            redemption_error: errBody,
                            note: 'Failed to update voucher redemption status.',
                          };
                          setStatus(false, 'Voucher redemption failed', xhr3.status);
                          renderOutput(combined);
                          setSpinner(false);
                        }
                    });
                  },
                  error: function(xhr2) {
                    let errBody;
                    try {
                      errBody = JSON.parse(xhr2.responseText);
                    } catch (e) {
                      errBody = {
                        message: 'Invalid JSON from server'
                      };
                    }
                    const combined = {
                      tag_check: tagBody,
                      voucher_error: errBody,
                      note: 'Unable to load claimed vouchers.',
                    };
                    setStatus(false, 'Redemption status lookup failed', xhr2.status);
                    renderOutput(combined);
                    setSpinner(false);
                  }
                });

                },
                error: function(xhr) {
                  let errBody;
                  try {
                    errBody = JSON.parse(xhr.responseText);
                  } catch (e) {
                    errBody = {
                      message: 'Invalid JSON from server'
                    };
                  }
                  setStatus(false, 'Tag scan failed', xhr.status);
                  renderOutput(errBody);
                  setSpinner(false);
                }
              });
          });

          // Copy JSON
          $copyBtn.on('click', function() {
            if (!lastJson) return;
            navigator.clipboard.writeText(lastJson).then(() => {
              $copyBtn.text('Copied!');
              setTimeout(() => $copyBtn.text('Copy JSON'), 1800);
            });
          });

          // Enter key
          $tagUid.on('keydown', function(e) {
            if (e.key === 'Enter') $scanBtn.trigger('click');
          });
  </script>
</body>

</html>