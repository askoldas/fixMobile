'use client';

import ProductsManager from '../ProductsManager';
import ClientOnly from '@/global/components/ClientOnly';

export default function ProductsPage() {
  return (
    <ClientOnly>
      <ProductsManager />
    </ClientOnly>
  );
}
