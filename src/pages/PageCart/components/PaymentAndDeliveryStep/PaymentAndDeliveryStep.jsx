import React, { useState, useEffect } from 'react';
import s from '../../pageCart.module.css';
import { loadFromLocalStorage } from '../../../../utils';

export const PaymentAndDeliveryStep = ({ totalPrice, handleCompleteOrder, user }) => {
   const paymentOptions = [
      { id: 1, type: 'Free (now by card)', price: 0 },
      { id: 2, type: 'Payment on delivery', price: 5 },
   ];

   const deliveryOptions = [
      {
         id: 1,
         type: 'Home delivery',
         price: 10,
         addresses: []
      },
      {
         id: 2,
         type: 'Delivery by Company 1',
         price: 5,
         addresses: ['Company 1 Address 1', 'Company 1 Address 2', 'Company 1 Address 3']
      },
      {
         id: 3,
         type: 'Delivery by Company 2',
         price: 4,
         addresses: ['Company 2 Address 1', 'Company 2 Address 2', 'Company 2 Address 3']
      },
   ];

   const [selectedPayment, setSelectedPayment] = useState(paymentOptions[0]);
   const [selectedDelivery, setSelectedDelivery] = useState(deliveryOptions[0]);
   const [selectedAddress, setSelectedAddress] = useState('');
   const [firstName, setFirstName] = useState('');
   const [lastName, setLastName] = useState('');
   const [email, setEmail] = useState('');

   useEffect(() => {
      if (user) {
         setFirstName(user.firstName || '');
         setLastName(user.lastName || '');
         setEmail(user.email || '');
      }
   }, [user]);

   const handlePaymentChange = (payment) => {
      setSelectedPayment(payment);
   };

   const handleDeliveryChange = (delivery) => {
      setSelectedDelivery(delivery);
      if (delivery.id === 1) {
         setSelectedAddress('');
      }
   };

   const handleAddressChange = (e) => {
      setSelectedAddress(e.target.value);
   };

   const calculateTotalPrice = () => {
      let total = totalPrice + selectedPayment.price + selectedDelivery.price;
      return total;
   };

   const handleCompleteOrderClick = () => {
      if (!selectedPayment || !selectedDelivery || (selectedDelivery.id === 1 && !selectedAddress)) {
         console.error("Please fill in all required fields");
         return;
      }
   
      const orderData = {
         payment: selectedPayment,
         delivery: selectedDelivery,
         address: selectedDelivery.id === 1 ? selectedAddress : '',
         totalPrice: calculateTotalPrice(),
         firstName: user ? firstName : '',
         lastName: user ? lastName : '',
         email: user ? email : ''
      };
   
      handleCompleteOrder(orderData);
   };
   
   return (
      <div className={s.paymentDeliveryStep}>
         <h2>Payment and Delivery</h2>
         <h3>Choose payment method:</h3>
         {paymentOptions.map((payment) => (
            <div key={payment.id} className={s.option}>
               <label>
                  <input
                     type="radio"
                     value={payment.type}
                     checked={selectedPayment.id === payment.id}
                     onChange={() => handlePaymentChange(payment)}
                  />
                  {payment.type} {payment.price !== 0 && `(+${payment.price})`}
               </label>
            </div>
         ))}
         <h3>Choose delivery method:</h3>
         {deliveryOptions.map((delivery) => (
            <div key={delivery.id} className={s.option}>
               <label>
                  <input
                     type="radio"
                     value={delivery.type}
                     checked={selectedDelivery.id === delivery.id}
                     onChange={() => handleDeliveryChange(delivery)}
                  />
                  {delivery.type} (+${delivery.price})
               </label>
               {delivery.addresses.length > 0 && delivery.id === selectedDelivery.id && (
                  <select value={selectedAddress} onChange={handleAddressChange}>
                     <option value="">Select an address</option>
                     {delivery.addresses.map((address, index) => (
                        <option key={index} value={address}>{address}</option>
                     ))}
                  </select>
               )}
            </div>
         ))}
         {selectedDelivery.id === 1 && (
            <div className={s.addressInput}>
               <label>
                  Enter your address:
                  <input type="text" value={selectedAddress} onChange={handleAddressChange} />
               </label>
            </div>
         )}
         {!user && (
            <>
               <div className={s.nameInput}>
                  <label>
                     First Name:
                     <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                  </label>
               </div>
               <div className={s.nameInput}>
                  <label>
                     Last Name:
                     <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                  </label>
               </div>
               <div className={s.emailInput}>
                  <label>
                     Email:
                     <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </label>
               </div>
            </>
         )}
         <div className={s.totalPrice}>Total Price: ${calculateTotalPrice().toFixed(2)}</div>
         <button onClick={handleCompleteOrderClick} className={s.completeOrderButton}>
            Complete Order
         </button>
      </div>
   );
};
