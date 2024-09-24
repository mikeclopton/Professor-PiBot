import React, { useState } from 'react';
import axios from 'axios';

const Input = ({ setResponse }) => {
  const [submissionType, setSubmissionType] = useState('latex');
  const [input, setInput] = useState('');

  const handleTypeChange = (event) => {
    setSubmissionType(event.target.value);
  };

  const handleInputChange = (event) => {
    if (submissionType === 'photo') {
      setInput(event.target.files[0]);
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
          <input type="file" onChange={handleInputChange} />
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
