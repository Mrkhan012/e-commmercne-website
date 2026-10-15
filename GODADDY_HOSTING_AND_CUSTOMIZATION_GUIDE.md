# 🚀 GoDaddy Shared Hosting, B2B Dealer & Store Operations Guide
**Website:** AFRO & CO. (`Afro.co`)  
**Technology:** React 19 + TypeScript + Vite + Tailwind CSS + GoDaddy Apache / PHP Backend

This comprehensive guide details:
1. **The Three End-User Systems:** Customer Storefront, Platform Admin Console, and B2B Dealer Portal.
2. **Deploying to GoDaddy Shared Hosting (cPanel / Apache + PHP).**
3. **Google Search Engine Optimization (SEO), XML Sitemap, & JSON-LD Structured Data.**
4. **Pagination, Performance, & Security Architecture.**
5. **How the Store Owner Manages Catalog, Dealers, Orders, & Currencies.**

---

## 👥 Part 1: Three Tailored End-User Experiences

The platform provides dedicated, role-guarded experiences for three primary stakeholder groups:

### 1. End Customer (Retail Experience)
- **Storefront & Catalog**: Responsive luxury layout, faceted filtering by category, price, color, size, brand, and sorting.
- **Pagination**: Fast, smooth client and server pagination (12 items per page) with URL state persistence.
- **Product Experience**: Multi-angle image zoom galleries, colorway/sizing variant selectors, real-time inventory counts, customer reviews with verified badges, and related recommendations.
- **Bag & Checkout**: Multi-step checkout supporting Credit Cards, Apple Pay, PayPal, and Cash on Delivery.
- **Customer Account Portal (`/account`)**: Order history, live package tracking, saved shipping addresses, personal wishlist, and customer support tickets.

### 2. Platform Admin Console (`/admin`)
- Accessible via `/admin` (Protected by Admin Role Guard).
- **Executive Analytics (`/admin/analytics`)**: Real-time revenue charts, order counts, customer acquisition, and conversion rates.
- **Order Management (`/admin/orders`)**: Filter orders, update status (Pending &rarr; Processing &rarr; Shipped &rarr; Delivered), assign courier tracking codes, and issue refunds.
- **Product Management (`/admin/products`)**: Add, edit, and delete products, adjust inventory levels, manage variant attributes, and configure pricing discounts.
- **Category Management (`/admin/categories`)**: Create new collection taxonomies and manage subcategory hierarchies.
- **Dealer & Wholesale Management (`/admin/dealers`)**:
  - Review incoming B2B dealer and boutique applications.
  - Approve or reject dealers.
  - Assign Dealer Tiers (**Bronze 15%**, **Silver 25%**, **Gold 35%** wholesale margins).
  - Allocate revolving commercial credit lines (e.g. $10,000 to $50,000) and set commercial payment terms (Prepaid, Net-30, Net-60).
- **Coupons & Promotions (`/admin/coupons`)**: Create promo codes, flash sale banners, and free shipping thresholds.

### 3. Dealer & Wholesaler Portal (`/dealer`)
- Tailored for retail partners, boutiques, and corporate bulk buyers.
- **Dealer Onboarding (`/dealer/register`)**: Public application form capturing Company Name, Tax ID / VAT / GSTIN, Business Type, and Expected Volume.
- **Wholesale Dashboard (`/dealer`)**: At-a-glance status of active tier margin, revolving credit line usage, and pending shipments.
- **Wholesale Catalog (`/dealer/catalog`)**:
  - View Retail MSRP vs. Wholesale Partner Price (e.g. 35% discount).
  - Minimum Order Quantities (MOQ).
  - Quick batch quantity steppers (+5, +10, +25, +50) with instant batch add-to-cart.
  - Full catalog pagination.
