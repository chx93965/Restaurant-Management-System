"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { loginUser } from '@/app/api/user';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = await loginUser({ username, password });
            localStorage.setItem('token', data.token);  // Store token for authenticated sessions
            router.push('/profile');  // Redirect to profile page
        } catch (err) {
            setError((err as Error).message || 'Login failed');
        }
    };

    return (
        <div>
            <h1>Login</h1>
            {error && <p>{error}</p>}
            <form onSubmit={handleLogin}>
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
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default LoginPage;
