import { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, MapPin, Trash2, Home, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Dialog } from '@/components/ui/Dialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { useUserStore } from '@/store/userStore';
import { useToastStore } from '@/store/toastStore';
import { useSeo } from '@/hooks/useSeo';
import { useReducedMotion } from '@/hooks/useUi';
import type { Address } from '@/types';

export default function AddressesPage() {
  useSeo({
    title: 'Saved Addresses',
    description: 'Manage shipping and billing locations for streamlined checkout.',
  });

  const reduceMotion = useReducedMotion();
  const { addresses, addAddress, removeAddress, setDefaultAddress } = useUserStore();
  const toast = useToastStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<Address, 'id'>>({
    label: 'home',
    firstName: '',
    lastName: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
    phone: '',
    isDefault: false,
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.line1 || !formData.city || !formData.zip) {
      toast.error('Missing fields', 'Please complete all required address fields.');
      return;
    }

    addAddress(formData);
    toast.success('Address saved', 'The new shipping address is now registered.');
    setIsModalOpen(false);
    setFormData({
      label: 'home',
      firstName: '',
      lastName: '',
      line1: '',
      line2: '',
      city: '',
      state: '',
      zip: '',
      country: 'United States',
      phone: '',
      isDefault: false,
    });
  };

  return (
    <motion.div
      initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
            Delivery Destinations
          </p>
          <h2 className="mt-1 font-heading text-2xl font-bold text-[var(--text-primary)]">
            Saved Addresses
          </h2>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2 uppercase tracking-wider">
          <Plus className="h-4 w-4" />
          Add Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <EmptyState
          icon={<MapPin className="h-10 w-10 text-[var(--color-noir-gold)]" />}
          title="No addresses on file"
          message="Save your primary residence or international pied-à-terre for expedited delivery."
          action={
            <Button onClick={() => setIsModalOpen(true)}>Add Your First Address</Button>
          }
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`flex flex-col justify-between border p-6 transition-all ${
                addr.isDefault
                  ? 'border-[var(--color-noir-gold)] bg-[var(--bg-card)]'
                  : 'border-[var(--border-color)] bg-[var(--bg-card)]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {addr.label === 'work' ? (
                      <Briefcase className="h-4 w-4 text-[var(--text-muted)]" />
                    ) : (
                      <Home className="h-4 w-4 text-[var(--text-muted)]" />
                    )}
                    <span className="font-heading text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                      {addr.label}
                    </span>
                  </div>
                  {addr.isDefault && (
                    <Badge variant="gold">
                      Default
                    </Badge>
                  )}
                </div>

                <div className="mt-4 text-xs leading-relaxed text-[var(--text-secondary)]">
                  <p className="font-semibold text-[var(--text-primary)]">
                    {addr.firstName} {addr.lastName}
                  </p>
                  <p>{addr.line1}</p>
                  {addr.line2 && <p>{addr.line2}</p>}
                  <p>
                    {addr.city}, {addr.state} {addr.zip}
                  </p>
                  <p>{addr.country}</p>
                  {addr.phone && <p className="mt-2 text-[var(--text-muted)]">{addr.phone}</p>}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-[var(--border-color)] pt-4">
                {!addr.isDefault ? (
                  <button
                    type="button"
                    onClick={() => {
                      setDefaultAddress(addr.id);
                      toast.success('Default updated', 'This address is now default.');
                    }}
                    className="text-xs font-semibold uppercase tracking-wider text-[var(--color-noir-gold)] hover:underline"
                  >
                    Set as Default
                  </button>
                ) : (
                  <span className="text-xs text-[var(--text-muted)]">Primary destination</span>
                )}

                <button
                  type="button"
                  onClick={() => {
                    removeAddress(addr.id);
                    toast.info('Address removed', 'Address has been deleted from your account.');
                  }}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Address Modal Dialog */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Delivery Address"
        description="Enter the address details for priority white-glove courier deliveries."
        size="lg"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                Address Type
              </label>
              <select
                value={formData.label}
                onChange={(e) =>
                  setFormData({ ...formData, label: e.target.value as 'home' | 'work' | 'other' })
                }
                className="w-full border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-xs text-[var(--text-primary)]"
              >
                <option value="home">Home</option>
                <option value="work">Office / Work</option>
                <option value="other">Other / Residence</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                Phone
              </label>
              <Input
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                First Name
              </label>
              <Input
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                Last Name
              </label>
              <Input
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
              Street Address
            </label>
            <Input
              required
              value={formData.line1}
              onChange={(e) => setFormData({ ...formData, line1: e.target.value })}
              placeholder="123 Luxury Way"
            />
          </div>

          <div>
            <label className="mb-1 block font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
              Apartment, Suite (Optional)
            </label>
            <Input
              value={formData.line2 || ''}
              onChange={(e) => setFormData({ ...formData, line2: e.target.value })}
              placeholder="Suite 400"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="mb-1 block font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                City
              </label>
              <Input
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                State / Region
              </label>
              <Input
                required
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                Postal Code
              </label>
              <Input
                required
                value={formData.zip}
                onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Address</Button>
          </div>
        </form>
      </Dialog>
    </motion.div>
  );
}
