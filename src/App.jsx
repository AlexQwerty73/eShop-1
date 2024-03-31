import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/';
import { PageCart, PageHome, PageOrders, PageLogin, PageNotFound, PageProduct, PageProfile, PageSingup } from './pages/';

const App = () => {
  return (
    <div className="App">

      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<PageHome />} />

          <Route path='product/' >
            <Route path=':productId/' element={<PageProduct />}>
            </Route>
          </Route>

          <Route path='profile/'>
            <Route path=':userId' element={<PageProfile />} />
          </Route>

          <Route path='orders/' element={<PageOrders />} />
          <Route path='cart/' element={<PageCart />} />

        </Route>

        <Route path='/singup/' element={<PageSingup />} />
        <Route path='/login/' element={<PageLogin />} />
        <Route path='*' element={<PageNotFound />} />
      </Routes>

    </div>
  );
}

export default App;
