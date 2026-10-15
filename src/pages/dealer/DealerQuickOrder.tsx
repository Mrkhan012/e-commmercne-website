import { useState } from 'react';
import {
  Plus,
  Trash2,
  ShoppingBag,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useProductStore } from '@/store/productStore';
import { useUserStore } from '@/store/userStore';
import { useDealerStore } from '@/store/dealerStore';
import { useCartStore } from '@/store/cartStore';
import { useCurrencyStore } from '@/store/currencyStore';
import { useToastStore } from '@/store/toastStore';
import { formatPrice } from '@/utils/format';
import { useSeo } from '@/hooks/useSeo';

interface OrderRow {
  id: string;
  productId: string;
  selectedColor?: string;
  selectedSize?: string;
  quantity: number;
}

export default function DealerQuickOrder() {
  useSeo({
    title: 'Bulk Matrix Quick Order | Dealer Portal',
    description: 'High-speed tabular wholesale order form for rapid SKU entry, bulk volume batches, and instant checkout.',
  });

  const { products } = useProductStore();
  const { user } = useUserStore();
  const { dealers } = useDealerStore();
  const { currentCurrency } = useCurrencyStore();
  const { addItem, openCart } = useCartStore();
  const toast = useToastStore();

  const currentDealer = user?.dealerProfile || dealers.find((d) => d.email === user?.email) || dealers[0];
  const discountRate = currentDealer?.discountRate || 0.35;
  const discountPercent = Math.round(discountRate * 100);

  // Initial order rows
  const [rows, setRows] = useState<OrderRow[]>([
    { id: 'row-1', productId: products[0]?.id || '', quantity: 10 },
    { id: 'row-2', productId: products[1]?.id || '', quantity: 15 },
    { id: 'row-3', productId: products[2]?.id || '', quantity: 5 },
  ]);

  const addRow = () => {
    setRows((prev) => [
      ...prev,
      {
        id: `row-${Date.now()}`,
        productId: products[0]?.id || '',
        quantity: currentDealer?.minOrderQuantity || 5,
      },
    ]);
  };

  const removeRow = (id: string) => {
    if (rows.length <= 1) {
      toast.error('Minimum requirement', 'At least one line item is required.');
      return;
    }
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const updateRow = (id: string, updates: Partial<OrderRow>) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  };

  const getWholesalePrice = (retailPrice: number) => {
    return Math.round(retailPrice * (1 - discountRate) * 100) / 100;
  };

  // Calculations
  const calculatedRows = rows.map((row) => {
    const product = products.find((p) => p.id === row.productId) || products[0];
    const wholesaleUnitPrice = getWholesalePrice(product.price);
    const retailTotal = product.price * row.quantity;
    const wholesaleTotal = wholesaleUnitPrice * row.quantity;
    const savings = retailTotal - wholesaleTotal;

    return {
      ...row,
      product,
      wholesaleUnitPrice,
      wholesaleTotal,
      savings,
    };
  });

  const grandTotalWholesale = calculatedRows.reduce((acc, r) => acc + r.wholesaleTotal, 0);
  const totalUnits = calculatedRows.reduce((acc, r) => acc + r.quantity, 0);
  const totalSavings = calculatedRows.reduce((acc, r) => acc + r.savings, 0);

  const handleAddAllToCart = () => {
    let addedCount = 0;
    calculatedRows.forEach((r) => {
      const color = r.product.colors?.find((c) => c.name === r.selectedColor) || r.product.colors?.[0];
      const size = r.product.sizes?.find((s) => s.label === r.selectedSize) || r.product.sizes?.[0];

      addItem(r.product, r.quantity, color, size, r.wholesaleUnitPrice, true);
      addedCount += r.quantity;
    });

    toast.success(
      'Wholesale items added to cart',
      `Successfully added ${addedCount} units across ${calculatedRows.length} lines to your wholesale bag.`
    );
    openCart();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--color-noir-gold)]">
            High-Efficiency Entry
          </span>
          <h1 className="font-heading text-2xl font-bold text-[var(--text-primary)]">
            Bulk Matrix Quick Order Form
          </h1>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">
            Rapidly assemble multi-line restock orders with active tier discount ({discountPercent}% off MSRP).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={addRow} variant="outline" size="sm">
            <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Line
          </Button>
          <Button onClick={handleAddAllToCart} variant="primary" size="sm">
            <ShoppingBag className="mr-1.5 h-3.5 w-3.5" /> Add All to Cart ({totalUnits} units)
          </Button>
        </div>
      </div>

      {/* ─── Matrix Order Table ─── */}
      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[var(--border-color)] bg-[var(--bg-secondary)] text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
              <tr>
                <th className="py-3 px-4 font-semibold w-12">#</th>
                <th className="py-3 px-4 font-semibold min-w-[240px]">Product / SKU</th>
                <th className="py-3 px-4 font-semibold min-w-[130px]">Color Variant</th>
                <th className="py-3 px-4 font-semibold min-w-[110px]">Size</th>
                <th className="py-3 px-4 font-semibold w-24">Quantity</th>
                <th className="py-3 px-4 font-semibold text-right">Wholesale Unit</th>
                <th className="py-3 px-4 font-semibold text-right">Line Total</th>
                <th className="py-3 px-4 font-semibold text-center w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {calculatedRows.map((row, index) => (
                <tr key={row.id} className="hover:bg-[var(--bg-secondary)]/40 transition-colors">
                  <td className="py-3 px-4 font-mono text-[var(--text-muted)]">{index + 1}</td>

                  {/* Product selector */}
                  <td className="py-3 px-4">
                    <select
                      value={row.productId}
                      onChange={(e) => updateRow(row.id, { productId: e.target.value })}
                      aria-label="Select product SKU"
                      className="w-full rounded border border-[var(--border-color)] bg-[var(--bg-primary)] px-2.5 py-1.5 text-xs text-[var(--text-primary)] focus:border-[var(--color-noir-gold)] focus:outline-none"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} — {formatPrice(getWholesalePrice(p.price), currentCurrency)} ({p.stock} in stock)
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Color selector */}
                  <td className="py-3 px-4">
                    {row.product.colors && row.product.colors.length > 0 ? (
                      <select
                        value={row.selectedColor || row.product.colors[0]?.name}
                        onChange={(e) => updateRow(row.id, { selectedColor: e.target.value })}
                        aria-label="Select color variant"
                        className="w-full rounded border border-[var(--border-color)] bg-[var(--bg-primary)] px-2.5 py-1.5 text-xs text-[var(--text-primary)] focus:border-[var(--color-noir-gold)] focus:outline-none"
                      >
                        {row.product.colors.map((c) => (
                          <option key={c.slug} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-[var(--text-muted)] text-[11px]">Standard</span>
                    )}
                  </td>

                  {/* Size selector */}
                  <td className="py-3 px-4">
                    {row.product.sizes && row.product.sizes.length > 0 ? (
                      <select
                        value={row.selectedSize || row.product.sizes[0]?.label}
                        onChange={(e) => updateRow(row.id, { selectedSize: e.target.value })}
                        aria-label="Select size variant"
                        className="w-full rounded border border-[var(--border-color)] bg-[var(--bg-primary)] px-2.5 py-1.5 text-xs text-[var(--text-primary)] focus:border-[var(--color-noir-gold)] focus:outline-none"
                      >
                        {row.product.sizes.map((s) => (
                          <option key={s.slug} value={s.label}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-[var(--text-muted)] text-[11px]">One Size</span>
                    )}
                  </td>

                  {/* Quantity input */}
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      min={1}
                      max={row.product.stock * 5}
                      value={row.quantity}
                      onChange={(e) => updateRow(row.id, { quantity: Math.max(1, parseInt(e.target.value) || 1) })}
                      aria-label="Line quantity"
                      className="w-20 rounded border border-[var(--border-color)] bg-[var(--bg-primary)] px-2 py-1.5 text-center font-mono text-xs font-bold text-[var(--text-primary)] focus:border-[var(--color-noir-gold)] focus:outline-none"
                    />
                  </td>

                  {/* Wholesale Unit Price */}
                  <td className="py-3 px-4 text-right font-mono font-semibold text-[var(--color-noir-gold)]">
                    {formatPrice(row.wholesaleUnitPrice, currentCurrency)}
                  </td>

                  {/* Line Total */}
                  <td className="py-3 px-4 text-right font-mono font-bold text-[var(--text-primary)]">
                    {formatPrice(row.wholesaleTotal, currentCurrency)}
                  </td>

                  {/* Remove row */}
                  <td className="py-3 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => removeRow(row.id)}
                      aria-label="Remove line"
                      className="text-[var(--text-muted)] hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ─── Footer Calculation Summary ─── */}
        <div className="border-t border-[var(--border-color)] bg-[var(--bg-secondary)] p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Button onClick={addRow} variant="outline" size="sm">
                <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Another Line
              </Button>
              <span className="text-xs text-[var(--text-muted)]">
                Lines: {calculatedRows.length} &bull; Total Pieces: {totalUnits} units
              </span>
            </div>

            <div className="flex flex-col sm:items-end gap-1">
              <div className="flex items-center gap-4 text-xs">
                <span className="text-[var(--text-muted)]">Wholesale Savings:</span>
                <span className="font-mono font-bold text-emerald-500">
                  -{formatPrice(totalSavings, currentCurrency)} ({discountPercent}% off MSRP)
                </span>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-xs font-semibold uppercase text-[var(--text-primary)]">
                  Total Wholesale Batch:
                </span>
                <span className="font-mono text-2xl font-extrabold text-[var(--color-noir-gold)]">
                  {formatPrice(grandTotalWholesale, currentCurrency)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button onClick={handleAddAllToCart} variant="primary" size="lg" className="w-full sm:w-auto">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Add All {totalUnits} Units to Wholesale Cart ({formatPrice(grandTotalWholesale, currentCurrency)})
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
