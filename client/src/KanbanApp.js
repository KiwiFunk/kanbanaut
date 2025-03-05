import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/issues';

const KanbanBoard = () => {
    const [issues, setIssues] = useState([]);                       // Create a state to store the issues

    // Fetch issues from the backend
    const fetchIssues = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(API_URL, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setIssues(response.data);
        } catch (error) {
            console.error('Error fetching issues:', error);
        }
    };
    
    // Update an issue's status
    const updateIssueStatus = async (id, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`${API_URL}/${id}`, {
                status: newStatus,                                  // Update the status field with newStatus parameter
            }, {
                headers: { Authorization: `Bearer ${token}` },      // Send the token in the Authorization header
            });
            setIssues(issues.map(issue => (issue._id === id ? response.data : issue)));
        } catch (error) {
            console.error('Error updating issue status:', error);
        }
    };

    // Delete an issue
    const deleteIssue = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setIssues(issues.filter(issue => issue._id !== id));
        } catch (error) {
            console.error('Error deleting issue:', error);
        }
    };

    useEffect(() => {
        fetchIssues();
    
        window.addEventListener('issueCreated', () => fetchIssues());           // Listen for the custom event 'issueCreated' to fetch issues
        return () => {                                                          // Clean up the event listener if the component is unmounted
            window.removeEventListener('issueCreated', () => fetchIssues());
        };

    }, []);

    return (
        <div className="kanban-columns">
            {['todo', 'inprogress', 'complete'].map(status => (
                <div className="kanban-column" key={status}>
                    <h2>{status.charAt(0).toUpperCase() + status.slice(1)}</h2>
                    <ul>
                        {issues.filter(issue => issue.status === status).map(issue => (
                            <li key={issue._id}>
                                <span className="card-title">{issue.title}</span>
                                <span className="card-body">{issue.body}</span>
                                <div className="kanban-actions">
                                    <button onClick={() => updateIssueStatus(issue._id, 'todo')}>To-Do</button>
                                    <button onClick={() => updateIssueStatus(issue._id, 'inprogress')}>In Progress</button>
                                    <button onClick={() => updateIssueStatus(issue._id, 'complete')}>Complete</button>
                                    <button onClick={() => deleteIssue(issue._id)}>Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default KanbanBoard;