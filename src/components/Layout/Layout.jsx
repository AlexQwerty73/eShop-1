import React from 'react';
import { Outlet } from 'react-router-dom';
import { Footer, Header } from './components/';
import { BackToTop } from '../common/BackToTop';

export const Layout = () => {
   return (
      <>
         <Header />

         <main>
            <Outlet />
         </main>

         <Footer />
         <BackToTop />
      </>
   );
};
