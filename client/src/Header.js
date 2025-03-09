import React from 'react';
import logo from './logo.svg';

const Header = ({ onLogout }) => {
    return (
        <header className="comp-container">
            <div className="header-content">
                <img src={logo} alt="Kanbanaut Logo" />
                <h1>Kanbanaut</h1>
                <button className="logout-button" onClick={onLogout}>Logout</button>
            </div>
        </header>
    );
};

export default Header;