- **Bulk Matrix Quick Order Form (`/dealer/quick-order`)**: High-speed tabular matrix for multi-line restock orders across sizes/colors with live subtotal calculations.
- **Wholesale Orders & Invoices (`/dealer/orders`)**:
  - View and track all wholesale shipments.
  - Instant **"View & Print B2B Tax Invoice"** modal with Buyer/Seller Tax IDs, HSN codes, and bank wire remittance details.
- **Request for Quote (RFQ) (`/dealer/rfq`)**: Volume negotiations for bulk manufacturing (>100 units) and custom private-label runs.

---

## 🚀 Part 2: How to Deploy to GoDaddy Shared Hosting

GoDaddy shared hosting uses standard Apache + PHP + cPanel File Manager.

### Step 1: Build the Production Frontend
On your computer in the project root:
```bash
npm run build
```
This generates the optimized `dist/` directory containing:
- `index.html` (with Google structured data and SEO meta tags)
- `assets/` (compressed CSS, JS, and media)
- `.htaccess` (pre-configured for Apache SPA routing & Gzip compression)
- `sitemap.xml` (Google Search Engine XML Sitemap)
- `robots.txt` (Search crawler directives)

### Step 2: Upload Files to GoDaddy `public_html/`
1. Log into your **GoDaddy Account** &rarr; **Web Hosting (cPanel)** &rarr; **File Manager**.
2. In File Manager settings (top right), enable **"Show Hidden Files (dotfiles)"** so `.htaccess` is visible.
3. Open `public_html/`.
4. Upload all files from the `dist/` folder directly into `public_html/`:
   - `index.html`
   - `assets/`
   - `.htaccess`
   - `sitemap.xml`
   - `robots.txt`
   - `favicon.svg`
5. Upload the `php/` directory directly into `public_html/php/`:
   - `php/api/` (REST API engine)
   - `php/data/` (JSON atomic datastore with pre-seeded products & dealers)
   - `php/install.php` (Environment diagnostic checker)
   - `php/database.sql` (Optional MySQL schema)
6. Ensure the `php/data/` folder has write permissions (`chmod 755` or `chmod 775` via cPanel).

### Step 3: Verify Deployment
Visit:
- Storefront: `https://yourdomain.com/`
- Dealer Portal: `https://yourdomain.com/dealer`
- Admin Console: `https://yourdomain.com/admin`
- Host Diagnostics: `https://yourdomain.com/php/install.php`
- API Health: `https://yourdomain.com/api/health`

### Optional: Connect GoDaddy cPanel MySQL Database
The backend works out-of-the-box with atomic JSON file storage. If you prefer MySQL:
1. In GoDaddy cPanel, click **MySQL Databases** and create a new database & user.
2. In **phpMyAdmin**, import `php/database.sql`.
3. Open `php/api/config.php` and enter your DB credentials:
```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'your_cpanel_dbname');
define('DB_USER', 'your_cpanel_dbuser');
define('DB_PASS', 'your_db_password');
```

---

## 🔍 Part 3: Google Search Engine Optimization (SEO)

To maximize Google search indexing and ranking:

