'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/categories', label: 'Categories' },
  { href: '/admin/users', label: 'Users' },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {navItems.map(({ href, label }) => (
          <li key={href} style={{ marginBottom: '12px' }}>
            <Link
              href={href}
              style={{
                textDecoration: 'none',
                color: pathname === href ? '#000' : '#555',
                fontWeight: pathname === href ? 'bold' : 'normal',
              }}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
