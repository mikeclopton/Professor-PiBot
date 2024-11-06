import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://127.0.0.1:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Login successful');
                navigate('/dashboard');
            } else {
                setErrorMessage(data.error || 'Login failed');
            }
        } catch (error) {
            console.error('Error during login:', error);
            setErrorMessage('An error occurred during login');
        }
    };

    return (
        <div className="container">
            <div className="login">
                <h2 className="login-header">Login to Your Account</h2>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <form className="login-input" onSubmit={handleLogin}>
                    <div className="input-group">
                        <i className="fas fa-envelope icon"></i>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <i className="fas fa-lock icon"></i>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">
                        <i className="fas fa-sign-in-alt"></i> Login
                    </button>
                    <p className="link">
                        Don’t have an account? <Link to="/register">Register here</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Login;
