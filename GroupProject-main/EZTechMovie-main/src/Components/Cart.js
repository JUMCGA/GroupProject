import React from "react";
import { Link } from "react-router-dom";
import list from "./data";
import "../CSS/Cart.css";

const Cart = ({ cart, removeFromCart, updateQuantity, goBack }) => {
    const getItemDetails = (id) => list.find((item) => item.id === id);

    return (
        <div className="cart-container">
            <button className="back-button" onClick={goBack}>⬅ Back to Home</button>
            <h2>Your Cart</h2>

            {cart.length === 0 ? (
                <p className="empty-cart">Cart is empty</p>
            ) : (
                <>
                    {cart.map((item) => {
                        const details = getItemDetails(item.id);
                        return (
                            <div key={item.id} className="cart-item">
                                <img src={details?.img} alt={item.service} className="cart-item-img" />
                                <div className="cart-item-info">
                                    <h3>{item.service}</h3>
                                    <p className="cart-description">{details?.serviceInfo}</p>
                                    <p className="cart-price">${(item.price * item.quantity).toFixed(2)}</p>
                                    {item.id >= 5 && (
                                        <input
                                            type="number"
                                            value={item.quantity}
                                            min="1"
                                            onChange={(e) =>
                                                updateQuantity(item.id, parseInt(e.target.value))
                                            }
                                        />
                                    )}
                                    <button onClick={() => removeFromCart(item.id)}>Remove</button>
                                </div>
                            </div>
                        );
                    })}

                    <Link to="/credit-card">
                        <button className="checkout-btn">Proceed to Payment</button>
                    </Link>
                </>
            )}
        </div>
    );
};

export default Cart;
