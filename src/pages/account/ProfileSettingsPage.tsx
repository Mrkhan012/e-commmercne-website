import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import { useUserStore } from '@/store/userStore';
import { useToastStore } from '@/store/toastStore';
import { useSeo } from '@/hooks/useSeo';
import { useReducedMotion } from '@/hooks/useUi';

export default function ProfileSettingsPage() {
  useSeo({
    title: 'Profile & Settings',
    description: 'Update your personal details, concierge preferences, and security settings.',
  });

  const reduceMotion = useReducedMotion();
  const { user, updateProfile, updatePreferences } = useUserStore();
  const toast = useToastStore();

  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');

  const [newsletter, setNewsletter] = useState(user?.preferences?.newsletter ?? true);
  const [smsOffers, setSmsOffers] = useState(user?.preferences?.smsOffers ?? false);
  const [notifications, setNotifications] = useState(user?.preferences?.notifications ?? true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ firstName, lastName, email, phone });
    updatePreferences({ newsletter, smsOffers, notifications });
    toast.success('Profile saved', 'Your account preferences have been updated.');
  };

  return (
    <motion.div
      initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div>
        <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
          Account Settings
        </p>
        <h2 className="mt-1 font-heading text-2xl font-bold text-[var(--text-primary)]">
          Profile &amp; Preferences
        </h2>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Personal Info */}
        <div className="border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-8">
          <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-[var(--text-primary)]">
            Personal Information
          </h3>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block font-heading text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                First Name
              </label>
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
              />
            </div>
            <div>
              <label className="mb-1.5 block font-heading text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Last Name
              </label>
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
              />
            </div>
            <div>
              <label className="mb-1.5 block font-heading text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Email Address
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
              />
            </div>
            <div>
              <label className="mb-1.5 block font-heading text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Phone Number
              </label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>
        </div>

        {/* Communication Preferences */}
        <div className="border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-8">
          <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-[var(--text-primary)]">
            Concierge &amp; Communications
          </h3>
          <div className="mt-6 space-y-4">
            <Checkbox
              id="pref-newsletter"
              checked={newsletter}
              onChange={(e) => setNewsletter(e.target.checked)}
              label="The NOIR Gazette — Seasonal previews, lookbooks, and private collection drops."
            />
            <Checkbox
              id="pref-notifications"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              label="Order & Dispatch Notifications — Real-time tracking alerts via email."
            />
            <Checkbox
              id="pref-sms"
              checked={smsOffers}
              onChange={(e) => setSmsOffers(e.target.checked)}
              label="Private VIP Text Concierge — Invitation to private runway viewings and salons."
            />
          </div>
        </div>

        <div>
          <Button type="submit" size="lg" className="uppercase tracking-[0.2em]">
            Save Changes
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
