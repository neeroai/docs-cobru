import Link from 'fumadocs-core/link';
import { ArrowUpRight, Bot, LayoutDashboard, LifeBuoy } from 'lucide-react';
import type { ReactNode } from 'react';

function GitHubMark() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-4">
      <path d="M12 .297C5.373.297 0 5.67 0 12.297c0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.333-1.755-1.333-1.755-1.09-.745.082-.729.082-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.835 2.807 1.305 3.492.998.108-.776.418-1.305.762-1.605-2.665-.3-5.467-1.332-5.467-5.93 0-1.31.468-2.38 1.235-3.22-.123-.301-.535-1.523.117-3.176 0 0 1.008-.323 3.3 1.23a11.47 11.47 0 0 1 3.003-.404c1.02.005 2.047.138 3.005.404 2.29-1.553 3.297-1.23 3.297-1.23.654 1.653.242 2.875.12 3.176.77.84 1.233 1.91 1.233 3.22 0 4.61-2.805 5.625-5.475 5.92.43.37.813 1.102.813 2.222 0 1.606-.015 2.898-.015 3.293 0 .322.217.694.825.576C20.565 22.092 24 17.592 24 12.297 24 5.67 18.627.297 12 .297Z" />
    </svg>
  );
}

function UtilityLink({
  href,
  label,
  icon,
  external = false,
}: {
  href: string;
  label: string;
  icon: ReactNode;
  external?: boolean;
}) {
  const className =
    'inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-fd-muted-foreground transition-colors hover:bg-fd-accent/60 hover:text-fd-foreground';

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer noopener" className={className}>
        {icon}
        <span>{label}</span>
        <ArrowUpRight className="ms-auto size-3.5 opacity-60" />
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {icon}
      <span>{label}</span>
    </Link>
  );
}

export function SidebarUtilityBanner({ locale }: { locale: string }) {
  return (
    <div className="flex flex-col gap-1">
      <UtilityLink
        href="https://github.com/neeroai/docs-cobru"
        label="GitHub"
        icon={<GitHubMark />}
        external
      />
      <UtilityLink
        href={`/${locale}/docs/build-with-ai`}
        label="Build with AI"
        icon={<Bot className="size-4" />}
      />
    </div>
  );
}

export function SidebarUtilityFooter() {
  return (
    <div className="flex flex-col gap-1 border-t border-fd-border/80 px-4 py-3">
      <UtilityLink
        href="mailto:soporte@cobru.co"
        label="Support"
        icon={<LifeBuoy className="size-4" />}
        external
      />
      <UtilityLink
        href="https://panel.cobru.co"
        label="Dashboard"
        icon={<LayoutDashboard className="size-4" />}
        external
      />
    </div>
  );
}
