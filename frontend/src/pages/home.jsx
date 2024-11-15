import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/modules"); // Navigates to the modules page
  };

  return (
    <div className="flex flex-col items-center bg-gray-900 h-[90vh]">
      {/* Hero Section */}
      <section className="w-full bg-gray-800 text-white py-16 px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to the Discrete Math AI Tutor</h1>
        <p className="text-lg mb-6">Your personal AI tutor for mastering discrete mathematics.</p>
        <button
          onClick={handleGetStarted}
          className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold"
        >
          Get Started
        </button>
      </section>

      {/* Introduction Section */}
      <section className="w-full max-w-4xl text-center py-12 px-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-300">About the Tutor</h2>
        <p className="text-gray-400 text-lg mb-6">
          Our AI tutor offers interactive lessons, practice questions, and real-time feedback to help you understand and excel in discrete math.
        </p>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6 py-12 px-6 flex-grow">
        <div className="bg-gray-800 shadow-md rounded-lg p-6 text-center text-gray-300">
          <h3 className="text-xl font-semibold mb-2">Interactive Lessons</h3>
          <p className="text-gray-400">Learn concepts with clear explanations and examples tailored to your pace.</p>
        </div>
        <div className="bg-gray-800 shadow-md rounded-lg p-6 text-center text-gray-300">
          <h3 className="text-xl font-semibold mb-2">Practice Questions</h3>
          <p className="text-gray-400">Test your knowledge with various question types and get instant feedback.</p>
        </div>
        <div className="bg-gray-800 shadow-md rounded-lg p-6 text-center text-gray-300">
          <h3 className="text-xl font-semibold mb-2">AI-Powered Assistance</h3>
          <p className="text-gray-400">Ask questions and receive support through an intelligent chatbot.</p>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="w-full bg-gray-700 text-white text-center py-4">
        <p>&copy; 2024 Discrete Math AI Tutor. All rights reserved.</p>
      </footer>
    </div>
  );
}
