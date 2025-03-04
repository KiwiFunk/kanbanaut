import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ToDoApp = ({ onLogout }) => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');

    // Fetch to-dos from the backend
    const fetchTodos = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/todos', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTodos(response.data);
        } catch (error) {
            console.error('Error fetching todos:', error);
        }
    };

    // Add a new to-do
    const addTodo = async () => {
        if (!newTodo) return;
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:5000/api/todos', {
                title: newTodo,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTodos([...todos, response.data]);
            setNewTodo('');
        } catch (error) {
            console.error('Error adding todo:', error);
        }
    };

    // Update a to-do's status
    const updateTodo = async (id, completed) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`http://localhost:5000/api/todos/${id}`, {
                completed: !completed,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTodos(todos.map(todo => (todo._id === id ? response.data : todo)));
        } catch (error) {
            console.error('Error updating todo:', error);
        }
    };

    // Delete a to-do
    const deleteTodo = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/todos/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTodos(todos.filter(todo => todo._id !== id));
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    return (
        <div>
            <h1>To-Do App</h1>
            <button onClick={onLogout}>Logout</button>
            <div>
                <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="Add a new to-do"
                />
                <button onClick={addTodo}>Add</button>
            </div>
            <ul>
                {todos.map(todo => (
                    <li key={todo._id}>
                        <span
                            style={{
                                textDecoration: todo.completed ? 'line-through' : 'none',
                                cursor: 'pointer',
                            }}
                            onClick={() => updateTodo(todo._id, todo.completed)}
                        >
                            {todo.title}
                        </span>
                        <button onClick={() => deleteTodo(todo._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ToDoApp;
