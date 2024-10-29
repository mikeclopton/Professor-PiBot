import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DrawingPad from './DrawingPad'; // Ensure this component is imported correctly

const Input = ({ module, userId, setResponse, setLatexPreview }) => {
    const [submissionType, setSubmissionType] = useState('latex');
    const [input, setInput] = useState('');
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);  
    const [response, setResponseState] = useState('');  
    const [progress, setProgress] = useState(0);  
    const [image, setImage] = useState(null);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await axios.get(`http://127.0.0.1:5000/api/getmodule?module=${module}`);
                console.log("Full API Response:", res.data);
                if (res.data && res.data.modules) {
                    setQuestions(res.data.modules[module].parts[1].questions || []);
                } else {
                    console.error("Error fetching module:", res.data.error);
                }
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        };
        fetchQuestions();
    }, [module]);

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
            console.log("Sending progress update:", data);
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
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(prevQuestion => prevQuestion + 1);
            setInput('');
            setResponseState('');
        }
    };

    const prevQuestion = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(prevQuestion => prevQuestion - 1);
            setInput('');
            setResponseState('');
        }
    };

    const handleTypeChange = (event) => {
        setSubmissionType(event.target.value);
        setInput('');
        setLatexPreview('');
        setImage(null); // Reset image state when switching submission type
    };

    const handleInputChange = (event) => {
        const newInput = event.target.value;
        setInput(newInput);
        if (submissionType === 'latex') {
            setLatexPreview(newInput);
        }
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

        const currentQuestionData = questions[currentQuestion];

        if (!currentQuestionData) {
            console.error("Question data not found for current index:", currentQuestion);
            setResponseState("Error: Question data not found.");
            return;
        }

        if (submissionType === 'photo' && image) {
            try {
                const photoResponse = await axios.post('/api/process-drawing', {
                    src: image,
                    formats: ['latex'],
                    data_options: {},
                });
                const latexOutput = photoResponse.data.latex_styled || '';
                setInput(latexOutput);
                setLatexPreview(latexOutput);
            } catch (error) {
                console.error("Error processing photo input:", error);
                setResponseState("Error processing photo input");
                return;
            }
        }

        const correctAnswer = currentQuestionData.answer;
        const isCorrect = input === correctAnswer;
        setResponseState(isCorrect ? "Correct!" : `Wrong, the correct answer is: ${correctAnswer}`);

        if (isCorrect) {
            console.log("Answer is correct, updating progress...");
            calculateProgress(currentQuestion);
            updateProgressInBackend();
        }
    };

    return (
        <div>
            <h2>{questions[currentQuestion]?.question || 'Loading...'}</h2>
            <button onClick={prevQuestion} disabled={currentQuestion === 0}>Previous</button>
            <button onClick={nextQuestion} disabled={currentQuestion === questions.length - 1}>Next</button>
            <p>{response}</p>
            <p>Progress: {(progress * 100).toFixed(2)}%</p>
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

                {submissionType === 'photo' && (
                    <input type="file" accept="image/*" onChange={handleImageChange} />
                )}

                {submissionType === 'pen' && (
                    <DrawingPad onInputChange={handleDrawingInput} setLatexPreview={setLatexPreview} />
                )}

                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default Input;
