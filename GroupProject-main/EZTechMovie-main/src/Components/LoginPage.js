import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import "../CSS/LoginPage.css";

const LoginPage = ({ handleLoginSuccess, handleLoginFailure }) => {
    return (
        <div className="login-page">
            <div className="login-box">
                <h2>Welcome to EZTechMovie 🎬</h2>
                <p>Log in with Google to get started.</p>
                <GoogleLogin
                    onSuccess={handleLoginSuccess}
                    onError={handleLoginFailure}
                    size="large"
                    theme="outline"
                />
            </div>
        </div>
    );
};

export default LoginPage;
