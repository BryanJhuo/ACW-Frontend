<<<<<<< HEAD
import "./index.css";
import Authentication_Page from "./Authentication_Page.tsx";
import { Routes, Route } from "react-router-dom";
=======
import './index.css'
import Authentication_Page from "./Pages/Authentication_Page.tsx"
import FrontPage from './Pages/FrontPage.tsx'
import ShoppingCart from './Pages/ShoppingCartPage.tsx'
import { Routes, Route } from 'react-router-dom'
>>>>>>> c055c131508e77fae0d0d650fefc14f360a73e0c

function App() {
  return (
    <Routes>
<<<<<<< HEAD
      <Route path="/auth" Component={Authentication_Page}></Route>
=======
      {/* Authentication route */}
      <Route path='/members' Component={Authentication_Page} />
      
      {/* FrontPage route */}
      <Route path='/' Component={FrontPage} />
      
      {/* ShoppingCart route */}
      <Route path='/cart' Component={ShoppingCart} />
>>>>>>> c055c131508e77fae0d0d650fefc14f360a73e0c
    </Routes>
  );
}

export default App;
