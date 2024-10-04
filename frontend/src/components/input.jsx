import React, { useState } from 'react';
import axios from 'axios';

const Input = ({ setResponse }) => {
    const [submissionType, setSubmissionType] = useState('latex');
    const [input, setInput] = useState('');
    const [fileName, setFileName] = useState(''); // State to hold the file name

    const handleTypeChange = (event) => {
        setSubmissionType(event.target.value);
        setInput(''); // Reset input when changing type
        setFileName(''); // Reset file name when changing type
    };

    const handleInputChange = (event) => {
        if (submissionType === 'photo') {
            setInput(event.target.files[0]);
            setFileName(event.target.files[0].name); // Set file name
        } else {
            setInput(event.target.value);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/process', {
                input: input,
                submissionType: submissionType
            });
            setResponse(res.data.response);
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

                {submissionType === 'photo' && (
                    <div>
                        <label htmlFor="file-upload" className="custom-file-upload">
                            <i className="fas fa-upload"></i> Upload Image
                        </label>
                        <input
                            id="file-upload"
                            type="file"
                            className="file-input"
                            onChange={handleInputChange}
                        />
                        {fileName && <div className="file-name">{fileName}</div>} {/* Display the filename */}
                    </div>
                )}

                {(submissionType === 'pen' || submissionType === 'latex') && (
                    <textarea 
                        placeholder={`Enter your ${submissionType === 'latex' ? 'LaTeX code' : 'answer'} here...`}
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
