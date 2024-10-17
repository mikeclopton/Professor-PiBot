import React, { useEffect, useState } from 'react';

const Tutor = ({ module, part }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aiResponse, setAiResponse] = useState(''); // State for AI response

  useEffect(() => {
    console.log("Module:", module);
    console.log("Part:", part);

    if (module && part) {
      const fetchQuestions = async () => {
        try {
          const response = await fetch(`http://127.0.0.1:5000/api/get_tutor_response?module=${module}&part=${part}`);
          const data = await response.json();

          if (response.ok) {
            setQuestions(data.questions);
            // After fetching questions, send them to the AI API for processing
            const aiResponse = await fetchAIResponse(data.questions);
            setAiResponse(aiResponse);
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

  const fetchAIResponse = async (questions) => {
    try {
      // Format the questions for the AI API
      const problemText = questions.map(q => q.question).join('\n'); // Join questions with newline
      const response = await fetch('http://127.0.0.1:5000/api/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: problemText, // Send the questions as input
          submissionType: 'tutor' // Specify submission type if needed
        }),
      });

      const data = await response.json();
      return data.response; // Adjust based on your API response structure
    } catch (err) {
      console.error('Failed to fetch AI response:', err);
      return 'Unable to get response from AI.';
    }
  };

  if (loading) return <p>Loading questions...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Discrete Tutor - Module {module} Part {part}</h2>
      <p>Solve the following problems:</p>
      <ul>
        {questions.map((question, index) => (
          <li key={index}>
            {question.question} {/* Display the question */}
          </li>
        ))}
      </ul>
      <h3>AI Tutor Response:</h3>
      <p>{aiResponse}</p> {/* Display AI response here */}
    </div>
  );
};

export default Tutor;
