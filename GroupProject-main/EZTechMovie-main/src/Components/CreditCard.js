import React, { useState, useEffect } from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useNavigate } from "react-router-dom";
import "../CSS/CreditCard.css";

const CreditCard = ({ cart, setCart }) => {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [totalAmount, setTotalAmount] = useState(0);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
        setTotalAmount(total.toFixed(2));
    }, [cart]);

    const handleApproval = (data, actions) => {
        setLoading(true);

        actions.order.capture().then(function (details) {
            console.log("Payment captured:", details);

            localStorage.setItem("paymentDetails", JSON.stringify(details));
            localStorage.setItem("paidAmount", totalAmount);
            localStorage.removeItem("cart");
            setCart([]);
            setPaymentSuccess(true);
            setLoading(false);
        });
    };

    const handleError = (error) => {
        console.error("Error with PayPal transaction:", error);
        setError("There was an error processing your payment.");
        setLoading(false);
    };

    return (
        <div className="credit-card-container">
            <h2>Enter Payment Details</h2>
            {error && <div className="error">{error}</div>}
            {loading && <div className="loading">Processing payment...</div>}

            <div className="payment-section">
                <h3>Pay with PayPal or Credit Card</h3>
                <p>Your total: ${totalAmount}</p>

                <PayPalButtons
                    style={{ layout: "vertical" }}
                    createOrder={(data, actions) => {
                        return actions.order.create({
                            intent: "CAPTURE",
                            purchase_units: [
                                {
                                    amount: {
                                        value: totalAmount,
                                    },
                                    shipping: {},
                                },
                            ],
                        });
                    }}
                    onApprove={handleApproval}
                    onError={handleError}
                />
            </div>

            {paymentSuccess && (
                <div className="payment-success">
                    <h3>Payment Successful!</h3>
                    <p>Your payment was processed successfully.</p>
                    <button
                        onClick={() => navigate("/thank-you")}
                        className="go-to-thankyou"
                    >
                        Go to Payment Confirmation Page
                    </button>
                </div>
            )}
        </div>
    );
};

export default CreditCard;
