-- ==============================================================================
-- AFRO & CO. — GoDaddy MySQL Relational Database Schema
-- Import this SQL file into your GoDaddy cPanel phpMyAdmin
-- ==============================================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- --------------------------------------------------------
-- Table structure for table `categories`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `categories` (
  `id` varchar(64) NOT NULL,
  `name` varchar(128) NOT NULL,
  `slug` varchar(128) NOT NULL,
  `description` text,
  `image` varchar(255) DEFAULT NULL,
  `product_count` int(11) DEFAULT 0,
  `featured` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `products`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `products` (
  `id` varchar(64) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `brand` varchar(128) NOT NULL DEFAULT 'AFRO & CO.',
  `category_id` varchar(64) NOT NULL,
  `subcategory` varchar(128) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `original_price` decimal(10,2) DEFAULT NULL,
  `discount_percent` int(11) DEFAULT 0,
  `currency` varchar(8) NOT NULL DEFAULT 'USD',
  `description` text NOT NULL,
  `short_description` varchar(512) DEFAULT NULL,
  `stock` int(11) NOT NULL DEFAULT 10,
  `rating` decimal(3,2) DEFAULT 5.00,
  `review_count` int(11) DEFAULT 0,
  `status` varchar(32) DEFAULT 'default',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `dealers` (B2B Wholesale Partners)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `dealers` (
  `id` varchar(64) NOT NULL,
  `company_name` varchar(255) NOT NULL,
  `business_type` varchar(64) NOT NULL DEFAULT 'boutique',
  `tax_id` varchar(128) NOT NULL,
  `website` varchar(255) DEFAULT NULL,
  `contact_person` varchar(128) NOT NULL,
  `email` varchar(128) NOT NULL,
  `phone` varchar(64) NOT NULL,
  `address` varchar(255) NOT NULL,
  `city` varchar(128) NOT NULL,
  `state` varchar(128) DEFAULT NULL,
  `country` varchar(128) NOT NULL DEFAULT 'United States',
  `tier` enum('bronze','silver','gold') NOT NULL DEFAULT 'bronze',
  `discount_rate` decimal(4,2) NOT NULL DEFAULT 0.15,
  `credit_limit` decimal(10,2) NOT NULL DEFAULT 10000.00,
  `credit_used` decimal(10,2) NOT NULL DEFAULT 0.00,
  `payment_terms` enum('prepaid','net30','net60') NOT NULL DEFAULT 'net30',
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `expected_volume` varchar(128) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `applied_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `approved_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `orders`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `orders` (
  `id` varchar(64) NOT NULL,
  `order_number` varchar(64) NOT NULL,
  `dealer_id` varchar(64) DEFAULT NULL,
  `is_wholesale` tinyint(1) DEFAULT 0,
  `po_number` varchar(128) DEFAULT NULL,
  `customer_name` varchar(128) NOT NULL,
  `customer_email` varchar(128) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `shipping` decimal(10,2) NOT NULL DEFAULT 0.00,
  `tax` decimal(10,2) NOT NULL DEFAULT 0.00,
  `discount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `total` decimal(10,2) NOT NULL,
  `payment_method` varchar(64) NOT NULL,
  `payment_status` varchar(32) NOT NULL DEFAULT 'unpaid',
  `status` enum('pending','processing','shipped','delivered','cancelled','refunded') NOT NULL DEFAULT 'pending',
  `tracking_number` varchar(128) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_number` (`order_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `order_items`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` varchar(64) NOT NULL,
  `product_id` varchar(64) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `quantity` int(11) NOT NULL,
  `selected_color` varchar(64) DEFAULT NULL,
  `selected_size` varchar(64) DEFAULT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `rfq_requests`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `rfq_requests` (
  `id` varchar(64) NOT NULL,
  `dealer_id` varchar(64) DEFAULT NULL,
  `company_name` varchar(255) NOT NULL,
  `contact_name` varchar(128) NOT NULL,
  `email` varchar(128) NOT NULL,
  `phone` varchar(64) NOT NULL,
  `product_id` varchar(64) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `requested_quantity` int(11) NOT NULL,
  `target_price` decimal(10,2) DEFAULT NULL,
  `quote_amount` decimal(10,2) DEFAULT NULL,
  `status` enum('pending','quoted','accepted','declined') NOT NULL DEFAULT 'pending',
  `notes` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

COMMIT;
