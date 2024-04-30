
import React, { createContext, useContext, useState, useRef } from 'react';

const CartContext = createContext();

const useCart = () => {
    const cartItems = useRef([]);
    const [totalPrice, setTotalPrice] = useState(0);

    // Function to calculate total price
    const calculateTotalPrice = () => {
        let total = 0;
        cartItems.current.forEach(item => {
            total += item.quantity * item.price;
        });
        setTotalPrice(total);
    };

    return {
        cartItems,
        totalPrice,
        calculateTotalPrice,
        setTotalPrice
    };
};

export const CartProvider = ({ children }) => {
    const cart = useCart();
  
    return (
      <CartContext.Provider value={cart}>
        {children}
      </CartContext.Provider>
    );
};

export const CartConsumer = () => {
    return useContext(CartContext);
};


