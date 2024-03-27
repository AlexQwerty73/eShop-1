import React from 'react';
import { Img } from '..';
import './carousel.css';
import s from './carousel.module.css';

export const Carousel = ({ imgs }) => {
   return (
      <div className={s.carousel}>
         <div id="carouselExampleIndicators" className="carousel slide">
            <div className="carousel-indicators">
               {imgs && imgs.map((_, index) => (
                  <button
                     key={index}
                     type="button"
                     data-bs-target="#carouselExampleIndicators"
                     data-bs-slide-to={index}
                     aria-label={`Slide ${index + 1}`}
                     className={index === 0 ? 'active' : ''}
                     aria-current={index === 0 ? 'true' : 'false'}
                  ></button>
               ))}
               {!imgs && (
                  <button
                     key={0}
                     type="button"
                     data-bs-target="#carouselExampleIndicators"
                     data-bs-slide-to={0}
                     aria-label={`Slide 1`}
                     className={'active'}
                     aria-current={'true'}
                  ></button>
               )}
            </div>
            <div className="carousel-inner">
               {imgs ? (
                  imgs.map((img, i) => (
                     <div key={i} className={`carousel-item ${i === 0 ? 'active' : ''}`}>
                        <Img className="d-block w-100" folder='products' img={img} alt='img' />
                     </div>
                  ))
               ) : (
                  <div className='carousel-item active'>
                     <Img className="d-block w-100" folder='products' img='not-found.png' alt='img' />
                  </div>
               )}
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
