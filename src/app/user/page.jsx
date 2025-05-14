import ClientOnly from '@/global/components/ClientOnly';
import UserProfile from './UserProfile';

export default function UserPage() {
  return (
    <ClientOnly>
      <UserProfile />
    </ClientOnly>
  );
}
