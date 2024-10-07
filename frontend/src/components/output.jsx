import React from 'react';
import { MathJax, MathJaxContext } from 'better-react-mathjax';

const Output = ({ latexPreview, response }) => {
    const renderResponseWithLatex = (text) => {
        const regex = /\$\$(.*?)\$\$/g; // Regex to match LaTeX enclosed in $$
        const parts = text.split(regex); // Split by LaTeX portions

        return parts.map((part, index) => {
            if (index % 2 === 1) { // Odd indices contain LaTeX code
                return (
                    <MathJax key={index} dynamic inline>
                        {`\\(${part.trim()}\\)`}
                    </MathJax>
                );
            } else {
                // Regular text
                return <span key={index}>{part}</span>;
            }
        });
    };

    return (
        <div>
            <h2>Results Here</h2>

            {latexPreview && (
                <div className="latex-preview">
                    <h3>LaTeX Preview:</h3>
                    <MathJaxContext>
                        <MathJax dynamic inline>
                            {`\\(${latexPreview}\\)`}
                        </MathJax>
                    </MathJaxContext>
                </div>
            )}

            <div className="llm-response">
                {response ? renderResponseWithLatex(response) : <p>Output will be shown here...</p>}
            </div>
        </div>
    );
};

export default Output;
