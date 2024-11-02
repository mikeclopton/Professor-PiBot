import React, { useState } from 'react';
import { MathJax } from 'better-react-mathjax';

const Chat = () => {
    const [chatMessages, setChatMessages] = useState([]);
    const [userInput, setUserInput] = useState('');

    const renderResponseWithLatex = (text) => {
        const regex = /\$\$(.*?)\$\$/g;
        const parts = text.split(regex);
        return parts.map((part, index) => {
            if (index % 2 === 1) {
                return (
                    <MathJax key={index} dynamic inline>
                        {`\\(${part.trim()}\\)`}
                    </MathJax>
                );
            } else {
                return <span key={index}>{part}</span>;
            }
        });
    };

    const handleSendMessage = async () => {
        if (!userInput.trim()) return;

        setChatMessages([...chatMessages, { sender: 'user', text: userInput }]);
        
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
            setUserInput('');
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-800 rounded-lg">
            {chatMessages.map((message, index) => (
                <div key={index} className={`flex ${message.sender === 'ai' ? 'items-start' : 'items-end justify-end'} mb-2`}>
                    {message.sender === 'ai' ? (
                        <>
                            {/* AI Message Structure */}
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
                            {/* User Message Structure */}
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
    );
};

export default Chat;
