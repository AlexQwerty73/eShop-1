import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/';
import { PageHome, PageLogin, PageNotFound, PageProduct, PageSingin, ProductPage } from './pages/';

const App = () => {
  return (
    <div className="App">

      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<PageHome />} />

          <Route path='product/' element={<ProductPage />}>
            <Route path=':productId/' >
              <Route index element={<PageProduct />} />
            </Route>
          </Route>

        </Route>

        <Route path='/singin/' element={<PageSingin />} />
        <Route path='/login/' element={<PageLogin />} />
        <Route path='*' element={<PageNotFound />} />
      </Routes>

    </div>
  );
}

export default App;
