import AuthenticationPage from "./Pages/AuthenticationPage.tsx"
import FrontPage from './Pages/FrontPage.tsx'
import ShoppingCart from './Pages/ShoppingCartPage.tsx'
import ShopPage from './Pages/ShopPage.tsx'
import { Routes, Route } from 'react-router-dom'
import ProductDetail from "./Pages/ProductDetail.tsx";

function App() {
  return (
    <Routes>
      {/* Authentication route */}
      <Route path='/members' Component={AuthenticationPage} />

      {/* FrontPage route */}
      <Route path="/" Component={FrontPage} />

      {/* ShoppingCart route */}
      <Route path="/cart" Component={ShoppingCart} />

      {/* ProductDetail route */}
      <Route path="/product" Component={ProductDetail} />

      {/* Shop route */}
      <Route path='/shop' Component={ShopPage} />
    </Routes>
  );
}

export default App;
