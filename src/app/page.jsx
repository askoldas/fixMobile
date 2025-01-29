'use client';

import React from 'react';
import Link from 'next/link';
import Button from '@/global/components/Button'; // Import reusable Button component
import './HomePage.scss'; // Import SCSS styles

export default function HomePage() {
  return (
    <div className="homepage-container">
      <div className="homepage-buttons">
        <Button variant="primary" onClick={() => window.open('https://serviss.fixmobile.lv/', '_blank')}>
          Serviss
        </Button>
        <Link href="/shop">
          <Button variant="secondary">Shop</Button>
        </Link>
      </div>
    </div>
  );
}
