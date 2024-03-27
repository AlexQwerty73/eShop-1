import React from 'react';
import s from './productItem.module.css';
import { Img, RenderStars } from '../common'
import { Link } from 'react-router-dom';
import { averageRating, priceWithDiscount } from '../../utils';

export const ProductItem = ({ product }) => {
   const { price, discount, name, currency } = product;

   return (
      <div className={`${s.product} ${product.inventory === 0 ? s.soldout : ''}`}>
         <Link to={`product/${product.id}`}>
            <div className={s.img}>
               <Img folder='products' img={product.imgs[0] || 'not-found.png'} />
            </div>
            <div className={s.name}>{name}</div>
            {/* <div className={s.rating}><RenderStars rating={averageRating(product)} /></div> */}
            <div className={s.oldPrice}> {discount > 0 ? `${price} ${currency}` : ' '}</div>

            <div>
               {
                  discount > 0
                     ? <div className={s.priceDiscount}>{priceWithDiscount(product)} {currency}</div>
                     : <div className={s.price}>{price} {currency}</div>
               }
            </div>

         </Link>
      </div>
   );
};