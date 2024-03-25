import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/';
import { PageHome, PageLogin, PageNotFound, PageSingin } from './pages/';

const App = () => {
  return (
    <div className="App">

      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<PageHome />} />

        </Route>

          <Route path='singin/' element={<PageSingin />}/>
          <Route path='login/' element={<PageLogin />}/>
        <Route path='*' element={<PageNotFound />} />
      </Routes>

    </div>
  );
}

export default App;
