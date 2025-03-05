import React, { useState, useEffect } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

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
        <HelmetProvider>
            <div className="App">

                <Helmet>
                    <title>Kanbanaut</title>
                    <meta name="description" content="A personal Kanban board application for managing your tasks and projects efficiently" />
                    <meta property="og:title" content="Kanbanaut" />
                    <meta property="og:description" content="Organize your tasks with our intuitive Kanban board interface" />
                    <meta name="theme-color" content="#28a745" />
                </Helmet>

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
        </HelmetProvider>
    );
}

export default App;
