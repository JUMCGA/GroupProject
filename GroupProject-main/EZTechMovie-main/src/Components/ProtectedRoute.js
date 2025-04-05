import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ isAuthenticated, children }) => {
    if (!isAuthenticated) {
        // If the user is not authenticated, redirect them to the login page
        return <Navigate to="/login" replace />;
    }

    return children; // If authenticated, render the protected route's content
};

export default ProtectedRoute;
