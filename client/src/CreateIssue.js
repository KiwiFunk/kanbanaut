import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/issues';                     // !!Update the naming convention for the API URL to ISSUE_URL
const COLUMNS_URL = 'http://localhost:5000/api/columns';

const CreateIssue = ({ projectId }) => {                                // Accept projectId as a prop to fetch the project specific columns
    const [newIssueTitle, setNewIssueTitle] = useState('');             // State to store the new issue title
    const [newIssueBody, setNewIssueBody] = useState('');               // State to store the new issue body
    const [columns, setColumns] = useState([]);                         // State to store the current columns
    const [selectedColumn, setSelectedColumn] = useState('');           // State to store the selected column

    const fetchColumns = async () => {
        if (!projectId) return;
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${COLUMNS_URL}/${projectId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setColumns(response.data);
            if (response.data.length > 0 && !selectedColumn) {
                setSelectedColumn(response.data[0]._id);
            }
        } catch (error) {
            console.error('Error fetching columns:', error);
        }
    };

    useEffect(() => {
        fetchColumns();
        
        // Add event listeners for column changes
        const handleColumnCreated = () => fetchColumns();
        const handleColumnDeleted = () => fetchColumns();
        
        window.addEventListener('columnCreated', handleColumnCreated);
        window.addEventListener('columnDeleted', handleColumnDeleted);
        
        // Cleanup
        return () => {
            window.removeEventListener('columnCreated', handleColumnCreated);
            window.removeEventListener('columnDeleted', handleColumnDeleted);
        };
    }, [projectId]);

    const addIssue = async () => {
        if (!newIssueTitle || !selectedColumn) return;
        try {
            const token = localStorage.getItem('token');
            await axios.post(API_URL, {
                title: newIssueTitle,
                body: newIssueBody,
                column: selectedColumn,
                projectId: projectId
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            
            window.dispatchEvent(new Event('issueCreated'));        // Dispatch a custom event 'issueCreated' to notify the KanbanBoard component
            setNewIssueTitle('');                                   // Clear the input fields after adding the new issue
            setNewIssueBody('');
        } catch (error) {
            console.error('Error adding issue:', error);
        }
    };

    return (
        <div className="comp-container">
            <div className="issue-form">
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
                <select
                    value={selectedColumn}
                    onChange={(e) => setSelectedColumn(e.target.value)}
                    className="column-select"
                >
                    {columns.map(column => (
                        <option key={column._id} value={column._id}>
                            {column.name}
                        </option>
                    ))}
                </select>
                <button onClick={addIssue}>Add</button>
            </div>
        </div>
    );
};

export default CreateIssue;