import React, { useState } from 'react';
import { useGetUsersQuery, useUpdateUserMutation, useUpdateProductMutation, useGetProductsQuery } from '../../redux';
import { formatDateTime } from '../../utils';
import s from './pageOrders.module.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context';
import { useToast } from '../../context/ToastContext';
import { usePageTitle } from '../../hooks';

export const PageOrders = () => {
   usePageTitle('My Orders');
   const { userId } = useAuth();
   const { showToast } = useToast();
   const [orderSearch, setOrderSearch] = useState('');
   const [orderStatusFilter, setOrderStatusFilter] = useState('all');
   const { data: userData, isLoading, isError } = useGetUsersQuery(userId, { skip: !userId });
   const [updateUser] = useUpdateUserMutation();
   const [updateProduct] = useUpdateProductMutation();
   const { data: products = [] } = useGetProductsQuery();

   if (!userId) {
      return (
         <div className="container">
            <p>Please <Link to="/login">log in</Link> to view your orders.</p>
         </div>
      );
   }

   if (isLoading) return <div>Loading...</div>;
   if (isError) return <div>Error loading data</div>;

   // Cancel order: mark as cancelled + restore inventory
   const handleCancelOrder = async (order) => {
      if (!window.confirm('Cancel this order?')) return;
      if (order.isCancelled) return;

      try {
         // Restore inventory
         for (const op of order.products) {
            const product = products.find((p) => p.id === op.id);
            if (product) {
               await updateProduct({
                  productId: product.id,
                  body: { ...product, inventory: product.inventory + op.quantity },
               });
            }
         }

         // Mark order cancelled — use id if available, fall back to date (unique enough)
         const matchKey = order.id || order.date;
         const updatedOrders = (userData.orders || []).map((o) => {
            const oKey = o.id || o.date;
            return oKey === matchKey ? { ...o, isCancelled: true } : o;
         });
         await updateUser({ ...userData, orders: updatedOrders }).unwrap();
         showToast('Order cancelled', 'info');
      } catch {
         showToast('Failed to cancel order', 'error');
      }
   };

   // Export orders to CSV
   const handleExportCSV = () => {
      if (!userData?.orders?.length) return;

      const headers = ['Order ID', 'Date', 'Products', 'Total', 'Delivery', 'Payment', 'Delivered', 'Cancelled'];
      const rows = userData.orders.map((order) => [
         order.id || '—',
         formatDateTime(order.date),
         order.products.map((p) => `${p.name} x${p.quantity}`).join('; '),
         order.totalPrice,
         `${order.delivery?.type} (+$${order.delivery?.price})`,
         `${order.payment?.type}`,
         order.isDelivered ? 'Yes' : 'No',
         order.isCancelled ? 'Yes' : 'No',
      ]);

      const csvContent = [headers, ...rows]
         .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
         .join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `orders-${userId}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Orders exported to CSV!', 'success');
   };

   if (!userData?.orders || userData.orders.length === 0) {
      return (
         <div className="container">
            <h1>User Orders: {userData?.first_name} {userData?.last_name}</h1>
            <p>You have no orders yet.</p>
         </div>
      );
   }

   return (
      <div className="container">
         <div className={s.header}>
            <h1>User Orders: {userData.first_name} {userData.last_name}</h1>
            <button className={s.exportBtn} onClick={handleExportCSV}>⬇ Export CSV</button>
         </div>

         {/* Order search + status filter */}
         <div className={s.orderFilters}>
            <input
               className={s.orderSearch}
               type="text"
               placeholder="🔍 Search by product name..."
               value={orderSearch}
               onChange={(e) => setOrderSearch(e.target.value)}
            />
            <select className={s.statusSelect} value={orderStatusFilter} onChange={(e) => setOrderStatusFilter(e.target.value)}>
               <option value="all">All Orders</option>
               <option value="active">Active</option>
               <option value="cancelled">Cancelled</option>
               <option value="delivered">Delivered</option>
            </select>
         </div>

         <table className={s.table}>
            <thead>
               <tr className={s.tableHeader}>
                  <th className={s.cell}>Date</th>
                  <th className={s.cell}>Product</th>
                  <th className={s.cell}>Price</th>
                  <th className={s.cell}>Qty</th>
                  <th className={s.cell}>Delivery</th>
                  <th className={s.cell}>Payment</th>
                  <th className={s.cell}>Total</th>
                  <th className={s.cell}>Delivered</th>
                  <th className={s.cell}>Status</th>
                  <th className={s.cell}>Actions</th>
               </tr>
            </thead>
            <tbody>
               {[...userData.orders].reverse()
                  .filter((order) => {
                     const matchSearch = !orderSearch || order.products.some((p) =>
                        p.name.toLowerCase().includes(orderSearch.toLowerCase())
                     );
                     const matchStatus =
                        orderStatusFilter === 'all' ||
                        (orderStatusFilter === 'cancelled' && order.isCancelled) ||
                        (orderStatusFilter === 'delivered' && order.isDelivered && !order.isCancelled) ||
                        (orderStatusFilter === 'active' && !order.isCancelled && !order.isDelivered);
                     return matchSearch && matchStatus;
                  })
                  .map((order, index) => (
                  <tr key={order.id || order.date} className={`${index % 2 === 0 ? s.rowEven : ''} ${order.isCancelled ? s.cancelled : ''}`}>
                     <td className={s.cell}>
                        {order.id ? (
                           <Link to={`/orders/${order.id}`} className={s.orderLink}>
                              {formatDateTime(order.date)}
                           </Link>
                        ) : (
                           formatDateTime(order.date)
                        )}
                     </td>
                     <td className={s.cell}>
                        <ul className={s.list}>
                           {order.products.map((product) => (
                              <li key={product.id} className={s.item}>{product.name}</li>
                           ))}
                        </ul>
                     </td>
                     <td className={s.cell}>
                        <ul className={s.list}>
                           {order.products.map((product) => (
                              <li key={product.id} className={s.item}>{product.price}</li>
                           ))}
                        </ul>
                     </td>
                     <td className={s.cell}>
                        <ul className={s.list}>
                           {order.products.map((product) => (
                              <li key={product.id} className={s.item}>{product.quantity}</li>
                           ))}
                        </ul>
                     </td>
                     <td className={s.cell}>{order.delivery?.type}, ${order.delivery?.price}</td>
                     <td className={s.cell}>{order.payment?.type}</td>
                     <td className={s.cell}>{order.totalPrice}</td>
                     <td className={s.cell}>{order.isDelivered ? '✅' : '❌'}</td>
                     <td className={s.cell}>
                        {order.isCancelled
                           ? <span className={s.cancelledBadge}>Cancelled</span>
                           : <span className={s.activeBadge}>Active</span>
                        }
                     </td>
                     <td className={s.cell}>
                        {!order.isCancelled && !order.isDelivered && (
                           <button className={s.cancelBtn} onClick={() => handleCancelOrder(order)}>
                              Cancel
                           </button>
                        )}
                        {order.id && (
                           <Link to={`/orders/${order.id}`} className={s.detailBtn}>Details</Link>
                        )}
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   );
};
