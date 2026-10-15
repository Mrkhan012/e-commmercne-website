<?php
/**
 * AFRO & CO. — GoDaddy Shared Hosting & Production Configuration
 * 
 * If using GoDaddy cPanel MySQL:
 * Fill in DB_HOST, DB_NAME, DB_USER, and DB_PASS.
 * 
 * If left empty or DB connection fails:
 * The backend automatically falls back to atomic JSON file storage in php/data/
 * so the entire website and API work out of the box with ZERO setup!
 */

// MySQL Database Credentials (Optional for GoDaddy cPanel)
define('DB_HOST', 'localhost');
define('DB_NAME', 'afro_ecommerce');
define('DB_USER', 'afro_dbuser');
define('DB_PASS', '');

// Store & Admin Security
define('STORE_NAME', 'AFRO & CO.');
define('STORE_URL', 'https://afro.co');
define('ADMIN_API_KEY', 'afro_secret_key_2026'); // Can be passed via X-Admin-Key header

// Notification Email (for contact requests, dealer applications, new orders)
define('NOTIFICATION_EMAIL', 'orders@afro.co');
define('MAIL_FROM', 'noreply@afro.co');

// Directory paths
define('DATA_DIR', dirname(__DIR__) . '/data');
