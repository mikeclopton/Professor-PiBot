import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Input = ({ module, setResponse, setLatexPreview }) => {
    const [submissionType, setSubmissionType] = useState('latex');
    const [input, setInput] = useState('');
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);  // Start from the first question

    useEffect(() => {
        // Fetch the questions for the given module
        const fetchQuestions = async () => {
            try {
                const res = await axios.get(`http://127.0.0.1:5000/api/getmodule?module=${module}`);
                console.log("Full API Response:", res.data);  // Log the API response to see the exact data structure
                if (res.data && res.data.modules) {
                    setQuestions(res.data.modules[module].parts[1].questions || []);  // Load questions from part 1
                } else {
                    console.error("Error fetching module:", res.data.error);
                }
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        };
        fetchQuestions();
    }, [module]);

    const handleTypeChange = (event) => {
        setSubmissionType(event.target.value);
        setInput('');
        setLatexPreview(''); // Reset LaTeX preview
    };

    const handleInputChange = (event) => {
        const newInput = event.target.value;
        setInput(newInput);

        if (submissionType === 'latex') {
            setLatexPreview(newInput); // Update LaTeX preview as user types
        }
    };

    // Function to check the user's answer
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Check if questions are loaded
        if (questions.length === 0) {
            setResponse("Error: Questions not loaded yet.");
            return;
        }

        // Fetch the current question's data
        const currentQuestionData = questions[currentQuestion];

        if (!currentQuestionData) {
            console.error("Question data not found for current index:", currentQuestion);  // Debugging
            setResponse("Error: Question data not found.");
            return;
        }

        // Extract the correct answer
        const correctAnswer = currentQuestionData.answer;

        // Compare user input with the correct answer (string comparison)
        let isCorrect = false;
        if (input === correctAnswer) {
            isCorrect = true;
        }

        // Update the response to show feedback
        setResponse(isCorrect ? "Correct!" : `Wrong, the correct answer is: ${correctAnswer}`);
    };

    return (
        <div>
            <h2>{questions[currentQuestion]?.question || 'Loading...'}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        <input
                            type="radio"
                            value="latex"
                            checked={submissionType === 'latex'}
                            onChange={handleTypeChange}
                        />
                        LaTeX
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="photo"
                            checked={submissionType === 'photo'}
                            onChange={handleTypeChange}
                        />
                        Photo
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="pen"
                            checked={submissionType === 'pen'}
                            onChange={handleTypeChange}
                        />
                        Pen
                    </label>
                </div>

                {submissionType === 'latex' && (
                    <textarea 
                        placeholder="Enter your LaTeX code here..."
                        value={input}
                        onChange={handleInputChange}
                    ></textarea>
                )}

                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default Input;
