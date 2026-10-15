import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';
import AuthLayout, { AuthDemoNote } from './AuthLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/schemas';
import { authService } from '@/services/authService';
import { useSeo } from '@/hooks/useSeo';
import { useReducedMotion } from '@/hooks/useUi';

const FORGOT_IMAGE = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&q=80';

export default function ForgotPasswordPage() {
  const reduceMotion = useReducedMotion();
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  useSeo({
    title: 'Reset Password',
    description: 'Recover access to your AFRO & CO. client profile.',
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    await authService.forgotPassword(data.email);
    setSubmittedEmail(data.email);
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
      image={FORGOT_IMAGE}
      headline="Account Recovery"
      subline="Restoring your discrete credentials and access to your saved catalog."
    >
      <motion.div {...enter}>
        <header>
          <Badge variant="outline" className="mb-5">
            Security
          </Badge>
          <h1 className="text-[clamp(1.75rem,4vw,2.5rem)] font-heading font-extrabold tracking-[-0.02em] text-[var(--text-primary)]">
            Reset password
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
            Remember your credentials?{' '}
            <Link
              to="/signin"
              className="font-medium text-[var(--text-primary)] underline decoration-[var(--color-noir-gold)] decoration-2 underline-offset-4 transition-opacity hover:opacity-70"
            >
              Back to sign in
            </Link>
          </p>
        </header>

        {submittedEmail ? (
          <div className="mt-8 border border-[var(--border-color)] bg-[var(--bg-secondary)] p-6">
            <div className="flex items-center gap-3 text-[var(--color-noir-gold)]">
              <CheckCircle2 className="h-6 w-6" />
              <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-[var(--text-primary)]">
                Reset Instructions Sent
              </h3>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-[var(--text-secondary)]">
              If an account is associated with <strong className="text-[var(--text-primary)]">{submittedEmail}</strong>, an encrypted reset link has been dispatched.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Button asChild variant="outline">
                <Link to="/reset-password?token=demo-token">Open Reset Link (Demo)</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link to="/signin">Return to Sign In</Link>
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            <div>
              <label className="mb-1.5 block font-heading text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Email Address
              </label>
              <Input
                type="email"
                {...register('email')}
                error={errors.email?.message}
                placeholder="you@domain.com"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              size="lg"
              className="w-full uppercase tracking-[0.2em]"
            >
              {isSubmitting ? 'Sending Request...' : 'Send Reset Link'}
            </Button>

            <AuthDemoNote className="pt-4" />
          </form>
        )}
      </motion.div>
    </AuthLayout>
  );
}
