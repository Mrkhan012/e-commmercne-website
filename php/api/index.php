<?php
/**
 * AFRO & CO. — RESTful API Dispatcher for GoDaddy Shared Hosting
 */

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-Admin-Key');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('X-XSS-Protection: 1; mode=block');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/db.php';

// Route parser
$uri = $_GET['endpoint'] ?? '';
if (empty($uri)) {
    $requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $uri = preg_replace('#^.*?/api/?#', '', $requestUri);
}

$segments = array_values(array_filter(explode('/', trim($uri, '/'))));
$resource = $segments[0] ?? 'health';
$subResource = $segments[1] ?? null;
$method = $_SERVER['REQUEST_METHOD'];

// Helper responses
function jsonResponse($data, int $code = 200) {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    exit;
}

function errorResponse(string $message, int $code = 400) {
    jsonResponse(['success' => false, 'error' => $message], $code);
}

// Read JSON input body
$inputRaw = file_get_contents('php://input');
$input = json_decode($inputRaw, true) ?: [];

// ─── RESOURCE ROUTING ────────────────────────────────────────────────────────

switch ($resource) {
    // 1. Health check & Diagnostics
    case 'health':
        jsonResponse([
            'success' => true,
            'status' => 'online',
            'platform' => 'AFRO & CO. E-Commerce Engine',
            'php_version' => PHP_VERSION,
            'storage_mode' => Database::isMySQL() ? 'MySQL Database' : 'Atomic JSON Datastore',
            'timestamp' => date('c'),
        ]);
        break;

    // 2. Products API (Catalog, Search, Pagination, Admin CRUD)
    case 'products':
        $products = Database::readJson('products.json', []);

        if ($method === 'GET') {
            // Check if requesting single product by ID or slug
            if ($subResource) {
                foreach ($products as $p) {
                    if ($p['id'] === $subResource || $p['slug'] === $subResource) {
                        jsonResponse(['success' => true, 'data' => $p]);
                    }
                }
                errorResponse('Product not found', 404);
            }

            // Filtering
            $category = $_GET['category'] ?? null;
            $search = $_GET['search'] ?? null;
            $sort = $_GET['sort'] ?? 'featured';
            $page = max(1, (int)($_GET['page'] ?? 1));
            $pageSize = max(1, min(100, (int)($_GET['pageSize'] ?? 12)));

            $filtered = array_values(array_filter($products, function($p) use ($category, $search) {
                if ($category && $category !== 'all') {
                    $pCat = strtolower($p['category'] ?? '');
                    $targetCat = strtolower($category);
                    if ($pCat !== $targetCat && (!isset($p['subcategory']) || strtolower($p['subcategory']) !== $targetCat)) {
                        return false;
                    }
                }
                if ($search) {
                    $term = strtolower($search);
                    $name = strtolower($p['name'] ?? '');
                    $brand = strtolower($p['brand'] ?? '');
                    $desc = strtolower($p['description'] ?? '');
                    if (strpos($name, $term) === false && strpos($brand, $term) === false && strpos($desc, $term) === false) {
                        return false;
                    }
                }
                return true;
            }));

            // Sorting
            if ($sort === 'price-asc') {
                usort($filtered, fn($a, $b) => ($a['price'] ?? 0) <=> ($b['price'] ?? 0));
            } elseif ($sort === 'price-desc') {
                usort($filtered, fn($a, $b) => ($b['price'] ?? 0) <=> ($a['price'] ?? 0));
            } elseif ($sort === 'rating') {
                usort($filtered, fn($a, $b) => ($b['rating'] ?? 0) <=> ($a['rating'] ?? 0));
            }

            $total = count($filtered);
            $totalPages = ceil($total / $pageSize) ?: 1;
            $pagedData = array_slice($filtered, ($page - 1) * $pageSize, $pageSize);

            jsonResponse([
                'success' => true,
                'data' => $pagedData,
                'total' => $total,
                'page' => $page,
                'pageSize' => $pageSize,
                'totalPages' => $totalPages,
            ]);
        } elseif ($method === 'POST') {
            // Admin Add Product
            if (empty($input['name']) || empty($input['price'])) {
                errorResponse('Product name and price are required');
            }

            $id = 'prod-' . dechex(time()) . rand(10, 99);
            $newProduct = array_merge([
                'id' => $id,
                'slug' => preg_replace('/[^a-z0-9]+/i', '-', strtolower(trim($input['name']))),
                'stock' => 10,
                'rating' => 5.0,
                'reviewCount' => 0,
                'createdAt' => date('c'),
                'updatedAt' => date('c'),
            ], Database::sanitize($input));

            array_unshift($products, $newProduct);
            Database::writeJson('products.json', $products);

            jsonResponse(['success' => true, 'data' => $newProduct], 201);
        } elseif ($method === 'PUT' && $subResource) {
            // Admin Update Product
            $found = false;
            foreach ($products as &$p) {
                if ($p['id'] === $subResource) {
                    $p = array_merge($p, Database::sanitize($input), ['updatedAt' => date('c')]);
                    $found = true;
                    break;
                }
            }
            if (!$found) errorResponse('Product not found', 404);

            Database::writeJson('products.json', $products);
            jsonResponse(['success' => true, 'message' => 'Product updated successfully']);
        } elseif ($method === 'DELETE' && $subResource) {
            // Admin Delete Product
            $products = array_values(array_filter($products, fn($p) => $p['id'] !== $subResource));
            Database::writeJson('products.json', $products);
            jsonResponse(['success' => true, 'message' => 'Product removed']);
        }
        break;

    // 3. Dealers API (Onboarding, Directory, Approvals, Tiers)
    case 'dealers':
        $dealers = Database::readJson('dealers.json', []);

        if ($method === 'GET') {
            $status = $_GET['status'] ?? null;
            if ($status && $status !== 'all') {
                $dealers = array_values(array_filter($dealers, fn($d) => ($d['status'] ?? '') === $status));
            }
            jsonResponse(['success' => true, 'data' => $dealers]);
        } elseif ($method === 'POST') {
            // Dealer Application Submission
            if (empty($input['companyName']) || empty($input['taxId']) || empty($input['email'])) {
                errorResponse('Company Name, Tax ID, and Email are required for B2B registration');
            }

            $newDealer = array_merge([
                'id' => 'dealer-' . dechex(time()) . rand(10, 99),
                'tier' => 'bronze',
                'discountRate' => 0.15,
                'creditLimit' => 10000,
                'creditUsed' => 0,
                'paymentTerms' => 'prepaid',
                'minOrderQuantity' => 5,
                'status' => 'pending',
                'appliedAt' => date('c'),
            ], Database::sanitize($input));

            array_unshift($dealers, $newDealer);
            Database::writeJson('dealers.json', $dealers);

            // Optional email notification to store owner
            @mail(
                NOTIFICATION_EMAIL,
                "New Dealer Application: " . $newDealer['companyName'],
                "A new dealer application has been submitted by " . $newDealer['contactPerson'] . " (" . $newDealer['email'] . ") for " . $newDealer['companyName'] . ".\n\nTax ID: " . $newDealer['taxId'],
                "From: " . MAIL_FROM
            );

            jsonResponse(['success' => true, 'data' => $newDealer, 'message' => 'Dealer application submitted for approval.'], 201);
        } elseif ($method === 'PUT') {
            // Admin update dealer status / tier / credit limit
            $dealerId = $subResource ?: ($input['id'] ?? null);
            if (!$dealerId) errorResponse('Dealer ID is required');

            $found = false;
            foreach ($dealers as &$d) {
                if ($d['id'] === $dealerId) {
                    $d = array_merge($d, Database::sanitize($input));
                    $found = true;
                    break;
                }
            }
            if (!$found) errorResponse('Dealer not found', 404);

            Database::writeJson('dealers.json', $dealers);
            jsonResponse(['success' => true, 'message' => 'Dealer account updated']);
        }
        break;

    // 4. Orders API (Retail + Wholesale B2B Purchase Orders)
    case 'orders':
        $orders = Database::readJson('orders.json', []);

        if ($method === 'GET') {
            if ($subResource) {
                foreach ($orders as $o) {
                    if ($o['id'] === $subResource || $o['orderNumber'] === $subResource) {
                        jsonResponse(['success' => true, 'data' => $o]);
                    }
                }
                errorResponse('Order not found', 404);
            }
            jsonResponse(['success' => true, 'data' => $orders]);
        } elseif ($method === 'POST') {
            if (empty($input['items']) || empty($input['total'])) {
                errorResponse('Items and total amount are required');
            }

            $orderNumber = 'NC-' . date('Y') . '-' . rand(1000, 9999);
            $newOrder = array_merge([
                'id' => 'order-' . dechex(time()) . rand(10, 99),
                'orderNumber' => $orderNumber,
                'status' => 'pending',
                'trackingNumber' => 'TRK-' . strtoupper(dechex(time())) . rand(100, 999),
                'createdAt' => date('c'),
                'updatedAt' => date('c'),
            ], Database::sanitize($input));

            array_unshift($orders, $newOrder);
            Database::writeJson('orders.json', $orders);

            // Optional notification
            @mail(
                NOTIFICATION_EMAIL,
                "New Order Received: " . $orderNumber,
                "Order total: $" . $newOrder['total'] . "\nPayment Method: " . ($newOrder['paymentMethod'] ?? 'card'),
                "From: " . MAIL_FROM
            );

            jsonResponse(['success' => true, 'data' => $newOrder], 201);
        }
        break;

    // 5. Contact & Support Inquiries
    case 'contact':
        if ($method === 'POST') {
            $inquiries = Database::readJson('inquiries.json', []);
            $newInquiry = array_merge([
                'id' => 'msg-' . time(),
                'receivedAt' => date('c'),
            ], Database::sanitize($input));

            array_unshift($inquiries, $newInquiry);
            Database::writeJson('inquiries.json', $inquiries);

            @mail(
                NOTIFICATION_EMAIL,
                "Store Inquiry from " . ($newInquiry['name'] ?? 'Client'),
                $newInquiry['message'] ?? 'No message body',
                "From: " . ($newInquiry['email'] ?? MAIL_FROM)
            );

            jsonResponse(['success' => true, 'message' => 'Message received. An atelier representative will reply shortly.']);
        }
        break;

    default:
        errorResponse('Invalid endpoint', 404);
}
