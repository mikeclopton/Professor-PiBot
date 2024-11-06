import React, { useState } from 'react';
import { MathJax, MathJaxContext } from 'better-react-mathjax';

const Chat = () => {
    const [chatMessages, setChatMessages] = useState([]);
    const [userInput, setUserInput] = useState('');

    const mathJaxConfig = {
        tex: {
            inlineMath: [['$', '$']],
            displayMath: [['$$', '$$']],
            processEscapes: true
        },
        svg: {
            fontCache: 'global'
        },
        startup: {
            typeset: true
        }
    };

    const formatResponse = (text) => {
        const steps = text.split('###').filter(step => step.trim());
        
        if (steps.length === 0) {
            return (
                <MathJax>
                    <div>{text}</div>
                </MathJax>
            );
        }
        
        return steps.map((step, index) => (
            <div key={index} style={{ marginBottom: '10px', padding: '5px' }}>
                <div style={{ fontWeight: 'bold', color: 'white' }}>
                    {index === 0 ? 'Explanation:' : `Step ${index}:`}
                </div>
                <div style={{ marginLeft: '20px', color: 'white' }}>
                    <MathJax>{step}</MathJax>
                </div>
            </div>
        ));
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
            setChatMessages(prevMessages => [...prevMessages, { 
                sender: 'ai', 
                text: data.response 
            }]);
        } catch (err) {
            console.error('Failed to fetch AI response:', err);
            setChatMessages(prevMessages => [...prevMessages, { 
                sender: 'ai', 
                text: 'Unable to get response from AI.' 
            }]);
        }
        setUserInput('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <MathJaxContext config={mathJaxConfig}>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ 
                    flexGrow: 1, 
                    overflowY: 'auto', 
                    padding: '10px',
                    marginBottom: '10px'
                }}>
                    {chatMessages.map((message, index) => (
                        <div key={index} style={{ 
                            margin: '10px',
                            padding: '10px',
                            backgroundColor: message.sender === 'user' ? '#1e3a8a' : '#1e293b',
                            borderRadius: '5px',
                            color: 'white'
                        }}>
                            <strong>{message.sender === 'user' ? 'You:' : 'AI:'}</strong>
                            <div style={{ marginTop: '5px' }}>
                                {message.sender === 'user' ? 
                                    message.text : 
                                    formatResponse(message.text)
                                }
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{ 
                    display: 'flex', 
                    padding: '10px',
                    backgroundColor: '#1e293b',
                    borderTop: '1px solid #2d3748'
                }}>
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        style={{ 
                            flexGrow: 1,
                            marginRight: '10px',
                            padding: '8px',
                            borderRadius: '4px',
                            border: '1px solid #4a5568',
                            backgroundColor: '#2d3748',
                            color: 'white'
                        }}
                        placeholder="Type your message..."
                    />
                    <button 
                        onClick={handleSendMessage}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#3182ce',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Send
                    </button>
                </div>
            </div>
        </MathJaxContext>
    );
};

export default Chat;