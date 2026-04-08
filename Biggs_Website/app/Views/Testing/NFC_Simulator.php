<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NFC Simulator</title>
    <style>
        :root {
            color-scheme: light;
            --bg: #f6f7fb;
            --panel: #ffffff;
            --text: #171b2e;
            --muted: #5b647f;
            --border: #d8deef;
            --primary: #1748d8;
            --primary-hover: #1238aa;
        }

        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
            background: radial-gradient(circle at top right, #e9eeff 0%, var(--bg) 45%);
            color: var(--text);
            padding: 24px;
        }

        .container {
            max-width: 920px;
            margin: 0 auto;
            display: grid;
            gap: 16px;
        }

        .card {
            background: var(--panel);
            border: 1px solid var(--border);
            border-radius: 14px;
            padding: 18px;
            box-shadow: 0 8px 20px rgba(18, 25, 53, 0.06);
        }

        h1 {
            margin: 0;
            font-size: 26px;
        }

        h2 {
            margin-top: 0;
            margin-bottom: 8px;
            font-size: 19px;
        }

        p {
            margin-top: 0;
            color: var(--muted);
        }

        .row {
            display: grid;
            gap: 12px;
            grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
            margin-bottom: 10px;
        }

        label {
            display: block;
            font-size: 13px;
            color: var(--muted);
            margin-bottom: 4px;
        }

        input {
            width: 100%;
            border: 1px solid var(--border);
            border-radius: 9px;
            padding: 9px 10px;
            font-size: 14px;
        }

        button {
            background: var(--primary);
            color: #fff;
            border: none;
            border-radius: 9px;
            padding: 10px 16px;
            cursor: pointer;
            font-weight: 600;
            transition: background 0.2s ease;
        }

        button:hover {
            background: var(--primary-hover);
        }

        button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }

        pre {
            margin: 12px 0 0;
            background: #0f1732;
            color: #e7ebff;
            border-radius: 10px;
            padding: 12px;
            overflow: auto;
            min-height: 60px;
            font-size: 13px;
        }

        .status {
            margin-top: 10px;
            font-size: 14px;
            font-weight: 600;
        }

        .hint {
            margin-top: 8px;
            font-size: 12px;
            color: var(--muted);
        }
    </style>
</head>
<body>
    <main class="container">
        <section class="card">
            <h1>NFC Simulator</h1>
            <p>Use this page to simulate tap flow from browser without physical NFC hardware.</p>
        </section>

        <section class="card">
            <h2>Enter Tag ID</h2>
            <form id="scan-form">
                <div class="row">
                    <div>
                        <label for="scan_tag_uid">Tag UID</label>
                        <input type="text" id="scan_tag_uid" name="scan_tag_uid" required>
                    </div>
                </div>
                <button type="submit" id="scan-btn">Check Redemption Status</button>
            </form>
            <div class="hint">This first validates the tag, then checks whether it has vouchers currently pending redemption.</div>
            <div class="status" id="scan-status"></div>
            <pre id="scan-output">No lookup request sent yet.</pre>
        </section>
    </main>
</body>

<script>
    async function postJson(url, payload) {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        let body;
        try {
            body = await response.json();
        } catch (error) {
            body = { message: 'Invalid JSON response from server' };
        }

        return { ok: response.ok, status: response.status, body };
    }

    function setResult(statusNode, outputNode, result, successLabel, failLabel) {
        statusNode.textContent = result.ok
            ? successLabel + ' (' + result.status + ')'
            : failLabel + ' (' + result.status + ')';

        statusNode.style.color = result.ok ? '#147b38' : '#b4232f';
        outputNode.textContent = JSON.stringify(result.body, null, 2);
    }

    const scanForm = document.getElementById('scan-form');
    const scanTagUid = document.getElementById('scan_tag_uid');
    const scanStatus = document.getElementById('scan-status');
    const scanOutput = document.getElementById('scan-output');
    const scanBtn = document.getElementById('scan-btn');

    scanForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const tagUid = scanTagUid.value.trim();
        if (!tagUid) {
            scanStatus.textContent = 'Tag UID is required.';
            scanStatus.style.color = '#b4232f';
            return;
        }

        scanBtn.disabled = true;
        scanStatus.textContent = 'Checking tag and loading active redemption state...';
        scanStatus.style.color = '#1748d8';

        const tagResult = await postJson('/user/checkTagUID', { tag_uid: tagUid });

        if (!tagResult.ok) {
            setResult(scanStatus, scanOutput, tagResult, 'Tag scan success', 'Tag scan failed');
            scanBtn.disabled = false;
            return;
        }

        const statusResult = await postJson('/claimed-vouchers/vouchers', { tag_uid: tagUid });

        const payload = statusResult.ok ? statusResult.body : { message: 'Unable to load claimed vouchers', details: statusResult.body };
        const activeVouchers = Array.isArray(statusResult.body)
            ? statusResult.body.filter(function (voucher) {
                return !voucher.claimed_at;
            })
            : [];

        const combined = {
            tag_check: tagResult.body,
            active_claims: activeVouchers,
            all_claimed_vouchers: statusResult.body,
            note: activeVouchers.length
                ? 'This tag currently has vouchers pending redemption.'
                : 'No vouchers are currently pending redemption for this tag.'
        };

        setResult(scanStatus, scanOutput, { ok: statusResult.ok, status: statusResult.status, body: combined }, 'Redemption status loaded', 'Redemption status lookup failed');

        scanBtn.disabled = false;
    });
</script>
</html>