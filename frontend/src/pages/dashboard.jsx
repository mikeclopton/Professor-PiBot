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
        <div className="w-full mx-auto my-16 p-6 bg-gray-800 text-white rounded-lg">
            <div className="bg-gray-900 p-6 rounded-md mb-6">
                <h3 className="text-xl font-semibold mb-4"><i className="fas fa-user mr-2"></i>Your Information</h3>
                {userInfo ? (
                    <div>
                        {!isEditing ? (
                            <>
                                <p className="mb-2"><i className="fas fa-user-circle mr-2"></i>Name: {userInfo.username}</p>
                                <p className="mb-4"><i className="fas fa-envelope mr-2"></i>Email: {userInfo.email}</p>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                >
                                    <i className="fas fa-edit mr-2"></i>Edit Info
                                </button>
                            </>
                        ) : (
                            <EditInfoForm user={userInfo} onUpdate={handleUpdate} onCancel={() => setIsEditing(false)} />
                        )}
                    </div>
                ) : (
                    <p>Error loading user information. Please try again.</p>
                )}
            </div>

            <div className="bg-gray-900 p-6 rounded-md">
                <h3 className="text-xl font-semibold mb-4"><i className="fas fa-chart-line mr-2"></i>Your Progress</h3>
                {progress && progress.length > 0 ? (
                    <div>
                        {progress.map((moduleProgress, index) => (
                            <p key={index} className="mb-2">
                                <i className="fas fa-book-open mr-2"></i> {moduleProgress.module_name}: {moduleProgress.completion_percentage}% Complete
                            </p>
                        ))}
                    </div>
                ) : (
                    <p>No progress data available.</p>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
