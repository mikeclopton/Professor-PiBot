import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DrawingPad from './DrawingPad'; // Ensure this component is imported correctly

const Input = ({ module, userId, setResponse, setLatexPreview }) => {
    const [submissionType, setSubmissionType] = useState('latex');
    const [input, setInput] = useState('');
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);  // Start from the first question
    const [response, setResponseState] = useState('');  // Local response state for feedback
    const [progress, setProgress] = useState(0);  // Track progress as a percentage

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

    // Calculate progress based on completed questions
    const calculateProgress = (questionIndex) => {
        if (questions.length > 0) {
            const newProgress = (questionIndex + 1) / questions.length;
            setProgress(newProgress);
        }
    };

    // Update progress in the backend (Supabase)
    const updateProgressInBackend = async () => {
        try {
            const data = {
                user_id: userId,   // Ensure this is correctly passed to the component
                module_id: module,  // Ensure this is the correct module ID
                progress: progress  // Progress is a float (e.g., 0.5 for 50%)
            };
            console.log("Sending progress update:", data);  // Debugging to see what's being sent
            const res = await axios.post('/api/update-progress', data);  // Ensure the API route is correct
            if (res.status === 200) {
                console.log("Progress updated successfully");
            } else {
                console.error("Error updating progress:", res.data);
            }
        } catch (error) {
            console.error("Error updating progress:", error);
        }
    };

    const nextQuestion = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(prevQuestion => prevQuestion + 1);
            setInput(''); // Reset input for the new question
            setResponseState(''); // Reset the response for the new question
        }
    };

    const prevQuestion = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(prevQuestion => prevQuestion - 1);
            setInput(''); // Reset input for the new question
            setResponseState(''); // Reset the response for the new question
        }
    };

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

    const handleDrawingInput = (drawingData) => {
        // Handle data from DrawingPad component
        setInput(drawingData);
    };

    // Function to check the user's answer
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Check if questions are loaded
        if (questions.length === 0) {
            setResponseState("Error: Questions not loaded yet.");
            return;
        }

        // Fetch the current question's data
        const currentQuestionData = questions[currentQuestion];

        if (!currentQuestionData) {
            console.error("Question data not found for current index:", currentQuestion);  // Debugging
            setResponseState("Error: Question data not found.");
            return;
        }

        // Handle submission for different input types
        if (submissionType === 'pen') {
            // Send drawing pad data to the backend
            try {
                const drawingResponse = await axios.post('/api/process-drawing', { src: input, formats: ['latex'], data_options: {} });
                const latexOutput = drawingResponse.data.latex_styled || '';
                setInput(latexOutput); // Update input with LaTeX from MathPix API
                setLatexPreview(latexOutput);
            } catch (error) {
                console.error("Error processing drawing input:", error);
                setResponseState("Error processing drawing input");
                return;
            }
        }

        // Extract the correct answer
        const correctAnswer = currentQuestionData.answer;

        // Compare user input with the correct answer (string comparison)
        const isCorrect = input === correctAnswer;

        // Update the response to show feedback
        setResponseState(isCorrect ? "Correct!" : `Wrong, the correct answer is: ${correctAnswer}`);

        if (isCorrect) {
            // Only update progress if the answer is correct
            console.log("Answer is correct, updating progress...");
            calculateProgress(currentQuestion);
            updateProgressInBackend();  // Update progress after correct answer submission
        }
    };

    return (
        <div>
            {/* Display the current question */}
            <h2>{questions[currentQuestion]?.question || 'Loading...'}</h2>

            {/* Navigation buttons for previous/next questions */}
            <button onClick={prevQuestion} disabled={currentQuestion === 0}>Previous</button>
            <button onClick={nextQuestion} disabled={currentQuestion === questions.length - 1}>Next</button>

            {/* Display the response for feedback */}
            <p>{response}</p>

            {/* Display progress */}
            <p>Progress: {(progress * 100).toFixed(2)}%</p>

            {/* Form to submit answers */}
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

                {/* Input field for the user's answer */}
                {submissionType === 'latex' && (
                    <textarea 
                        placeholder="Enter your LaTeX code here..."
                        value={input}
                        onChange={handleInputChange}
                    ></textarea>
                )}

                {/* Drawing Pad Component */}
                {submissionType === 'pen' && (
                    <DrawingPad onInputChange={handleDrawingInput} />
                )}

                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default Input;
