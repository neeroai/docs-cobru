import Link from 'fumadocs-core/link';
import Image from 'next/image';

interface CobruDocsLogoProps {
  href: string;
  className?: string;
}

export function CobruDocsLogo({ href, className }: CobruDocsLogoProps) {
  return (
    <Link
      href={href}
      className={['inline-flex items-center', className].filter(Boolean).join(' ')}
      aria-label="Cobru Docs"
    >
      <Image
        src="/logo-cobru.svg"
        alt="Cobru"
        width={132}
        height={39}
        className="block h-7 w-auto dark:hidden"
        priority
      />
      <Image
        src="/logo-cobru-all-white.svg"
        alt="Cobru"
        width={146}
        height={39}
        className="hidden h-7 w-auto dark:block"
        priority
      />
    </Link>
  );
}
