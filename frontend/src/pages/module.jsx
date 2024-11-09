import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ModuleSelection = () => {
  const navigate = useNavigate();
  const [modules, setModules] = useState([1, 2, 3, 4, 5, 6, 7]);
  const [loading, setLoading] = useState(false);

  const handleModuleSelect = async (selectedModule) => {
    if (loading) return; // Prevent double clicks
    
    setLoading(true);
    try {
      const response = await fetch(`/api/getmodule?module=${selectedModule}`);
      if (!response.ok) throw new Error('Failed to fetch module');
      navigate(`/learn?module=${selectedModule}&part=1`);
    } catch (error) {
      console.error('Error loading module:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto mt-16 p-8 bg-gray-800 rounded-lg text-center">
      <h2 className="text-3xl font-semibold text-white mb-6">Select a Module</h2>
      <ul className="list-none p-0">
        {modules.map((module) => (
          <li key={module} className="mb-4">
            <button
              className="w-full py-3 px-6 cursor-pointer transition-transform bg-blue-600 text-white rounded-lg border-blue-700 border-b-4 hover:bg-blue-700 hover:-translate-y-1 active:border-b-2 active:translate-y-1 active:bg-blue-800"
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
