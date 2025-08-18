'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavItem({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(href + '/');
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 rounded-xl px-3 py-2
        ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`}
    >
      {children}
    </Link>
  );
}
