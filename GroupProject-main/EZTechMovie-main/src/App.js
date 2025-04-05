import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import "./CSS/Styles.css";
import Cart from "./Components/Cart";
import Navbar from "./Components/Navbar";
import Subscription from "./Components/Subscription";
import Movies from "./Components/Movies";
import Checkout from "./Components/Checkout";
import Home from "./Components/Home";
import MovieDetails from "./Components/MovieDetails";
import Watchlist from "./Components/Watchlist";
import CreditCard from "./Components/CreditCard";
import ThankYou from "./Components/ThankYou";
import LoginPage from "./Components/LoginPage";
import ProtectedRoute from "./Components/ProtectedRoute";

const AppContent = () => {
    const [cart, setCart] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedAuth = localStorage.getItem("isAuthenticated");
        const storedUser = localStorage.getItem("user");
        if (storedAuth === "true") {
            setIsAuthenticated(true);
            if (storedUser) setUser(JSON.parse(storedUser));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        if (isAuthenticated) {
            localStorage.setItem("isAuthenticated", "true");
        } else {
            localStorage.removeItem("isAuthenticated");
        }
    }, [isAuthenticated]);

    const handleLoginSuccess = (response) => {
        const decoded = jwtDecode(response.credential);
        const userInfo = { name: decoded.name, email: decoded.email };
        localStorage.setItem("user", JSON.stringify(userInfo));
        localStorage.setItem("isAuthenticated", "true");
        setUser(userInfo);
        setIsAuthenticated(true);
        navigate("/");
    };

    const handleLoginFailure = (error) => {
        console.log("Login failed:", error);
        setIsAuthenticated(false);
        setUser(null);
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("isAuthenticated");
        setUser(null);
        setIsAuthenticated(false);
        navigate("/login");
    };

    const addToCart = (item) => {
        const existingItem = cart.find((cartItem) => cartItem.id === item.id);
        if (item.id < 5) {
            const alreadyHasRestrictedItem = cart.some(
                (cartItem) => cartItem.id < 5 && cartItem.id !== item.id
            );
            if (alreadyHasRestrictedItem) {
                alert("Only one subscription is allowed at a time!");
                return;
            }
            if (existingItem) {
                alert("You already added this subscription to your cart!");
                return;
            }
            setCart([...cart, { ...item, quantity: 1 }]);
            return;
        }

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
        if (id < 5) return;
        if (quantity < 1) return;
        setCart(
            cart.map((item) =>
                item.id === id ? { ...item, quantity: quantity } : item
            )
        );
    };

    return (
        <GoogleOAuthProvider clientId="634585739538-r1ro44997svomvmtum07lo8s07qpph5b.apps.googleusercontent.com">
            <PayPalScriptProvider
                options={{
                    "client-id": "AQqyriu9nxHJIEWfef3TaFXdC-6-PLeiOeCVw-5-RRjWWdY4uygXTTskGFhtMNOZ9mtuFBfQARobsARR",
                }}
            >
                <Navbar
                    cartCount={cart.length}
                    goToCart={() => navigate("/cart")}
                    isAuthenticated={isAuthenticated}
                    user={user}
                    handleLogout={handleLogout}
                />

                <Routes>
                    <Route
                        path="/login"
                        element={
                            <LoginPage
                                handleLoginSuccess={handleLoginSuccess}
                                handleLoginFailure={handleLoginFailure}
                                />
                                                  }
                    />
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute isAuthenticated={isAuthenticated}>
                                <Home />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/subscriptions"
                        element={
                            <ProtectedRoute isAuthenticated={isAuthenticated}>
                                <Subscription addToCart={addToCart} />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/movies"
                        element={
                            <ProtectedRoute isAuthenticated={isAuthenticated}>
                                <Movies />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/checkout"
                        element={
                            <ProtectedRoute isAuthenticated={isAuthenticated}>
                                <Checkout cart={cart} />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/movie/:id"
                        element={
                            <ProtectedRoute isAuthenticated={isAuthenticated}>
                                <MovieDetails />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/watchlist"
                        element={
                            <ProtectedRoute isAuthenticated={isAuthenticated}>
                                <Watchlist />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/cart"
                        element={
                            <ProtectedRoute isAuthenticated={isAuthenticated}>
                                <Cart
                                    cart={cart}
                                    removeFromCart={removeFromCart}
                                    updateQuantity={updateQuantity}
                                    goBack={() => navigate("/")}
                                />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/credit-card"
                        element={
                            <ProtectedRoute isAuthenticated={isAuthenticated}>
                                <CreditCard cart={cart} setCart={setCart} />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/thank-you"
                        element={
                            <ProtectedRoute isAuthenticated={isAuthenticated}>
                                <ThankYou />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </PayPalScriptProvider>
        </GoogleOAuthProvider>
    );
};

const App = () => (
    <Router>
        <AppContent />
    </Router>
);

export default App;