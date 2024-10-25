import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { createClient } from '@supabase/supabase-js';
import { MathJax, MathJaxContext } from 'better-react-mathjax';

// Supabase Configuration
const SUPABASE_URL = 'https://yryikveitsajowqjuewz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlyeWlrdmVpdHNham93cWp1ZXd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY3NjU1OTEsImV4cCI6MjA0MjM0MTU5MX0.wXBjw_ynVx9fTs15A54OkBXle66TkPl5y7CNelk5KQ4';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const Input = ({ module, setResponse, setLatexPreview }) => {
    const [submissionType, setSubmissionType] = useState('latex');
    const [input, setInput] = useState('');
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(1);  // Track current question number

    useEffect(() => {
        // Fetch the questions for the given module
        const fetchQuestions = async () => {
            try {
                const res = await axios.get(`/api/get_module?module=${module}`);
                setQuestions(res.data.modules[module].questions || []);
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

    // Function to check the user's answer and insert the result into Supabase
    const handleSubmit = async (event) => {
        event.preventDefault();
        const correctAnswer = questions[currentQuestion]?.answer;

        let isCorrect = false;
        if (correctAnswer && input === correctAnswer) {
            isCorrect = true;
        }

        setResponse(isCorrect ? 'Correct!' : `Wrong, the correct answer is: ${correctAnswer}`);

        // Example: Insert user's submission and progress into the Supabase database
        try {
            const { data, error } = await supabase
                .from('submissions') // Assume you have a 'submissions' table in Supabase
                .insert([{ 
                    answer: input, 
                    correct: isCorrect, 
                    module_number: module, 
                    question_number: currentQuestion + 1 
                }]);

            if (error) {
                console.error('Error inserting into Supabase:', error);
            } else {
                console.log('Inserted into Supabase:', data);
            }

        } catch (error) {
            console.error('Error submitting input:', error);
            setResponse('Error processing your input');
        }
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
