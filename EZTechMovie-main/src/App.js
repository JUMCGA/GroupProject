import React, { useState, useEffect } from "react";
import "./CSS/Styles.css";
import Cart from "./Components/Cart";
import Navbar from "./Components/Navbar";
import Subscription from "./Components/Subscription";

const App = () => {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart"));
    if (savedCart) setCart(savedCart);
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);
    const alreadyHasRestrictedItem = cart.some(
        (cartItem) => cartItem.id < 5 && cartItem.id !== item.id
    );

    if (item.id < 5) {
      // Prevent adding a different restricted item if one is already in the cart
      if (alreadyHasRestrictedItem) {
        alert("Only one subscription is allowed at a time!");
        return;
      }

      // Prevent re-adding the same restricted item
      if (existingItem) {
        alert("You already added this subscription to your cart!");
        return;
      }

      // Add the restricted item once
      setCart([...cart, { ...item, quantity: 1 }]);
      return;
    }

    // Standard behavior for unrestricted items
    if (existingItem) {
      setCart(
          cart.map((cartItem) =>
              cartItem.id === item.id
                  ? { ...cartItem, quantity: cartItem.quantity + 1 }
                  : cartItem
          )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    setCart(
        cart.map((item) => {
          if (item.id === id) {
            if (item.id < 5 && quantity > 1) {
              alert("You can only have one of this subscription.");
              return { ...item, quantity: 1 };
            }
            return { ...item, quantity };
          }
          return item;
        })
    );
  };

  return (
      <div>
        <Navbar
            cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
            goToCart={() => setShowCart(true)}
        />
        {showCart ? (
            <Cart
                cart={cart}
                removeFromCart={removeFromCart}
                updateQuantity={updateQuantity}
                goBack={() => setShowCart(false)}
            />
        ) : (
            <Subscription addToCart={addToCart} />
        )}
      </div>
  );
};

export default App;
