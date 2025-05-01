import { redirect } from 'next/navigation';

export default function AdminPage() {
  // Redirect to your default admin section
  redirect('/admin/products');
}
