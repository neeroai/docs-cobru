import type { ReactNode } from "react";

// Root layout — pass-through shell.
// <html> and <body> are owned by app/[locale]/layout.tsx for per-locale lang attr.
// global-error.tsx provides its own html/body as required by Next.js.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
