import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DrawingPad from './DrawingPad';
import "https://unpkg.com/mathlive";
import { MathJax, MathJaxContext } from 'better-react-mathjax';

const Course = ({ module, userId }) => {
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
    const [answeredQuestions, setAnsweredQuestions] = useState([]); // Track which questions are correctly answered
    

    useEffect(() => {
        const fetchQuestions = async () => {
            setLoading(true); // Set loading to true at the start of fetching
            try {
                const response = await axios.get(`http://127.0.0.1:5000/api/getmodule?module=${module}`);
                
                if (response.data && response.data.questions) {
                    // Only update questions if the module data matches the requested module
                    setQuestions(response.data.questions);
                    setAnsweredQuestions(Array(response.data.questions.length).fill(false)); // Initialize answers
                    setError(null); // Reset any previous error
                } else {
                    setError("Error: Module not found or questions are missing.");
                }
            } catch (err) {
                console.error('Error fetching questions:', err);
                setError('Failed to fetch questions.');
            } finally {
                setLoading(false); // End loading state
            }
        };
    
        // Clear previous questions and call fetch
        setQuestions([]); // Clear questions before fetching new ones
        fetchQuestions();
    }, [module]);
    

    const calculateProgress = () => {
        const correctAnswersCount = answeredQuestions.filter(Boolean).length;
        const newProgress = (correctAnswersCount / questions.length) * 100;
        setProgress(newProgress);
    };

    const updateProgressInBackend = async () => {
        try {
            const data = {
                user_id: userId,
                module_id: module,
                progress: progress / 100 // Send progress as a decimal (0.14 for 14%)
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

            if (isCorrect && !answeredQuestions[currentQuestionIndex]) {
                // Only update progress if this question was not previously answered correctly
                const updatedAnswers = [...answeredQuestions];
                updatedAnswers[currentQuestionIndex] = true;
                setAnsweredQuestions(updatedAnswers);

                calculateProgress();
                await updateProgressInBackend();
            }
        } catch (error) {
            console.error('Error validating answer:', error);
            setResponseState('Error validating your answer. Please try again.');
        }
    };

    const nextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setInput('');
            setResponseState('');
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

    if (loading) return <div className="text-center">Loading questions...</div>;
    if (error) return <div className="text-center text-red-500">{error}</div>;

    return (
        <MathJaxContext>
            
            <div className="p-6 bg-gray-800 text-gray-100 rounded-lg shadow-lg transition-all duration-300 ease-in-out h-full flex flex-col justify-between overflow-auto">
            <div className="progress-section mt-6">
                        <p className="font-semibold mb-2">Module Progress</p>
                        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-teal-400 to-green-500 text-white text-xs font-medium flex items-center justify-center transition-all duration-500 ease-in-out"
                                style={{ width: `${progress}%` }}
                            >
                                {Math.round(progress)}%
                            </div>
                        </div>
                    </div>
                <div>
                <MathJax key={`latex-${currentQuestionIndex}`}>
                    <h2 className="text-2xl font-semibold mb-4 font-sans transition-transform duration-300 ease-in-out">
                        {questions[currentQuestionIndex]?.question || 'Loading...'}
                    </h2>
                </MathJax>
                <MathJax key={`response-${response}`}>
                    <p
                        className={`${
                            response.includes("Correct!") ? "text-green-500" : response.includes("Incorrect") ? "text-red-500" : "text-gray-600"
                        } mb-4`}
                    >
                        {response}
                    </p>
                </MathJax>

                <div className="flex space-x-4 mt-4">
                    <button
                        className="relative inline-block px-4 py-2 font-semibold text-white bg-gray-700 rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-transform duration-200"
                    >
                        Don't Know?
                    </button>
                    <button
                        className="relative inline-block px-4 py-2 font-semibold text-white bg-gray-700 rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-transform duration-200"
                    >
                        Hint
                    </button>
                </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex space-x-4">
                            {['latex', 'photo', 'pen'].map((type) => (
                                <label key={type} className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        value={type}
                                        checked={submissionType === type}
                                        onChange={handleTypeChange}
                                        className="form-radio text-blue-600"
                                    />
                                    <span className="capitalize">{type}</span>
                                </label>
                            ))}
                        </div>

                        {submissionType === 'latex' && (
                            <div className="flex items-center justify-center w-full">
                                <math-field
                                    key={`latex-${currentQuestionIndex}`}
                                    value={input}
                                    onInput={(evt) => setInput(evt.target.value)}
                                    placeholder="Enter Answer Here"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        )}
                        {submissionType === 'photo' && (
                            <div className="flex items-center justify-center w-full">
                                <label
                                    htmlFor="dropzone-file"
                                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                                >
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <svg
                                            className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 20 16"
                                        >
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                            />
                                        </svg>
                                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            SVG, PNG, JPG or GIF (MAX. 800x400px)
                                        </p>
                                    </div>
                                    <input
                                        id="dropzone-file"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        )}

                        {submissionType === 'pen' && (
                            <DrawingPad
                                key={`pen-${currentQuestionIndex}`}
                                setResponse={setResponseState}
                                setLatexPreview={setInput}
                                onInputChange={(drawingOutput) => {
                                    console.log('Setting input value:', drawingOutput);
                                    setInput(drawingOutput);
                                }}
                            />
                        )}

                        {/* New Button Integration */}
                        <div className="flex items-center justify-center mt-6">
                            <button className="relative inline-block p-px font-semibold leading-6 text-white bg-gray-800  cursor-pointer rounded-xl transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95">
                                <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                                <span className="relative z-10 block px-6 py-3 rounded-xl bg-gray-950">
                                    <div className="relative z-10 flex items-center space-x-2">
                                        <span className="transition-all duration-500 group-hover:translate-x-1">
                                            Submit
                                        </span>
                                    </div>
                                </span>
                            </button>
                        </div>
                    </form>
                </div>

                <div className="flex justify-between mt-4">
                    <button
                        onClick={prevQuestion}
                        disabled={currentQuestionIndex === 0}
                        className={`relative inline-block p-px font-semibold leading-6 text-white bg-gray-800 rounded-xl transition-transform duration-300 ${
                            currentQuestionIndex === 0
                                ? 'cursor-not-allowed opacity-50'
                                : 'cursor-pointer hover:scale-105 active:scale-95'
                        }`}
                    >
                        <span
                            className={`absolute inset-0 rounded-xl bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 p-[2px] ${
                                currentQuestionIndex === 0 ? 'opacity-50' : 'opacity-0 group-hover:opacity-100'
                            }`}
                        />
                        <span className="relative z-10 block px-6 py-3 rounded-xl bg-gray-950">
                            <div className="relative z-10 flex items-center space-x-2">
                                <span className="transition-all duration-500 group-hover:translate-x-1">
                                    Previous
                                </span>
                            </div>
                        </span>
                    </button>

                    <button
                        onClick={nextQuestion}
                        disabled={currentQuestionIndex === questions.length - 1}
                        className={`relative inline-block p-px font-semibold leading-6 text-white bg-gray-800 rounded-xl transition-transform duration-300 ${
                            currentQuestionIndex === questions.length - 1
                                ? 'cursor-not-allowed opacity-50'
                                : 'cursor-pointer hover:scale-105 active:scale-95'
                        }`}
                    >
                        <span
                            className={`absolute inset-0 rounded-xl bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 p-[2px] ${
                                currentQuestionIndex === questions.length - 1 ? 'opacity-50' : 'opacity-0 group-hover:opacity-100'
                            }`}
                        />
                        <span className="relative z-10 block px-6 py-3 rounded-xl bg-gray-950">
                            <div className="relative z-10 flex items-center space-x-2">
                                <span className="transition-all duration-500 group-hover:translate-x-1">Next</span>
                            </div>
                        </span>
                    </button>
                </div>

            </div>
        </MathJaxContext>
    );
};

export default Course;
