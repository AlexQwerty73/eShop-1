import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetUsersQuery } from '../../redux';
import { useAuth } from '../../context';
import { formatDateTime } from '../../utils';
import { usePageTitle } from '../../hooks';
import { Breadcrumbs } from '../../components/common/Breadcrumbs/Breadcrumbs';
import s from './pageOrderDetail.module.css';

export const PageOrderDetail = () => {
   const { orderId } = useParams();
   const { userId } = useAuth();
   const { data: userData, isLoading, isError } = useGetUsersQuery(userId, { skip: !userId });

   const order = userData?.orders?.find((o) => o.id === orderId);

   usePageTitle(order ? `Order #${orderId.slice(0, 8)}` : 'Order Detail');

   if (!userId) {
      return (
         <div className="container">
            <p>Please <Link to="/login">log in</Link> to view order details.</p>
         </div>
      );
   }

   if (isLoading) return <div className="container"><p>Loading...</p></div>;
   if (isError) return <div className="container"><p>Error loading data.</p></div>;
   if (!order) {
      return (
         <div className="container">
            <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Orders', to: '/orders/' }, { label: 'Order' }]} />
            <p>Order not found.</p>
         </div>
      );
   }

   return (
      <div className="container">
         <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Orders', to: '/orders/' }, { label: `Order #${order.id?.slice(0,8) || '—'}` }]} />
         <div className={s.card}>
            <div className={s.topRow}>
               <div>
                  <h1 className={s.title}>Order Details</h1>
                  <p className={s.id}>ID: <code>{order.id}</code></p>
               </div>
               <div className={s.badges}>
                  {order.isCancelled
                     ? <span className={s.badgeCancelled}>Cancelled</span>
                     : <span className={s.badgeActive}>Active</span>
                  }
                  {order.isDelivered
                     ? <span className={s.badgeDelivered}>Delivered</span>
                     : <span className={s.badgePending}>Pending delivery</span>
                  }
                  <button className={s.printBtn} onClick={() => window.print()} title="Print receipt">🖨 Print</button>
               </div>
            </div>

            <p className={s.date}>📅 {formatDateTime(order.date)}</p>

            {/* Customer info */}
            <div className={s.section}>
               <h2>Customer</h2>
               <p><strong>Name:</strong> {order.first_name} {order.last_name}</p>
               <p><strong>Email:</strong> {order.email}</p>
               <p><strong>Address:</strong> {order.address}</p>
            </div>

            {/* Delivery & Payment */}
            <div className={s.row2col}>
               <div className={s.section}>
                  <h2>Delivery</h2>
                  <p><strong>Type:</strong> {order.delivery?.type}</p>
                  <p><strong>Price:</strong> ${order.delivery?.price}</p>
               </div>
               <div className={s.section}>
                  <h2>Payment</h2>
                  <p><strong>Method:</strong> {order.payment?.type}</p>
                  <p><strong>Fee:</strong> ${order.payment?.price}</p>
               </div>
            </div>

            {/* Promo code */}
            {order.promoCode && (
               <div className={s.section}>
                  <h2>Promo Code</h2>
                  <p><code>{order.promoCode}</code> — saved <strong>${order.promoDiscount?.toFixed(2)}</strong></p>
               </div>
            )}

            {/* Products */}
            <div className={s.section}>
               <h2>Products</h2>
               <table className={s.table}>
                  <thead>
                     <tr>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Qty</th>
                        <th>Subtotal</th>
                     </tr>
                  </thead>
                  <tbody>
                     {order.products.map((p) => (
                        <tr key={p.id}>
                           <td>
                              <Link to={`/product/${p.id}`} className={s.prodLink}>{p.name}</Link>
                           </td>
                           <td>${p.price}</td>
                           <td>{p.quantity}</td>
                           <td>${(p.price * p.quantity).toFixed(2)}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>

            {/* Total */}
            <div className={s.total}>
               <strong>Total:</strong> ${Number(order.totalPrice).toFixed(2)}
            </div>
         </div>
      </div>
   );
};
