import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './login.css';

function Login() {
    return (
        <div className="container">
            <div className="login">
                <h2 className="login-header">Login to Your Account!</h2>
                <div className="login-input">
                    <div className="input-group">
                        <i className="fas fa-user"></i>
                        <input type="text" placeholder="Username" />
                    </div>
                    <div className="input-group">
                        <i className="fas fa-lock"></i>
                        <input type="password" placeholder="Password" />
                    </div>
                    <button>Login</button>
                    <p className="remember-me">
                        <input type="checkbox" id="remember-me" />
                        <label htmlFor="remember-me">Remember me</label>
                    </p>
                    <p className="link">
                        Don’t have an account? <Link to="/register">Register here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
