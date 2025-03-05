import React from 'react';

const Header = ({ onLogout }) => {
  return (
    <div className="header-container">
      <h1>Kanbanaut</h1>
      <button className="logout-button" onClick={onLogout}>Logout</button>
    </div>
  );
};

export default Header;