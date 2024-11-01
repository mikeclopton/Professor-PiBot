import React, { useEffect, useState } from 'react';

const Tutor = ({ module, part }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aiResponse, setAiResponse] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // State for current question index
  const [chatMessages, setChatMessages] = useState([]); // State for chat messages
  const [userInput, setUserInput] = useState(''); // State for user input

  useEffect(() => {
    if (module && part) {
      const fetchQuestions = async () => {
        try {
          const response = await fetch(`http://127.0.0.1:5000/api/get_tutor_response?module=${module}&part=${part}`);
          const data = await response.json();

          if (response.ok) {
            setQuestions(data.questions);
          } else {
            setError(data.error || 'Error fetching questions');
          }
        } catch (err) {
          setError('Failed to fetch questions. Please try again later.');
        } finally {
          setLoading(false);
        }
      };

      fetchQuestions();
    } else {
      setError('Module or part is undefined.');
      setLoading(false);
    }
  }, [module, part]);

  // Fetch AI response whenever the current question index changes
  useEffect(() => {
    const fetchAIResponse = async () => {
      if (questions.length > 0) {
        const currentQuestion = questions[currentQuestionIndex].question; // Get the current question
        try {
          const response = await fetch('http://127.0.0.1:5000/api/process', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              input: currentQuestion,
              submissionType: 'tutor'
            }),
          });

          const data = await response.json();
          setAiResponse(data.response); // Set AI response for the current question
        } catch (err) {
          console.error('Failed to fetch AI response:', err);
          setAiResponse('Unable to get response from AI.');
        }
      }
    };

    fetchAIResponse();
  }, [currentQuestionIndex, questions]); // Trigger when currentQuestionIndex changes

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    // Add user's message to chat messages
    setChatMessages([...chatMessages, { sender: 'user', text: userInput }]);
    
    // Send the user input to the AI
    try {
      const response = await fetch('http://127.0.0.1:5000/api/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: userInput,
          submissionType: 'chat'
        }),
      });

      const data = await response.json();
      // Add AI's response to chat messages
      setChatMessages(prevMessages => [...prevMessages, { sender: 'ai', text: data.response }]);
    } catch (err) {
      console.error('Failed to fetch AI response:', err);
      setChatMessages(prevMessages => [...prevMessages, { sender: 'ai', text: 'Unable to get response from AI.' }]);
    } finally {
      setUserInput(''); // Clear user input
    }
  };

  if (loading) return <p>Loading questions...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Discrete Tutor - Module {module} Part {part}</h2>
      <h3>{questions[currentQuestionIndex].number}. {questions[currentQuestionIndex].question}</h3>
      
      <div>
        <button onClick={previousQuestion} disabled={currentQuestionIndex === 0}>Previous</button>
        <button onClick={nextQuestion} disabled={currentQuestionIndex === questions.length - 1}>Next</button>
      </div>
      
      <h3>AI Tutor Response:</h3>
      <p>{aiResponse}</p>

      {/* Chat Container */}
      <div className="max-w-md mx-auto p-4 mt-4">
        {/* Chat Messages */}
        <div className="space-y-4">
          {chatMessages.map((message, index) => (
            <div key={index} className={`flex ${message.sender === 'ai' ? 'items-start' : 'items-end justify-end'}`}>
              {message.sender === 'ai' ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 100 100"
                    width="50"
                    height="50"
                    fill="#009688"
                    className="w-8 h-8 rounded-full"
                  >
                    {/* Robot Face */}
                    <circle cx="50" cy="50" r="20" fill="#009688" />
                    <circle cx="50" cy="40" r="2" fill="#fff" />
                    <rect x="47" y="45" width="6" height="10" fill="#fff" />
                    <circle cx="50" cy="65" r="3" fill="#009688" />
                    {/* Robot Eyes */}
                    <circle cx="45" cy="45" r="3" fill="#fff" />
                    <circle cx="55" cy="45" r="3" fill="#fff" />
                    <circle cx="45" cy="45" r="1" fill="#000" />
                    <circle cx="55" cy="45" r="1" fill="#000" />
                    {/* Robot Antennas */}
                    <line x1="50" y1="30" x2="40" y2="20" stroke="#009688" strokeWidth="2" />
                    <line x1="50" y1="30" x2="60" y2="20" stroke="#009688" strokeWidth="2" />
                  </svg>
                  <div className="ml-3 bg-gray-100 p-3 rounded-lg">
                    <p className="text-sm text-gray-800">{message.text}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-blue-500 p-3 rounded-lg">
                    <p className="text-sm text-white">{message.text}</p>
                  </div>
                  <img
                    src="https://s3.amazonaws.com/37assets/svn/765-default-avatar.png"
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full ml-3"
                  />
                </>
              )}
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <div className="mt-4 flex items-center">
          <input
            type="text"
            placeholder="Type your message..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="flex-1 py-2 px-3 rounded-full bg-gray-100 focus:outline-none"
          />
          <button onClick={handleSendMessage} className="bg-blue-500 text-white px-4 py-2 rounded-full ml-3 hover:bg-blue-600">Send</button>
        </div>
      </div>
    </div>
  );
};

export default Tutor;
