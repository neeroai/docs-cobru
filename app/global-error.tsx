'use client';

import '@/app/globals.css';

// Minimal global error boundary — renders outside locale layout
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-bg px-6 py-16 text-fg">
        <main
          className="mx-auto flex w-full max-w-2xl flex-col gap-5 rounded-[var(--radius-xl)] border border-[var(--color-border-default)] bg-[var(--color-bg-raised)] p-8 shadow-sm"
          role="alert"
        >
          <p className="text-sm font-medium uppercase tracking-[0.08em] text-[var(--color-text-brand)]">
            Cobru Docs
          </p>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-fg">Something went wrong</h1>
            <p className="text-base leading-7 text-[var(--color-text-secondary)]">
              An unexpected rendering error interrupted this page.
            </p>
          </div>
          <pre className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] bg-[var(--color-bg-overlay)] px-4 py-3 font-mono text-sm leading-6 text-[var(--color-text-secondary)]">
            {error.message}
          </pre>
          <button
            className="inline-flex h-10 w-fit items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-brand-primary)] px-4 text-sm font-medium text-white transition-colors hover:bg-[var(--color-brand-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-border-focus)]"
            type="button"
            onClick={reset}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
