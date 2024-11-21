import React, { useEffect, useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import EditInfoForm from '../components/EditInfoForm';

function Dashboard() {
    const [userInfo, setUserInfo] = useState(null);
    const [progress, setProgress] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [profilePicture, setProfilePicture] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // Fetch user data from the server
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
                console.log("User Data:", data); // Debugging user data
                setUserInfo(data.user); // Populate userInfo state
                setProgress(data.progress || []);
                setProfilePicture(data.user.profilePicture || null);
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, []);

    // Handle profile picture upload
    const handleProfilePictureUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagePreview(URL.createObjectURL(file)); // Show preview image

            const formData = new FormData();
            formData.append('profilePicture', file);

            fetch('http://127.0.0.1:5000/api/user/upload-pfp', {
                method: 'POST',
                body: formData,
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Failed to upload profile picture');
                    }
                    return response.json();
                })
                .then((data) => {
                    console.log("Profile picture updated:", data);
                    setProfilePicture(data.profilePictureUrl);
                })
                .catch((error) => console.error('Error uploading profile picture:', error));
        }
    };

    if (isLoading) {
        return <div className="w-full p-8 text-center text-white">Loading user data...</div>;
    }

    return (
        <div className="relative max-w-4xl mx-auto my-8 p-6 bg-gray-900 rounded-lg shadow-lg space-y-6">
            {/* Profile Section */}
            <div className="relative bg-gray-800 p-6 rounded-lg shadow-lg space-y-6">
                <h3 className="text-2xl font-semibold text-white flex items-center">
                    <i className="fas fa-user mr-2"></i> Your Information
                </h3>
                <div className="flex items-center space-x-6">
                    <img
                        src={imagePreview || profilePicture || 'default-avatar.png'}
                        alt="Profile"
                        className="w-32 h-32 rounded-full border border-gray-600"
                    />
                    <div>
                        <label className="text-gray-300 text-sm block">Change Profile Picture</label>
                        <input
                            type="file"
                            accept="image/*"
                            className="text-gray-300 text-sm"
                            onChange={handleProfilePictureUpload}
                        />
                    </div>
                </div>
                {userInfo ? (
                    <div className="space-y-4">
                        {!isEditing ? (
                            <>
                                <p className="text-gray-300">
                                    <i className="fas fa-user-circle mr-2"></i>
                                    <span className="font-medium">Name:</span> {userInfo.username || 'N/A'}
                                </p>
                                <p className="text-gray-300">
                                    <i className="fas fa-envelope mr-2"></i>
                                    <span className="font-medium">Email:</span> {userInfo.email || 'N/A'}
                                </p>
                                <p className="text-gray-300">
                                    <i className="fas fa-map-marker-alt mr-2"></i>
                                    <span className="font-medium">Address:</span> {userInfo.address || 'Not provided'}
                                </p>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                >
                                    Edit Info
                                </button>
                            </>
                        ) : (
                            <EditInfoForm
                                user={userInfo}
                                onUpdate={(updatedInfo) => {
                                    setUserInfo({ ...userInfo, ...updatedInfo });
                                    setIsEditing(false);
                                }}
                            />
                        )}
                    </div>
                ) : (
                    <p className="text-red-400">
 Error loading user information. Unfortunately, we were unable to retrieve the necessary data for your profile at this time. Please check your network connection and try refreshing the page. If the issue persists, contact our support team for further assistance.                    </p>
                )}
            </div>

            {/* Progress Section */}
            <div className="relative bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold text-white">
                    <i className="fas fa-chart-line mr-2"></i> Progress
                </h3>
                {progress && progress.length > 0 ? (
                    <ul className="space-y-2">
                        {progress.map((module, idx) => (
                            <li key={idx} className="text-gray-300">
                                {module.module_name}: {module.completion_percentage}%
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-400">No progress data is available at this time. Start completing modules to track your progress here. Your progress will automatically be saved and displayed as you work through each module, providing a clear overview of your achievements and learning journey.</p>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
