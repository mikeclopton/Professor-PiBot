import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

function Questions({ module, part }) {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch questions from the backend when the component loads
        const fetchQuestions = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:5000/api/get_questions?module=${module}&part=${part}`);
                const data = await response.json();

                if (response.ok) {
                    setQuestions(data);
                } else {
                    setError(data.error || 'Error fetching questions');
                }
            } catch (err) {
                setError('Failed to fetch questions. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [module, part]);

    if (loading) return <p>Loading questions...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>Module {module} - Part {part}</h2>
            <ul>
                {questions.map((question, index) => (
                    <li key={index}>
                        {question}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Questions;
