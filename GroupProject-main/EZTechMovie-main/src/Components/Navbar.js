import React from "react";
import { NavLink } from "react-router-dom";
import { FiHome, FiFilm, FiShoppingCart, FiShoppingBag, FiBookmark } from "react-icons/fi";
import "../CSS/Navbar.css";

const Navbar = ({ cartCount, goToCart, isAuthenticated, user, handleLogout }) => {
    return (
        <nav className="navbar">
            <h1 className="navbar-logo">EZTechMovie</h1>

            <div className="nav-links">
                <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}><FiHome /> Home</NavLink>
                <NavLink to="/watchlist" className={({ isActive }) => isActive ? "active" : ""}><FiBookmark /> StreamList</NavLink>
                <NavLink to="/movies" className={({ isActive }) => isActive ? "active" : ""}><FiFilm /> Movies</NavLink>
                <NavLink to="/subscriptions" className={({ isActive }) => isActive ? "active" : ""}><FiShoppingBag /> Store</NavLink>
                <div className="cart" onClick={goToCart}>
                    <FiShoppingCart className="cart-icon" />
                    <span className="cart-count">{cartCount}</span>
                </div>
            </div>

            {/* Only show logout + welcome if authenticated */}
            {isAuthenticated && user && (
                <div className="auth-section">
                    <span className="welcome-text">Welcome, {user.name}</span>
                    <button className="logout-button" onClick={handleLogout}>Logout</button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
