import React, { useState, useEffect } from 'react';
import s from '../../pageCart.module.css';
import { useGetPromoCodesQuery, useUpdatePromoCodeMutation } from '../../../../redux';

export const PaymentAndDeliveryStep = ({ totalPrice, handleCompleteOrder, user, currency = 'USD' }) => {
   const paymentOptions = [
      { id: 1, type: 'Free (pay by card now)', price: 0 },
      { id: 2, type: 'Payment on delivery',    price: 5 },
   ];

   const deliveryOptions = [
      { id: 1, type: 'Home delivery',           price: 10, addresses: [] },
      { id: 2, type: 'Delivery by Company 1',   price: 5,  addresses: ['Company 1 — Point A', 'Company 1 — Point B', 'Company 1 — Point C'] },
      { id: 3, type: 'Delivery by Company 2',   price: 4,  addresses: ['Company 2 — Point A', 'Company 2 — Point B', 'Company 2 — Point C'] },
   ];

   const [selectedPayment,  setSelectedPayment]  = useState(paymentOptions[0]);
   const [selectedDelivery, setSelectedDelivery] = useState(deliveryOptions[0]);
   const [selectedAddress,  setSelectedAddress]  = useState('');
   const [first_name, setFirstName] = useState('');
   const [last_name,  setLastName]  = useState('');
   const [email,      setEmail]     = useState('');
   const [validationError, setValidationError] = useState('');

   // Promo code state
   const [promoInput, setPromoInput]       = useState('');
   const [appliedPromo, setAppliedPromo]   = useState(null); // { code, discount }
   const [promoMsg,    setPromoMsg]        = useState('');
   const [promoError,  setPromoError]      = useState('');

   const { data: promoCodes = [] } = useGetPromoCodesQuery();
   const [updatePromoCode] = useUpdatePromoCodeMutation();

   useEffect(() => {
      if (user) {
         setFirstName(user.first_name || '');
         setLastName(user.last_name  || '');
         setEmail(user.email        || '');
      }
   }, [user]);

   const handleDeliveryChange = (delivery) => {
      setSelectedDelivery(delivery);
      setSelectedAddress('');
   };

   const now = new Date();

   const calculateDiscount = (promo, baseTotal) => {
      if (promo.discountType === 'percent') {
         return +(baseTotal * (promo.discountPercent / 100)).toFixed(2);
      }
      return +Math.min(promo.discountFixed, baseTotal).toFixed(2);
   };

   const handleApplyPromo = () => {
      setPromoMsg('');
      setPromoError('');
      const code = promoInput.trim().toUpperCase();
      const promo = promoCodes.find((p) => p.code.toUpperCase() === code);

      if (!promo) {
         setPromoError('Promo code not found.');
         return;
      }
      if (!promo.isActive) {
         setPromoError('This promo code is no longer active.');
         return;
      }
      if (new Date(promo.expiresAt) < now) {
         setPromoError('This promo code has expired.');
         return;
      }
      if (promo.maxUses > 0 && promo.usedCount >= promo.maxUses) {
         setPromoError('This promo code has reached its usage limit.');
         return;
      }
      if (promo.minOrderAmount > 0 && totalPrice < promo.minOrderAmount) {
         setPromoError(`Minimum order amount for this code is $${promo.minOrderAmount}.`);
         return;
      }

      const discount = calculateDiscount(promo, totalPrice);
      setAppliedPromo({ ...promo, discountAmount: discount });
      setPromoMsg(`✓ Code applied! You save $${discount.toFixed(2)}`);
   };

   const handleRemovePromo = () => {
      setAppliedPromo(null);
      setPromoInput('');
      setPromoMsg('');
      setPromoError('');
   };

   const calculateTotalPrice = () => {
      const base = totalPrice + selectedPayment.price + selectedDelivery.price;
      return appliedPromo ? Math.max(0, base - appliedPromo.discountAmount) : base;
   };

   const handleCompleteOrderClick = async () => {
      setValidationError('');

      if (selectedDelivery.id === 1 && !selectedAddress.trim()) {
         setValidationError('Please enter your delivery address.');
         return;
      }
      if (selectedDelivery.id !== 1 && !selectedAddress) {
         setValidationError('Please select a pickup point for the chosen delivery method.');
         return;
      }
      if (!user) {
         if (!first_name.trim() || !last_name.trim() || !email.trim()) {
            setValidationError('Please fill in your name and email to complete the order.');
            return;
         }
      }

      // Increment promo usedCount
      if (appliedPromo) {
         try {
            await updatePromoCode({ ...appliedPromo, usedCount: appliedPromo.usedCount + 1 });
         } catch { /* non-blocking */ }
      }

      const orderData = {
         payment:       selectedPayment,
         delivery:      selectedDelivery,
         address:       selectedAddress,
         totalPrice:    calculateTotalPrice(),
         first_name:    user ? (user.first_name || '') : first_name,
         last_name:     user ? (user.last_name  || '') : last_name,
         email:         user ? (user.email      || '') : email,
         promoCode:     appliedPromo?.code || null,
         promoDiscount: appliedPromo?.discountAmount || 0,
      };

      handleCompleteOrder(orderData);
   };

   return (
      <div className={s.paymentDeliveryStep}>
         <h2>Payment &amp; Delivery</h2>

         {/* Payment */}
         <h3>Payment method:</h3>
         {paymentOptions.map((p) => (
            <div key={p.id} className={s.option}>
               <label>
                  <input type="radio" checked={selectedPayment.id === p.id} onChange={() => setSelectedPayment(p)} />
                  {' '}{p.type}{p.price > 0 && ` (+$${p.price})`}
               </label>
            </div>
         ))}

         {/* Delivery */}
         <h3>Delivery method:</h3>
         {deliveryOptions.map((d) => (
            <div key={d.id} className={s.option}>
               <label>
                  <input type="radio" checked={selectedDelivery.id === d.id} onChange={() => handleDeliveryChange(d)} />
                  {' '}{d.type} (+${d.price})
               </label>
               {d.addresses.length > 0 && selectedDelivery.id === d.id && (
                  <select value={selectedAddress} onChange={(e) => setSelectedAddress(e.target.value)} style={{ display: 'block', marginTop: 6, width: '100%', padding: '6px 8px' }}>
                     <option value="">— Select a pickup point —</option>
                     {d.addresses.map((addr, i) => (
                        <option key={i} value={addr}>{addr}</option>
                     ))}
                  </select>
               )}
            </div>
         ))}

         {/* Home delivery — manual address input */}
         {selectedDelivery.id === 1 && (
            <div className={s.addressInput}>
               <label>
                  Your address:
                  <input type="text" value={selectedAddress} onChange={(e) => setSelectedAddress(e.target.value)} placeholder="Street, city, postal code" />
               </label>
            </div>
         )}

         {/* Guest fields */}
         {!user && (
            <>
               <h3>Contact info:</h3>
               <div className={s.nameInput}>
                  <label>First Name</label>
                  <input type="text" value={first_name} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" />
               </div>
               <div className={s.nameInput}>
                  <label>Last Name</label>
                  <input type="text" value={last_name} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" />
               </div>
               <div className={s.emailInput}>
                  <label>Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" />
               </div>
            </>
         )}

         {/* Promo code */}
         <h3>Promo Code:</h3>
         {appliedPromo ? (
            <div className={s.promoApplied}>
               <span>🎉 <strong>{appliedPromo.code}</strong> — -${appliedPromo.discountAmount.toFixed(2)}</span>
               <button className={s.removePromo} onClick={handleRemovePromo}>Remove</button>
            </div>
         ) : (
            <div className={s.promoRow}>
               <input
                  type="text"
                  className={s.promoInput}
                  placeholder="Enter promo code"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleApplyPromo()}
               />
               <button className={s.promoBtn} onClick={handleApplyPromo}>Apply</button>
            </div>
         )}
         {promoMsg   && <div className={s.promoSuccess}>{promoMsg}</div>}
         {promoError && <div className={s.promoError}>{promoError}</div>}

         {validationError && (
            <div className={s.validationError}>{validationError}</div>
         )}

         <div className={s.totalPrice}>
            {appliedPromo && (
               <div className={s.promoSavings}>
                  <span>Discount: -${appliedPromo.discountAmount.toFixed(2)}</span>
               </div>
            )}
            Total: {calculateTotalPrice().toFixed(2)} {currency}
         </div>

         <button onClick={handleCompleteOrderClick} className={s.completeOrderButton}>
            Complete Order
         </button>
      </div>
   );
};
