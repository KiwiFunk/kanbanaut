import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/projects';

const Header = ({ onLogout, onProjectChange }) => {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');

  // Fetch projects
  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(response.data);
      if (response.data.length > 0 && !currentProject) {
        setCurrentProject(response.data[0]);
        onProjectChange(response.data[0]._id);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  // Create new project
  const createProject = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(API_URL, {
        name: newProjectName,
        description: newProjectDesc
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects([...projects, response.data]);
      setNewProjectName('');
      setNewProjectDesc('');
      setShowNewProject(false);
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

// Delete a project 
const deleteProject = async (projectId) => {
  if (!window.confirm('Are you sure? All columns and issues in this project will be deleted.')) return;
  
  try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
      });
      
      // Remove the deleted project from local state
      const updatedProjects = projects.filter(p => p._id !== projectId);
      setProjects(updatedProjects);
      
      // If we deleted the current project, switch to another one if available
      if (currentProject._id === projectId) {
          if (updatedProjects.length > 0) {
              setCurrentProject(updatedProjects[0]);
              onProjectChange(updatedProjects[0]._id);
          } else {
              setCurrentProject(null);
              onProjectChange(null);
          }
      }
  } catch (error) {
      console.error('Error deleting project:', error);
      alert('Error deleting project');
  }
};

  // Handle project change
  const handleProjectChange = (project) => {
    setCurrentProject(project);
    onProjectChange(project._id);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <header className="comp-container">
      <div className="header-content">
        <h1>Kanbanaut</h1>
        <div className="project-controls">
          <select 
            value={currentProject?._id || ''} 
            onChange={(e) => handleProjectChange(projects.find(p => p._id === e.target.value))}
          >
            {projects.map(project => (
              <option key={project._id} value={project._id}>
                {project.name}
              </option>
            ))}
          </select>
          <button className="new-project-btn" onClick={() => setShowNewProject(!showNewProject)}>
            + New Project
          </button>
          <button className="new-project-btn" onClick={() => deleteProject(currentProject._id)}>
            - Delete Project
          </button>
        </div>
        <button className="logout-button" onClick={onLogout}>Logout</button>
      </div>
      
      {showNewProject && (
        <div className="new-project-form">
          <input
            type="text"
            placeholder="Project Name"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Project Description (Optional)"
            value={newProjectDesc}
            onChange={(e) => setNewProjectDesc(e.target.value)}
          />
          <button onClick={createProject}>Create Project</button>
          <button onClick={() => setShowNewProject(false)}>Cancel</button>
        </div>
      )}
    </header>
  );
};

export default Header;