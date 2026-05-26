import React, { useState, useEffect } from 'react';
import s from './pageCart.module.css';
import { loadFromLocalStorage, priceWithDiscount, saveToLocalStorage } from '../../utils';
import {
   useGetProductsQuery,
   useGetUsersQuery,
   useUpdateUserMutation,
   useUpdateProductMutation,
} from '../../redux';
import { CartTable } from './components';
import { PaymentAndDeliveryStep, DELIVERY_OPTIONS, PAYMENT_OPTIONS } from './components/PaymentAndDeliveryStep/PaymentAndDeliveryStep';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { usePageTitle } from '../../hooks';
import { useNavigate, Link } from 'react-router-dom';
import { useGetPromoCodesQuery, useUpdatePromoCodeMutation } from '../../redux';

export const PageCart = () => {
   usePageTitle('Cart');
   const navigate  = useNavigate();
   const { userId } = useAuth();
   const { refreshCart } = useCart();

   const [cart, setCart] = useState(loadFromLocalStorage('cart') || {});
   const [productsWithQty, setProductsWithQty] = useState([]);
   const [step, setStep] = useState(1); // 1 = cart, 2 = checkout
   const [orderSuccess, setOrderSuccess] = useState(false);

   /* ── Checkout state (lifted from PaymentAndDeliveryStep) ── */
   const [delivery,   setDelivery]   = useState(DELIVERY_OPTIONS[0]);
   const [payment,    setPayment]    = useState(PAYMENT_OPTIONS[0]);
   const [address,    setAddress]    = useState('');
   const [firstName,  setFirstName]  = useState('');
   const [lastName,   setLastName]   = useState('');
   const [email,      setEmail]      = useState('');
   const [validationError, setValidationError] = useState('');

   /* ── Promo code (shown in sidebar at all steps) ── */
   const [promoInput,   setPromoInput]   = useState('');
   const [appliedPromo, setAppliedPromo] = useState(null);
   const [promoMsg,     setPromoMsg]     = useState('');
   const [promoError,   setPromoError]   = useState('');

   const { data: products,    isLoading }  = useGetProductsQuery();
   const { data: promoCodes = [] }         = useGetPromoCodesQuery();
   const [updateUser]      = useUpdateUserMutation();
   const [updateProduct]   = useUpdateProductMutation();
   const [updatePromoCode] = useUpdatePromoCodeMutation();

   const userData = useGetUsersQuery(userId, { skip: !userId });
   const user     = userData?.data;

   /* Auto-fill contact info from user profile */
   useEffect(() => {
      if (user) {
         setFirstName(user.first_name || '');
         setLastName(user.last_name   || '');
         setEmail(user.email          || '');
      }
   }, [user]);

   /* Build productsWithQty from cart + fetched products */
   useEffect(() => {
      if (products) {
         const updated = Object.entries(cart).map(([productId, qty]) => {
            const product = products.find((p) => p.id === productId);
            return product ? { product, qty } : null;
         }).filter(Boolean);
         setProductsWithQty(updated);
      }
   }, [cart, products]);

   /* ── Cart mutations ── */
   const handleQuantityChange = (productId, newQty) => {
      if (newQty < 1) return;
      const updated = { ...cart, [productId]: newQty };
      setCart(updated);
      saveToLocalStorage('cart', updated);
      refreshCart();
   };

   const handleDeleteItem = (productId) => {
      const updated = { ...cart };
      delete updated[productId];
      setCart(updated);
      saveToLocalStorage('cart', updated);
      refreshCart();
   };

   /* ── Price calculations ── */
   const subtotal = productsWithQty.reduce(
      (sum, { product, qty }) => sum + priceWithDiscount(product) * qty, 0
   );
   const currency      = productsWithQty[0]?.product?.currency || 'USD';
   const deliveryCost  = delivery.price;
   const paymentCost   = payment.price;
   const promoDiscount = appliedPromo?.discountAmount || 0;
   const total         = Math.max(0, subtotal + deliveryCost + paymentCost - promoDiscount);

   /* ── Promo code ── */
   const now = new Date();

   const handleApplyPromo = () => {
      setPromoMsg('');
      setPromoError('');
      const code  = promoInput.trim().toUpperCase();
      const promo = promoCodes.find((p) => p.code.toUpperCase() === code);

      if (!promo)                                               { setPromoError('Promo code not found.');                                        return; }
      if (!promo.isActive)                                      { setPromoError('This promo code is no longer active.');                          return; }
      if (new Date(promo.expiresAt) < now)                      { setPromoError('This promo code has expired.');                                  return; }
      if (promo.maxUses > 0 && promo.usedCount >= promo.maxUses){ setPromoError('This promo code has reached its usage limit.');                  return; }
      if (promo.minOrderAmount > 0 && subtotal < promo.minOrderAmount) { setPromoError(`Minimum order $${promo.minOrderAmount} required.`); return; }

      const discount = promo.discountType === 'percent'
         ? +(subtotal * (promo.discountPercent / 100)).toFixed(2)
         : +Math.min(promo.discountFixed, subtotal).toFixed(2);

      setAppliedPromo({ ...promo, discountAmount: discount });
      setPromoMsg(`✓ Code applied! You save $${discount.toFixed(2)}`);
   };

   /* ── Proceed to checkout validation ── */
   const handleProceed = () => {
      if (productsWithQty.length === 0) return;
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
   };

   /* ── Complete order ── */
   const handleCompleteOrder = async () => {
      setValidationError('');

      if (delivery.id === 1 && !address.trim())       { setValidationError('Please enter your delivery address.'); return; }
      if (delivery.id !== 1 && !address)              { setValidationError('Please select a pickup point.'); return; }
      if (!user && (!firstName.trim() || !lastName.trim() || !email.trim())) {
         setValidationError('Please fill in your name and email.');
         return;
      }

      const orderProducts = Object.keys(cart).map((pid) => {
         const found = products?.find((p) => p.id === pid);
         if (!found) return null;
         return { id: pid, price: found.price, name: found.name, discount: found.discount, quantity: cart[pid] };
      }).filter(Boolean);

      const order = {
         id:            `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
         date:          new Date().toISOString(),
         isDelivered:   false,
         isCancelled:   false,
         delivery,
         payment,
         totalPrice:    total,
         address,
         first_name:    user ? (user.first_name || '') : firstName,
         last_name:     user ? (user.last_name  || '') : lastName,
         email:         user ? (user.email      || '') : email,
         promoCode:     appliedPromo?.code          || null,
         promoDiscount: appliedPromo?.discountAmount || 0,
         products:      orderProducts,
      };

      try {
         if (user) {
            await updateUser({ ...user, orders: [...(user.orders || []), order] });
         }
         if (appliedPromo) {
            await updatePromoCode({ ...appliedPromo, usedCount: appliedPromo.usedCount + 1 }).catch(() => {});
         }
         for (const [pid, qty] of Object.entries(cart)) {
            const p = products?.find((x) => x.id === pid);
            if (p) await updateProduct({ productId: p.id, body: { ...p, inventory: Math.max(0, p.inventory - qty) } });
         }

         setCart({});
         saveToLocalStorage('cart', {});
         refreshCart();
         setOrderSuccess(true);
      } catch (err) {
         console.error('Order error:', err);
         setValidationError('Something went wrong. Please try again.');
      }
   };

   /* ── Loading ── */
   if (isLoading) {
      return (
         <div className={s.page}>
            <div className="container" style={{ textAlign: 'center', padding: '80px 0', color: '#9ca3af' }}>
               Loading...
            </div>
         </div>
      );
   }

   /* ── Success screen ── */
   if (orderSuccess) {
      return (
         <div className={s.page}>
            <div className="container">
               <div className={s.successScreen}>
                  <div className={s.successIcon}>🎉</div>
                  <h2 className={s.successTitle}>Order placed!</h2>
                  <p className={s.successSub}>
                     Thank you for your purchase.{' '}
                     {userId
                        ? 'You can track it in your orders.'
                        : 'Check your email for confirmation.'}
                  </p>
                  {userId && (
                     <Link to="/orders/" style={{ display: 'inline-block', marginBottom: 12 }}>
                        <button className={s.ctaBtn} style={{ width: 'auto', padding: '12px 32px' }}>
                           My Orders →
                        </button>
                     </Link>
                  )}
                  <br />
                  <button
                     className={s.ctaBtnSecondary}
                     style={{ width: 'auto', padding: '10px 32px' }}
                     onClick={() => { setOrderSuccess(false); navigate('/'); }}
                  >
                     Continue Shopping
                  </button>
               </div>
            </div>
         </div>
      );
   }

   /* ── Empty cart ── */
   if (!isLoading && productsWithQty.length === 0 && step === 1) {
      return (
         <div className={s.page}>
            <div className="container">
               <div className={s.emptyCart}>
                  <div className={s.emptyIcon}>🛒</div>
                  <h2 className={s.emptyTitle}>Your cart is empty</h2>
                  <p className={s.emptySub}>Looks like you haven't added anything yet.</p>
                  <button className={s.ctaBtn} style={{ width: 'auto', padding: '12px 32px' }} onClick={() => navigate('/')}>
                     Start Shopping →
                  </button>
               </div>
            </div>
         </div>
      );
   }

   /* ── Order summary sidebar (shared) ── */
   const OrderSummary = () => (
      <div className={s.card}>
         <div className={s.summaryTitle}>Order Summary</div>

         <div className={s.summaryItems}>
            {productsWithQty.map(({ product, qty }) => (
               <div key={product.id} className={s.summaryItem}>
                  <span className={s.summaryItemName}>{product.name} × {qty}</span>
                  <span className={s.summaryItemPrice}>
                     {(priceWithDiscount(product) * qty).toFixed(2)} {currency}
                  </span>
               </div>
            ))}
         </div>

         <div className={s.summaryDivider} />

         <div className={s.summaryRow}>
            <span>Subtotal</span>
            <span className={s.summaryRowValue}>{subtotal.toFixed(2)} {currency}</span>
         </div>
         <div className={s.summaryRow}>
            <span>Delivery</span>
            <span className={s.summaryRowValue}>
               {deliveryCost === 0 ? 'Free' : `+${deliveryCost.toFixed(2)} ${currency}`}
            </span>
         </div>
         {paymentCost > 0 && (
            <div className={s.summaryRow}>
               <span>Payment fee</span>
               <span className={s.summaryRowValue}>+{paymentCost.toFixed(2)} {currency}</span>
            </div>
         )}
         {promoDiscount > 0 && (
            <div className={s.summaryRow}>
               <span>Promo discount</span>
               <span className={s.summaryRowDiscount}>−{promoDiscount.toFixed(2)} {currency}</span>
            </div>
         )}

         <div className={s.summaryTotal}>
            <span>Total</span>
            <span>{total.toFixed(2)} {currency}</span>
         </div>

         {/* Promo code */}
         <div className={s.promoSection}>
            <span className={s.promoLabel}>Promo code</span>
            {appliedPromo ? (
               <div className={s.promoApplied}>
                  <span>🎉 {appliedPromo.code} — −${appliedPromo.discountAmount.toFixed(2)}</span>
                  <button className={s.promoRemoveBtn} onClick={() => { setAppliedPromo(null); setPromoInput(''); setPromoMsg(''); setPromoError(''); }}>✕</button>
               </div>
            ) : (
               <div className={s.promoRow}>
                  <input
                     className={s.promoInput}
                     placeholder="Enter code"
                     value={promoInput}
                     onChange={e => setPromoInput(e.target.value)}
                     onKeyDown={e => e.key === 'Enter' && handleApplyPromo()}
                  />
                  <button className={s.promoApplyBtn} onClick={handleApplyPromo}>Apply</button>
               </div>
            )}
            {promoMsg   && <div className={s.promoMsg}>{promoMsg}</div>}
            {promoError && <div className={s.promoErr}>{promoError}</div>}
         </div>

         {/* CTA */}
         {step === 1 ? (
            <button className={s.ctaBtn} onClick={handleProceed} disabled={productsWithQty.length === 0}>
               Proceed to Checkout →
            </button>
         ) : (
            <button className={s.ctaBtn} onClick={handleCompleteOrder}>
               Place Order →
            </button>
         )}
         {step === 2 && (
            <button className={s.ctaBtnSecondary} onClick={() => { setStep(1); setValidationError(''); }}>
               ← Back to Cart
            </button>
         )}
      </div>
   );

   return (
      <div className={s.page}>
         <div className="container">

            {/* ── Step progress bar ── */}
            <div className={s.stepBar}>
               <div className={`${s.stepItem} ${step >= 1 ? s.active : ''}`}>
                  <div className={s.stepCircle}>{step > 1 ? '✓' : '1'}</div>
                  <span className={s.stepLabel}>Cart</span>
               </div>
               <div className={`${s.stepLine} ${step > 1 ? s.done : ''}`} />
               <div className={`${s.stepItem} ${step >= 2 ? s.active : ''}`}>
                  <div className={s.stepCircle}>2</div>
                  <span className={s.stepLabel}>Checkout</span>
               </div>
               <div className={s.stepLine} />
               <div className={s.stepItem}>
                  <div className={s.stepCircle}>3</div>
                  <span className={s.stepLabel}>Confirm</span>
               </div>
            </div>

            {/* ── 2-column layout ── */}
            <div className={s.layout}>

               {/* Left: cart items or checkout form */}
               <div className={s.mainCol}>
                  {step === 1 ? (
                     <div className={s.card}>
                        <div className={s.cardTitle}>🛒 Your Cart ({productsWithQty.length} item{productsWithQty.length !== 1 ? 's' : ''})</div>
                        <CartTable
                           productsWithQty={productsWithQty}
                           handleQuantityChange={handleQuantityChange}
                           handleDeleteItem={handleDeleteItem}
                        />
                     </div>
                  ) : (
                     <PaymentAndDeliveryStep
                        delivery={delivery}     setDelivery={setDelivery}
                        payment={payment}       setPayment={setPayment}
                        address={address}       setAddress={setAddress}
                        firstName={firstName}   setFirstName={setFirstName}
                        lastName={lastName}     setLastName={setLastName}
                        email={email}           setEmail={setEmail}
                        user={user}
                        validationError={validationError}
                     />
                  )}
               </div>

               {/* Right: order summary */}
               <div className={s.sidebar}>
                  <OrderSummary />
               </div>

            </div>
         </div>
      </div>
   );
};
