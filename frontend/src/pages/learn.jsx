import React, { useState } from 'react';
import './learn.css';
import Input from '../components/input';
import Output from '../components/output';
import Tutor from '../components/tutor';
import '@fortawesome/fontawesome-free/css/all.min.css';

function Learn() {
  const [response, setResponse] = useState('');

  return (
    <>
      <div className="learn">
        <div className="learn-input">
          <h2>
            Input <i className="fas fa-pencil-alt"></i>
          </h2>
          <Input setResponse={setResponse} />
        </div>
        <div className="learn-output">
          <h2>
            Output <i className="fas fa-eye"></i>
          </h2>
          <Output response={response} />
        </div>
        <div className="learn-tutor">
          <h2>
            Tutor <i className="fas fa-chalkboard-teacher"></i>
          </h2>
          <Tutor />
        </div>
      </div>
    </>
  );
}

export default Learn;

