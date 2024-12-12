import "./index.css";
import Authentication_Page from "./Pages/Authentication_Page.tsx";
import FrontPage from "./Pages/FrontPage.tsx";
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
    </Routes>
  );
}

export default App;
