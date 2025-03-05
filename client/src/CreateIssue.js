import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/issues';

const CreateIssue = () => {
    const [newIssueTitle, setNewIssueTitle] = useState('');         // State to store the new issue title
    const [newIssueBody, setNewIssueBody] = useState('');           // State to store the new issue body
    
    // Add a new issue
    const addIssue = async () => {
        if (!newIssueTitle) return;
        try {
            const token = localStorage.getItem('token');
            await axios.post(API_URL, {
                title: newIssueTitle,
                body: newIssueBody,
                status: 'todo',
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
          
            window.dispatchEvent(new Event('issueCreated'));        // Dispatch custom event to tell KanbanBoard to fetch issues       
            
            setNewIssueTitle('');               //Clear the title field
            setNewIssueBody('');                //Clear the body field
        } catch (error) {
            console.error('Error adding issue:', error);
        }
    };

    return (
        <div className="create-issue-container">
            <h2>Create New Issue</h2>
            <div className="kanban-form">
                <input
                    className="issue-title"
                    type="text"
                    value={newIssueTitle}
                    onChange={(e) => setNewIssueTitle(e.target.value)}
                    placeholder="Add a new issue"
                />
                <input
                    className="issue-body"
                    type="text"
                    value={newIssueBody}
                    onChange={(e) => setNewIssueBody(e.target.value)}
                    placeholder="Describe your issue (Optional)"
                />
                <button onClick={addIssue}>Add</button>
            </div>
        </div>
    );
};

export default CreateIssue;