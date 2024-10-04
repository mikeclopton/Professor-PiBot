import React from 'react';
import './dashboard.css';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Ensure Font Awesome is imported

function Dashboard() {
  return (
    <>
      <div className="dashboard">
        <div className="dashboard-user-info">
          {/* Placeholder for user info */}
          <h3><i className="fas fa-user"></i> Your Information</h3> {/* User icon */}
          <div className="info-placeholder">
            <p><i className="fas fa-user-circle"></i> Name: John Doe</p> {/* Name icon */}
            <p><i className="fas fa-envelope"></i> Email: johndoe@example.com</p> {/* Email icon */}
            <button><i className="fas fa-edit"></i> Edit Info</button> {/* Edit icon */}
          </div>
        </div>
        <div className="dashboard-progress">
          {/* Placeholder for progress tracking */}
          <h3><i className="fas fa-chart-line"></i> Your Progress</h3> {/* Progress chart icon */}
          <div className="progress-placeholder">
            <p><i className="fas fa-book-open"></i> Topic 1: Sets and Logic - 50% Complete</p> {/* Topic icon */}
            <p><i className="fas fa-book-open"></i> Topic 2: Relations and Functions - 30% Complete</p>
            <p><i className="fas fa-book-open"></i> Topic 3: Graph Theory - 0% Complete</p>
            {/* More topics can be added here */}
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;

