import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductsList } from '../../components';
import { useGetProductsQuery } from '../../redux';
import { averageRating } from '../../utils';
import { SkeletonGrid } from '../../components/common/Skeleton/SkeletonCard';
import { usePageTitle } from '../../hooks';
import s from './pageHome.module.css';

const PRODUCTS_PER_PAGE = 6;

export const PageHome = () => {
   usePageTitle('Home');
   const { data: productsData = [], isLoading } = useGetProductsQuery();
   const [searchParams] = useSearchParams();

   const [searchQuery, setSearchQuery]     = useState(searchParams.get('q') || '');
   const [showSuggestions, setShowSuggestions] = useState(false);

   // Sync search field when URL ?q= changes (header search)
   useEffect(() => {
      const q = searchParams.get('q') || '';
      setSearchQuery(q);
   }, [searchParams]);
   const [selectedCategory, setSelectedCategory] = useState('');
   const [sortBy, setSortBy]               = useState('default');
   const [minPrice, setMinPrice]           = useState('');
   const [maxPrice, setMaxPrice]           = useState('');
   const [inStockOnly, setInStockOnly]     = useState(false);
   const [minRating, setMinRating]         = useState(0); // 0 = all
   const [visibleCount, setVisibleCount]   = useState(PRODUCTS_PER_PAGE);

   const loaderRef = useRef(null);
   const topRef    = useRef(null);

   // Unique categories
   const categories = useMemo(
      () => [...new Set(productsData.flatMap((p) => p.category || []))].sort(),
      [productsData]
   );

   // Autocomplete suggestions
   const suggestions = useMemo(() => {
      if (!searchQuery.trim() || searchQuery.length < 2) return [];
      const q = searchQuery.toLowerCase();
      return productsData
         .filter((p) => p.name.toLowerCase().includes(q))
         .map((p) => p.name)
         .slice(0, 6);
   }, [productsData, searchQuery]);

   // Price bounds for placeholder
   const priceStats = useMemo(() => {
      if (!productsData.length) return { min: 0, max: 9999 };
      const prices = productsData.map((p) => p.price);
      return { min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) };
   }, [productsData]);

   // Filter + sort
   const filtered = useMemo(() => {
      let list = productsData.filter((p) => {
         const matchSearch   = p.name.toLowerCase().includes(searchQuery.toLowerCase());
         const matchCategory = !selectedCategory || (p.category || []).includes(selectedCategory);
         const matchMin      = minPrice === '' || p.price >= parseFloat(minPrice);
         const matchMax      = maxPrice === '' || p.price <= parseFloat(maxPrice);
         const matchStock    = !inStockOnly || p.inventory > 0;
         const matchRating   = !minRating || averageRating(p) >= minRating;
         return matchSearch && matchCategory && matchMin && matchMax && matchStock && matchRating;
      });

      if (sortBy === 'price_asc')  list = [...list].sort((a, b) => a.price - b.price);
      else if (sortBy === 'price_desc') list = [...list].sort((a, b) => b.price - a.price);
      else if (sortBy === 'rating')    list = [...list].sort((a, b) => averageRating(b) - averageRating(a));
      else if (sortBy === 'discount')  list = [...list].sort((a, b) => b.discount - a.discount);

      return list;
   }, [productsData, searchQuery, selectedCategory, sortBy, minPrice, maxPrice, inStockOnly, minRating]);

   // Infinite scroll
   const hasMore = visibleCount < filtered.length;

   const loadMore = useCallback(() => {
      setVisibleCount((prev) => Math.min(prev + PRODUCTS_PER_PAGE, filtered.length));
   }, [filtered.length]);

   useEffect(() => {
      const el = loaderRef.current;
      if (!el || !hasMore) return;
      const observer = new IntersectionObserver(
         (entries) => { if (entries[0].isIntersecting) loadMore(); },
         { threshold: 0.1 }
      );
      observer.observe(el);
      return () => observer.disconnect();
   }, [hasMore, loadMore]);

   // Reset + scroll to top when filters change
   useEffect(() => {
      setVisibleCount(PRODUCTS_PER_PAGE);
      topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
   }, [searchQuery, selectedCategory, sortBy, minPrice, maxPrice, inStockOnly, minRating]);

   const visible = filtered.slice(0, visibleCount);

   return (
      <div className="pageHome">
         <div className="container" ref={topRef}>

            {/* Controls */}
            <div className={s.controls}>
               <div className={s.searchWrap}>
                  <input
                     className={s.searchInput}
                     type="text"
                     placeholder="🔍 Search products..."
                     value={searchQuery}
                     onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
                     onFocus={() => setShowSuggestions(true)}
                     onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                     autoComplete="off"
                  />
                  {showSuggestions && suggestions.length > 0 && (
                     <ul className={s.suggestions}>
                        {suggestions.map((name) => (
                           <li
                              key={name}
                              className={s.suggestion}
                              onMouseDown={() => { setSearchQuery(name); setShowSuggestions(false); }}
                           >
                              🔍 {name}
                           </li>
                        ))}
                     </ul>
                  )}
               </div>

               <select className={s.select} value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                  <option value="">All categories</option>
                  {categories.map((cat) => (
                     <option key={cat} value={cat}>{cat}</option>
                  ))}
               </select>

               <select className={s.select} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="default">Sort: Default</option>
                  <option value="price_asc">Price: Low → High</option>
                  <option value="price_desc">Price: High → Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="discount">Biggest Discount</option>
               </select>
            </div>

            {/* Price range */}
            <div className={s.priceRange}>
               <span className={s.priceRangeLabel}>Price:</span>
               <input
                  className={s.priceInput}
                  type="number"
                  placeholder={`Min (${priceStats.min})`}
                  value={minPrice}
                  min={0}
                  onChange={(e) => setMinPrice(e.target.value)}
               />
               <span className={s.priceSep}>—</span>
               <input
                  className={s.priceInput}
                  type="number"
                  placeholder={`Max (${priceStats.max})`}
                  value={maxPrice}
                  min={0}
                  onChange={(e) => setMaxPrice(e.target.value)}
               />
               {(minPrice || maxPrice) && (
                  <button className={s.clearPrice} onClick={() => { setMinPrice(''); setMaxPrice(''); }}>
                     ✕
                  </button>
               )}
            </div>

            {/* Bottom filter row: stock toggle + rating filter */}
            <div className={s.bottomFilters}>
               <label className={s.stockToggle}>
                  <input
                     type="checkbox"
                     checked={inStockOnly}
                     onChange={(e) => setInStockOnly(e.target.checked)}
                  />
                  <span className={s.stockToggleLabel}>In Stock Only</span>
               </label>

               <div className={s.ratingFilter}>
                  <span className={s.ratingFilterLabel}>Min rating:</span>
                  {[0, 1, 2, 3, 4, 5].map((star) => (
                     <button
                        key={star}
                        className={`${s.ratingBtn} ${minRating === star ? s.ratingBtnActive : ''}`}
                        onClick={() => setMinRating(star)}
                        title={star === 0 ? 'All ratings' : `${star}★ and above`}
                     >
                        {star === 0 ? 'All' : `${star}★`}
                     </button>
                  ))}
               </div>
            </div>

            {/* Results count */}
            {!isLoading && (
               <p className={s.resultsCount}>
                  {filtered.length} product{filtered.length !== 1 ? 's' : ''} found
               </p>
            )}

            {/* Products grid or skeleton */}
            {isLoading ? (
               <SkeletonGrid count={PRODUCTS_PER_PAGE} />
            ) : visible.length > 0 ? (
               <>
                  <ProductsList products={visible} />
                  {hasMore && (
                     <div ref={loaderRef} className={s.sentinel}>
                        <SkeletonGrid count={3} />
                     </div>
                  )}
               </>
            ) : (
               <div className={s.noResults}>
                  <p>No products found. Try a different search or price range.</p>
               </div>
            )}

         </div>
      </div>
   );
};
