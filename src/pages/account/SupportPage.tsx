import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MessageSquare, Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToastStore } from '@/store/toastStore';
import { useSeo } from '@/hooks/useSeo';
import { useReducedMotion } from '@/hooks/useUi';

export default function SupportPage() {
  useSeo({
    title: 'Client Concierge & Support',
    description: 'Direct communication with NOIR & CO. styling advisors and private client services.',
  });

  const reduceMotion = useReducedMotion();
  const toast = useToastStore();
  const [topic, setTopic] = useState('order_inquiry');
  const [message, setMessage] = useState('');
  const [orderRef, setOrderRef] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setMessage('');
      setOrderRef('');
      toast.success('Inquiry received', 'Your concierge advisor will respond within 4 hours.');
    }, 600);
  };

  return (
    <motion.div
      initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div>
        <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
          Dedicated Services
        </p>
        <h2 className="mt-1 font-heading text-2xl font-bold text-[var(--text-primary)]">
          Client Concierge
        </h2>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <div className="border border-[var(--border-color)] bg-[var(--bg-card)] p-6">
          <Phone className="h-5 w-5 text-[var(--color-noir-gold)]" />
          <h3 className="mt-3 font-heading text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
            Private Client Desk
          </h3>
          <p className="mt-1 text-xs text-[var(--text-muted)]">Direct toll-free line</p>
          <p className="mt-3 font-heading text-sm font-bold text-[var(--text-primary)]">
            +1 (800) 555-NOIR
          </p>
          <p className="mt-1 text-[11px] text-[var(--text-muted)]">Mon - Sat, 9am - 8pm EST</p>
        </div>

        <div className="border border-[var(--border-color)] bg-[var(--bg-card)] p-6">
          <Mail className="h-5 w-5 text-[var(--color-noir-gold)]" />
          <h3 className="mt-3 font-heading text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
            Bespoke Inquiries
          </h3>
          <p className="mt-1 text-xs text-[var(--text-muted)]">Written response &amp; sizing</p>
          <p className="mt-3 font-heading text-sm font-bold text-[var(--text-primary)]">
            concierge@noir-co.com
          </p>
          <p className="mt-1 text-[11px] text-[var(--text-muted)]">Guaranteed response &lt; 4 hrs</p>
        </div>

        <div className="border border-[var(--border-color)] bg-[var(--bg-card)] p-6">
          <MessageSquare className="h-5 w-5 text-[var(--color-noir-gold)]" />
          <h3 className="mt-3 font-heading text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
            Private Styling Salon
          </h3>
          <p className="mt-1 text-xs text-[var(--text-muted)]">Virtual wardrobe consultation</p>
          <p className="mt-3 font-heading text-sm font-bold text-[var(--text-primary)]">
            Available on demand
          </p>
          <p className="mt-1 text-[11px] text-[var(--text-muted)]">For verified VIP tier members</p>
        </div>
      </div>

      {/* Inquiry Form */}
      <div className="border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-8">
        <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-[var(--text-primary)]">
          Send an Inquiry to Our Atelier
        </h3>
        <p className="mt-1 text-xs text-[var(--text-secondary)]">
          Our senior wardrobe specialists and logistics team are at your complete disposal.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                Inquiry Topic
              </label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-xs text-[var(--text-primary)]"
              >
                <option value="order_inquiry">Order Status / Delivery Questions</option>
                <option value="size_guidance">Atelier Fit &amp; Size Consultation</option>
                <option value="returns_care">Returns, Exchanges &amp; Garment Care</option>
                <option value="vip_appointment">Private Appointment Booking</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                Order Reference (Optional)
              </label>
              <Input
                value={orderRef}
                onChange={(e) => setOrderRef(e.target.value)}
                placeholder="e.g. NC-2024-8842"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
              Your Message
            </label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="How may our concierge assist your experience today?"
              className="w-full border border-[var(--border-color)] bg-[var(--bg-primary)] p-3 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--color-noir-gold)]"
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="gap-2 uppercase tracking-wider">
            <Send className="h-4 w-4" />
            {isSubmitting ? 'Sending...' : 'Transmit Inquiry'}
          </Button>
        </form>
      </div>
    </motion.div>
  );
}
