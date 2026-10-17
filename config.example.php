<?php
declare(strict_types=1);
// Copy OUTSIDE public_html as ../nombres-config.php (preferred), or to ignored
// config.local.php. Never put production credentials in Git or in chat.
return [
    'storage' => 'file', // Change to mysql AFTER importing and checking the catalog.
    'cache_ttl' => 60,
    'diagnostics' => false, // Temporarily true: X-Nombres-Storage response header.
    // 'cache_dir' => '/home/ACCOUNT/domains/nombres.com.py/nombres-cache',
    'db' => [
        'host' => 'localhost', // Use the actual hostname shown in hPanel.
        'port' => 3306,
        'name' => 'YOUR_DATABASE_NAME',
        'user' => 'YOUR_DATABASE_USER',
        'password' => '', // Enter securely on the server, outside version control.
    ],
];
