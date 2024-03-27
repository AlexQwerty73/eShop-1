import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/';
import { PageHome, PageLogin, PageNotFound, PageProduct, PageSingup } from './pages/';

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
            <Route path=':userId' />{/*  */}
          </Route>

        </Route>

        <Route path='/singup/' element={<PageSingup />} />
        <Route path='/login/' element={<PageLogin />} />
        <Route path='*' element={<PageNotFound />} />
      </Routes>

    </div>
  );
}

export default App;
