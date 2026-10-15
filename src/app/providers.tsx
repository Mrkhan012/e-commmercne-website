import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--bg-primary)] px-6 text-center">
      <p className="font-heading text-sm uppercase tracking-[0.3em] text-[var(--text-muted)]">
        AFRO &amp; CO.
      </p>
      <h1 className="font-heading text-3xl font-bold text-[var(--text-primary)]">
        Something went wrong
      </h1>
      <p className="max-w-md text-sm text-[var(--text-muted)]">
        An unexpected error interrupted this view. You can retry or reload the page.
      </p>
      <pre className="max-w-md overflow-auto rounded-md border border-[var(--border-color)] bg-[var(--bg-secondary)] p-4 text-left text-xs text-[var(--text-muted)]">
        {error instanceof Error ? error.message : String(error ?? 'An unknown error occurred')}
      </pre>
      <button
        type="button"
        onClick={resetErrorBoundary}
        className="mt-2 rounded-none border border-[var(--text-primary)] bg-[var(--text-primary)] px-8 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--bg-primary)] transition-colors hover:bg-transparent hover:text-[var(--text-primary)]"
      >
        Try again
      </button>
    </div>
  );
}

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ErrorBoundary>
  );
}
