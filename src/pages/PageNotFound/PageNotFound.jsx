import React from 'react';
import { Link } from 'react-router-dom';
import { Img } from '../../components/common';

export const PageNotFound = () => {
   return (
      <div className='pageNotFound'>
         <div className="container">
            <h1>Page not found <Link to='/'>Home</Link></h1>
         </div>
      </div>
   );
};
