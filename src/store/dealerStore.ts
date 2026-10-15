import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DealerProfile, DealerTier, PaymentTerms, RFQRequest } from '@/types';

interface DealerState {
  dealers: DealerProfile[];
  rfqRequests: RFQRequest[];
  // Actions
  applyForDealer: (
    data: Omit<DealerProfile, 'id' | 'status' | 'appliedAt' | 'creditUsed' | 'tier' | 'discountRate' | 'creditLimit' | 'paymentTerms' | 'minOrderQuantity'> & {
      notes?: string;
    }
  ) => DealerProfile;
  approveDealer: (
    id: string,
    tier: DealerTier,
    discountRate: number,
    creditLimit: number,
    paymentTerms: PaymentTerms
  ) => void;
  rejectDealer: (id: string, reason?: string) => void;
  updateDealer: (id: string, updates: Partial<DealerProfile>) => void;
  submitRFQ: (data: Omit<RFQRequest, 'id' | 'status' | 'createdAt'>) => RFQRequest;
  updateRFQStatus: (id: string, status: RFQRequest['status'], quoteAmount?: number) => void;
  getDealer: (id: string) => DealerProfile | undefined;
  getDealerByEmail: (email: string) => DealerProfile | undefined;
}

const INITIAL_DEALERS: DealerProfile[] = [
  {
    id: 'dealer-001',
    companyName: 'Apex Luxury Retailing Ltd.',
    businessType: 'distributor',
    taxId: 'US-EIN-948271034',
    website: 'https://apexluxury.example.com',
    contactPerson: 'Jonathan Vance',
    phone: '+1 (212) 555-8921',
    email: 'dealer@example.com',
    address: '450 Lexington Avenue, Suite 2200',
    city: 'New York',
    state: 'NY',
    country: 'United States',
    tier: 'gold',
    discountRate: 0.35, // 35% wholesale discount
    creditLimit: 50000,
    creditUsed: 14200,
    paymentTerms: 'net30',
    status: 'approved',
    expectedMonthlyVolume: '$20,000 - $50,000',
    minOrderQuantity: 10,
    notes: 'Premium flagship dealer across Manhattan & Hamptons stores.',
    appliedAt: '2025-08-14T10:00:00.000Z',
    approvedAt: '2025-08-16T14:30:00.000Z',
  },
  {
    id: 'dealer-002',
    companyName: 'Riviera High-Street Boutiques',
    businessType: 'boutique',
    taxId: 'FR-VAT-884920194',
    website: 'https://rivieraboutiques.example.fr',
    contactPerson: 'Camille Dubois',
    phone: '+33 1 42 68 55 00',
    email: 'orders@rivieraboutiques.fr',
    address: '18 Rue du Faubourg Saint-Honoré',
    city: 'Paris',
    state: 'Île-de-France',
    country: 'France',
    tier: 'silver',
    discountRate: 0.25, // 25% wholesale discount
    creditLimit: 25000,
    creditUsed: 6800,
    paymentTerms: 'net30',
    status: 'approved',
    expectedMonthlyVolume: '$10,000 - $20,000',
    minOrderQuantity: 5,
    notes: 'Curated luxury apparel & leather goods boutique chain.',
    appliedAt: '2025-09-02T09:15:00.000Z',
    approvedAt: '2025-09-04T11:00:00.000Z',
  },
  {
    id: 'dealer-003',
    companyName: 'Nordic Prime Imports AB',
    businessType: 'retailer',
    taxId: 'SE-5561234567',
    website: 'https://nordicprime.example.se',
    contactPerson: 'Lars Lindqvist',
    phone: '+46 8 123 4567',
    email: 'b2b@nordicprime.se',
    address: 'Kungsgatan 14',
    city: 'Stockholm',
    state: 'Stockholm',
    country: 'Sweden',
    tier: 'bronze',
    discountRate: 0.15, // 15% wholesale discount
    creditLimit: 10000,
    creditUsed: 2100,
    paymentTerms: 'prepaid',
    status: 'approved',
    expectedMonthlyVolume: '$5,000 - $10,000',
    minOrderQuantity: 3,
    notes: 'Scandinavian department store supplier.',
    appliedAt: '2025-10-10T16:20:00.000Z',
    approvedAt: '2025-10-12T09:00:00.000Z',
  },
  {
    id: 'dealer-004',
    companyName: 'Sovereign Department Stores',
    businessType: 'retailer',
    taxId: 'GB-VAT-902184912',
    website: 'https://sovereigndepartment.example.co.uk',
    contactPerson: 'Alistair Sterling',
    phone: '+44 20 7946 0912',
    email: 'procurement@sovereignstores.co.uk',
    address: '88 Regent Street',
    city: 'London',
    state: 'Greater London',
    country: 'United Kingdom',
    tier: 'bronze',
    discountRate: 0.15,
    creditLimit: 20000,
    creditUsed: 0,
    paymentTerms: 'net30',
    status: 'pending',
    expectedMonthlyVolume: '$25,000+',
    minOrderQuantity: 10,
    notes: 'Flagship retailer expanding ready-to-wear luxury accessories catalog.',
    appliedAt: '2026-03-20T11:45:00.000Z',
  },
  {
    id: 'dealer-005',
    companyName: 'Kensington Corporate Gifting',
    businessType: 'corporate',
    taxId: 'AE-TRN-100293847500003',
    website: 'https://kensingtongifts.example.ae',
    contactPerson: 'Tariq Al-Mansoor',
    phone: '+971 4 312 9900',
    email: 'sales@kensingtongifts.ae',
    address: 'DIFC Gate Precinct 4',
    city: 'Dubai',
    state: 'Dubai',
    country: 'United Arab Emirates',
    tier: 'silver',
    discountRate: 0.25,
    creditLimit: 30000,
    creditUsed: 0,
    paymentTerms: 'net30',
    status: 'pending',
    expectedMonthlyVolume: '$15,000 - $30,000',
    minOrderQuantity: 10,
    notes: 'Corporate gift hampers and bespoke VIP merchandise orders.',
    appliedAt: '2026-04-01T08:30:00.000Z',
  },
];

