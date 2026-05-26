import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/';
import {
   PageCart, PageHome, PageOrders, PageNotFound,
   PageProduct, PageProfile, PageWishlist,
   PageSellProduct, PageAdmin, PageOrderDetail, PageCompare,
   PageAdminDashboard, PageMyProducts, PageEditProduct, PageMyReviews,
   PageAuth,
} from './pages/';
import { ProtectedRoute } from './components/common';
import { ToastContainer } from './components/common/Toast/Toast';

const App = () => {
   return (
      <div className="App">
         <Routes>
            <Route path="/" element={<Layout />}>
               <Route index element={<PageHome />} />

               <Route path="product/">
                  <Route path=":productId/" element={<PageProduct />} />
               </Route>

               {/* Protected: must be logged in */}
               <Route
                  path="profile/:userId"
                  element={<ProtectedRoute><PageProfile /></ProtectedRoute>}
               />
               <Route
                  path="orders/"
                  element={<ProtectedRoute><PageOrders /></ProtectedRoute>}
               />
               <Route
                  path="orders/:orderId"
                  element={<ProtectedRoute><PageOrderDetail /></ProtectedRoute>}
               />
               <Route
                  path="my-products/"
                  element={<ProtectedRoute><PageMyProducts /></ProtectedRoute>}
               />
               <Route
                  path="sell/edit/:productId"
                  element={<ProtectedRoute><PageEditProduct /></ProtectedRoute>}
               />
               <Route
                  path="my-reviews/"
                  element={<ProtectedRoute><PageMyReviews /></ProtectedRoute>}
               />
               <Route path="cart/"     element={<PageCart />} />
               <Route path="wishlist/" element={<PageWishlist />} />
               <Route path="compare/"  element={<PageCompare />} />
               <Route
                  path="sell/"
                  element={<ProtectedRoute><PageSellProduct /></ProtectedRoute>}
               />
               <Route path="admin/"           element={<PageAdmin />} />
               <Route path="admin/dashboard/" element={<PageAdminDashboard />} />
            </Route>

            <Route path="/singup/" element={<PageAuth />} />
            <Route path="/login/"  element={<PageAuth />} />
            <Route path="*"        element={<PageNotFound />} />
         </Routes>

         {/* Global toast notifications */}
         <ToastContainer />
      </div>
   );
};

export default App;
