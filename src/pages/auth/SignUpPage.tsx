import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import AuthLayout, { AuthDemoNote } from './AuthLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import { Badge } from '@/components/ui/Badge';
import { signUpSchema, type SignUpFormData } from '@/schemas';
import { authService } from '@/services/authService';
import { useUserStore } from '@/store/userStore';
import { useToastStore } from '@/store/toastStore';
import { useSeo } from '@/hooks/useSeo';
import { useReducedMotion } from '@/hooks/useUi';

const SIGN_UP_IMAGE = 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&q=80';

export default function SignUpPage() {
  const reduceMotion = useReducedMotion();
  const navigate = useNavigate();
  const signUpUser = useUserStore((state) => state.signUp);
  const toastSuccess = useToastStore((state) => state.success);

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: true,
    },
  });

  const acceptTerms = watch('acceptTerms');

  useSeo({
    title: 'Create an Account',
    description: 'Join AFRO & CO. for exclusive collections, tailored styling advice, and private salon viewings.',
  });

  const onSubmit = async (data: SignUpFormData) => {
    setServerError(null);
    const result = await authService.signUp({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      acceptTerms: data.acceptTerms,
    });

    if (result.success) {
      signUpUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
      });
      toastSuccess('Welcome to AFRO & CO.', 'Your member account has been registered.');
      navigate('/account');
      return;
    }

    setServerError(result.error ?? 'Could not create account. Please check your details.');
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
      image={SIGN_UP_IMAGE}
      headline="Enter the inner sanctum of AFRO & CO."
      subline="Curated luxury, bespoke styling invitations, and permanent access to your private bag."
    >
      <motion.div {...enter}>
        <header>
          <Badge variant="outline" className="mb-5">
            Membership
          </Badge>
          <h1 className="text-[clamp(1.75rem,4vw,2.5rem)] font-heading font-extrabold tracking-[-0.02em] text-[var(--text-primary)]">
            Create account
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
            Already registered?{' '}
            <Link
              to="/signin"
              className="font-medium text-[var(--text-primary)] underline decoration-[var(--color-noir-gold)] decoration-2 underline-offset-4 transition-opacity hover:opacity-70"
            >
              Sign in
            </Link>
          </p>
        </header>

        <AnimatePresence initial={false}>
          {serverError && (
            <motion.div
              key="server-error"
              initial={reduceMotion ? {} : { opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? {} : { opacity: 0, y: -6 }}
              className="mt-6 flex items-start gap-3 border border-red-500/40 bg-red-500/5 px-4 py-3"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
              <p className="text-xs text-red-500">{serverError}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* B2B Dealer Partnership Callout */}
        <div className="mt-6 rounded border border-[var(--color-noir-gold)]/40 bg-[var(--color-noir-gold)]/10 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="font-heading text-[10px] font-bold uppercase tracking-widest text-[var(--color-noir-gold)]">
                B2B Wholesale Portal
              </span>
              <p className="text-xs font-bold text-[var(--text-primary)] mt-0.5">
                Applying as a Retail Boutique or Distributor?
              </p>
              <p className="text-[11px] text-[var(--text-muted)]">
                Request a verified dealer account with tiered wholesale margins (up to 40% OFF) and Net-30 credit terms.
              </p>
            </div>
            <Button
              asChild
              size="sm"
              variant="outline"
              className="shrink-0 text-[10px] uppercase tracking-wider border-[var(--color-noir-gold)] text-[var(--color-noir-gold)] hover:bg-[var(--color-noir-gold)] hover:text-black"
            >
              <Link to="/dealer/register">Apply as Dealer</Link>
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block font-heading text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                First Name
              </label>
              <Input
                {...register('firstName')}
                error={errors.firstName?.message}
                placeholder="Elena"
              />
            </div>
            <div>
              <label className="mb-1.5 block font-heading text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Last Name
              </label>
              <Input
                {...register('lastName')}
                error={errors.lastName?.message}
                placeholder="Vane"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block font-heading text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
              Email Address
            </label>
            <Input
              type="email"
              {...register('email')}
              error={errors.email?.message}
              placeholder="elena@example.com"
            />
          </div>

          <div>
            <label className="mb-1.5 block font-heading text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
              Password
            </label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                error={errors.password?.message}
                placeholder="At least 8 chars (1 uppercase, 1 number)"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block font-heading text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
              Confirm Password
            </label>
            <Input
              type="password"
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
              placeholder="Re-enter password"
            />
          </div>

          <div className="pt-2">
            <Checkbox
              id="acceptTerms"
              checked={acceptTerms}
              onChange={(e) => setValue('acceptTerms', e.target.checked as true)}
              label={
                <span className="text-xs text-[var(--text-secondary)]">
                  I agree to AFRO &amp; CO.'s{' '}
                  <Link to="/terms" className="underline hover:text-[var(--text-primary)]">
                    Terms
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="underline hover:text-[var(--text-primary)]">
                    Privacy Policy
                  </Link>
                  .
                </span>
              }
            />
            {errors.acceptTerms && (
              <p className="mt-1 text-xs text-red-500">{errors.acceptTerms.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            size="lg"
            className="w-full uppercase tracking-[0.2em]"
          >
            {isSubmitting ? 'Registering...' : 'Create Member Account'}
          </Button>

          <AuthDemoNote className="pt-4" />
        </form>
      </motion.div>
    </AuthLayout>
  );
}
