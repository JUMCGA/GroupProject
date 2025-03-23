import React from "react";
import "../CSS/Cart.css";

const Cart = ({ cart, removeFromCart, updateQuantity, goBack }) => {
  return (
    <div className="cart-container">
      <button className="back-button" onClick={goBack}>⬅ Back to Home</button>
      <h2>Your Subscription</h2>
      {cart.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        cart.map((item) => (
          <div key={item.id} className="cart-item">
            <h3>{item.service}</h3>
            <p>${(item.price * item.quantity).toFixed(2)}</p>
            <input
              type="number"
              value={item.quantity}
              min="1"
              onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
            />
            <button onClick={() => removeFromCart(item.id)}>Remove</button>
          </div>
        ))
      )}
    </div>
  );
};

export default Cart;
