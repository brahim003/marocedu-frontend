// src/App.jsx
import React, { useState } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import HeroCarouselMobile from "./components/HeroCarousel/HeroCarouselMobile";
import FindListCTA from "./components/FindListCTA/FindListCTA";
import Ecoles from "./pages/Ecoles.jsx";
import Niveaux from "./pages/Niveaux.jsx";
import SuppliesList from "./pages/SuppliesList.jsx";
import ProductPage from "./pages/ProductPage";
import MyCart from "./pages/MyCart";
import MyCartMobile from "./pages/MyCartMobile"; // ← new mobile version

// Home page
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
  const [cart, setCart] = useState([]); // shared cart state
  const [selectedOptions, setSelectedOptions] = useState({});
  const [displayItems, setDisplayItems] = useState([]);
  const isMobile = useIsMobile();

  return (
    <>
      <Navbar />
      <Routes>
        {/* Home */}
        <Route path="/" element={<HomePage />} />

        {/* Schools */}
        <Route path="/ecoles" element={<Ecoles />} />

        {/* Levels for a given school */}
        <Route path="/ecoles/:slug/niveaux" element={<Niveaux />} />

        {/* Supplies for a specific level */}
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

        {/* Product page */}
        <Route
          path="/product/:id"
          element={
            <ProductPage
              cart={cart}
              setCart={setCart}
              selectedOptions={selectedOptions}
              setSelectedOptions={setSelectedOptions}
              displayItems={displayItems}
              setDisplayItems={setDisplayItems}
            />
          }
        />

        {/* Cart page - responsive */}
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

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
