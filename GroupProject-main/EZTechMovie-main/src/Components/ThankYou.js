import React, { useEffect, useState } from "react";
import "../CSS/ThankYou.css";

const ThankYou = () => {
    const [paidAmount, setPaidAmount] = useState(0);

    useEffect(() => {
        // Retrieve the paid amount from localStorage
        const amount = localStorage.getItem("paidAmount");
        if (amount) {
            setPaidAmount(amount);
            localStorage.removeItem("paidAmount");  // Remove it after use
        }
    }, []);

    return (
        <div className="thank-you-container">
            <h2>Thank you for your purchase!</h2>
            <p>Your payment of ${paidAmount} was successful.</p>
            <p>We appreciate your order!</p>
        </div>
    );
};

export default ThankYou;
