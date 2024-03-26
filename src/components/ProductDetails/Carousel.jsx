import React from 'react';
import { Img } from '../common'
import s from './productDetails.module.css';
import './carousel.css';

export const Carousel = ({ product }) => {
   return (
      <div className={s.carousel}>
         <div id="carouselExampleIndicators" className="carousel slide">
            <div className="carousel-indicators">
               {
                  product.imgs.map((_, index) => (
                     <button
                        key={index}
                        type="button"
                        data-bs-target="#carouselExampleIndicators"
                        data-bs-slide-to={index}
                        aria-label={`Slide ${index + 1}`}
                        className={index === 0 ? 'active' : ''}
                        aria-current={index === 0 ? 'true' : 'false'}
                     ></button>
                  ))
               }
            </div>
            <div className="carousel-inner">

               {
                  product.imgs.map((img, i) => (
                     <div key={i} className={`carousel-item ${i === 0 ? 'active' : ''} ${s.p}`}>
                        <Img className="d-block w-100" folder='products' img={img} alt='img' />
                     </div>
                  ))
               }
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
               <span className="carousel-control-prev-icon" aria-hidden="true"></span>
               <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
               <span className="carousel-control-next-icon" aria-hidden="true"></span>
               <span className="visually-hidden">Next</span>
            </button>
         </div>
      </div>
   );
};