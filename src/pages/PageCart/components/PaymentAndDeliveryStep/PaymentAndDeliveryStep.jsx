import React from 'react';
import s from '../../pageCart.module.css';

export const DELIVERY_OPTIONS = [
   { id: 1, icon: '🚚', name: 'Home Delivery',      desc: '2–4 business days',     price: 10, addresses: [] },
   { id: 2, icon: '📦', name: 'Company Express',    desc: '1–2 business days',     price: 5,  addresses: ['Point A — Downtown', 'Point B — North', 'Point C — East'] },
   { id: 3, icon: '🏪', name: 'Local Pickup',       desc: 'Ready in 2 hours',      price: 0,  addresses: ['Store A — Main St', 'Store B — Mall', 'Store C — Airport'] },
];

export const PAYMENT_OPTIONS = [
   { id: 1, icon: '💳', name: 'Card now',          desc: 'Visa / Mastercard / AMEX', price: 0 },
   { id: 2, icon: '💵', name: 'Pay on delivery',   desc: 'Cash or card at door',     price: 5 },
];

export const PaymentAndDeliveryStep = ({
   delivery, setDelivery,
   payment,  setPayment,
   address,  setAddress,
   firstName, setFirstName,
   lastName,  setLastName,
   email,     setEmail,
   user,
   validationError,
}) => (
   <div>
      {/* Guest contact info */}
      {!user && (
         <div className={s.card}>
            <div className={s.cardTitle}>👤 Contact info</div>
            <div className={s.guestNotice}>
               ℹ️ You're checking out as a guest — fill in your details below.
            </div>
            <div className={s.fieldRow}>
               <div className={s.fieldGroup}>
                  <label className={s.fieldLabel}>First Name *</label>
                  <input className={s.fieldInput} value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First name" />
               </div>
               <div className={s.fieldGroup}>
                  <label className={s.fieldLabel}>Last Name *</label>
                  <input className={s.fieldInput} value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last name" />
               </div>
            </div>
            <div className={s.fieldGroup}>
               <label className={s.fieldLabel}>Email *</label>
               <input className={s.fieldInput} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com" />
            </div>
         </div>
      )}

      {/* Delivery */}
      <div className={s.card}>
         <div className={s.cardTitle}>🚚 Delivery method</div>
         <div className={s.optionCards}>
            {DELIVERY_OPTIONS.map((d) => (
               <div key={d.id}>
                  <div
                     className={`${s.optionCard} ${delivery.id === d.id ? s.optionCardActive : ''}`}
                     onClick={() => { setDelivery(d); setAddress(''); }}
                  >
                     <span className={s.optionIcon}>{d.icon}</span>
                     <div className={s.optionBody}>
                        <div className={s.optionName}>{d.name}</div>
                        <div className={s.optionDesc}>{d.desc}</div>
                     </div>
                     <span className={`${s.optionPrice} ${d.price === 0 ? s.free : ''}`}>
                        {d.price === 0 ? 'Free' : `+$${d.price}`}
                     </span>
                     <div className={s.optionCheck} />
                  </div>

                  {/* Address input for Home Delivery */}
                  {delivery.id === d.id && d.id === 1 && (
                     <div className={s.fieldGroup} style={{ marginTop: 10 }}>
                        <label className={s.fieldLabel}>Delivery address *</label>
                        <input
                           className={s.fieldInput}
                           value={address}
                           onChange={e => setAddress(e.target.value)}
                           placeholder="Street, city, postal code"
                        />
                     </div>
                  )}

                  {/* Pickup point select */}
                  {delivery.id === d.id && d.addresses.length > 0 && (
                     <select
                        className={s.pickupSelect}
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                     >
                        <option value="">— Select a pickup point —</option>
                        {d.addresses.map((a) => (
                           <option key={a} value={a}>{a}</option>
                        ))}
                     </select>
                  )}
               </div>
            ))}
         </div>
      </div>

      {/* Payment */}
      <div className={s.card}>
         <div className={s.cardTitle}>💳 Payment method</div>
         <div className={s.optionCards}>
            {PAYMENT_OPTIONS.map((p) => (
               <div
                  key={p.id}
                  className={`${s.optionCard} ${payment.id === p.id ? s.optionCardActive : ''}`}
                  onClick={() => setPayment(p)}
               >
                  <span className={s.optionIcon}>{p.icon}</span>
                  <div className={s.optionBody}>
                     <div className={s.optionName}>{p.name}</div>
                     <div className={s.optionDesc}>{p.desc}</div>
                  </div>
                  <span className={`${s.optionPrice} ${p.price === 0 ? s.free : ''}`}>
                     {p.price === 0 ? 'Free' : `+$${p.price}`}
                  </span>
                  <div className={s.optionCheck} />
               </div>
            ))}
         </div>
      </div>

      {validationError && (
         <div className={s.validationError}>⚠️ {validationError}</div>
      )}
   </div>
);
