import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider, CartProvider, WishlistProvider, ToastProvider, CompareProvider } from './context';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
   <BrowserRouter>
      <Provider store={store}>
         <ToastProvider>
            <AuthProvider>
               <CartProvider>
                  <WishlistProvider>
                     <CompareProvider>
                        <App />
                     </CompareProvider>
                  </WishlistProvider>
               </CartProvider>
            </AuthProvider>
         </ToastProvider>
      </Provider>
   </BrowserRouter>
);
