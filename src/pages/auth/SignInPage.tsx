import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'motion/react';
import { AlertCircle, ArrowRight, Eye, EyeOff, Globe, Lock, Mail, Apple } from 'lucide-react';
import AuthLayout, { AuthDemoNote } from './AuthLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import { Badge } from '@/components/ui/Badge';
import { signInSchema, type SignInFormData } from '@/schemas';
import { authService } from '@/services/authService';
import { useUserStore } from '@/store/userStore';
import { useToastStore } from '@/store/toastStore';
import { useSeo } from '@/hooks/useSeo';
import { useReducedMotion } from '@/hooks/useUi';

const SIGN_IN_IMAGE = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80';

const DEMO_EMAIL = 'demo@noir-co.com';

export default function SignInPage() {
  const reduceMotion = useReducedMotion();
  const navigate = useNavigate();
  const signInToStore = useUserStore((state) => state.signIn);
  const toastError = useToastStore((state) => state.error);

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [oauthPending, setOauthPending] = useState<'google' | 'apple' | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  useSeo({
    title: 'Sign In',
    description:
      'Sign in to your NOIR & CO. account to track orders, manage addresses, and access your saved pieces.',
  });

  const onSubmit = async (data: SignInFormData) => {
    setServerError(null);
    const result = await authService.signIn({
      email: data.email,
      password: data.password,
      rememberMe: data.rememberMe ?? false,
    });

    if (result.success) {
      signInToStore(data.email);
      navigate('/account');
      return;
    }

    setServerError(result.error ?? 'We could not sign you in. Please try again.');
  };

  const handleOAuth = async (provider: 'google' | 'apple') => {
    setOauthPending(provider);
    const result = await authService.oauthRedirect(provider);
    setOauthPending(null);
    if (!result.success) {
      toastError(
        `${provider === 'google' ? 'Google' : 'Apple'} sign-in unavailable`,
        result.error ?? 'Social sign-in is not configured in this demo build.'
      );
    }
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
      image={SIGN_IN_IMAGE}
      headline="Welcome back to the house of NOIR & CO."
      subline="Your orders, saved pieces, and private appointments — exactly where you left them."
    >
      <motion.div {...enter}>
        <header>
          <Badge variant="outline" className="mb-5">
            Members
          </Badge>
          <h1 className="text-[clamp(1.75rem,4vw,2.5rem)] font-heading font-extrabold tracking-[-0.02em] text-[var(--text-primary)]">
            Sign in
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
            New to NOIR &amp; CO.?{' '}
            <Link
              to="/signup"
              className="font-medium text-[var(--text-primary)] underline decoration-[var(--color-noir-gold)] decoration-2 underline-offset-4 transition-opacity hover:opacity-70"
            >
              Create an account
            </Link>
          </p>
        </header>

        {/* ─── Server error ─── */}
        <AnimatePresence initial={false}>
          {serverError && (
            <motion.div
              key="server-error"
              initial={reduceMotion ? {} : { opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? {} : { opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              role="alert"
              className="mt-6 flex items-start gap-3 border border-red-500/40 bg-red-500/5 px-4 py-3"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" aria-hidden="true" />
              <p className="text-xs leading-relaxed text-red-500">{serverError}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Form ─── */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 space-y-5">
          <Input
            label="Email address"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            leading={<Mail className="h-4 w-4" />}
            error={errors.email?.message}
            {...register('email')}
          />

          <div>
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Enter your password"
              leading={<Lock className="h-4 w-4" />}
              error={errors.password?.message}
              trailing={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  className="flex h-8 w-8 items-center justify-center text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-noir-gold)]"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              }
              {...register('password')}
            />
            <div className="mt-2 flex justify-end">
              <Link
                to="/forgot-password"
                className="text-[11px] font-heading font-semibold uppercase tracking-[0.16em] text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Checkbox label="Remember me" {...register('rememberMe')} />
          </div>

          <Button type="submit" fullWidth size="lg" loading={isSubmitting}>
            {isSubmitting ? 'Signing in' : 'Sign in'}
            {!isSubmitting && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
          </Button>
        </form>

        {/* ─── Divider ─── */}
        <div className="mt-8 flex items-center gap-4" aria-hidden="true">
          <span className="h-px flex-1 bg-[var(--border-color)]" />
          <span className="font-heading text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
            or continue with
          </span>
          <span className="h-px flex-1 bg-[var(--border-color)]" />
        </div>

        {/* ─── Social (demo) ─── */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOAuth('google')}
            loading={oauthPending === 'google'}
            disabled={oauthPending !== null}
          >
            <Globe className="h-4 w-4" aria-hidden="true" />
            Google
            <span className="ml-1 font-normal normal-case tracking-normal opacity-60">demo</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOAuth('apple')}
            loading={oauthPending === 'apple'}
            disabled={oauthPending !== null}
          >
            <Apple className="h-4 w-4" aria-hidden="true" />
            Apple
            <span className="ml-1 font-normal normal-case tracking-normal opacity-60">demo</span>
          </Button>
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-[var(--text-muted)]">
          Social sign-in is illustrative only — selecting a provider will explain why it cannot be
          used in this prototype.
        </p>

        <AuthDemoNote className="mt-8" />

        <p className="mt-6 border-t border-[var(--border-color)] pt-6 text-xs text-[var(--text-muted)]">
          Demo credentials:{' '}
          <span className="text-[var(--text-secondary)]">{DEMO_EMAIL}</span> with any password of at
          least 6 characters.
        </p>
      </motion.div>
    </AuthLayout>
  );
}
