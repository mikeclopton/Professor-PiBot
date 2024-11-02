import React from 'react';
import { useNavigate } from 'react-router-dom';
import './module.css'; // Make sure to create this CSS file for styling

const ModuleSelection = () => {
  const navigate = useNavigate();
  const modules = [1, 2, 3, 4, 5, 6, 7]; // Example modules array; replace this with your actual module data

  const handleModuleSelect = (selectedModule) => {
    navigate(`/learn?module=${selectedModule}&part=1`);
  };

  return (
    <div className="module-container">
      <h2 className="module-title">Select a Module</h2>
      <ul className="module-list">
        {modules.map((module) => (
          <li key={module} className="module-item">
            <button className="module-button" onClick={() => handleModuleSelect(module)}>
              Module {module}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ModuleSelection;
