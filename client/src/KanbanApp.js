import React, { useState, useEffect } from 'react';
import axios from 'axios';

//API URL'S
const ISSUES_URL = 'http://localhost:5000/api/issues';
const COLUMNS_URL = 'http://localhost:5000/api/columns';

const KanbanBoard = ({ projectId }) => {
    const [issues, setIssues] = useState([]);                       // State to store issues
    const [columns, setColumns] = useState([]);                     // State to store columns
    const [newColumnName, setNewColumnName] = useState('');         // State to store new column name
    const [editingColumn, setEditingColumn] = useState(null);       // State to store the ID of the column being edited

    // Fetch columns for current project
    const fetchColumns = async () => {
        if (!projectId) return;
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${COLUMNS_URL}/${projectId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setColumns(response.data);
        } catch (error) {
            console.error('Error fetching columns:', error);
        }
    };

    // Fetch issues for current project
    const fetchIssues = async () => {
        if (!projectId) return;
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${ISSUES_URL}/${projectId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setIssues(response.data);
        } catch (error) {
            console.error('Error fetching issues:', error);
        }
    };

    // Add new column
    const addColumn = async () => {
        if (!newColumnName.trim() || !projectId) return;
        try {
            const token = localStorage.getItem('token');
            await axios.post(COLUMNS_URL, {
                name: newColumnName,
                projectId
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setNewColumnName('');
            fetchColumns();
        } catch (error) {
            console.error('Error adding column:', error);
        }
    };

    // Update column name
    const updateColumnName = async (columnId, newName) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${COLUMNS_URL}/${columnId}`, {
                name: newName,
                projectId
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchColumns();
        } catch (error) {
            console.error('Error updating column:', error);
        }
    };

    
    // Delete column
    const deleteColumn = async (columnId) => {
        if (!window.confirm('Are you sure? All issues in this column will be deleted.')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${COLUMNS_URL}/${columnId}?projectId=${projectId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchColumns();
            fetchIssues();
        } catch (error) {
            console.error('Error deleting column:', error);
        }
    };

    // Update issue column
    const updateIssueColumn = async (issueId, newColumnId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${ISSUES_URL}/${issueId}`, {
                columnId: newColumnId,
                projectId
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchIssues();
        } catch (error) {
            console.error('Error updating issue:', error);
        }
    };

    // Delete issue
    const deleteIssue = async (issueId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${ISSUES_URL}/${issueId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchIssues();
        } catch (error) {
            console.error('Error deleting issue:', error);
        }
    };

    useEffect(() => {
        if (projectId) {
            fetchColumns();
            fetchIssues();
        }
        
        const handleIssueCreated = () => fetchIssues();
        window.addEventListener('issueCreated', handleIssueCreated);                            // Listen for the custom event 'issueCreated' to fetch issues
        return () => window.removeEventListener('issueCreated', handleIssueCreated);            // Clean up the event listener if the component is unmounted
    }, [projectId]);

    return (
        <div className="comp-container">
            <div className="column-controls">
                <input
                    type="text"
                    value={newColumnName}
                    onChange={(e) => setNewColumnName(e.target.value)}
                    placeholder="New column name"
                />
                <button onClick={addColumn}>Add Column</button>
            </div>
            <div className="kanban-columns">
                {columns.map(column => (
                    <div key={column._id} className="kanban-column">
                        <div className="column-header">
                            {editingColumn === column._id ? (
                                <input
                                    type="text"
                                    defaultValue={column.name}
                                    onBlur={(e) => {
                                        updateColumnName(column._id, e.target.value);
                                        setEditingColumn(null);
                                    }}
                                    autoFocus
                                />
                            ) : (
                                <h2 onClick={() => setEditingColumn(column._id)}>
                                    {column.name}
                                </h2>
                            )}
                            <button 
                                onClick={() => deleteColumn(column._id)}
                                className="delete-column"
                            >
                                ×
                            </button>
                        </div>
                        <ul>
                            {issues
                                .filter(issue => issue.columnId === column._id)
                                .map(issue => (
                                    <li key={issue._id} className="issue-card">
                                        <div className="issue-header">
                                            <h3>{issue.title}</h3>
                                            <button 
                                                onClick={() => deleteIssue(issue._id)}
                                                className="delete-issue"
                                            >
                                                ×
                                            </button>
                                        </div>
                                        <p>{issue.body}</p>
                                        <select
                                            value={issue.columnId}
                                            onChange={(e) => updateIssueColumn(issue._id, e.target.value)}
                                            className="column-select"
                                        >
                                            {columns.map(col => (
                                                <option key={col._id} value={col._id}>
                                                    {col.name}
                                                </option>
                                            ))}
                                        </select>
                                    </li>
                                ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default KanbanBoard;