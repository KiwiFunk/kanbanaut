import React from 'react';

const Header = ({ onLogout }) => {
  return (
    <header className="comp-container">
      <h1>Kanbanaut</h1>
      <button className="logout-button" onClick={onLogout}>Logout</button>
    </header>
  );
};

export default Header;