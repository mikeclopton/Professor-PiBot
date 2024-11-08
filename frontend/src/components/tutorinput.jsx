import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DrawingPad from './DrawingPad';
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
            setInput('');
            setResponseState('');
            calculateProgress(currentQuestionIndex + 1);
            updateProgressInBackend();
        }
    };

    const prevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
            setInput('');
            setResponseState('');
        }
    };

    const handleTypeChange = (event) => {
        setSubmissionType(event.target.value);
        setInput('');
    };

    const handleInputChange = (event) => {
        setInput(event.target.value);
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

        let processedInput = input;

        if (submissionType === 'photo' && image) {
            try {
                const photoResponse = await axios.post('http://127.0.0.1:5000/api/process-drawing', {
                    src: image,
                    formats: ['latex'],
                    data_options: {}
                });
                processedInput = photoResponse.data.latex_styled || '';
            } catch (error) {
                console.error("Error processing photo input:", error);
                setResponseState("Error processing photo input");
                return;
            }
        }

        try {
            const validationResponse = await axios.post('http://127.0.0.1:5000/api/process', {
                input: processedInput,
                correctAnswer: currentQuestionData.answer,
                submissionType: 'validation',
                inputType: submissionType
            });

            const isCorrect = validationResponse.data.isCorrect;
            setResponseState(isCorrect 
                ? "Correct!" 
                : `Incorrect. The correct answer is: ${currentQuestionData.answer}`
            );

            if (isCorrect) {
                calculateProgress(currentQuestionIndex);
                await updateProgressInBackend();
            }
        } catch (error) {
            console.error('Error validating answer:', error);
            setResponseState('Error validating your answer. Please try again.');
        }
    };

    if (loading) return <div className="text-center text-gray-600">Loading questions...</div>;
    if (error) return <div className="text-center text-red-500">{error}</div>;

    return (
        <div className="p-6 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{questions[currentQuestionIndex]?.question || 'Loading...'}</h2>

            <p className="text-gray-600 mb-4">{response}</p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex space-x-4">
                    <label className="flex items-center space-x-2">
                        <input
                            type="radio"
                            value="latex"
                            checked={submissionType === 'latex'}
                            onChange={handleTypeChange}
                            className="form-radio text-blue-600"
                        />
                        <span className="text-gray-700">LaTeX</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input
                            type="radio"
                            value="photo"
                            checked={submissionType === 'photo'}
                            onChange={handleTypeChange}
                            className="form-radio text-blue-600"
                        />
                        <span className="text-gray-700">Photo</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input
                            type="radio"
                            value="pen"
                            checked={submissionType === 'pen'}
                            onChange={handleTypeChange}
                            className="form-radio text-blue-600"
                        />
                        <span className="text-gray-700">Pen</span>
                    </label>
                </div>

                {submissionType === 'latex' && (
                    <math-field
                        value={input}
                        onInput={(evt) => setInput(evt.target.value)}
                        placeholder="Enter Answer here:"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                )}

                {submissionType === 'photo' && (
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="block w-full text-gray-600"
                    />
                )}

                {submissionType === 'pen' && (
                    <DrawingPad
                        setResponse={setResponseState}
                        setLatexPreview={setInput}
                        onInputChange={handleDrawingInput}
                    />
                )}

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-semibold"
                >
                    Submit
                </button>
            </form>

            <div className="flex justify-between mt-4">
                <button
                    onClick={prevQuestion}
                    disabled={currentQuestionIndex === 0}
                    className={`py-2 px-4 rounded-lg ${currentQuestionIndex === 0 ? 'bg-gray-300' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                >
                    Previous
                </button>
                <button
                    onClick={nextQuestion}
                    disabled={currentQuestionIndex === questions.length - 1}
                    className={`py-2 px-4 rounded-lg ${currentQuestionIndex === questions.length - 1 ? 'bg-gray-300' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default TutorInput;
