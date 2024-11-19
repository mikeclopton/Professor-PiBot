import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ModuleSelection = () => {
  const navigate = useNavigate();
  const [modules] = useState(["1: Counting and Probability", "2: Matrix Input Practice", "3: Sequences and Summations", "4: Demo Module", "5: Advanced Discrete Math Problems", "6: Discrete Math Practice", "7: Mixed Review Of All Modules"]);
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
    <div className="w-full flex justify-center mt-16">
      <div className="inline-flex flex-col items-center p-8 bg-gray-800 rounded-lg text-center">
        <h2 className="text-3xl font-semibold text-gray-100 mb-6">Select a Module</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <ul className="list-none p-0 w-full">
          {modules.map((module) => (
            <li key={module} className="mb-4">
              <button
                className="w-64 py-3 px-6 cursor-pointer transition-transform bg-indigo-700 text-gray-100 rounded-lg border-b-4 border-indigo-900 hover:bg-indigo-500 hover:shadow-lg hover:-translate-y-1 active:shadow-none active:border-b-2 active:bg-indigo-800 shadow-indigo-900 shadow-md"
                onClick={() => handleModuleSelect(module)}
                disabled={loading}
              >
                {loading ? "Loading..." : `Module ${module}`}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ModuleSelection;
