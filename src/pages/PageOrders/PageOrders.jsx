import React from 'react';
import { useGetUsersQuery } from '../../redux';
import { formatDateTime, loadFromLocalStorage } from '../../utils';
import s from './pageOrders.module.css';

export const PageOrders = () => {
   const userId = loadFromLocalStorage('user');
   const { data: userData, isLoading, isError } = useGetUsersQuery(userId);

   if (isLoading) return <div>Loading...</div>;
   if (isError) return <div>Error loading data</div>;

   return (
      <div className="container">
         <h1>User Orders: {userData.first_name} {userData.last_name}</h1>
         <table className={s.table}>
            <thead>
               <tr className={s.tableHeader}>
                  <th className={s.cell}>Date</th>
                  <th className={s.cell}>Product</th>
                  <th className={s.cell}>Price</th>
                  <th className={s.cell}>Quantity</th>
                  <th className={s.cell}>Delivery</th>
                  <th className={s.cell}>Payment</th>
                  <th className={s.cell}>Total</th>
                  <th className={s.cell}>Delivered</th>
               </tr>
            </thead>
            <tbody>
               {userData.orders.map((order, index) => (
                  <tr key={order.date} className={index % 2 === 0 ? s.rowEven : ''}>
                     <td className={s.cell}>{formatDateTime(order.date)}</td>
                     <td className={s.cell}>
                        <ul className={s.list}>
                           {order.products.map(product => (
                              <li key={product.id} className={s.item}>
                                 {product.name}
                              </li>
                           ))}
                        </ul>
                     </td>
                     <td className={s.cell}>
                        <ul className={s.list}>
                           {order.products.map(product => (
                              <li key={product.id} className={s.item}>
                                 {product.price}
                              </li>
                           ))}
                        </ul>
                     </td>
                     <td className={s.cell}>
                        <ul className={s.list}>
                           {order.products.map(product => (
                              <li key={product.id} className={s.item}>
                                 {product.quantity}
                              </li>
                           ))}
                        </ul>
                     </td>
                     <td className={s.cell}>{order.delivery.type}, {order.delivery.price} UAH</td>
                     <td className={s.cell}>{order.payment.type}, {order.payment.price} UAH</td>
                     <td className={s.cell}>{order.totalPrice}</td>
                     <td className={s.cell}>{order.isDelivered ? 'Yes' : 'No'}</td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   );
};
