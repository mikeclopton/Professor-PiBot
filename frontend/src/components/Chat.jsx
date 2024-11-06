import React, { useState } from 'react';
import { MathJax, MathJaxContext } from 'better-react-mathjax';

const Chat = ({ response }) => {
    const [chatMessages, setChatMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [loading, setLoading] = useState(false); // Loading state

    const renderResponseWithLatex = (text) => {
        const steps = text.split('###').filter(step => step.trim());
        
        if (steps.length === 0) {
            return (
                <MathJax dynamic>
                    <div>{text}</div>
                </MathJax>
            );
        }

        return steps.map((step, index) => (
            <div key={index} style={{ marginBottom: '10px', padding: '5px' }}>
                <div style={{ fontWeight: 'bold', color: 'black' }}>
                    {index === 0 ? 'Explanation:' : `Step ${index}:`}
                </div>
                <div style={{ marginLeft: '20px', color: 'black' }}>
                    <MathJax>{step}</MathJax>
                </div>
            </div>
        ));
    };
    

    const handleSendMessage = async () => {
        if (!userInput.trim()) return;

        setChatMessages([...chatMessages, { sender: 'user', text: userInput }]);
        setLoading(true); // Set loading to true when request is sent

        try {
            const response = await fetch('http://127.0.0.1:5000/api/process', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    input: userInput,
                    submissionType: 'chat'
                }),
            });

            const data = await response.json();
            setChatMessages(prevMessages => [...prevMessages, { sender: 'ai', text: data.response }]);
        } catch (err) {
            console.error('Failed to fetch AI response:', err);
            setChatMessages(prevMessages => [...prevMessages, { sender: 'ai', text: 'Unable to get response from AI.' }]);
        } finally {
            setLoading(false); // Set loading to false after receiving response
            setUserInput('');
        }
    };

    return (
        <MathJaxContext>
            <div className="flex flex-col h-full">
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 bg-gray-800 rounded-lg">
                    {chatMessages.map((message, index) => (
                        <div key={index} className={`flex ${message.sender === 'ai' ? 'items-start' : 'items-end justify-end'} mb-2`}>
                            {message.sender === 'ai' ? (
                                <>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 100 100"
                                        width="50"
                                        height="50"
                                        fill="#009688"
                                        className="w-8 h-8 rounded-full"
                                    >
                                        {/* SVG Content */}
                                    </svg>
                                    <div className="ml-3 bg-gray-100 p-3 rounded-lg">
                                        <p className="text-sm text-gray-800">{renderResponseWithLatex(message.text)}</p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="bg-blue-500 p-3 rounded-lg">
                                        <p className="text-sm text-white">{message.text}</p>
                                    </div>
                                    <img
                                        src="https://s3.amazonaws.com/37assets/svn/765-default-avatar.png"
                                        alt="User Avatar"
                                        className="w-8 h-8 rounded-full ml-3"
                                    />
                                </>
                            )}
                        </div>
                    ))}

                    {/* Loading indicator */}
                    {loading && (
                        <div className="flex items-center mb-2">
                            <svg
                                className="animate-spin h-5 w-5 text-blue-500 mr-3"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                        </div>
                    )}
                </div>

                {/* Chat Input */}
                <div className="mt-4 flex items-center">
                    <input
                        type="text"
                        placeholder="Type your message..."
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        className="flex-1 py-2 px-3 rounded-full bg-gray-100 focus:outline-none text-black"
                    />
                    <button onClick={handleSendMessage} className="bg-blue-500 text-white px-4 py-2 rounded-full ml-3 hover:bg-blue-600">Send</button>
                </div>
            </div>
        </MathJaxContext>
    );
};

export default Chat;
