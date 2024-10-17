import React, { useState } from 'react';
import './learn.css';
import Input from '../components/input';
import Output from '../components/output';
import Tutor from '../components/tutor';
import '@fortawesome/fontawesome-free/css/all.min.css';

function Learn() {
  const [response, setResponse] = useState('');
  const [latexPreview, setLatexPreview] = useState(''); // Manage LaTeX preview
  const [module, setModule] = useState(1); // Default module value
  const [part, setPart] = useState(1); // Default part value

  return (
    <>
      <div className="learn">
        <div className="learn-input">
          <h2>
            Input <i className="fas fa-pencil-alt"></i>
          </h2>
          <Input setResponse={setResponse} setLatexPreview={setLatexPreview} />
        </div>
        <div className="learn-output">
          <h2>
            Output <i className="fas fa-eye"></i>
          </h2>
          <Output response={response} latexPreview={latexPreview} />
        </div>
        <div className="learn-tutor">
          <h2>
            Tutor <i className="fas fa-chalkboard-teacher"></i>
          </h2>
          {/* Pass module and part to Tutor component */}
          <Tutor module={module} part={part} />
        </div>
      </div>
    </>
  );
}

export default Learn;