const INITIAL_RFQS: RFQRequest[] = [
  {
    id: 'rfq-101',
    dealerId: 'dealer-001',
    companyName: 'Apex Luxury Retailing Ltd.',
    contactName: 'Jonathan Vance',
    email: 'dealer@example.com',
    phone: '+1 (212) 555-8921',
    productId: 'prod-004',
    productName: 'Cashmere Crewneck Sweater',
    requestedQuantity: 120,
    targetPrice: 220,
    notes: 'Holiday season restock for NYC stores. Need batch delivery by Nov 15.',
    status: 'quoted',
    createdAt: '2026-04-02T10:00:00.000Z',
    quoteAmount: 26400,
  },
];

export const useDealerStore = create<DealerState>()(
  persist(
    (set, get) => ({
      dealers: INITIAL_DEALERS,
      rfqRequests: INITIAL_RFQS,

      applyForDealer: (data) => {
        const id = `dealer-${Date.now().toString(36)}`;
        const newDealer: DealerProfile = {
          ...data,
          id,
          tier: 'bronze',
          discountRate: 0.15,
          creditLimit: 10000,
          creditUsed: 0,
          paymentTerms: 'prepaid',
          minOrderQuantity: 5,
          status: 'pending',
          appliedAt: new Date().toISOString(),
        };

        set((state) => ({
          dealers: [newDealer, ...state.dealers],
        }));

        return newDealer;
      },

      approveDealer: (id, tier, discountRate, creditLimit, paymentTerms) =>
        set((state) => ({
          dealers: state.dealers.map((d) =>
            d.id === id
              ? {
                  ...d,
                  status: 'approved',
                  tier,
                  discountRate,
                  creditLimit,
                  paymentTerms,
                  approvedAt: new Date().toISOString(),
                }
              : d
          ),
        })),

      rejectDealer: (id, reason) =>
        set((state) => ({
          dealers: state.dealers.map((d) =>
            d.id === id
              ? {
                  ...d,
                  status: 'rejected',
                  notes: reason ? `${d.notes ? `${d.notes} | ` : ''}Rejection reason: ${reason}` : d.notes,
                }
              : d
          ),
        })),

      updateDealer: (id, updates) =>
        set((state) => ({
          dealers: state.dealers.map((d) => (d.id === id ? { ...d, ...updates } : d)),
        })),

      submitRFQ: (data) => {
        const id = `rfq-${Date.now().toString(36)}`;
        const newRFQ: RFQRequest = {
          ...data,
          id,
          status: 'pending',
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          rfqRequests: [newRFQ, ...state.rfqRequests],
        }));

        return newRFQ;
      },

      updateRFQStatus: (id, status, quoteAmount) =>
        set((state) => ({
          rfqRequests: state.rfqRequests.map((r) =>
            r.id === id ? { ...r, status, quoteAmount: quoteAmount ?? r.quoteAmount } : r
          ),
        })),

      getDealer: (id) => get().dealers.find((d) => d.id === id),

      getDealerByEmail: (email) =>
        get().dealers.find((d) => d.email.toLowerCase() === email.toLowerCase()),
    }),
    {
      name: 'afro_dealer_store',
    }
  )
);
