import type { ReactNode } from "react";

// Root layout — minimal shell.
// <html> and <body> live in app/[locale]/layout.tsx for per-locale lang attr.
// suppressHydrationWarning here prevents mismatches from the locale layout.
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
