import React, { useEffect, useState } from 'react';

const Tutor = ({ module, part }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aiResponse, setAiResponse] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // State for current question index

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
    </div>
  );
};

export default Tutor;
