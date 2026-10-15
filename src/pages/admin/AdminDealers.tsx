import { useState, useMemo } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  Building2,
  CreditCard,
  Plus,
  Edit2,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useDealerStore } from '@/store/dealerStore';
import { useCurrencyStore } from '@/store/currencyStore';
import { useToastStore } from '@/store/toastStore';
import { formatPrice } from '@/utils/format';
import { useSeo } from '@/hooks/useSeo';
import type { DealerProfile, DealerTier, PaymentTerms } from '@/types';

export default function AdminDealers() {
  useSeo({
    title: 'Dealer & Wholesale Management | Admin Console',
    description: 'Review B2B dealer applications, configure wholesale discount tiers, credit lines, and corporate payment terms.',
  });

  const { dealers, approveDealer, rejectDealer, applyForDealer } = useDealerStore();
  const { currentCurrency } = useCurrencyStore();
  const toast = useToastStore();

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Modals
  const [approvingDealer, setApprovingDealer] = useState<DealerProfile | null>(null);
  const [selectedTier, setSelectedTier] = useState<DealerTier>('silver');
  const [selectedDiscount, setSelectedDiscount] = useState<number>(0.25);
  const [selectedCredit, setSelectedCredit] = useState<number>(25000);
  const [selectedTerms, setSelectedTerms] = useState<PaymentTerms>('net30');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCompany, setNewCompany] = useState('');
  const [newTaxId, setNewTaxId] = useState('');
  const [newContact, setNewContact] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');

  // Statistics
  const totalDealers = dealers.length;
  const pendingCount = dealers.filter((d) => d.status === 'pending').length;
  const approvedCount = dealers.filter((d) => d.status === 'approved').length;
  const totalCreditAllocated = dealers
    .filter((d) => d.status === 'approved')
    .reduce((sum, d) => sum + d.creditLimit, 0);

  // Filtered & paginated dealers
  const filteredDealers = useMemo(() => {
    return dealers.filter((d) => {
      const matchesTab = activeTab === 'all' || d.status === activeTab;
      const matchesSearch =
        !search ||
        d.companyName.toLowerCase().includes(search.toLowerCase()) ||
        d.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
        d.email.toLowerCase().includes(search.toLowerCase()) ||
        d.taxId.toLowerCase().includes(search.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [dealers, activeTab, search]);

  const totalFiltered = filteredDealers.length;
  const totalPages = Math.ceil(totalFiltered / pageSize) || 1;
  const paginatedDealers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredDealers.slice(start, start + pageSize);
  }, [filteredDealers, currentPage, pageSize]);

  const handleOpenApprove = (dealer: DealerProfile) => {
    setApprovingDealer(dealer);
    setSelectedTier(dealer.tier || 'silver');
    setSelectedDiscount(dealer.discountRate || 0.25);
    setSelectedCredit(dealer.creditLimit || 25000);
    setSelectedTerms(dealer.paymentTerms || 'net30');
  };

  const handleConfirmApproval = () => {
    if (!approvingDealer) return;
    approveDealer(approvingDealer.id, selectedTier, selectedDiscount, selectedCredit, selectedTerms);
    toast.success(
      'Dealer Approved',
      `${approvingDealer.companyName} has been approved as a ${selectedTier.toUpperCase()} tier partner.`
    );
    setApprovingDealer(null);
  };

  const handleReject = (dealer: DealerProfile) => {
    const reason = window.prompt(`Enter rejection note for ${dealer.companyName} (optional):`);
    if (reason !== null) {
      rejectDealer(dealer.id, reason);
      toast.info('Application Rejected', `${dealer.companyName} was updated to rejected.`);
    }
  };

  const handleCreateDealer = (e: React.FormEvent) => {
    e.preventDefault();
    applyForDealer({
      companyName: newCompany,
      businessType: 'boutique',
      taxId: newTaxId,
      contactPerson: newContact,
      email: newEmail,
      phone: newPhone,
      address: '100 Commercial Way',
      city: 'Metropolis',
      state: 'NY',
      country: 'United States',
    });

    toast.success('Dealer Created', `${newCompany} added to registry.`);
    setIsAddModalOpen(false);
    setNewCompany('');
    setNewTaxId('');
    setNewContact('');
    setNewEmail('');
    setNewPhone('');
  };

  const tierColors: Record<string, string> = {
    gold: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
    silver: 'bg-slate-300/10 text-slate-300 border-slate-300/30',
    bronze: 'bg-orange-500/10 text-orange-500 border-orange-500/30',
  };

  return (
    <div className="space-y-6">
      {/* ─── Header ─── */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--color-noir-gold)]">
            Wholesale Network Administration
          </span>
          <h1 className="font-heading text-2xl font-bold text-[var(--text-primary)]">
            Dealer &amp; B2B Partner Management
          </h1>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">
            Approve retailer applications, assign margin discount tiers, and manage credit lines.
          </p>
        </div>

        <Button onClick={() => setIsAddModalOpen(true)} variant="primary" size="sm">
          <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Partner
        </Button>
      </div>

      {/* ─── Metric Cards ─── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
            <span>Total Registered</span>
            <Building2 className="h-4 w-4 text-[var(--color-noir-gold)]" />
          </div>
          <p className="mt-2 font-heading text-2xl font-extrabold text-[var(--text-primary)]">
            {totalDealers} Partners
          </p>
          <p className="mt-1 text-[11px] text-[var(--text-muted)]">Verified retail &amp; corporate buyers</p>
        </div>

        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
            <span>Pending Approvals</span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <p className="mt-2 font-heading text-2xl font-extrabold text-amber-500">
            {pendingCount} Awaiting
          </p>
          <p className="mt-1 text-[11px] text-[var(--text-muted)]">New dealer applications</p>
        </div>

        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
            <span>Approved Partners</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="mt-2 font-heading text-2xl font-extrabold text-emerald-500">
            {approvedCount} Active
          </p>
          <p className="mt-1 text-[11px] text-[var(--text-muted)]">Enabled for wholesale purchasing</p>
        </div>

        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
            <span>Revolving Credit Line</span>
            <CreditCard className="h-4 w-4 text-blue-400" />
          </div>
          <p className="mt-2 font-heading text-2xl font-extrabold text-[var(--text-primary)]">
            {formatPrice(totalCreditAllocated, currentCurrency)}
          </p>
          <p className="mt-1 text-[11px] text-[var(--text-muted)]">Net-30 / Net-60 terms allocated</p>
        </div>
      </div>

      {/* ─── Filters & Search ─── */}
      <div className="flex flex-col gap-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setCurrentPage(1);
              }}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                activeTab === tab
                  ? 'bg-[var(--color-noir-gold)] text-black'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {tab} {tab === 'pending' && pendingCount > 0 && `(${pendingCount})`}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search company, tax ID, email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-md border border-[var(--border-color)] bg-[var(--bg-primary)] py-1.5 pl-8 pr-3 text-xs text-[var(--text-primary)] focus:border-[var(--color-noir-gold)] focus:outline-none"
          />
        </div>
      </div>

      {/* ─── Dealers Table ─── */}
      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[var(--border-color)] bg-[var(--bg-secondary)] text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
              <tr>
                <th className="py-3 px-4 font-semibold">Company &amp; Tax ID</th>
                <th className="py-3 px-4 font-semibold">Contact Person</th>
                <th className="py-3 px-4 font-semibold">Tier &amp; Margin</th>
                <th className="py-3 px-4 font-semibold">Credit Facility</th>
                <th className="py-3 px-4 font-semibold">Payment Terms</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {paginatedDealers.map((dealer) => {
                const discountPct = Math.round(dealer.discountRate * 100);
                return (
                  <tr key={dealer.id} className="hover:bg-[var(--bg-secondary)]/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-[var(--text-primary)]">{dealer.companyName}</div>
                      <div className="font-mono text-[10px] text-[var(--text-muted)]">
                        Tax ID: {dealer.taxId} &bull; {dealer.businessType}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-medium text-[var(--text-primary)]">{dealer.contactPerson}</div>
                      <div className="text-[10px] text-[var(--text-muted)]">{dealer.email}</div>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`rounded border px-2 py-0.5 text-[10px] font-bold uppercase font-mono ${
                          tierColors[dealer.tier] || tierColors.bronze
                        }`}
                      >
                        {dealer.tier?.toUpperCase()} ({discountPct}% OFF)
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono">
                      <span className="font-bold text-[var(--text-primary)]">
                        {formatPrice(dealer.creditLimit, currentCurrency)}
                      </span>
                      {dealer.creditUsed > 0 && (
                        <span className="block text-[10px] text-amber-500">
                          {formatPrice(dealer.creditUsed, currentCurrency)} used
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 uppercase text-[var(--text-secondary)] font-medium">
                      {dealer.paymentTerms}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                          dealer.status === 'approved'
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : dealer.status === 'pending'
                            ? 'bg-amber-500/10 text-amber-500 animate-pulse'
                            : 'bg-red-500/10 text-red-400'
                        }`}
                      >
                        {dealer.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {dealer.status === 'pending' ? (
                          <>
                            <Button
                              onClick={() => handleOpenApprove(dealer)}
                              variant="primary"
                              size="sm"
                              className="h-7 text-[11px] px-2.5"
                            >
                              Approve
                            </Button>
                            <Button
                              onClick={() => handleReject(dealer)}
                              variant="outline"
                              size="sm"
                              className="h-7 text-[11px] px-2 text-red-400 hover:text-red-300"
                            >
                              Reject
                            </Button>
                          </>
                        ) : (
                          <Button
                            onClick={() => handleOpenApprove(dealer)}
                            variant="outline"
                            size="sm"
                            className="h-7 text-[11px] px-2.5"
                          >
                            <Edit2 className="mr-1 h-3 w-3" /> Edit Terms
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ─── Pagination ─── */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-[var(--border-color)] p-4 sm:flex-row">
          <p className="text-xs text-[var(--text-secondary)]">
            Showing <span className="font-semibold text-[var(--text-primary)]">{(currentPage - 1) * pageSize + 1}</span> to{' '}
            <span className="font-semibold text-[var(--text-primary)]">
              {Math.min(currentPage * pageSize, totalFiltered)}
            </span>{' '}
            of <span className="font-semibold text-[var(--text-primary)]">{totalFiltered}</span> partners
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="mr-1 h-3.5 w-3.5" />
              Previous
            </Button>
            <span className="text-xs text-[var(--text-muted)] font-mono">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* ─── Approval / Edit Modal ─── */}
      {approvingDealer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
              <div>
                <h3 className="font-heading text-lg font-bold text-[var(--text-primary)]">
                  Configure Dealer Terms
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">{approvingDealer.companyName}</p>
              </div>
              <button
                type="button"
                onClick={() => setApprovingDealer(null)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              {/* Tier Selection */}
              <div>
                <label className="mb-1 block font-semibold text-[var(--text-secondary)]">Wholesale Tier</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { tier: 'bronze' as DealerTier, discount: 0.15, label: 'Bronze (15%)' },
                    { tier: 'silver' as DealerTier, discount: 0.25, label: 'Silver (25%)' },
                    { tier: 'gold' as DealerTier, discount: 0.35, label: 'Gold (35%)' },
                  ].map((t) => (
                    <button
                      key={t.tier}
                      type="button"
                      onClick={() => {
                        setSelectedTier(t.tier);
                        setSelectedDiscount(t.discount);
                      }}
                      className={`rounded-lg border p-2 text-center transition-colors ${
                        selectedTier === t.tier
                          ? 'border-[var(--color-noir-gold)] bg-[var(--color-noir-gold)]/10 text-[var(--color-noir-gold)] font-bold'
                          : 'border-[var(--border-color)] text-[var(--text-secondary)]'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Credit Limit */}
              <div>
                <label className="mb-1 block font-semibold text-[var(--text-secondary)]">
                  Credit Facility Line ({currentCurrency})
                </label>
                <input
                  type="number"
                  step={5000}
                  value={selectedCredit}
                  onChange={(e) => setSelectedCredit(parseInt(e.target.value) || 0)}
                  className="w-full rounded border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 font-mono text-xs text-[var(--text-primary)] focus:border-[var(--color-noir-gold)] focus:outline-none"
                />
              </div>

              {/* Payment Terms */}
              <div>
                <label className="mb-1 block font-semibold text-[var(--text-secondary)]">Payment Terms</label>
                <select
                  value={selectedTerms}
                  onChange={(e) => setSelectedTerms(e.target.value as PaymentTerms)}
                  className="w-full rounded border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--color-noir-gold)] focus:outline-none"
                >
                  <option value="net30">Net-30 Commercial Terms (Standard)</option>
                  <option value="net60">Net-60 Commercial Terms (Flagship Distributors)</option>
                  <option value="prepaid">Prepaid / Wire Prior to Dispatch</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t border-[var(--border-color)] pt-4">
              <Button onClick={() => setApprovingDealer(null)} variant="outline" size="sm">
                Cancel
              </Button>
              <Button onClick={handleConfirmApproval} variant="primary" size="sm">
                Save &amp; Activate Terms
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Add Partner Modal ─── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
              <h3 className="font-heading text-lg font-bold text-[var(--text-primary)]">
                Register New Partner
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDealer} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="mb-1 block font-semibold text-[var(--text-secondary)]">Company Legal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Milan Prestige Goods Srl"
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  className="w-full rounded border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--color-noir-gold)] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block font-semibold text-[var(--text-secondary)]">Tax ID / VAT / GSTIN</label>
                <input
                  type="text"
                  required
                  placeholder="IT-VAT-998822001"
                  value={newTaxId}
                  onChange={(e) => setNewTaxId(e.target.value)}
                  className="w-full rounded border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 font-mono text-xs text-[var(--text-primary)] focus:border-[var(--color-noir-gold)] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block font-semibold text-[var(--text-secondary)]">Contact Person</label>
                <input
                  type="text"
                  required
                  placeholder="Matteo Rossi"
                  value={newContact}
                  onChange={(e) => setNewContact(e.target.value)}
                  className="w-full rounded border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--color-noir-gold)] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block font-semibold text-[var(--text-secondary)]">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="orders@milanprestige.it"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full rounded border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--color-noir-gold)] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block font-semibold text-[var(--text-secondary)]">Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="+39 02 8849 2011"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full rounded border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--color-noir-gold)] focus:outline-none"
                />
              </div>

              <div className="mt-6 flex justify-end gap-2 border-t border-[var(--border-color)] pt-4">
                <Button onClick={() => setIsAddModalOpen(false)} variant="outline" size="sm">
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Create Partner
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
