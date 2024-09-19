import React from 'react';
import './login.css';

function Login() {
    return (
        <div className="container">
            <div className="login">
                <div className="login-input">
                    <input type="text" placeholder="Username" />
                    <input type="password" placeholder="Password" />
                    <button>Login</button>
                </div>
            </div>
        </div>
    );
}

export default Login;
