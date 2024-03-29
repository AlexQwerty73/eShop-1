import React, { useState, useEffect } from 'react';
import s from './pageCart.module.css';
import { loadFromLocalStorage, priceWithDiscount, saveToLocalStorage } from '../../utils';
import { useGetProductsQuery, useGetUsersQuery, useUpdateUserMutation } from '../../redux';

export const PageCart = () => {
   const [cart, setCart] = useState(loadFromLocalStorage('cart'));
   const [productsWithQty, setProductsWithQty] = useState([]);
   const { data: products, isLoading, error } = useGetProductsQuery();
   const [updateUser] = useUpdateUserMutation();

   const userId = loadFromLocalStorage('user');
   const userData = useGetUsersQuery(userId);

   useEffect(() => {
      if (products) {
         const updatedProducts = Object.entries(cart).map(([productId, qty]) => {
            const product = products.find(p => p.id === productId);
            if (product) {
               return { product, qty };
            }
            return null;
         }).filter(Boolean);
         setProductsWithQty(updatedProducts);
      }
   }, [cart, products]);

   const handleQuantityChange = (productId, newQuantity) => {
      if (newQuantity < 0) return;
      const updatedCart = { ...cart, [productId]: newQuantity };
      setCart(updatedCart);
      saveToLocalStorage('cart', updatedCart);
   };

   const handleDeleteItem = (productId) => {
      const updatedCart = { ...cart };
      delete updatedCart[productId];
      setCart(updatedCart);
      saveToLocalStorage('cart', updatedCart);
   };

   const handleBuy = async () => {
      if (!userData) return;

      const date = new Date().toISOString();
      // Формуємо масив замовлень, обмежений необхідними полями
      const order = {
         date,
         products: Object.keys(cart).map(productId => ({
            id: productId,
            price: products.find(p => p.id === productId).price,
            name: products.find(p => p.id === productId).name,
            discount: products.find(p => p.id === productId).discount,
            quantity: cart[productId]
         }))
      };
      const currentUser = userData.data;

      // Перевіряємо, чи користувач має визначені замовлення
      if (currentUser && currentUser.orders) {
         const updatedOrders = [...currentUser.orders, order];
         await updateUser({ ...currentUser, orders: updatedOrders });
      } else {
         // Якщо користувач ще не має замовлень, створюємо новий масив
         await updateUser({ ...currentUser, orders: [order] });
      }

      setCart({});
      saveToLocalStorage('cart', {});
   };



   const totalPriceOfEverything = productsWithQty.reduce((total, { product, qty }) => {
      return total + (priceWithDiscount(product) * qty);
   }, 0);

   return (
      <div className={s.pageCart}>
         <div className="container">
            <h1>Your Cart</h1>
            <table className={s.table}>
               <thead>
                  <tr>
                     <th className={s.headerCell}>Name</th>
                     <th className={s.headerCell}>Price</th>
                     <th className={s.headerCell}>Quantity</th>
                     <th className={s.headerCell}>Total Price</th>
                     <th className={s.headerCell}>Action</th>
                  </tr>
               </thead>
               <tbody>
                  {productsWithQty.map(({ product, qty }) => (
                     <tr key={product.id} className={s.row}>
                        <td>{product.name}</td>
                        <td>{priceWithDiscount(product)}</td>
                        <td>
                           <div className={s.quantityControl}>
                              <button onClick={() => handleQuantityChange(product.id, qty - 1)} className={s.quantityButton}>-</button>
                              <input
                                 type="number"
                                 value={qty}
                                 min={0}
                                 onChange={(e) => {
                                    const newQuantity = parseInt(e.target.value);
                                    handleQuantityChange(product.id, isNaN(newQuantity) ? 0 : newQuantity);
                                 }}
                                 className={s.quantityInput}
                              />
                              <button onClick={() => handleQuantityChange(product.id, qty + 1)} className={s.quantityButton}>+</button>
                           </div>
                        </td>
                        <td>{(priceWithDiscount(product) * qty).toFixed(2)}</td>
                        <td><button onClick={() => handleDeleteItem(product.id)} className={s.deleteButton}>Delete</button></td>
                     </tr>
                  ))}
               </tbody>
            </table>
            <button onClick={handleBuy} className={s.buyButton}>Buy</button>
            <div className={s.totalPrice}>Total Price of Everything: {totalPriceOfEverything.toFixed(2)}</div>
         </div>
      </div>
   );
};
