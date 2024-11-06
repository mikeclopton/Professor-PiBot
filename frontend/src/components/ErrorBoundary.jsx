import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Chat error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-container p-4 text-white">
                    <h3>Something went wrong.</h3>
                    <button 
                        onClick={() => window.location.reload()}
                        className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                    >
                        Reload Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;