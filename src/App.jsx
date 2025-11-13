// src/App.jsx
import React, { useState } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";

// --- COMPONENTS ---
import Navbar from "./components/Navbar/Navbar";
import HeroCarouselMobile from "./components/HeroCarousel/HeroCarouselMobile";
import FindListCTA from "./components/FindListCTA/FindListCTA";

// --- CLIENT PAGES ---
import Ecoles from "./pages/Ecoles.jsx";
import Niveaux from "./pages/Niveaux.jsx";
import SuppliesList from "./pages/SuppliesList.jsx";
import ProductDetail from "./pages/ProductDetail";
import MyCart from "./pages/MyCart";
import MyCartMobile from "./pages/MyCartMobile";
import Checkout from "./pages/Checkout"; 

// --- ADMIN PAGES (Added Here) ---
import AdminDashboard from "./pages/AdminDashboard";     // 👈 Dashboard List
import AdminOrderDetail from "./pages/AdminOrderDetail"; // 👈 Single Order Detail

// Home page Component
function HomePage() {
  const navigate = useNavigate();
  return (
    <>
      <HeroCarouselMobile />
      <FindListCTA onPrimary={() => navigate("/ecoles")} />
    </>
  );
}

// Custom hook for screen width
function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
}

export default function App() {
  const [cart, setCart] = useState([]); 
  const [selectedOptions, setSelectedOptions] = useState({});
  const [displayItems, setDisplayItems] = useState([]);
  const isMobile = useIsMobile();

  // Helper to empty the cart after purchase
  const clearCart = () => {
    setCart([]);
  };

  return (
    <>
      <Navbar />
      <Routes>
        {/* --- PUBLIC ROUTES --- */}
        <Route path="/" element={<HomePage />} />
        <Route path="/ecoles" element={<Ecoles />} />
        <Route path="/ecoles/:slug/niveaux" element={<Niveaux />} />
        
        <Route
          path="/ecoles/:slug/niveaux/:levelSlug/fournitures"
          element={
            <SuppliesList
              cart={cart}
              setCart={setCart}
              selectedOptions={selectedOptions}
              setSelectedOptions={setSelectedOptions}
              displayItems={displayItems}
              setDisplayItems={setDisplayItems}
            />
          }
        />

        <Route
          path="/product/:id"
          element={
            <ProductDetail
              cart={cart}
              setCart={setCart}
              selectedOptions={selectedOptions}
              setSelectedOptions={setSelectedOptions}
              displayItems={displayItems}
              setDisplayItems={setDisplayItems}
            />
          }
        />

        <Route
          path="/mycart"
          element={
            isMobile ? (
              <MyCartMobile cart={cart} setCart={setCart} />
            ) : (
              <MyCart cart={cart} setCart={setCart} />
            )
          }
        />

        <Route 
          path="/checkout" 
          element={<Checkout clearCart={clearCart} />} 
        />

        {/* --- ADMIN ROUTES (NEW) --- */}
        
        {/* 1. Dashboard (List of all orders) */}
        <Route path="/admin-panel" element={<AdminDashboard />} />

        {/* 2. Order Detail (Specific order items) */}
        <Route path="/admin/order/:id" element={<AdminOrderDetail />} />


        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}