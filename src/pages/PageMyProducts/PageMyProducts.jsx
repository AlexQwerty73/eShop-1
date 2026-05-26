import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGetProductsQuery, useDeleteProductMutation } from '../../redux';
import { useAuth } from '../../context';
import { useToast } from '../../context/ToastContext';
import { usePageTitle } from '../../hooks';
import { averageRating } from '../../utils';
import s from './pageMyProducts.module.css';

export const PageMyProducts = () => {
   usePageTitle('My Products');
   const { userId, isAdmin } = useAuth();
   const { showToast } = useToast();
   const navigate = useNavigate();
   const { data: allProducts = [], isLoading } = useGetProductsQuery();
   const [deleteProduct] = useDeleteProductMutation();
   const [search, setSearch] = useState('');
   const [sortBy, setSortBy] = useState('name');

   const myProducts = useMemo(() => {
      const base = isAdmin
         ? allProducts
         : allProducts.filter((p) => p.seller_id === userId);

      let list = base.filter((p) =>
         p.name.toLowerCase().includes(search.toLowerCase())
      );

      if (sortBy === 'name')     list = [...list].sort((a, b) => a.name.localeCompare(b.name));
      if (sortBy === 'price')    list = [...list].sort((a, b) => a.price - b.price);
      if (sortBy === 'stock')    list = [...list].sort((a, b) => a.inventory - b.inventory);
      if (sortBy === 'rating')   list = [...list].sort((a, b) => averageRating(b) - averageRating(a));
      if (sortBy === 'newest')   list = [...list].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));

      return list;
   }, [allProducts, userId, isAdmin, search, sortBy]);

   const handleDelete = async (product) => {
      if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
      try {
         await deleteProduct(product.id).unwrap();
         showToast('Product deleted', 'info');
      } catch {
         showToast('Failed to delete product', 'error');
      }
   };

   if (!userId) {
      return (
         <div className="container">
            <p>Please <Link to="/login">log in</Link> to view your products.</p>
         </div>
      );
   }

   const totalStock = myProducts.reduce((sum, p) => sum + (p.inventory || 0), 0);
   const outOfStock = myProducts.filter((p) => p.inventory === 0).length;

   return (
      <div className="container">
         <div className={s.pageHeader}>
            <div>
               <h1 className={s.title}>
                  {isAdmin ? '🔧 All Products' : '🏪 My Products'}
               </h1>
               <p className={s.subtitle}>
                  {myProducts.length} product{myProducts.length !== 1 ? 's' : ''} · {totalStock} in stock · {outOfStock} out of stock
               </p>
            </div>
            <Link to="/sell/" className={s.addBtn}>+ Add New Product</Link>
         </div>

         {/* Toolbar */}
         <div className={s.toolbar}>
            <input
               className={s.searchInput}
               type="text"
               placeholder="🔍 Search by name..."
               value={search}
               onChange={(e) => setSearch(e.target.value)}
            />
            <select className={s.sortSelect} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
               <option value="name">Sort: Name A–Z</option>
               <option value="price">Sort: Price</option>
               <option value="stock">Sort: Stock</option>
               <option value="rating">Sort: Top Rated</option>
               <option value="newest">Sort: Newest</option>
            </select>
         </div>

         {isLoading ? (
            <p className={s.loading}>Loading products...</p>
         ) : myProducts.length === 0 ? (
            <div className={s.empty}>
               <div className={s.emptyIcon}>📦</div>
               <p>{search ? 'No products match your search.' : "You haven't published any products yet."}</p>
               {!search && <Link to="/sell/" className={s.addBtn}>Publish Your First Product</Link>}
            </div>
         ) : (
            <div className={s.grid}>
               {myProducts.map((product) => (
                  <div key={product.id} className={`${s.card} ${product.inventory === 0 ? s.cardSoldOut : ''}`}>
                     {/* Product image */}
                     <Link to={`/product/${product.id}`} className={s.imgWrap}>
                        {product.imgs?.[0] ? (
                           <img src={product.imgs[0]} alt={product.name} className={s.img} />
                        ) : (
                           <div className={s.imgPlaceholder}>📷</div>
                        )}
                        {product.inventory === 0 && (
                           <span className={s.soldOutBadge}>Out of Stock</span>
                        )}
                        {product.discount > 0 && (
                           <span className={s.discountBadge}>-{(product.discount * 100).toFixed(0)}%</span>
                        )}
                     </Link>

                     {/* Product info */}
                     <div className={s.info}>
                        <Link to={`/product/${product.id}`} className={s.productName}>
                           {product.name}
                        </Link>
                        <div className={s.meta}>
                           <span className={s.price}>{product.price} {product.currency}</span>
                           <span className={`${s.stock} ${product.inventory === 0 ? s.stockOut : product.inventory < 5 ? s.stockLow : ''}`}>
                              {product.inventory === 0 ? '✗ Out of stock' : `✓ ${product.inventory} in stock`}
                           </span>
                        </div>
                        <div className={s.category}>
                           {(product.category || []).map((c) => (
                              <span key={c} className={s.catTag}>{c}</span>
                           ))}
                        </div>
                        <div className={s.stats}>
                           <span>⭐ {averageRating(product).toFixed(1)}</span>
                           <span>💬 {(product.reviews || []).length} reviews</span>
                           {isAdmin && product.seller_name && (
                              <span className={s.seller}>🏪 {product.seller_name}</span>
                           )}
                        </div>
                     </div>

                     {/* Actions */}
                     <div className={s.actions}>
                        <button
                           className={s.editBtn}
                           onClick={() => navigate(`/sell/edit/${product.id}`)}
                        >
                           ✏️ Edit
                        </button>
                        <button
                           className={s.deleteBtn}
                           onClick={() => handleDelete(product)}
                        >
                           🗑 Delete
                        </button>
                     </div>
                  </div>
               ))}
            </div>
         )}
      </div>
   );
};
