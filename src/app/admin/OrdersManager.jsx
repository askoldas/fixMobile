'use client';

import React, { useEffect, useState } from 'react';
import { fetchDocuments, updateDocument } from '@/lib/firebaseUtils';
import styles from './styles/products-manager.module.scss'; // Reuse same styling

export default function OrdersManager() {
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await fetchDocuments('orders');
        setOrders(data);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  const toggleExpand = (id) => {
    setExpandedOrderId((prev) => (prev === id ? null : id));
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateDocument('orders', orderId, { status: newStatus });
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  return (
    <div className={styles['manager-container']}>
      <h2>Orders</h2>
      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className={styles['list']}>
          {orders.map((order) => (
            <div
              key={order.id}
              className={styles['list-item']}
              style={{
                border: '1px solid #ccc',
                borderRadius: '6px',
                marginBottom: '1rem',
                padding: '1rem',
                cursor: 'pointer',
              }}
              onClick={() => toggleExpand(order.id)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>Order ID:</strong> {order.id}
              </div>
              <div>
                <strong>Status:</strong>{' '}
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="ready">Ready</option>
                  <option value="fulfilled">Fulfilled</option>
                </select>
              </div>
              <div>
                <strong>Total:</strong> €{order.totalPrice.toFixed(2)}
              </div>
              <div>
                <strong>Customer:</strong> {order.contactInfo?.name}
              </div>

              {expandedOrderId === order.id && (
                <div style={{ marginTop: '1rem' }}>
                  <strong>Items:</strong>
                  <ul style={{ paddingLeft: '1rem', marginTop: '0.5rem' }}>
                    {order.items.map((item, idx) => (
                      <li key={idx}>
                        {item.name} × {item.quantity} — €{(item.price * item.quantity).toFixed(2)}
                      </li>
                    ))}
                  </ul>
                  <p><strong>Email:</strong> {order.contactInfo?.email}</p>
                  <p><strong>Phone:</strong> {order.contactInfo?.phone}</p>
                  <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                  <p><strong>Address:</strong> {order.contactInfo?.address}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
