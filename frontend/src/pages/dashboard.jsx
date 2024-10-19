// Dashboard.jsx
import React, { useEffect, useState } from 'react';
import './dashboard.css';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Ensure Font Awesome is imported
import EditInfoForm from '../components/EditInfoForm'; // Import the EditInfoForm component

function Dashboard() {
    const [userInfo, setUserInfo] = useState(null);
    const [progress, setProgress] = useState([]);
    const [isEditing, setIsEditing] = useState(false); // State to manage edit form visibility

    useEffect(() => {
        const fetchUserData = async () => {
            try {
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
                setProgress(data.progress); // Assuming progress data is returned in the response
            } catch (error) {
                console.error('Error fetching user data:', error);
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
                    <p>Loading user information...</p>
                )}
            </div>
            <div className="dashboard-progress">
                <h3><i className="fas fa-chart-line"></i> Your Progress</h3>
                {progress.length > 0 ? (
                    <div className="progress-placeholder">
                        {progress.map((topic, index) => (
                            <p key={index}>
                                <i className="fas fa-book-open"></i> {topic.name}: {topic.completion}% Complete
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
