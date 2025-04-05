import React from "react";
import { Link } from "react-router-dom";
import "../CSS/Home.css";

const Home = () => {
    return (
        <div className="home-page">
            <div className="home-container">
                <h1>Welcome to EZTechMovie 🎬</h1>
                <p>Discover where your favorite shows are streaming, search movie info, and grab a subscription or some gear!</p>

                <div className="home-buttons">
                    <Link to="/watchlist">
                        <button>📺 View Your StreamList</button>
                    </Link>
                    <Link to="/movies">
                        <button>🎥 Browse Movies</button>
                    </Link>
                    <Link to="/subscriptions">
                        <button>🛒 View Our Store</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
