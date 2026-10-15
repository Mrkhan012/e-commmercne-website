<?php
/**
 * Dual-Mode Data Layer for GoDaddy Shared Hosting
 * Seamlessly supports both atomic JSON file store AND MySQL PDO.
 */

require_once __DIR__ . '/config.php';

class Database {
    private static $pdo = null;
    private static $useMySQL = false;

    public static function init() {
        if (!empty(DB_NAME) && !empty(DB_USER) && DB_PASS !== '') {
            try {
                $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
                self::$pdo = new PDO($dsn, DB_USER, DB_PASS, [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                ]);
                self::$useMySQL = true;
            } catch (Exception $e) {
                // Fall back gracefully to JSON storage
                self::$useMySQL = false;
            }
        }
    }

    public static function isMySQL(): bool {
        return self::$useMySQL && self::$pdo !== null;
    }

    public static function getPDO(): ?PDO {
        return self::$pdo;
    }

    /**
     * Reads a JSON file safely with shared lock.
     */
    public static function readJson(string $filename, array $default = []): array {
        $filePath = DATA_DIR . '/' . $filename;
        if (!file_exists($filePath)) {
            return $default;
        }

        $fp = fopen($filePath, 'r');
        if (!$fp) return $default;

        flock($fp, LOCK_SH);
        $size = filesize($filePath);
        $content = $size > 0 ? fread($fp, $size) : '';
        flock($fp, LOCK_UN);
        fclose($fp);

        $decoded = json_decode($content, true);
        return is_array($decoded) ? $decoded : $default;
    }

    /**
     * Writes to a JSON file atomically with exclusive lock.
     */
    public static function writeJson(string $filename, array $data): bool {
        if (!is_dir(DATA_DIR)) {
            mkdir(DATA_DIR, 0755, true);
        }

        $filePath = DATA_DIR . '/' . $filename;
        $fp = fopen($filePath, 'c+');
        if (!$fp) return false;

        flock($fp, LOCK_EX);
        ftruncate($fp, 0);
        rewind($fp);
        fwrite($fp, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
        fflush($fp);
        flock($fp, LOCK_UN);
        fclose($fp);

        return true;
    }

    /**
     * Helper to sanitize string inputs against XSS.
     */
    public static function sanitize($value) {
        if (is_array($value)) {
            return array_map([self::class, 'sanitize'], $value);
        }
        if (is_string($value)) {
            return htmlspecialchars(trim($value), ENT_QUOTES, 'UTF-8');
        }
        return $value;
    }
}

Database::init();
