import React from 'react';
import './dashboard.css';

function Dashboard() {
  return (
    <>
      <div className="dashboard">
        <div className="dashboard-user-info">
          {/* Placeholder for user info */}
          <h3>Your Information</h3>
          <div className="info-placeholder">
            <p>Name: John Doe</p>
            <p>Email: johndoe@example.com</p>
            <button>Edit Info</button>
          </div>
        </div>
        <div className="dashboard-progress">
          {/* Placeholder for progress tracking */}
          <h3>Your Progress</h3>
          <div className="progress-placeholder">
            <p>Topic 1: Sets and Logic - 50% Complete</p>
            <p>Topic 2: Relations and Functions - 30% Complete</p>
            <p>Topic 3: Graph Theory - 0% Complete</p>
            {/* More topics can be added here */}
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
