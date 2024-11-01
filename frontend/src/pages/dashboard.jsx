// Dashboard.jsx
import React, { useEffect, useState } from 'react';
import './dashboard.css';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Ensure Font Awesome is imported
import EditInfoForm from '../components/EditInfoForm'; // Import the EditInfoForm component

function Dashboard() {
    const [userInfo, setUserInfo] = useState(null);
    const [progress, setProgress] = useState(null); // Initially null to differentiate from empty progress data
    const [isEditing, setIsEditing] = useState(false); // State to manage edit form visibility
    const [isLoading, setIsLoading] = useState(true); // Loading state to manage API fetch

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setIsLoading(true); // Start loading
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
                setProgress(data.progress || []); // Set an empty array if no progress data
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setIsLoading(false); // Stop loading
            }
        };

        fetchUserData();
    }, []);

    const handleUpdate = (updatedInfo) => {
        setUserInfo((prevUserInfo) => ({
            ...prevUserInfo,
            ...updatedInfo,
        }));
        setIsEditing(false); // Close the edit form after saving changes
    };

    if (isLoading) {
        return <div className="dashboard"><p>Loading user data...</p></div>;
    }

    return (
        <div className="dashboard">
            <div className="dashboard-user-info">
                <h3><i className="fas fa-user"></i> Your Information</h3>
                {userInfo ? (
                    <div className="info-placeholder">
                        {!isEditing ? (
                            <>
                                <p><i className="fas fa-user-circle"></i> Name: {userInfo.username}</p>
                                <p><i className="fas fa-envelope"></i> Email: {userInfo.email}</p>
                                <button onClick={() => setIsEditing(true)}>
                                    <i className="fas fa-edit"></i> Edit Info
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
            <div className="dashboard-progress">
                <h3><i className="fas fa-chart-line"></i> Your Progress</h3>
                {progress && progress.length > 0 ? (
                    <div className="progress-placeholder">
                        {progress.map((moduleProgress, index) => (
                            <p key={index}>
                                <i className="fas fa-book-open"></i> {moduleProgress.module_name}: {moduleProgress.completion_percentage}% Complete
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
