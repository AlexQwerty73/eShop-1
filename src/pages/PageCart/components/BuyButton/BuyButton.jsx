import React from 'react';
import s from '../../pageCart.module.css';

export const BuyButton = ({ handleBuy }) => {
   return <button onClick={handleBuy} className={s.buyButton}>Buy</button>;
};
