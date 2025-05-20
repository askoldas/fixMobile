'use client';

import CategoriesManager from '../CategoriesManager';
import ProductTypesManager from '../ProductTypesManager';
import ClientOnly from '@/global/components/ClientOnly';

export default function CategoriesPage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>

      <section style={{ marginBottom: '40px' }}>
        <ClientOnly>
          <CategoriesManager />
        </ClientOnly>
      </section>

      <section>
        <ClientOnly>
          <ProductTypesManager />
        </ClientOnly>
      </section>
    </div>
  );
}
