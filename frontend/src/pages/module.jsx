import React, { useState, useRef } from "react";

const ModuleSelection = () => {
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

  const [hoveredModule, setHoveredModule] = useState(null);
  const [fadeStyle, setFadeStyle] = useState({
    opacity: 0,
    transform: "translateX(-10px)",
  });
  const hoverTimeout = useRef(null);

  const handleModuleSelect = (selectedModule) => {
    // Reload the page with the selected module
    window.location.href = `/learn?module=${selectedModule}&part=1`;
  };

  const handleMouseEnter = (module) => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);

    setHoveredModule(module);
    setFadeStyle({
      opacity: 0,
      transform: "translateX(-10px)",
    });

    hoverTimeout.current = setTimeout(() => {
      setFadeStyle({
        opacity: 1,
        transform: "translateX(0)",
        transition: "opacity 0.3s ease-in-out, transform 0.3s ease-in-out",
      });
    }, 50);
  };

  const handleMouseLeave = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);

    setFadeStyle({
      opacity: 0,
      transform: "translateX(-10px)",
      transition: "opacity 0.3s ease-in-out, transform 0.3s ease-in-out",
    });

    hoverTimeout.current = setTimeout(() => setHoveredModule(null), 300);
  };

  return (
    <div className="w-full flex justify-center mt-16">
      <div
        className="inline-flex flex-col items-center p-8 text-center relative"
        style={{
          background: "linear-gradient(145deg, #1f2937, #2d3748)",
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
              >
                Module {module}: {moduleTitles[module]}
              </button>

              {hoveredModule === module && (
                <div
                  className="absolute top-0 left-full ml-12 w-64 p-4 rounded-lg shadow-lg"
                  style={{
                    background: "rgba(31, 41, 55, 0.9)",
                    color: "#F3F4F6",
                    textAlign: "left",
                    zIndex: 10,
                    ...fadeStyle,
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
