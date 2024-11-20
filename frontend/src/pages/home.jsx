import React from "react";
import { useNavigate } from "react-router-dom";
import { FaBook, FaQuestionCircle, FaRobot } from "react-icons/fa";
import heroBg from "../assets/hero-bg.webp";

export default function Home() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/register");
  };

  const handleModules = () => {
    navigate("/modules");
  };

  return (
    <div className="flex flex-col items-center bg-gray-900">
      {/* Hero Section */}
      <section
        className="w-full bg-cover bg-center relative text-white py-20 px-6"
        style={{
          backgroundImage: `url(${heroBg})`,
        }}
      >
        <div className="absolute inset-0 bg-gray-900 bg-opacity-70"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-bold mb-6">Welcome to Professor PiBot</h1>
          <p className="text-xl mb-8">
            Your personal AI tutor for mastering discrete mathematics.
          </p>
          <button
            onClick={handleGetStarted}
            className="bg-blue-600 hover:bg-blue-700 px-10 py-4 rounded-lg font-semibold text-xl"
          >
            Get Started
          </button>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="w-full max-w-5xl text-center py-16 px-8 h-full">
        <h2 className="text-3xl font-bold text-gray-100 mb-6">
          Meet Professor PiBot
        </h2>
        <p className="text-lg text-gray-400 mb-8">
          A smarter way to learn discrete math. With interactive lessons, tailored exercises, and AI-powered guidance, we ensure you excel with confidence.
        </p>
        <button
          onClick={handleGetStarted}
          className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-md font-medium text-white"
        >
          Explore Modules
        </button>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 py-16 px-8">
        <div className="bg-gray-800 shadow-lg rounded-lg p-6 text-center text-gray-300">
          <FaBook className="text-blue-400 text-5xl mx-auto mb-4" />
          <h3 className="text-2xl font-semibold mb-2">Interactive Lessons</h3>
          <p className="text-gray-400">
            Learn concepts with clear explanations and examples tailored to your pace.
          </p>
        </div>
        <div className="bg-gray-800 shadow-lg rounded-lg p-6 text-center text-gray-300">
          <FaQuestionCircle className="text-blue-400 text-5xl mx-auto mb-4" />
          <h3 className="text-2xl font-semibold mb-2">Practice Questions</h3>
          <p className="text-gray-400">
            Test your knowledge with various question types and get instant feedback.
          </p>
        </div>
        <div className="bg-gray-800 shadow-lg rounded-lg p-6 text-center text-gray-300">
          <FaRobot className="text-blue-400 text-5xl mx-auto mb-4" />
          <h3 className="text-2xl font-semibold mb-2">AI-Powered Assistance</h3>
          <p className="text-gray-400">
            Ask questions and receive support through an intelligent chatbot.
          </p>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="w-full bg-gray-800 text-white py-8">
        <div className="text-center mb-4">
          <p className="text-sm">&copy; 2024 Professor PiBot. All rights reserved.</p>
        </div>
        <div className="flex justify-center space-x-6">
          <a
            href="#"
            className="text-gray-400 hover:text-white"
            aria-label="Facebook"
          >
            <i className="fab fa-facebook-f"></i>
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-white"
            aria-label="Twitter"
          >
            <i className="fab fa-twitter"></i>
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-white"
            aria-label="Instagram"
          >
            <i className="fab fa-instagram"></i>
          </a>
        </div>
      </footer>
    </div>
  );
}
