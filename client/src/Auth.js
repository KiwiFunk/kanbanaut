import React, { useState } from 'react';
import axios from 'axios';

const Auth = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true); // Toggle between login and sign-up

    const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = isLogin
        ? 'http://localhost:5000/api/users/login'
        : 'http://localhost:5000/api/users/register';

    try {
        const response = await axios.post(endpoint, { email, password });
        const token = response.data.token;

        if (isLogin) {
            localStorage.setItem('token', token); // Save the token in localStorage
            alert('Logged in successfully!');
            onLogin(); // Call the login callback
        } else {
            alert('Registered successfully! You can now log in.');
        }

        setEmail('');
        setPassword('');
    } catch (error) {
        console.error('Error:', error.response?.data?.message || error.message);
        alert('Authentication failed!');
    }
};

    return (
        <div>
            <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
            </form>
            <button onClick={() => setIsLogin(!isLogin)}>
                Switch to {isLogin ? 'Sign Up' : 'Login'}
            </button>
        </div>
    );
};

export default Auth;
