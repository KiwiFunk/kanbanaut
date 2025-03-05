import React, { useState, useEffect } from 'react';
import Auth from './Auth';

import Header from './Header';
import CreateIssue from './CreateIssue';
import KanbanBoard from './KanbanApp';

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
                <>
                    <Header onLogout={handleLogout} />
                    <CreateIssue />
                    <KanbanBoard  />
                </>
            ) : (
                <Auth onLogin={handleLogin} />
            )}
        </div>
    );
}

export default App;
