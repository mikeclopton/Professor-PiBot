import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ModuleSelection = () => {
  const navigate = useNavigate();
  const [modules] = useState([1, 2, 3, 4, 5, 6, 7]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleModuleSelect = async (selectedModule) => {
    if (loading) return; // Prevent double clicks
    
    setLoading(true);
    setError(null); // Reset error on each new request

    try {
      const response = await fetch(`/api/getmodule?module=${selectedModule}`);
      if (!response.ok) throw new Error('Failed to fetch module');
      navigate(`/learn?module=${selectedModule}&part=1`);
    } catch (error) {
      console.error('Error loading module:', error);
      setError('Failed to load module. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto mt-16 p-8 bg-gray-900 rounded-lg text-center">
      <h2 className="text-3xl font-semibold text-gray-100 mb-6">Select a Module</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <ul className="list-none p-0">
        {modules.map((module) => (
          <li key={module} className="mb-4">
            <button
              className="w-full py-3 px-6 cursor-pointer transition-transform bg-gray-700 text-gray-100 rounded-lg border-b-4 border-gray-900 hover:bg-gray-500 hover:shadow-lg hover:-translate-y-1 active:shadow-none active:border-b-2 active:bg-gray-800 shadow-gray-900 shadow-md"
              onClick={() => handleModuleSelect(module)}
              disabled={loading}
            >
              {loading ? "Loading..." : `Module ${module}`}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ModuleSelection;
