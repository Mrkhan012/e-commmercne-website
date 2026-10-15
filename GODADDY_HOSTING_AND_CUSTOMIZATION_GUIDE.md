# 🚀 GoDaddy Shared Hosting & Store Customization Guide
**Website:** AFRO & CO. (`Afro.co`)  
**Technology:** React 19 + TypeScript + Vite + Tailwind CSS

This guide explains:
1. **How to deploy your website to GoDaddy Shared Hosting (cPanel / Apache)**.
2. **How to change site name, logos, favicon, and SEO meta tags**.
3. **How to change store colors and typography**.
4. **How the store owner / admin manages products, orders, categories, and currency without touching code**.

---

## Part 1: How to Deploy to GoDaddy Shared Hosting

### Step 1: Build the Production Bundle
On your computer/terminal, open the project root and run:
```bash
npm run build
```
This generates an optimized production folder named `dist/` containing:
- `index.html`
- `assets/` (bundled JS, CSS, and images)
- `.htaccess` *(Crucial for GoDaddy Apache routing)*
- `favicon.svg`

---

### Step 2: Ensure `.htaccess` is Included (Prevents 404 on Refresh)
In Single-Page Applications (SPA), without an `.htaccess` file, refreshing URLs like `/shop` or `/admin` will show a **"404 Not Found"** error on GoDaddy.

We have already configured `public/.htaccess`, which automatically builds into `dist/.htaccess`:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ index.html [L]
</IfModule>
```

---

### Step 3: Upload to GoDaddy cPanel File Manager

1. Log in to your **GoDaddy Account** and open **My Products**.
2. Click **Manage** next to **Web Hosting** (cPanel).
3. In the cPanel Dashboard, click **File Manager**.
4. **IMPORTANT: Enable Hidden Files**:
   - In the top-right corner of File Manager, click **Settings**.
   - Check the box **"Show Hidden Files (dotfiles)"** and click **Save**. (This ensures `.htaccess` is visible and uploaded).
5. Open the `public_html` directory:
   - If this is your **primary domain** (e.g., `afro.co`), upload directly to `public_html/`.
   - If this is an **addon domain** or **subdomain**, open the specific folder created for it (e.g. `public_html/store/`).
6. **Upload the contents of `dist/`**:
   - Tip: Zip the contents inside `dist/` into a single file (e.g., `dist.zip`).
   - Click **Upload** in GoDaddy File Manager and select `dist.zip`.
   - Right-click `dist.zip` in File Manager and select **Extract**.
   - Ensure `index.html`, `assets/`, and `.htaccess` are directly inside `public_html/` (not nested inside a subfolder named `dist/`).
7. Visit your domain in your browser. Your store is live!

---

## Part 2: How to Change Site Name, Logo, & Favicon

### 1. Browser Tab Title & SEO Descriptions
File: [`index.html`](file:///Users/afro/noir-co/index.html)
- Line 7: `<meta name="description" content="Your store description..." />`
- Line 8: `<meta property="og:title" content="Your Site Name" />`
- Line 11: `<title>AFRO & CO. | Afro.co</title>`

### 2. Header Brand Name & Logo Text
File: [`src/components/navigation/Header.tsx`](file:///Users/afro/noir-co/src/components/navigation/Header.tsx)
- Search for `AFRO & CO.` to change the main brand text or replace it with an `<img>` tag:
```tsx
{/* Replace with image logo if desired: */}
<img src="/logo.png" alt="Afro & Co." className="h-8 w-auto" />
```

### 3. Footer Brand Name & Social Links
File: [`src/components/layout/Footer.tsx`](file:///Users/afro/noir-co/src/components/layout/Footer.tsx)
- Update company bio, contact emails, phone numbers, and social links (Instagram, X, LinkedIn).

### 4. Favicon (Browser Tab Icon)
File: [`public/favicon.svg`](file:///Users/afro/noir-co/public/favicon.svg)
- Replace `favicon.svg` with your custom SVG or add a standard `favicon.ico` / `favicon.png` in `public/` and update [`index.html`](file:///Users/afro/noir-co/index.html) line 5:
```html
<link rel="icon" type="image/png" href="/favicon.png" />
```

---

## Part 3: How to Change Colors & Fonts

### Changing Color Palette
File: [`src/index.css`](file:///Users/afro/noir-co/src/index.css) (Lines 9–18)

All store colors are centralized design tokens:
```css
@theme {
  /* Brand Colors */
  --color-noir-black: #0A0A0A;      /* Primary dark surfaces / header */
  --color-noir-charcoal: #171717;   /* Secondary dark cards */
  --color-noir-surface: #222222;    /* Dark card background */
  --color-noir-ivory: #F7F5F0;      /* Light background */
  --color-noir-white: #FFFFFF;      /* Clean white */
  --color-noir-light-gray: #E8E6E1; /* Borders & lines */
  --color-noir-muted: #888780;      /* Secondary text & labels */
  --color-noir-gold: #C8A97E;       /* Accent color (buttons, highlights, sale badges) */
}
```
*To customize:* Change `#C8A97E` to your preferred brand accent (e.g., emerald green `#10B981`, royal sapphire `#2563EB`, or copper `#B45309`).

### Changing Typography / Fonts
1. Choose fonts on [Google Fonts](https://fonts.google.com).
2. Update the `<link>` in [`index.html`](file:///Users/afro/noir-co/index.html) (Line 15).
3. Assign them in [`src/index.css`](file:///Users/afro/noir-co/src/index.css):
```css
--font-heading: 'Manrope', sans-serif;
--font-editorial: 'Playfair Display', serif;
--font-body: 'Inter', sans-serif;
```

---

## Part 4: No-Code Admin Dashboard Features

Your client or store admin can manage the following directly from the browser without editing code:

| Feature | Admin Page URL | What the Admin Can Do |
| :--- | :--- | :--- |
| **Products & Inventory** | `/admin/products` | • Add new products with title, images, prices, SKU, tags<br>• Edit prices, stock counts, descriptions<br>• Delete discontinued products |
| **Discounts & Sales** | `/admin/products` & `/admin/coupons` | • Click **"Sales & Offers"** to apply percentage discounts<br>• Set flash sales or bulk department markdowns<br>• Create promo coupon codes (e.g. `WELCOME15`, `LUXURY20`) |
| **Store Categories** | `/admin/categories` | • Add new luxury departments (e.g. *Fragrance, Watches, Leather*)<br>• Custom slugs, cover photos, subcategories<br>• Toggle "Featured on Homepage" |
| **Order Management** | `/admin/orders` | • Review incoming customer orders<br>• Update status: `Pending` ➔ `Processing/Packed` ➔ `Shipped` ➔ `Delivered`<br>• Customers see real-time updates on their tracking page |
| **Multi-Currency** | Header / `/admin/settings` | • Switch live between **INR (₹)**, **AED (د.إ)**, **USD ($)**, **EUR (€)**, **GBP (£)**, etc.<br>• Prices across the store convert automatically |
| **Customer Reviews** | `/admin/reviews` | • Moderate, approve, or hide customer testimonials |

---

## Summary of Commands
```bash
# 1. Install dependencies (first time)
npm install

# 2. Run local development server with hot-reload
npm run dev

# 3. Build optimized website for GoDaddy upload
npm run build
```
Upload the contents of **`dist/`** to GoDaddy's **`public_html/`**.
