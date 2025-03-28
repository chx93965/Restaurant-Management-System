import React, { useState } from 'react';
import UserForm from '../components/user/userForm';
import LoginForm from '../components/user/loginForm';
import '../styles/user.css';

const UserPage = () => {
    const [isLogin, setIsLogin] = useState(true); // Toggle between login and register

    return (
        <div className="auth-page">
            <div className="auth-toggle">
                <button onClick={() => setIsLogin(true)}>Login</button>
                <button onClick={() => setIsLogin(false)}>Register</button>
            </div>
            {isLogin ? <LoginForm /> : <UserForm />}
        </div>
    );
};

export default UserPage;
