import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, CheckCircle2 } from 'lucide-react';
import AuthLayout, { AuthDemoNote } from './AuthLayout';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { authService } from '@/services/authService';
import { useToastStore } from '@/store/toastStore';
import { useSeo } from '@/hooks/useSeo';
import { useReducedMotion } from '@/hooks/useUi';

const VERIFY_IMAGE = 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&q=80';

export default function EmailVerificationPage() {
  const reduceMotion = useReducedMotion();
  const toastSuccess = useToastStore((state) => state.success);
  const [isVerified, setIsVerified] = useState(false);
  const [resending, setResending] = useState(false);

  useSeo({
    title: 'Verify Your Email',
    description: 'Confirm your registered email address with AFRO & CO.',
  });

  const handleVerifyNow = async () => {
    const result = await authService.verifyEmail('demo-token');
    if (result.success) {
      setIsVerified(true);
      toastSuccess('Email verified', 'Your email address is now confirmed.');
    }
  };

  const handleResend = async () => {
    setResending(true);
    await authService.resendVerification('client@example.com');
    setResending(false);
    toastSuccess('Link sent', 'A new verification message was sent to your inbox.');
  };

  const enter = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4 },
      };

  return (
    <AuthLayout
      image={VERIFY_IMAGE}
      headline="Confirm Your Identity"
      subline="Ensuring private delivery of order confirmations and bespoke salon releases."
    >
      <motion.div {...enter}>
        <header>
          <Badge variant="outline" className="mb-5">
            Verification
          </Badge>
          <h1 className="text-[clamp(1.75rem,4vw,2.5rem)] font-heading font-extrabold tracking-[-0.02em] text-[var(--text-primary)]">
            Verify Email
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
            We have dispatched an encrypted verification dispatch to your registered address.
          </p>
        </header>

        {isVerified ? (
          <div className="mt-8 border border-[var(--border-color)] bg-[var(--bg-secondary)] p-6">
            <div className="flex items-center gap-3 text-[var(--color-noir-gold)]">
              <CheckCircle2 className="h-6 w-6" />
              <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-[var(--text-primary)]">
                Email Successfully Verified
              </h3>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-[var(--text-secondary)]">
              Your member status is active. You may now continue your acquisition journey.
            </p>
            <Button asChild className="mt-6 w-full uppercase tracking-wider">
              <Link to="/account">Go to Account Dashboard</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-4 border border-[var(--border-color)] bg-[var(--bg-card)] p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--bg-secondary)] text-[var(--color-noir-gold)]">
                <Mail className="h-5 w-5" />
              </div>
              <div className="text-xs">
                <p className="font-semibold text-[var(--text-primary)]">demo@afro.co</p>
                <p className="text-[var(--text-muted)]">Check your spam folder if not received</p>
              </div>
            </div>

            <Button
              onClick={handleVerifyNow}
              size="lg"
              className="w-full uppercase tracking-[0.2em]"
            >
              Simulate Verification Click
            </Button>

            <Button
              onClick={handleResend}
              disabled={resending}
              variant="outline"
              className="w-full uppercase tracking-[0.16em]"
            >
              {resending ? 'Dispatching...' : 'Resend Verification Email'}
            </Button>

            <AuthDemoNote className="pt-4" />
          </div>
        )}
      </motion.div>
    </AuthLayout>
  );
}
