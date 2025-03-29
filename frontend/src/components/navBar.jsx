import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/navBar.css';

const NavBar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">Restaurant App</Link>
                <div className="navbar-links">
                    <Link to="/" className="navbar-link">Home</Link>
                    <Link to="/login" className="navbar-link">Login</Link>
                    <Link to="/register" className="navbar-link">Register</Link>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
