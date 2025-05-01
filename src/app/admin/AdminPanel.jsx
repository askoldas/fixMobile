'use client';

import AdminNav from './components/AdminNav';

export default function CustomAdminPanel() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Admin Panel</h1>
      <AdminNav />
    </div>
  );
}
