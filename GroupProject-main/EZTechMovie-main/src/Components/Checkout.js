import React from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const Checkout = ({ cart }) => {
    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    ).toFixed(2);

    return (
        <div style={{ padding: "2rem" }}>
            <h2>Checkout</h2>
            <p>Total: ${total}</p>

            <PayPalScriptProvider
                options={{
                    "client-id": "test", // Use "test" for sandbox
                    currency: "USD",
                }}
            >
                <PayPalButtons
                    createOrder={(data, actions) => {
                        return actions.order.create({
                            purchase_units: [
                                {
                                    amount: {
                                        value: total,
                                    },
                                },
                            ],
                        });
                    }}
                    onApprove={(data, actions) => {
                        return actions.order.capture().then((details) => {
                            alert(`Transaction completed by ${details.payer.name.given_name}!`);
                        });
                    }}
                />
            </PayPalScriptProvider>
        </div>
    );
};

export default Checkout;
