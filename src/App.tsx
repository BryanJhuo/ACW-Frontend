import AuthenticationPage from "./Pages/AuthenticationPage.tsx";
import FrontPage from "./Pages/FrontPage.tsx";
import ShoppingCart from "./Pages/ShoppingCartPage.tsx";
import ShopPage from "./Pages/ShopPage.tsx";
import { Routes, Route } from "react-router-dom";
import ProductDetail from "./Pages/ProductDetail.tsx";
import MemberCenter from "./Pages/MemberCenterPage.tsx";
import CenterDetail from "./Pages/CenterDetailPage.tsx";
import SalerPage from "./Pages/SalerPage.tsx";
import OrderPage from "./Pages/OrderPage.tsx";
import FAQPage from "./Pages/FAQPage.tsx";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        {/* Authentication route */}
        <Route path="/auth" Component={AuthenticationPage} />

        {/* FrontPage route */}
        <Route path="/" Component={FrontPage} />

        {/* ShoppingCart route */}
        <Route path="/cart" Component={ShoppingCart} />

        {/* ProductDetail route */}
        <Route path="/product/:id" Component={ProductDetail} />

        {/* Shop route */}
        <Route path="/shop" Component={ShopPage} />

        {/* MemberCenter route*/}
        <Route path="/member" Component={MemberCenter} />

        {/* MemberCenterDetail route */}
        <Route path="/member/detail" Component={CenterDetail} />

        {/* Saler route */}
        <Route path="/saler" Component={SalerPage} />

        {/* Order route */}
        <Route path="/order" Component={OrderPage} />

        {/* FAQ route */}
        <Route path="/faq" Component={FAQPage} />
      </Routes>
    </div>
  );
}

export default App;
