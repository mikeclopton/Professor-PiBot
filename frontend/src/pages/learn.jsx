import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './learn.css';
import TutorInput from '../components/tutorinput'; // Import the new combined component
import Output from '../components/output';
import Chat from '../components/Chat';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';

function Learn() {
  const location = useLocation();
  const [response, setResponse] = useState('');
  const [latexPreview, setLatexPreview] = useState(''); // Manage LaTeX preview
  const [module, setModule] = useState(1); // Default module value
  const [part, setPart] = useState(1); // Default part value
  const [userId, setUserId] = useState(null); // Store userId

  useEffect(() => {
    // Parse the query parameters from the URL
    const queryParams = new URLSearchParams(location.search);
    const selectedModule = queryParams.get('module');
    const selectedPart = queryParams.get('part');

    // Set module and part based on URL query parameters
    if (selectedModule) setModule(parseInt(selectedModule));
    if (selectedPart) setPart(parseInt(selectedPart));

    // Fetch user info from backend
    const fetchUser = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:5000/api/user'); // Adjust the backend URL if needed
        if (res.status === 200) {
          setUserId(res.data.user_id); // Set the user ID
        } else {
          console.error("Error fetching user data:", res.data.error);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUser(); // Call the function to fetch user session info
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
            part={part} // Pass part if needed for functionality
          />
        </div>
      </div>
      <div className="learn-chat">
        <h2>
          Chat With Tutor <i className="fas fa-eye"></i>
        </h2>
        <div className= "chat">
          <Chat response={response} latexPreview={latexPreview} />
        </div>
      </div>
    </div>
  );
}

export default Learn;
