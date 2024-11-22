import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const ModuleSelection = () => {
  const navigate = useNavigate();
  const [modules] = useState([1, 2, 3, 4, 5, 6, 7]);
  const moduleTitles = {
    1: "Counting and Probability",
    2: "Matrix Input Practice",
    3: "Sequences and Summations",
    4: "Demo Module",
    5: "Advanced Discrete Math Problems",
    6: "Discrete Math Practice",
    7: "Mixed Review Of All Modules",
  };
  const moduleDescriptions = {
    1: "Learn the fundamentals of counting techniques and probability theory.",
    2: "Practice matrix input methods and basic operations in discrete math.",
    3: "Understand and work with sequences, summations, and their applications.",
    4: "Explore a demo module for navigating and interacting with lessons.",
    5: "Tackle advanced problems in discrete math to deepen your understanding.",
    6: "Review and practice various topics in discrete math with exercises.",
    7: "A mixed review of all modules to test your overall knowledge.",
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hoveredModule, setHoveredModule] = useState(null); // Track hovered module
  const [fadeStyle, setFadeStyle] = useState({ opacity: 0, transform: "translateX(-10px)" }); // Style for fade-in/out
  const hoverTimeout = useRef(null); // Track hover timeout to handle fast transitions

  const handleModuleSelect = async (selectedModule) => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch(`/api/getmodule?module=${selectedModule}`);
      if (!response.ok) throw new Error("Failed to fetch module");

      navigate(`/learn?module=${selectedModule}&part=1`);
    } catch (error) {
      console.error("Error loading module:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMouseEnter = (module) => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current); // Clear any existing timeouts

    setHoveredModule(module);
    setFadeStyle({
      opacity: 0, // Start invisible
      transform: "translateX(-10px)", // Start slightly offset
    });

    hoverTimeout.current = setTimeout(() => {
      setFadeStyle({
        opacity: 1, // Fade in
        transform: "translateX(0)", // Move to position
        transition: "opacity 0.3s ease-in-out, transform 0.3s ease-in-out", // Smooth transition
      });
    }, 50); // Small delay to trigger transition
  };

  const handleMouseLeave = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current); // Clear any existing timeouts

    setFadeStyle({
      opacity: 0, // Fade out
      transform: "translateX(-10px)", // Slide out
      transition: "opacity 0.3s ease-in-out, transform 0.3s ease-in-out", // Smooth transition
    });

    hoverTimeout.current = setTimeout(() => setHoveredModule(null), 300); // Remove module after fade-out completes
  };

  return (
    <div className="w-full flex justify-center mt-16">
      <div
        className="inline-flex flex-col items-center p-8 text-center relative"
        style={{
          background:
            "linear-gradient(145deg, #1f2937, #2d3748)", // Gradient background
          border: "1px solid #374151",
          borderRadius: "12px",
          boxShadow: "0 8px 15px rgba(0, 0, 0, 0.2)",
        }}
      >
        <h2
          className="text-3xl font-semibold mb-6"
          style={{ color: "#F3F4F6", textShadow: "0px 1px 2px rgba(0, 0, 0, 0.3)" }}
        >
          Select a Module
        </h2>
        {error && (
          <p
            className="mb-4"
            style={{
              color: "#EF4444",
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              fontWeight: "bold",
            }}
          >
            {error}
          </p>
        )}
        <ul className="list-none p-0 w-full">
          {modules.map((module) => (
            <li
              key={module}
              className="mb-4 relative"
              onMouseEnter={() => handleMouseEnter(module)}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className={`w-64 py-3 px-6 cursor-pointer transition-transform text-gray-100 rounded-lg border-b-4 hover:shadow-lg hover:-translate-y-1 active:shadow-none active:border-b-2 ${
                  hoveredModule === module
                    ? "bg-indigo-800 border-indigo-700"
                    : "bg-indigo-700 border-indigo-900 hover:bg-indigo-500"
                }`}
                style={{
                  fontSize: "1rem",
                  fontWeight: "600",
                  boxShadow: "0 4px 10px rgba(99, 102, 241, 0.2)",
                  transition: "all 0.3s ease",
                }}
                onClick={() => handleModuleSelect(module)}
                disabled={loading && hoveredModule === module}
              >
                {loading && hoveredModule === module
                  ? "Loading..."
                  : `Module ${module}: ${moduleTitles[module]}`}
              </button>

              {/* Description Panel */}
              {hoveredModule === module && (
                <div
                  className="absolute top-0 left-full ml-12 w-64 p-4 rounded-lg shadow-lg"
                  style={{
                    background: "rgba(31, 41, 55, 0.9)",
                    color: "#F3F4F6",
                    textAlign: "left",
                    zIndex: 10,
                    ...fadeStyle, // Apply dynamic fade style
                  }}
                >
                  <h4 className="font-bold mb-2">Module Description</h4>
                  <p className="text-sm">{moduleDescriptions[module]}</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ModuleSelection;
