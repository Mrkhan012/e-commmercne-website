<?php
/**
 * AFRO & CO. — GoDaddy Shared Hosting Deployment & Diagnostic Checker
 * Access this via your browser: https://yourdomain.com/php/install.php
 */

require_once __DIR__ . '/api/config.php';
require_once __DIR__ . '/api/db.php';

$checks = [];

// 1. PHP Version
$phpOk = version_compare(PHP_VERSION, '7.4.0', '>=');
$checks[] = [
    'title' => 'PHP Version',
    'status' => $phpOk ? 'pass' : 'fail',
    'message' => 'PHP ' . PHP_VERSION . ($phpOk ? ' (Compatible with GoDaddy Shared Hosting)' : ' (Requires PHP 7.4 or higher)'),
];

// 2. Data Directory Writable
$dataDir = DATA_DIR;
$dataDirOk = is_dir($dataDir) && is_writable($dataDir);
$checks[] = [
    'title' => 'Data Directory Write Permissions',
    'status' => $dataDirOk ? 'pass' : 'fail',
    'message' => $dataDirOk ? 'Directory ' . $dataDir . ' is writable.' : 'Directory ' . $dataDir . ' needs chmod 755 or 775 permissions.',
];

// 3. Products JSON Data file
$productsFile = DATA_DIR . '/products.json';
$productsOk = file_exists($productsFile);
$checks[] = [
    'title' => 'Products Datastore',
    'status' => $productsOk ? 'pass' : 'warn',
    'message' => $productsOk ? 'Found products.json with ' . count(Database::readJson('products.json')) . ' items.' : 'products.json not found yet.',
];

// 4. Dealers JSON Data file
$dealersFile = DATA_DIR . '/dealers.json';
$dealersOk = file_exists($dealersFile);
$checks[] = [
    'title' => 'Dealers & B2B Datastore',
    'status' => $dealersOk ? 'pass' : 'warn',
    'message' => $dealersOk ? 'Found dealers.json with ' . count(Database::readJson('dealers.json')) . ' registered partners.' : 'dealers.json not initialized.',
];

// 5. Database Mode
$isDb = Database::isMySQL();
$checks[] = [
    'title' => 'Active Storage Engine',
    'status' => 'pass',
    'message' => $isDb ? 'Connected to GoDaddy cPanel MySQL Database (' . DB_NAME . ')' : 'Running on Atomic JSON Datastore (Zero-config shared hosting mode)',
];

// 6. JSON & OpenSSL Extensions
$jsonExt = extension_loaded('json');
$sslExt = extension_loaded('openssl');
$checks[] = [
    'title' => 'PHP Core Extensions',
    'status' => ($jsonExt && $sslExt) ? 'pass' : 'warn',
    'message' => 'JSON: ' . ($jsonExt ? 'Enabled' : 'Disabled') . ' | OpenSSL: ' . ($sslExt ? 'Enabled' : 'Disabled'),
];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GoDaddy Hosting Diagnostic | AFRO &amp; CO.</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0c0c0e; color: #f4f4f5; margin: 0; padding: 40px 20px; line-height: 1.5; }
        .container { max-width: 720px; margin: 0 auto; background: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 32px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
        h1 { margin-top: 0; font-size: 24px; color: #d4af37; letter-spacing: -0.02em; }
        .badge { display: inline-block; padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; }
        .badge-pass { background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); }
        .badge-fail { background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); }
        .badge-warn { background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); }
        .item { padding: 16px 0; border-bottom: 1px solid #27272a; display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; }
        .item:last-child { border-bottom: none; }
        .title { font-weight: 600; font-size: 14px; color: #fafafa; }
        .msg { font-size: 12px; color: #a1a1aa; margin-top: 4px; }
        .btn { display: inline-block; background: #d4af37; color: #000; font-weight: 700; font-size: 13px; text-decoration: none; padding: 10px 20px; border-radius: 6px; margin-top: 24px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>AFRO &amp; CO. — GoDaddy Shared Hosting Status</h1>
        <p style="font-size: 13px; color: #a1a1aa;">Automatic environment diagnosis for Apache, PHP, and storage engines.</p>

        <div style="margin-top: 24px;">
            <?php foreach ($checks as $c): ?>
                <div class="item">
                    <div>
                        <div class="title"><?= htmlspecialchars($c['title']) ?></div>
                        <div class="msg"><?= htmlspecialchars($c['message']) ?></div>
                    </div>
                    <span class="badge badge-<?= $c['status'] ?>"><?= strtoupper($c['status']) ?></span>
                </div>
            <?php endforeach; ?>
        </div>

        <a href="../" class="btn">Launch Storefront &rarr;</a>
    </div>
</body>
</html>
