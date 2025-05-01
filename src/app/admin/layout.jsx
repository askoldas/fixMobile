'use client';

import AuthGuard from "@/hooks/AuthGuard";
import AdminNav from './components/AdminNav';

export default function AdminLayout({ children }) {
  return (
    <AuthGuard>
      <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
        {/* Fixed Sidebar Navigation */}
        <aside style={{
          width: '220px',
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRight: '1px solid #ccc',
          position: 'fixed',
          paddingTop: '40px',
          top: 0,
          bottom: 0,
          left: 0,
          overflowY: 'auto',
        }}>
          <h2 style={{ marginBottom: '20px' }}>Admin Menu</h2>
          <AdminNav />
        </aside>

        {/* Scrollable Main Content */}
        <main style={{
          marginLeft: '220px', // account for fixed sidebar width
          padding: '20px',
          flex: 1,

        }}>
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
