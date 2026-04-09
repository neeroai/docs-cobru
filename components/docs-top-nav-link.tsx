'use client';

import { usePathname } from 'fumadocs-core/framework';
import Link from 'fumadocs-core/link';

interface DocsTopNavLinkProps {
  href: string;
  label: string;
  exact?: string[];
  prefixes?: string[];
}

function isActivePath(pathname: string, exact: string[], prefixes: string[]) {
  if (exact.includes(pathname)) return true;
  return prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function DocsTopNavLink({ href, label, exact = [], prefixes = [] }: DocsTopNavLinkProps) {
  const pathname = usePathname();
  const active = isActivePath(pathname, exact, prefixes);

  return (
    <Link
      href={href}
      data-top-nav="true"
      data-active={active}
      className="relative inline-flex h-14 items-center border-b-2 border-transparent px-1 text-[1.025rem] font-medium tracking-[-0.015em] text-fd-muted-foreground transition-colors hover:text-fd-foreground data-[active=true]:border-fd-primary data-[active=true]:text-fd-foreground"
    >
      {label}
    </Link>
  );
}
