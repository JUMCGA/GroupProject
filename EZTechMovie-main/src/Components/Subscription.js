import React from "react";
import list from "./data";
import "../CSS/Subscription.css";

const Subscription = ({ addToCart }) => {
    const firstRowItems = list.filter((item) => item.id >= 1 && item.id <= 4);
    const secondRowItems = list.filter((item) => item.id >= 5 && item.id <= 8);

    return (
        <div className="subscription-container">
            {/* First Row */}
            <div className="subscription-row">
                {firstRowItems.map((item) => (
                    <div key={item.id} className="subscription-item">
                        <img src={item.img} alt={item.service} className="subscription-image" />
                        <div className="subscription-details">
                            <h3>{item.service}</h3>
                            <p>{item.serviceInfo}</p>
                            <p className="subscription-price">${item.price.toFixed(2)}</p>
                            <button onClick={() => addToCart(item)} className="add-to-cart-button">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Second Row */}
            <div className="subscription-row">
                {secondRowItems.map((item) => (
                    <div key={item.id} className="subscription-item">
                        <img src={item.img} alt={item.service} className="subscription-image" />
                        <div className="subscription-details">
                            <h3>{item.service}</h3>
                            <p>{item.serviceInfo}</p>
                            <p className="subscription-price">${item.price.toFixed(2)}</p>
                            <button onClick={() => addToCart(item)} className="add-to-cart-button">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Subscription;
