import React, { useState } from 'react';
import UserForm from '../components/user/userForm';
import LoginForm from '../components/user/loginForm';
import '../styles/user.css';
import { loginUser } from "../services/user";
import { useNavigate } from "react-router-dom";

const UserPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('customer'); // Default role
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // const user = await loginUser({ username, password });
            // Mock user for debug
            // const user = { username, role: 'customer' };
            // const user = { username, role: 'staff' };
            const user = { username, role: 'manager' };
            if (user) {
                localStorage.setItem("user", JSON.stringify({ username, role }));
                navigate('/'); // Redirect to Home
            } else {
                alert("Invalid login credentials");
            }
        } catch (error) {
            console.error("Login failed", error);
            alert("Login error, please try again");
        }
    };

    return (
        <div className="auth-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit} className="auth-form">
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <select value={role} onChange={(e) => setRole(e.target.value)} required>
                    <option value="customer">Customer</option>
                    <option value="staff">Staff</option>
                    <option value="manager">Manager</option>
                </select>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default UserPage;
