'use client';

import UsersManager from '../UsersManager';
import ClientOnly from '@/global/components/ClientOnly';

export default function UsersPage() {
  return (
    <ClientOnly>
      <UsersManager />
    </ClientOnly>
  );
}