### 1. XML Sitemap (`https://yourdomain.com/sitemap.xml`)
- Contains all key landing pages, category collections, and dealer registration.
- **Submit to Google Search Console**:
  1. Open [Google Search Console](https://search.google.com/search-console).
  2. Select your property &rarr; Click **Sitemaps** in the left sidebar.
  3. Enter `sitemap.xml` and click **Submit**.

### 2. Search Engine Crawler Directives (`https://yourdomain.com/robots.txt`)
- Allows Googlebot and Bingbot to index products, categories, and public pages.
- Disallows private administrative (`/admin/`), customer account (`/account/`), and checkout pages.

### 3. Schema.org JSON-LD Structured Data
- **Organization & Store Schema**: Embedded in `index.html` providing brand credentials to Google Knowledge Graph.
- **WebSite Sitelinks SearchBox Schema**: Enables Google to display a direct search bar for your store in Google SERPs.
- **Product Schema with Live Offers**: Injected by `useSeo.ts` on product pages including name, price, currency, availability, and aggregate reviews.

---

## ⚡ Part 4: Performance, Pagination, & Security

- **Vite Lazy-Loading**: Every major route (Shop, Product, Admin, Dealer) is code-split into lightweight chunks loaded on demand.
- **Pagination**:
  - Implemented on Customer Shop (`/shop`), Admin Products (`/admin/products`), Admin Orders (`/admin/orders`), Dealer Catalog (`/dealer/catalog`), and Dealer Orders (`/dealer/orders`).
- **Security**:
  - Role-based route guards prevent unauthorized access to Admin and Dealer portals.
  - Apache `.htaccess` security headers enforce `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, and XSS filtering.
  - Input sanitization on all PHP endpoints.

---

## 💡 Part 5: One-Click Demo Role Switcher

For testing and demonstration, you can switch between all three roles instantly without logging out:
1. Open the **User Profile Dropdown** in the top navigation header.
2. Under **"Switch Role View"**, select:
   - **Customer View** &rarr; Tests retail customer browsing, cart, and standard checkout.
   - **Dealer (B2B) View** &rarr; Opens `/dealer` with 35% Gold Wholesale discount, bulk matrix order, and Net-30 PO checkout.
   - **Platform Admin View** &rarr; Opens `/admin` with full order management, product catalog editing, and dealer approval controls.

---

## 🎨 Part 6: Customizing Website Name & Choosing Theme Colors

You can fully customize your website's **Store Name** and **Color Palette** in two ways:

### Method A: Live in Admin Dashboard (Zero Code, Real-Time Reflection)
1. Go to **Admin Dashboard &rarr; Store Settings** (`/admin/settings`).
2. At the top, open the **Brand Identity & Theme Color Studio**:
   - **Storefront Name**: Type your desired brand name (e.g. `AURUM & CO.`, `NOIR LUXE`, `MY STORE`) and click **Apply Name**. It instantly updates the header logo, footer, page titles, and browser tabs.
   - **Brand Tagline**: Customize your atelier subtitle or boutique tagline.
   - **Curated Color Palettes**: Click any luxury preset swatch:
     - 🟡 **Imperial Gold** (`#C8A97E`) - Heritage luxury & warm atelier aesthetic
     - 🟢 **Emerald Royale** (`#10B981`) - Fine jewellery & prestigious heritage
     - 🔵 **Sapphire Noir** (`#2563EB`) - Executive precision & cobalt elegance
     - 🔴 **Crimson Velvet** (`#E11D48`) - Haute couture passion & bold statement
     - 🟣 **Imperial Violet** (`#8B5CF6`) - Sovereign elegance & distinction
     - 🟠 **Cognac Amber** (`#D97706`) - Artisanal leathercraft & warm golden glow
     - ⚪ **Monochrome Slate** (`#71717A`) - Minimalist architectural quiet luxury
   - **Custom Hex Color Picker**: Click the color picker box or enter any 6-digit hex code (e.g. `#FF4500`, `#00C49F`) to match your exact corporate branding.
   - **Live Preview**: See a live interactive preview card update in real-time before your eyes.
   - Settings are automatically saved to `localStorage` and persist across page refreshes.

### Method B: In Source Code (Permanent Default)
- **Change Default Brand Name & Palette**:
  - Edit [src/store/brandStore.ts](file:///Users/afro/noir-co/src/store/brandStore.ts#L37-L44):
    ```ts
    const DEFAULT_BRAND = {
      siteName: 'YOUR BRAND NAME',
      siteSubtitle: 'Your Store Tagline',
      primaryColor: '#C8A97E',
      activePresetId: 'gold',
      supportEmail: 'contact@yourdomain.com',
      supportPhone: '+1 (800) 555-0199',
    };
    ```
- **Change Default CSS Variable**:
  - Edit [src/index.css](file:///Users/afro/noir-co/src/index.css):
    ```css
    :root {
      --color-noir-gold: #C8A97E; /* Your primary accent color */
    }
    ```

