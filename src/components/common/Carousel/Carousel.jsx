import React, { useState, useEffect, useCallback } from 'react';
import { Img } from '..';
import './carousel.css';
import s from './carousel.module.css';

/* ── Lightbox (full-screen zoom overlay) ── */
const Lightbox = ({ imgs, startIndex, onClose }) => {
   const [current, setCurrent] = useState(startIndex);

   const prev = useCallback(() => setCurrent((i) => (i - 1 + imgs.length) % imgs.length), [imgs.length]);
   const next = useCallback(() => setCurrent((i) => (i + 1) % imgs.length), [imgs.length]);

   // Keyboard navigation
   useEffect(() => {
      const handler = (e) => {
         if (e.key === 'Escape')       onClose();
         if (e.key === 'ArrowLeft')    prev();
         if (e.key === 'ArrowRight')   next();
      };
      document.addEventListener('keydown', handler);
      document.body.style.overflow = 'hidden';
      return () => {
         document.removeEventListener('keydown', handler);
         document.body.style.overflow = '';
      };
   }, [onClose, prev, next]);

   const getImgSrc = (img) => {
      if (!img) return '/imgs/products/not-found.png';
      if (img.startsWith('data:') || img.startsWith('http')) return img;
      return `/imgs/products/${img}`;
   };

   return (
      <div className={s.lightboxOverlay} onClick={onClose}>
         {/* Close */}
         <button className={s.lightboxClose} onClick={onClose} aria-label="Close">✕</button>

         {/* Counter */}
         {imgs.length > 1 && (
            <div className={s.lightboxCounter}>{current + 1} / {imgs.length}</div>
         )}

         {/* Image */}
         <div className={s.lightboxImgWrap} onClick={(e) => e.stopPropagation()}>
            <img
               src={getImgSrc(imgs[current])}
               alt={`Zoom ${current + 1}`}
               className={s.lightboxImg}
               onError={(e) => { e.target.src = '/imgs/products/not-found.png'; }}
            />
         </div>

         {/* Arrows */}
         {imgs.length > 1 && (
            <>
               <button className={`${s.lightboxArrow} ${s.lightboxPrev}`} onClick={(e) => { e.stopPropagation(); prev(); }} aria-label="Previous">‹</button>
               <button className={`${s.lightboxArrow} ${s.lightboxNext}`} onClick={(e) => { e.stopPropagation(); next(); }} aria-label="Next">›</button>
            </>
         )}

         {/* Thumbnails */}
         {imgs.length > 1 && (
            <div className={s.lightboxThumbs} onClick={(e) => e.stopPropagation()}>
               {imgs.map((img, i) => (
                  <button
                     key={i}
                     className={`${s.lightboxThumb} ${i === current ? s.lightboxThumbActive : ''}`}
                     onClick={() => setCurrent(i)}
                  >
                     <img src={getImgSrc(img)} alt={`thumb ${i + 1}`} onError={(e) => { e.target.src = '/imgs/products/not-found.png'; }} />
                  </button>
               ))}
            </div>
         )}
      </div>
   );
};

/* ── Main Carousel ── */
export const Carousel = ({ imgs }) => {
   const [lightboxOpen, setLightboxOpen] = useState(false);
   const [lightboxIndex, setLightboxIndex] = useState(0);

   const hasImgs = Array.isArray(imgs) && imgs.length > 0;

   const openLightbox = (index) => {
      setLightboxIndex(index);
      setLightboxOpen(true);
   };

   return (
      <>
         <div className={s.carousel}>
            <div id="carouselExampleIndicators" className="carousel slide">

               {/* Indicators */}
               <div className="carousel-indicators">
                  {hasImgs ? (
                     imgs.map((_, index) => (
                        <button
                           key={index}
                           type="button"
                           data-bs-target="#carouselExampleIndicators"
                           data-bs-slide-to={index}
                           aria-label={`Slide ${index + 1}`}
                           className={index === 0 ? 'active' : ''}
                           aria-current={index === 0 ? 'true' : undefined}
                        />
                     ))
                  ) : (
                     <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to={0} aria-label="Slide 1" className="active" aria-current="true" />
                  )}
               </div>

               {/* Slides */}
               <div className="carousel-inner">
                  {hasImgs ? (
                     imgs.map((img, i) => (
                        <div key={i} className={`carousel-item ${i === 0 ? 'active' : ''}`}>
                           <div
                              className={s.imgClickable}
                              onClick={() => openLightbox(i)}
                              title="Click to zoom"
                           >
                              <Img className="d-block w-100" folder="products" img={img} alt={`Product image ${i + 1}`} />
                              <div className={s.zoomHint}>🔍 Click to zoom</div>
                           </div>
                        </div>
                     ))
                  ) : (
                     <div className="carousel-item active">
                        <Img className="d-block w-100" folder="products" img="not-found2.png" alt="No image" />
                     </div>
                  )}
               </div>

               {/* Controls */}
               {hasImgs && imgs.length > 1 && (
                  <>
                     <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true" />
                        <span className="visually-hidden">Previous</span>
                     </button>
                     <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true" />
                        <span className="visually-hidden">Next</span>
                     </button>
                  </>
               )}
            </div>
         </div>

         {/* Lightbox portal */}
         {lightboxOpen && (
            <Lightbox
               imgs={hasImgs ? imgs : ['not-found2.png']}
               startIndex={lightboxIndex}
               onClose={() => setLightboxOpen(false)}
            />
         )}
      </>
   );
};
