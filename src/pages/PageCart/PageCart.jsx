import React, { useState, useEffect } from 'react';
import s from './pageCart.module.css';
import { loadFromLocalStorage, priceWithDiscount, saveToLocalStorage } from '../../utils';
import { useGetProductsQuery, useGetUsersQuery, useUpdateUserMutation } from '../../redux';

import { EmptyCartMessage, CartTable, BuyButton, PaymentAndDeliveryStep } from './components';

export const PageCart = () => {
   const [cart, setCart] = useState(loadFromLocalStorage('cart'));
   const [productsWithQty, setProductsWithQty] = useState([]);
   const { data: products, isLoading, error } = useGetProductsQuery();
   const [updateUser] = useUpdateUserMutation();

   const userId = loadFromLocalStorage('user');
   const userData = useGetUsersQuery(userId);
   const [showPaymentStep, setShowPaymentStep] = useState(false);

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
      if (newQuantity < 1) return;
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

   const handleBuy = () => {
      setShowPaymentStep(true);
   };

   const handleCompleteOrder = async (orderData) => {
      if (!userData) return;

      const currentUser = userData.data;
      const date = new Date().toISOString();
      const order = {
         date,
         isDelivered: false,
         delivery: orderData.delivery,
         payment: orderData.payment,
         totalPrice: orderData.totalPrice,
         address: orderData.address,
         first_name: userId ? currentUser.first_name : orderData.first_name,
         last_name: userId ? currentUser.last_name : orderData.last_name,
         email: userId ? currentUser.email : orderData.email,
         products: Object.keys(cart).map(productId => ({
            id: productId,
            price: products.find(p => p.id === productId).price,
            name: products.find(p => p.id === productId).name,
            discount: products.find(p => p.id === productId).discount,
            quantity: cart[productId]
            
         }))
      };

      try {
         if (currentUser && currentUser.orders) {
            const updatedOrders = [...currentUser.orders, order];
            await updateUser({ ...currentUser, orders: updatedOrders });
         } else {
            await updateUser({ ...currentUser, orders: [order] });
         }

         setCart({});
         saveToLocalStorage('cart', {});
         setShowPaymentStep(false);
      } catch (error) {
         console.error("Error completing order:", error);
      }
   };



   const totalPriceOfEverything = productsWithQty.reduce((total, { product, qty }) => {
      return total + (priceWithDiscount(product) * qty);
   }, 0);

   return (
      <div className={s.pageCart}>
         <div className="container">
            <h1>Your Cart</h1>
            {productsWithQty.length === 0 ? (
               <EmptyCartMessage />
            ) : (
               <CartTable
                  productsWithQty={productsWithQty}
                  handleQuantityChange={handleQuantityChange}
                  handleDeleteItem={handleDeleteItem}
               />
            )}
            <div className={s.b_part}>
               <div className={s.totalPrice}>Total Price of Everything: {totalPriceOfEverything.toFixed(2)}</div>
               {showPaymentStep ? (
                  <PaymentAndDeliveryStep
                     totalPrice={totalPriceOfEverything}
                     handleCompleteOrder={handleCompleteOrder}
                     user={userData?.data}
                  />
               ) : (
                  <BuyButton handleBuy={handleBuy} />
               )}
            </div>
         </div>
      </div>
   );
};
