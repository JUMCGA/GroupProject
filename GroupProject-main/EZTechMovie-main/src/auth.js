// src/auth.js

import { useState, useEffect } from "react";

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check authentication status from localStorage when the component mounts
    useEffect(() => {
        const token = localStorage.getItem("authToken"); // Check if there's an auth token in localStorage
        if (token) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    }, []);

    const login = (token) => {
        // Store token in localStorage to keep user logged in
        localStorage.setItem("authToken", token);
        setIsAuthenticated(true);
    };

    const logout = () => {
        // Remove token from localStorage to log the user out
        localStorage.removeItem("authToken");
        setIsAuthenticated(false);
    };

    return { isAuthenticated, login, logout };
};
