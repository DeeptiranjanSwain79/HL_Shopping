import React, { useEffect } from "react";
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import WebFont from 'webfontloader';
import './App.css';
import Header from "./component/layout/Header/Header.js";
import Footer from './component/layout/Footer/Footer.js';
import Home from "./component/Home/Home.js";
import ProductDetails from "./component/Product/ProductDetails.js";
import Products from "./component/Product/Products.js";
import Search from "./component/Product/Search.js";
import LoginSignUp from "./component/User/LoginSignUp";
import store from "./store";
import { loadUser } from "./actions/userAction";
import UserOptions from "./component/layout/Header/UserOptions.js"
import { useSelector } from "react-redux";
import Profile from "./component/User/Profile.js";
import UpdateProfile from "./component/User/UpdateProfile.js";
import UpdatePassword from "./component/User/UpdatePassword.js";
import ForgotPassword from "./component/User/ForgotPassword.js";
import Cart from "./component/Cart/Cart.js";
import Shipping from "./component/Cart/Shipping.js";
import ConfirmOrder from "./component/Cart/ConfirmOrder";
// import axios from "axios";
import Payment from "./component/Cart/Payment.js";
import OrderSuccess from "./component/Cart/OrderSuccess.js";
import MyOrders from "./component/Order/MyOrders.js";
import OrderDetails from "./component/Order/OrderDetails.js";
import Dashboard from "./component/Admin/Dashboard.js";
import ProductList from "./component/Admin/ProductList.js";
import NewProduct from "./component/Admin/NewProduct";
import UpdateProduct from "./component/Admin/UpdateProduct";
import OrderList from "./component/Admin/OrderList";
import ProcessOrder from "./component/Admin/ProcessOrder";
import UsersList from "./component/Admin/UsersList";
import UpdateUser from "./component/Admin/UpdateUser";
import ProductReviews from "./component/Admin/ProductReviews";
import PageNotFound from "./component/layout/NotFound/PageNotFound";
import Contact from "./component/layout/Contact/Contact";
import Aboutus from "./component/layout/About/Aboutus";

function App() {

  const { isAuthenticated, user } = useSelector(state => state.user);


  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Tiro Tamil", "Lobster", "Caveat", "Dancing Script", "Cormorant Garamond", "Joan", "Pacifico", "Kalam", "Poppins", "EB Garamond"]
      }
    });

    store.dispatch(loadUser());
  }, []);

  window.addEventListener("contextmenu", e => e.preventDefault());

  return (
    <>
      <BrowserRouter>
        <Header />

        {isAuthenticated && <UserOptions user={user} />}
        <Routes>
          <Route exact path="/" element={<Home />} />

          <Route exact path="/product/:id" element={<ProductDetails />} />

          <Route exact path="/products" element={<Products />} />

          <Route path="/products/:keyword" element={<Products />} />

          <Route exact path="/search" element={<Search />} />

          <Route exact path="/login" element={<LoginSignUp />} />

          <Route exact path="/account" element={<Profile />} />

          <Route exact path="/me/update" element={<UpdateProfile />} />

          <Route exact path="/password/update" element={<UpdatePassword />} />

          <Route exact path="/password/forgot" element={<ForgotPassword />} />

          <Route exact path="/cart" element={<Cart />} />

          <Route exact path="/shipping" element={<Shipping />} />

          <Route exact path="/order/confirm" element={<ConfirmOrder />} />

          <Route exact path="/process/payment" element={<Payment />} />

          <Route exact path="/success" element={<OrderSuccess />} />

          <Route exact path="/orders" element={<MyOrders />} />

          <Route exact path="/order/:id" element={<OrderDetails />} />

          <Route exact path="/admin/dashboard" element={<Dashboard />} />

          <Route exact path="/admin/products" element={<ProductList />} />

          <Route exact path="/admin/product" element={<NewProduct />} />

          <Route exact path="/admin/product/:id" element={<UpdateProduct />} />

          <Route exact path="/admin/orders" element={<OrderList />} />

          <Route exact path="/admin/order/:id" element={<ProcessOrder />} />

          <Route exact path="/admin/users" element={<UsersList />} />

          <Route exact path="/admin/user/:id" element={<UpdateUser />} />

          <Route exact path="/admin/reviews" element={<ProductReviews />} />

          <Route exact path="/contact" element={<Contact />} />

          <Route exact path="/about" element={<Aboutus />} />

          <Route path="*" element={<PageNotFound />} />
        </Routes>

        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
