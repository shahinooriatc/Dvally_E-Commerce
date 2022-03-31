import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./Components/Home/Home";
import NavSection from "./Components/NavSection/NavSection";
import Products from "./Components/Products/Products";
import ProductDetails from "./Components/ProductDetails/ProductDetails";
import Cart from "./Components/CartPage/CartPage";
import Registration from "./Components/Auth/Registration/Registration";
import Login from "./Components/Auth/Login/Login";
import Compare from "./Components/Compare/Compare";
import WishList from "./Components/WishList/WishList";
import Shipping from "./Components/Shipping/Shipping";

function App() {
  return (
    <>
      <BrowserRouter>
        <NavSection />
        <ToastContainer position="top-center" autoClose={2000} limit={1}/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route exact path="/products" element={<Products />} />
          <Route exact path="/compare" element={<Compare />} />
          <Route exact path="/wishlist" element={<WishList />} />
          <Route path="/products/:slug" element={<ProductDetails />} />
          <Route path="/productcart" element={<Cart />} />
          <Route path="/productcart/:id" element={<Cart />} />
          <Route path="registration" element={<Registration />} />
          <Route path="login" element={<Login />} />
          <Route path="paymentpage" element={<Shipping />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
