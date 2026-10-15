import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'motion/react';
import { CheckCircle2, Eye, EyeOff } from 'lucide-react';
import AuthLayout, { AuthDemoNote } from './AuthLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { resetPasswordSchema, type ResetPasswordFormData } from '@/schemas';
import { authService } from '@/services/authService';
import { useToastStore } from '@/store/toastStore';
import { useSeo } from '@/hooks/useSeo';
import { useReducedMotion } from '@/hooks/useUi';

const RESET_IMAGE = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80';

export default function ResetPasswordPage() {
  const reduceMotion = useReducedMotion();
  const toastSuccess = useToastStore((state) => state.success);

  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  useSeo({
    title: 'Choose New Password',
    description: 'Update your security credentials for NOIR & CO.',
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    const result = await authService.resetPassword('demo-token', data.password);
    if (result.success) {
      setIsSuccess(true);
      toastSuccess('Password updated', 'You can now sign in with your new credentials.');
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
      image={RESET_IMAGE}
      headline="Renew Your Access"
      subline="Select a secure new passphrase to protect your account and orders."
    >
      <motion.div {...enter}>
        <header>
          <Badge variant="outline" className="mb-5">
            Security
          </Badge>
          <h1 className="text-[clamp(1.75rem,4vw,2.5rem)] font-heading font-extrabold tracking-[-0.02em] text-[var(--text-primary)]">
            New Password
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
            Ensure your password is at least 8 characters with 1 capital and 1 number.
          </p>
        </header>

        {isSuccess ? (
          <div className="mt-8 border border-[var(--border-color)] bg-[var(--bg-secondary)] p-6">
            <div className="flex items-center gap-3 text-[var(--color-noir-gold)]">
              <CheckCircle2 className="h-6 w-6" />
              <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-[var(--text-primary)]">
                Password Successfully Reset
              </h3>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-[var(--text-secondary)]">
              Your credentials have been securely updated. You may now authenticate.
            </p>
            <Button asChild className="mt-6 w-full uppercase tracking-wider">
              <Link to="/signin">Proceed to Sign In</Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            <div>
              <label className="mb-1.5 block font-heading text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                New Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  error={errors.password?.message}
                  placeholder="At least 8 chars"
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
                Confirm New Password
              </label>
              <Input
                type="password"
                {...register('confirmPassword')}
                error={errors.confirmPassword?.message}
                placeholder="Re-type new password"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              size="lg"
              className="w-full uppercase tracking-[0.2em]"
            >
              {isSubmitting ? 'Updating...' : 'Update Password'}
            </Button>

            <AuthDemoNote className="pt-4" />
          </form>
        )}
      </motion.div>
    </AuthLayout>
  );
}
