import React, { useState, useEffect } from 'react';
import s from './pageCart.module.css';
import { loadFromLocalStorage, priceWithDiscount, saveToLocalStorage } from '../../utils';
import {
   useGetProductsQuery,
   useGetUsersQuery,
   useUpdateUserMutation,
   useUpdateProductMutation,
} from '../../redux';
import { EmptyCartMessage, CartTable, BuyButton, PaymentAndDeliveryStep } from './components';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { usePageTitle } from '../../hooks';
import { useNavigate } from 'react-router-dom';

export const PageCart = () => {
   usePageTitle('Cart');
   const navigate = useNavigate();
   const [cart, setCart] = useState(loadFromLocalStorage('cart') || {});
   const [productsWithQty, setProductsWithQty] = useState([]);
   const [orderSuccess, setOrderSuccess] = useState(false);

   const { data: products, isLoading } = useGetProductsQuery();
   const [updateUser] = useUpdateUserMutation();
   const [updateProduct] = useUpdateProductMutation();
   const { refreshCart } = useCart();

   const { userId } = useAuth();
   const userData = useGetUsersQuery(userId, { skip: !userId });
   const [showPaymentStep, setShowPaymentStep] = useState(false);

   useEffect(() => {
      if (products) {
         const updated = Object.entries(cart).map(([productId, qty]) => {
            const product = products.find((p) => p.id === productId);
            return product ? { product, qty } : null;
         }).filter(Boolean);
         setProductsWithQty(updated);
      }
   }, [cart, products]);

   const handleQuantityChange = (productId, newQuantity) => {
      if (newQuantity < 1) return;
      const updatedCart = { ...cart, [productId]: newQuantity };
      setCart(updatedCart);
      saveToLocalStorage('cart', updatedCart);
      refreshCart();
   };

   const handleDeleteItem = (productId) => {
      const updatedCart = { ...cart };
      delete updatedCart[productId];
      setCart(updatedCart);
      saveToLocalStorage('cart', updatedCart);
      refreshCart();
   };

   const handleCompleteOrder = async (orderData) => {
      const currentUser = userData?.data;

      // Build order snapshot
      const orderProducts = Object.keys(cart).map((productId) => {
         const found = products?.find((p) => p.id === productId);
         if (!found) return null;
         return {
            id: productId,
            price: found.price,
            name: found.name,
            discount: found.discount,
            quantity: cart[productId],
         };
      }).filter(Boolean);

      const order = {
         id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
         date: new Date().toISOString(),
         isDelivered: false,
         isCancelled: false,
         delivery: orderData.delivery,
         payment: orderData.payment,
         totalPrice: orderData.totalPrice,
         address: orderData.address,
         first_name: currentUser?.first_name || orderData.first_name || '',
         last_name: currentUser?.last_name  || orderData.last_name  || '',
         email:      currentUser?.email      || orderData.email      || '',
         promoCode:     orderData.promoCode     || null,
         promoDiscount: orderData.promoDiscount || 0,
         products: orderProducts,
      };

      try {
         // Save to user history only if logged in
         if (currentUser) {
            const existingOrders = currentUser.orders || [];
            await updateUser({ ...currentUser, orders: [...existingOrders, order] });
         }

         // Decrease inventory for everyone (guest and logged-in)
         for (const [productId, qty] of Object.entries(cart)) {
            const product = products?.find((p) => p.id === productId);
            if (product) {
               const newInventory = Math.max(0, product.inventory - qty);
               await updateProduct({
                  productId: product.id,
                  body: { ...product, inventory: newInventory },
               });
            }
         }

         setCart({});
         saveToLocalStorage('cart', {});
         setShowPaymentStep(false);
         refreshCart();
         setOrderSuccess(true);
      } catch (error) {
         console.error('Error completing order:', error);
      }
   };

   const totalPriceOfEverything = productsWithQty.reduce(
      (total, { product, qty }) => total + priceWithDiscount(product) * qty,
      0
   );
   // Use the most common currency in cart (fallback USD)
   const cartCurrency = productsWithQty[0]?.product?.currency || 'USD';

   if (isLoading) return <div className="container"><p>Loading...</p></div>;

   if (orderSuccess) {
      return (
         <div className={s.pageCart}>
            <div className="container">
               <div className={s.successOrder}>
                  <h2>🎉 Order placed successfully!</h2>
                  <p>Thank you for your purchase. {userId ? 'You can track it in My Orders.' : ''}</p>
                  <button className={s.buyButton} onClick={() => { setOrderSuccess(false); navigate('/'); }}>
                     Continue Shopping
                  </button>
               </div>
            </div>
         </div>
      );
   }

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
               <div className={s.totalPrice}>
                  Total: {totalPriceOfEverything.toFixed(2)} {cartCurrency}
               </div>
               {showPaymentStep ? (
                  <PaymentAndDeliveryStep
                     totalPrice={totalPriceOfEverything}
                     handleCompleteOrder={handleCompleteOrder}
                     user={userData?.data}
                     currency={cartCurrency}
                  />
               ) : (
                  productsWithQty.length > 0 && <BuyButton handleBuy={() => setShowPaymentStep(true)} />
               )}
            </div>
         </div>
      </div>
   );
};
