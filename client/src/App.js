import React, { useState, useEffect } from 'react';
import Auth from './Auth';
import ToDoApp from './ToDoApp';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
    };

    return (
        <div className="App">
            {isAuthenticated ? (
                <ToDoApp onLogout={handleLogout} />
            ) : (
                <Auth onLogin={handleLogin} />
            )}
        </div>
    );
}

export default App;
