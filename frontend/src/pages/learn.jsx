import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MathJaxContext } from 'better-react-mathjax';
import './learn.css';
import TutorInput from '../components/tutorinput';
import Output from '../components/output';
import Chat from '../components/Chat';
import ErrorBoundary from '../components/ErrorBoundary';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';

function Learn() {
  const location = useLocation();
  const [response, setResponse] = useState('');
  const [latexPreview, setLatexPreview] = useState('');
  const [module, setModule] = useState(1);
  const [part, setPart] = useState(1);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const selectedModule = queryParams.get('module');
    const selectedPart = queryParams.get('part');

    if (selectedModule) setModule(parseInt(selectedModule));
    if (selectedPart) setPart(parseInt(selectedPart));

    const fetchUser = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:5000/api/user');
        if (res.status === 200) {
          setUserId(res.data.user_id);
        } else {
          console.error("Error fetching user data:", res.data.error);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUser();
  }, [location]);

  return (
    <div className="learn">
      <div className="learn-input">
        <h2>
          Tutor & Input <i className="fas fa-pencil-alt"></i>
        </h2>
        <div className="course">
          <TutorInput 
            setResponse={setResponse} 
            setLatexPreview={setLatexPreview} 
            module={module} 
            userId={userId} 
            part={part}
          />
        </div>
      </div>
      <div className="learn-chat">
        <h2>
          Chat With Tutor <i className="fas fa-eye"></i>
        </h2>
        <ErrorBoundary>
          <MathJaxContext>
            <div className="chat">
              <Chat response={response} latexPreview={latexPreview} />
            </div>
          </MathJaxContext>
        </ErrorBoundary>
      </div>
    </div>
  );
}

export default Learn;