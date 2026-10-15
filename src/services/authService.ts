import type { User } from '@/types';

/**
 * Authentication service (DEMO ONLY).
 *
 * This implementation validates against local demo data and stores a session in
 * localStorage. It is NOT secure authentication. Do not ship this to production.
 *
 * ─── Production integration contract ────────────────────────────────────────
 * Replace these methods with calls to a real provider (e.g. Supabase Auth,
 * Auth0, Firebase, or a custom Node/Express + PostgreSQL backend).
 *
 *   POST /api/auth/signin         { email, password } -> { user, token }
 *   POST /api/auth/signup         { firstName, lastName, email, password } -> { user, token }
 *   POST /api/auth/signout        (Authorization: Bearer <token>)
 *   POST /api/auth/forgot-password{ email } -> { message }
 *   POST /api/auth/reset-password { token, password } -> { message }
 *   POST /api/auth/verify-email   { token } -> { message }
 *   POST /api/auth/oauth/:provider-> redirect to provider consent screen
 *
 * Never store passwords or tokens in localStorage in production. Use httpOnly,
 * Secure, SameSite cookies set by the backend, and rotate tokens server-side.
 */

export interface SignInInput {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface SignUpInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  acceptTerms: boolean;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
  message?: string;
}

const LATENCY = 700;

const delay = <T,>(value: T, ms = LATENCY): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

const buildDemoUser = (email: string, firstName: string, lastName: string): User => ({
  id: `user-${Date.now()}`,
  firstName,
  lastName,
  email,
  role: 'customer',
  createdAt: new Date().toISOString(),
  addresses: [],
  preferences: {
    newsletter: true,
    smsOffers: false,
    currency: 'USD',
    theme: 'light',
    notifications: true,
  },
});

export const authService = {
  async signIn(input: SignInInput): Promise<AuthResult> {
    // Demo credentials accepted by the local mock.
    if (input.password.length < 6) {
      return delay({ success: false, error: 'Password must be at least 6 characters.' }, 400);
    }
    const user = buildDemoUser(
      input.email,
      'Demo',
      'Customer'
    );
    return delay({ success: true, user, message: 'Signed in successfully (demo).' });
  },

  async signUp(input: SignUpInput): Promise<AuthResult> {
    if (input.password.length < 8) {
      return delay(
        { success: false, error: 'Password must be at least 8 characters.' },
        400
      );
    }
    if (!input.acceptTerms) {
      return delay({ success: false, error: 'You must accept the terms to continue.' });
    }
    const user = buildDemoUser(input.email, input.firstName, input.lastName);
    return delay({
      success: true,
      user,
      message: 'Account created. Please verify your email (demo).',
    });
  },

  async forgotPassword(email: string): Promise<AuthResult> {
    // Always report success so we do not disclose which emails are registered.
    return delay({
      success: true,
      message: `If an account exists for ${email}, a reset link is on its way (demo).`,
    });
  },

  async resetPassword(_token: string, password: string): Promise<AuthResult> {
    if (password.length < 8) {
      return delay({ success: false, error: 'Password must be at least 8 characters.' }, 400);
    }
    return delay({ success: true, message: 'Password reset successful (demo).' });
  },

  async verifyEmail(_token: string): Promise<AuthResult> {
    return delay({ success: true, message: 'Email verified (demo).' });
  },

  async resendVerification(email: string): Promise<AuthResult> {
    return delay({ success: true, message: `Verification email re-sent to ${email} (demo).` });
  },

  async signOut(): Promise<AuthResult> {
    return delay({ success: true, message: 'Signed out.' }, 200);
  },

  /** Placeholder for a real OAuth redirect. UI-only in this demo. */
  async oauthRedirect(provider: 'google' | 'apple'): Promise<AuthResult> {
    return delay({
      success: false,
      error: `${provider} sign-in is not configured in this demo build.`,
    });
  },
};
