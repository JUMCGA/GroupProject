import React from "react";
import { Link } from "react-router-dom";
import "../CSS/Navbar.css";
import { FiShoppingCart } from "react-icons/fi";


const Navbar = ({ cartCount, goToCart }) => {
  return (
    <nav className="navbar">
      <h1>EZTechMovie</h1>
      <div className="cart" onClick={goToCart}>
        <FiShoppingCart className="cart-icon" />
        <span className="cart-count">{cartCount}</span>
      </div>
    </nav>
  );
};

export default Navbar;
