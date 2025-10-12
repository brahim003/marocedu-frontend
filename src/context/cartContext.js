// src/context/cartContext.js
import React, { createContext, useState, useContext } from "react";

// 1️⃣ Create the Cart context
const CartContext = createContext();

// 2️⃣ Create the Cart provider
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Add a new product or update it if it already exists in the cart
  const addOrUpdateProduct = (product) => {
    setCart((prev) => {
      const index = prev.findIndex(
        (item) => item.id === product.id && item.optionId === product.optionId
      );
      if (index >= 0) {
        const newCart = [...prev];
        newCart[index] = product; // update existing product
        return newCart;
      } else {
        return [...prev, product]; // add new product
      }
    });
  };

  // Remove a product from the cart
  const removeProduct = (productId, optionId) => {
    setCart((prev) =>
      prev.filter((item) => !(item.id === productId && item.optionId === optionId))
    );
  };

  // Return the provider with the cart state and methods
  return (
    <CartContext.Provider value={{ cart, addOrUpdateProduct, removeProduct }}>
      {children}
    </CartContext.Provider>
  );
};

// 3️⃣ Create a small hook to use the cart context easily
export const useCart = () => useContext(CartContext);
