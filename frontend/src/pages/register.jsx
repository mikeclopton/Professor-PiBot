import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './register.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function Register() {
    return (
        <div className="container">
            <div className="register">
                <h2 className="register-header">
                    <i className="fas fa-user-plus"></i> Create Your Account
                </h2>
                <div className="register-input">
                    <div className="input-group">
                        <i className="fas fa-user"></i>
                        <input type="text" placeholder="Username" />
                    </div>
                    <div className="input-group">
                        <i className="fas fa-envelope"></i>
                        <input type="email" placeholder="Email" />
                    </div>
                    <div className="input-group">
                        <i className="fas fa-lock"></i>
                        <input type="password" placeholder="Password" />
                    </div>
                    <div className="input-group">
                        <i className="fas fa-lock"></i>
                        <input type="password" placeholder="Confirm Password" />
                    </div>
                    <button>Register</button>
                    <p className="link">
                        Already have an account? <Link to="/login">Login here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;
