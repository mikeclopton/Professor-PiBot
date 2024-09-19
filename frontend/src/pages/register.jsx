import React from 'react';
import './register.css'; // You can create a separate CSS file or reuse the login.css

function Register() {
    return (
        <div className="container">
            <div className="register">
                <div className="register-input">
                    <input type="text" placeholder="Username" />
                    <input type="email" placeholder="Email" />
                    <input type="password" placeholder="Password" />
                    <input type="password" placeholder="Confirm Password" />
                    <button>Register</button>
                </div>
            </div>
        </div>
    );
}

export default Register;
