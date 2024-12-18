import './index.css'
import AuthenticationPage from "./Pages/AuthenticationPage.tsx"
import FrontPage from './Pages/FrontPage.tsx'
import ShoppingCart from './Pages/ShoppingCartPage.tsx'
import ItemListPage from './Pages/ItemListPage.tsx'
import { Routes, Route } from 'react-router-dom'
import "./index.css";
import Authentication_Page from "./Pages/Authentication_Page.tsx";
import FrontPage from "./Pages/FrontPage.tsx";
import ProductDetail from "./Pages/ProductDetail.tsx";
import ShoppingCart from "./Pages/ShoppingCartPage.tsx";
import { Routes, Route } from "react-router-dom";

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

      {/* ItemList route */}
      <Route path='/items' Component={ItemListPage} />
    </Routes>
  );
}

export default App;
