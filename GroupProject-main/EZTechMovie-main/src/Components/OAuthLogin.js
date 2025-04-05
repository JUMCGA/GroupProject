import React, { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import "../CSS/OAuth.css";  // Optional: add some styles

const OAuthLogin = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const handleLoginSuccess = (response) => {
        const credential = response.credential;
        // Decode the JWT token from Google OAuth response
        const userData = parseJwt(credential); // Use this to extract user info like email, name, etc.

        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));  // Save user info in localStorage
        navigate("/");  // Redirect to home page or desired page
    };

    const handleLoginFailure = (error) => {
        console.log("Login Failed:", error);
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem("user");  // Remove user info from localStorage
    };

    const parseJwt = (token) => {
        // Decode JWT token to extract user details
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const decoded = JSON.parse(window.atob(base64));
        return decoded;
    };

    return (
        <div className="oauth-container">
            {!user ? (
                <GoogleOAuthProvider clientId="634585739538-r1ro44997svomvmtum07lo8s07qpph5b.apps.googleusercontent.com">
                    <GoogleLogin
                        onSuccess={handleLoginSuccess}
                        onError={handleLoginFailure}
                        useOneTap
                    />
                </GoogleOAuthProvider>
            ) : (
                <div className="user-info">
                    <h3>Welcome, {user.name}!</h3>
                    <button onClick={handleLogout} className="logout-btn">
                        Log Out
                    </button>
                </div>
            )}
        </div>
    );
};

export default OAuthLogin;
