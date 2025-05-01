'use client';

import CategoriesManager from '../CategoriesManager';
import ProductTypesManager from '../ProductTypesManager';
import ClientOnly from '@/global/components/ClientOnly';

export default function CategoriesPage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Manage Categories & Product Types</h1>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ marginBottom: '10px' }}>Devices</h2>
        <ClientOnly>
          <CategoriesManager />
        </ClientOnly>
      </section>

      <section>
        <h2 style={{ marginBottom: '10px' }}>Product Types</h2>
        <ClientOnly>
          <ProductTypesManager />
        </ClientOnly>
      </section>
    </div>
  );
}
