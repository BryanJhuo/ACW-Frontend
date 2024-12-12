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
      <Route path="/members" Component={Authentication_Page} />

      {/* FrontPage route */}
      <Route path="/" Component={FrontPage} />

      {/* ShoppingCart route */}
      <Route path="/cart" Component={ShoppingCart} />
      {/* ProductDetail route */}
      <Route path="/product" Component={ProductDetail} />
    </Routes>
  );
}

export default App;
