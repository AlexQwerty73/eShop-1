import React from 'react';
import { useGetProductsQuery } from '../../redux';
import { useWishlist } from '../../context';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { Img, RenderStars } from '../../components/common';
import { Link } from 'react-router-dom';
import { averageRating, loadFromLocalStorage, priceWithDiscount, saveToLocalStorage } from '../../utils';
import { usePageTitle } from '../../hooks';
import s from './pageWishlist.module.css';

export const PageWishlist = () => {
   usePageTitle('Wishlist');
   const { wishlist, toggleWishlist } = useWishlist();
   const { refreshCart } = useCart();
   const { showToast } = useToast();
   const { data: allProducts = [], isLoading } = useGetProductsQuery();

   const wishlistProducts = allProducts.filter((p) => wishlist.includes(p.id));

   const handleAddToCart = (product) => {
      if (product.inventory === 0) return;
      const cart = loadFromLocalStorage('cart') || {};
      cart[product.id] = (cart[product.id] || 0) + 1;
      saveToLocalStorage('cart', cart);
      refreshCart();
      showToast(`${product.name} added to cart!`, 'success');
   };

   const handleRemoveFromWishlist = (productId) => {
      toggleWishlist(productId);
      showToast('Removed from wishlist', 'info');
   };

   if (isLoading) return <div className="container"><p>Loading...</p></div>;

   return (
      <div className={s.page}>
         <div className="container">
            <h1 className={s.title}>♥ My Wishlist</h1>

            {wishlistProducts.length === 0 ? (
               <div className={s.empty}>
                  <p>Your wishlist is empty.</p>
                  <Link to="/" className={s.link}>Browse Products</Link>
               </div>
            ) : (
               <>
                  <p className={s.count}>{wishlistProducts.length} item{wishlistProducts.length !== 1 ? 's' : ''}</p>
                  <div className={s.grid}>
                     {wishlistProducts.map((product) => {
                        const discounted = product.discount > 0;
                        const finalPrice = priceWithDiscount(product);
                        const outOfStock = product.inventory === 0;

                        return (
                           <div key={product.id} className={`${s.card} ${outOfStock ? s.soldOut : ''}`}>
                              <button
                                 className={s.removeBtn}
                                 onClick={() => handleRemoveFromWishlist(product.id)}
                                 title="Remove from wishlist"
                              >♥</button>

                              <Link to={`/product/${product.id}`} className={s.imgLink}>
                                 <div className={s.imgWrap}>
                                    <Img folder="products" img={product.imgs?.[0]} alt={product.name} />
                                 </div>
                              </Link>

                              <div className={s.info}>
                                 <Link to={`/product/${product.id}`} className={s.name}>{product.name}</Link>
                                 <div className={s.stars}>
                                    <RenderStars rating={averageRating(product)} />
                                 </div>
                                 <div className={s.priceRow}>
                                    {discounted ? (
                                       <>
                                          <span className={s.oldPrice}>{product.price} {product.currency}</span>
                                          <span className={s.newPrice}>{finalPrice} {product.currency}</span>
                                       </>
                                    ) : (
                                       <span className={s.newPrice}>{product.price} {product.currency}</span>
                                    )}
                                 </div>
                                 {outOfStock ? (
                                    <div className={s.outOfStock}>⚠ Out of stock</div>
                                 ) : (
                                    <button className={s.addToCart} onClick={() => handleAddToCart(product)}>
                                       🛒 Add to Cart
                                    </button>
                                 )}
                              </div>
                           </div>
                        );
                     })}
                  </div>
               </>
            )}
         </div>
      </div>
   );
};
