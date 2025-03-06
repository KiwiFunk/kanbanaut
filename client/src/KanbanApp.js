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
            console.log('Fetched columns:', response.data); // Debug log
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
        if (!newColumnName.trim() || !projectId) {
            console.log('Missing required fields:', { newColumnName, projectId });
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(COLUMNS_URL, {
                name: newColumnName,
                projectId: projectId
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log('Created column:', response.data);
            await fetchColumns();
            setNewColumnName('');
            // Dispatch custom event for column creation
            window.dispatchEvent(new Event('columnCreated'));
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
            await fetchColumns();
            await fetchIssues();
            // Dispatch event for column deletion
            window.dispatchEvent(new Event('columnDeleted'));
        } catch (error) {
            console.error('Error deleting column:', error);
        }
    };
    // Update issue column
    const updateIssueColumn = async (issueId, newColumnId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${ISSUES_URL}/${issueId}`, {
                column: newColumnId, // Changed from columnId to column to match the Issue model
                project: projectId  // Changed from projectId to project to match the Issue model
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            await fetchIssues(); // Added await to ensure issues are refetched
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
                {columns && columns.length > 0 ? (
                    columns.map(column => (
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
                                    .filter(issue => issue.column === column._id)
                                    .map(issue => (
                                        <li key={issue._id} className="issue-card">
                                            <div className="issue-content">
                                                <h3>{issue.title}</h3>
                                                {issue.body && <p>{issue.body}</p>}
                                            </div>
                                            <div className="issue-actions">
                                                <select 
                                                    value={issue.column} 
                                                    onChange={(e) => updateIssueColumn(issue._id, e.target.value)}
                                                    className="column-select"
                                                >
                                                    {columns.map(col => (
                                                        <option key={col._id} value={col._id}>
                                                            Move to: {col.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <button 
                                                    onClick={() => deleteIssue(issue._id)}
                                                    className="delete-issue"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    ))
                ) : (
                    <div>No columns yet. Create one to get started!</div>
                )}
            </div>
        </div>
    );
};

export default KanbanBoard;