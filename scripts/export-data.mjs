import fs from 'fs';
import path from 'path';

// Let's create a bundle or parse the products from the built files or source
// Since vite built the dist folder, dist/assets contains products!
// Let's find dist/assets/products-*.js
const distAssets = fs.readdirSync('./dist/assets');
const productFile = distAssets.find(f => f.startsWith('products-') && f.endsWith('.js'));
const categoryFile = distAssets.find(f => f.startsWith('categoryStore-') && f.endsWith('.js'));
const couponFile = distAssets.find(f => f.startsWith('couponStore-') && f.endsWith('.js'));

console.log('Found assets:', { productFile, categoryFile, couponFile });
