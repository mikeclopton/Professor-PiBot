import React, { useState } from 'react';
import axios from 'axios';
import { MathJax, MathJaxContext } from 'better-react-mathjax';

const Input = ({ setResponse, setLatexPreview }) => {
    const [submissionType, setSubmissionType] = useState('latex');
    const [input, setInput] = useState('');

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

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/process', {
                input: input,
                submissionType: submissionType,
            });
            setResponse(res.data.response); // Full LLM response
        } catch (error) {
            console.error('Error submitting input:', error);
            setResponse('Error processing your input');
        }
    };

    return (
        <div>
            <h2>Input your answer here</h2>
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
                    <>
                        <textarea 
                            placeholder="Enter your LaTeX code here..."
                            value={input}
                            onChange={handleInputChange}
                        ></textarea>
                    </>
                )}

                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default Input;
