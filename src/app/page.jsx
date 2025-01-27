'use client';

import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div
      className="flex items-center justify-center h-screen bg-black relative"
      style={{
        backgroundImage: "url('/images/hero_phone.webp')",
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right',
      }}
    >
      <div className="flex flex-row items-center gap-4">
        <a
          href="https://serviss.fixmobile.lv/"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 bg-white text-black font-bold rounded hover:bg-gray-200"
        >
          Serviss
        </a>
        <Link href="/shop">
          <button
            className="px-6 py-3 bg-white text-black font-bold rounded hover:bg-gray-200"
          >
            Shop
          </button>
        </Link>
      </div>
    </div>
  );
}
