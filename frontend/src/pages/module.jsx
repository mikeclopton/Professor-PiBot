// module.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './module.css';

const ModuleSelection = () => {
  const navigate = useNavigate();
  const [modules, setModules] = useState([1, 2, 3, 4, 5, 6, 7]);
  const [loading, setLoading] = useState(false);

  const handleModuleSelect = async (selectedModule) => {
    if (loading) return; // Prevent double clicks
    
    setLoading(true);
    try {
      // Only fetch module data once
      const response = await fetch(`/api/getmodule?module=${selectedModule}`);
      if (!response.ok) throw new Error('Failed to fetch module');
      
      // Navigate after successful fetch
      navigate(`/learn?module=${selectedModule}&part=1`);
    } catch (error) {
      console.error('Error loading module:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="module-container">
      <h2 className="module-title">Select a Module</h2>
      <ul className="module-list">
        {modules.map((module) => (
          <li key={module} className="module-item">
            <button 
              className="module-button" 
              onClick={() => handleModuleSelect(module)}
              disabled={loading}
            >
              Module {module}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ModuleSelection;