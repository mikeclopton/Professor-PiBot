import React, { useEffect, useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import EditInfoForm from '../components/EditInfoForm';

function Dashboard() {
    const [userInfo, setUserInfo] = useState(null);
    const [progress, setProgress] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('http://127.0.0.1:5000/api/user', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }

                const data = await response.json();
                setUserInfo(data.user);
                setProgress(data.progress || []);
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleUpdate = (updatedInfo) => {
        setUserInfo((prevUserInfo) => ({
            ...prevUserInfo,
            ...updatedInfo,
        }));
        setIsEditing(false);
    };

    if (isLoading) {
        return <div className="w-full p-8 text-center text-white">Loading user data...</div>;
    }

    return (
        <div className="relative max-w-4xl mx-auto my-8 p-6 bg-gray-900 rounded-lg shadow-lg space-y-6">
            {/* Artistic Background Elements */}
            <div className="absolute inset-0 -z-10 pointer-events-none">
                <svg className="absolute top-10 left-10 w-72 h-72 opacity-40" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                    <path d="M0,100 Q50,0 100,100 T200,100" fill="none" stroke="red" strokeWidth="2" />
                </svg>
                <svg className="absolute bottom-10 right-10 w-72 h-72 opacity-40" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                    <path d="M0,100 Q50,0 100,100 T200,100" fill="none" stroke="red" strokeWidth="2" />
                </svg>
            </div>

            {/* User Information Section */}
            <div className="relative bg-gray-800 p-6 rounded-lg shadow-[0px_4px_15px_rgba(0,0,0,0.8)]">
                <h3 className="text-2xl font-semibold text-white mb-4 flex items-center">
                    <i className="fas fa-user mr-2"></i>
                    Your Information
                </h3>
                {userInfo ? (
                    <div>
                        {!isEditing ? (
                            <>
                                <p className="text-gray-300 mb-2">
                                    <i className="fas fa-user-circle mr-2"></i> 
                                    <span className="font-medium">Name:</span> {userInfo.username}
                                </p>
                                <p className="text-gray-300 mb-4">
                                    <i className="fas fa-envelope mr-2"></i> 
                                    <span className="font-medium">Email:</span> {userInfo.email}
                                </p>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow"
                                >
                                    <i className="fas fa-edit mr-2"></i>Edit Info
                                </button>
                            </>
                        ) : (
                            <EditInfoForm user={userInfo} onUpdate={handleUpdate} onCancel={() => setIsEditing(false)} />
                        )}
                    </div>
                ) : (
                    <p className="text-red-400">
                        Error loading user information. Unfortunately, we were unable to retrieve the necessary data for your profile at this time. Please check your network connection and try refreshing the page. If the issue persists, contact our support team for further assistance.
                    </p>
                )}
            </div>

            {/* Progress Section */}
            <div className="relative bg-gray-800 p-6 rounded-lg shadow-[0px_4px_15px_rgba(0,0,0,0.8)]">
                <h3 className="text-2xl font-semibold text-white mb-4 flex items-center">
                    <i className="fas fa-chart-line mr-2"></i>
                    Your Progress
                </h3>
                {progress && progress.length > 0 ? (
                    <div className="space-y-2">
                        {progress.map((moduleProgress, index) => (
                            <p key={index} className="text-gray-300">
                                <i className="fas fa-book-open mr-2"></i> 
                                {moduleProgress.module_name}: {moduleProgress.completion_percentage}% Complete
                            </p>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-400">
                        No progress data is available at this time. Start completing modules to track your progress here. Your progress will automatically be saved and displayed as you work through each module, providing a clear overview of your achievements and learning journey.
                    </p>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
