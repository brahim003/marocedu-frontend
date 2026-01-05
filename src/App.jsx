// src/App.jsx
import React, { useState } from "react";
import { Routes, Route, useNavigate, Navigate, useLocation } from "react-router-dom";

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

// --- ADMIN PAGES ---
import AdminDashboard from "./pages/AdminDashboard";       // Order List
import AdminHome from "./pages/AdminHome";                 // Admin Menu
import SupplyManagement from "./pages/SupplyManagement";   // Supply List

// ✅ NEW SCHOOL PAGES (Organized in subfolder)
import SchoolManagement from "./pages/admin/schools/SchoolManagement";
import AddSchool from "./pages/admin/schools/AddSchool";

//admin controlling the supplies files
import AdminSchools from "./pages/admin/supplies/AdminSchools";
import AdminLevels from "./pages/admin/supplies/AdminLevels";
import SupplyManager from "./pages/admin/supplies/SupplyManager";

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

  // 1. Get the current URL location
  const location = useLocation();

  // 2. Check if we are on an admin page
  // This returns true if the URL starts with "/admin" or is "/admin-panel"
  const isAdminPage = location.pathname.startsWith("/admin");

  // Helper to empty the cart after purchase
  const clearCart = () => {
    setCart([]);
  };

  return (
    <>
      {/* 3. Only show Navbar if we are NOT on an admin page */}
      {!isAdminPage && <Navbar />}

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

        {/* --- ADMIN ROUTES --- */}

        {/* 1. Main Menu (Admin Home) */}
        <Route path="/admin-panel" element={<AdminHome />} />

        {/* 2. Order List */}
        <Route path="/admin/orders" element={<AdminDashboard />} />

        {/* 3. Single Order Detail */}

        {/* 4. Supply Management */}
        <Route path="/admin/supplies" element={<SupplyManagement />} />

        {/* ✅ 5. SCHOOL MANAGEMENT (NEW) */}
        <Route path="/admin/schools" element={<SchoolManagement />} />
        <Route path="/admin/schools/create" element={<AddSchool />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />

        <Route path="/admin/ecoles" element={<AdminSchools />} />
        <Route path="/admin/ecoles/:slug/levels" element={<AdminLevels />} />
        <Route path="/admin/ecoles/:slug/levels/:levelId/fournitures" element={<SupplyManager />} />

      </Routes>
    </>
  );
}