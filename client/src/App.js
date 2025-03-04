import React from 'react';
import Auth from './Auth';
import ToDoApp from './ToDoApp';

function App() {
    const token = localStorage.getItem('token');

    return (
        <div className="App">
            {token ? <ToDoApp /> : <Auth />}
        </div>
    );
}

export default App;
