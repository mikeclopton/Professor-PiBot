import React from 'react';
import { useNavigate } from 'react-router-dom';
import './module.css'; // Make sure to create this CSS file for styling

const ModuleSelection = () => {
  const navigate = useNavigate();
  const modules = [1, 2, 3, 4, 5, 6, 7]; // Example modules array; replace this with your actual module data

  const handleModuleSelect = (selectedModule) => {
    // Assuming you're passing part 1 for simplicity; you can modify this as needed
    navigate(`/learn?module=${selectedModule}&part=1`);
  };

  return (
    <div className="module-selection">
      <h2>Select a Module</h2>
      <ul>
        {modules.map((module) => (
          <li key={module}>
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
