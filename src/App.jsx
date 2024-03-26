import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/';
import { PageHome, PageLogin, PageNotFound, PageProduct, PageSingin } from './pages/';

const App = () => {
  return (
    <div className="App">

      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<PageHome />} />

          <Route path=':productId' element={<PageProduct />} />

        </Route>

        <Route path='/singin/' element={<PageSingin />} />
        <Route path='/login/' element={<PageLogin />} />
        <Route path='*' element={<PageNotFound />} />
      </Routes>

    </div>
  );
}

export default App;
