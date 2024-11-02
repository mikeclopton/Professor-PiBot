import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DrawingPad from './DrawingPad'; // Ensure this component is imported correctly
import "//unpkg.com/mathlive";

const TutorInput = ({ module, part, userId }) => {
    const [submissionType, setSubmissionType] = useState('latex');
    const [input, setInput] = useState('');
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [aiResponse, setAiResponse] = useState('');
    const [response, setResponseState] = useState('');
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [image, setImage] = useState(null);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:5000/api/getmodule?module=${module}`);
                if (response.data && response.data.modules) {
                    setQuestions(response.data.modules[module].parts[1].questions || []);
                } else {
                    setError("Error fetching module questions.");
                }
            } catch (err) {
                console.error('Error fetching questions:', err);
                setError('Failed to fetch questions.');
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, [module]);

    useEffect(() => {
        const fetchAIResponse = async () => {
            if (questions.length > 0) {
                const currentQuestion = questions[currentQuestionIndex].question;
                try {
                    const response = await axios.post('http://127.0.0.1:5000/api/process', {
                        input: currentQuestion,
                        submissionType: 'tutor',
                    });
                    setAiResponse(response.data.response);
                } catch (err) {
                    console.error('Failed to fetch AI response:', err);
                    setAiResponse('Unable to get response from AI.');
                }
            }
        };
        fetchAIResponse();
    }, [currentQuestionIndex, questions]);

    const calculateProgress = (questionIndex) => {
        if (questions.length > 0) {
            const newProgress = (questionIndex + 1) / questions.length;
            setProgress(newProgress);
        }
    };

    const updateProgressInBackend = async () => {
        try {
            const data = {
                user_id: userId,
                module_id: module,
                progress: progress
            };
            const res = await axios.post('/api/update-progress', data);
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
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setInput(''); // Reset input for the next question
            setResponseState(''); // Reset response for the next question
            calculateProgress(currentQuestionIndex + 1); // Calculate progress for the next question
            updateProgressInBackend(); // Update progress in the backend
        }
    };

    const prevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
            setInput(''); // Reset input for the previous question
            setResponseState(''); // Reset response for the previous question
        }
    };

    const handleTypeChange = (event) => {
        setSubmissionType(event.target.value);
        setInput('');
    };

    const handleInputChange = (event) => {
        const newInput = event.target.value;
        setInput(newInput);
    };

    const handleDrawingInput = (drawingData) => {
        setInput(drawingData);
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setImage(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (questions.length === 0) {
            setResponseState("Error: Questions not loaded yet.");
            return;
        }

        const currentQuestionData = questions[currentQuestionIndex];
        if (!currentQuestionData) {
            setResponseState("Error: Question data not found.");
            return;
        }

        const correctAnswer = currentQuestionData.answer;
        const isCorrect = input === correctAnswer;
        setResponseState(isCorrect ? "Correct!" : `Wrong, the correct answer is: ${correctAnswer}`);

        if (isCorrect) {
            calculateProgress(currentQuestionIndex);
            updateProgressInBackend(); // Update progress in the backend when correct
        }
    };



    return (
        <div className="tutor-input-container">
            <h2>{questions[currentQuestionIndex]?.question || 'Loading...'}</h2>
    
            <p>{response}</p>
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
                    <math-field
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Enter Answer here:"
                    />
                )}
    
                {submissionType === 'photo' && (
                    <input type="file" accept="image/*" onChange={handleImageChange} />
                )}
    
                {submissionType === 'pen' && (
                    <DrawingPad onInputChange={handleDrawingInput} />
                )}
    
                <button type="submit">Submit</button>
            </form>
    
            <div className="navigation-buttons">
                <button onClick={prevQuestion} disabled={currentQuestionIndex === 0}>Previous</button>
                <button onClick={nextQuestion} disabled={currentQuestionIndex === questions.length - 1}>Next</button>
            </div>
        </div>
    );
    
};

export default TutorInput;
