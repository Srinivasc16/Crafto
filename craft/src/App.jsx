import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Products from "./Products";
import Navbar from "./Navbar.jsx";
import SubProducts from "./Subproducts.jsx";
import Checkout from "./Checkout.jsx";
import Login from "./Login.jsx";
import Workshop from "./Workshop.jsx";
import ScrollToTop from "./ScrollToTop.jsx";
import Logout from "./Logout.jsx";

const App = () => (
    <>
        <div className="fixed top-0 left-0 w-full z-50">
            <Navbar />
        </div>
        <ScrollToTop />
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:productId" element={<SubProducts />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/workshop" element={<Workshop />} />
            <Route path="/logout" element={<Logout />} />
        </Routes>
    </>
);

export default App;
