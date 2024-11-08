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
    <div className="w-full mx-auto mt-16 p-8 bg-gray-700 rounded-lg text-center">
      <h2 className="text-3xl font-semibold text-white mb-6">Select a Module</h2>
      <ul className="list-none p-0">
        {modules.map((module) => (
          <li key={module} className="mb-4">
            <button 
              className="w-full py-3 px-6 cursor-pointer transition-all bg-blue-500 text-white px-6 py-2 rounded-lg border-blue-600 border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
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
