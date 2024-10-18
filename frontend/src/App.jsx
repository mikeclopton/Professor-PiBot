import './App.css';
import React, { useEffect, useState } from 'react';
import { useRoutes, Link, useNavigate } from 'react-router-dom';
import Learn from './pages/learn.jsx';
import Dashboard from './pages/dashboard.jsx';
import Login from './pages/login.jsx';
import Register from './pages/register.jsx';
import logo from './assets/logo.jpg';
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check if the user is logged in
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/user', {
          method: 'GET',
          credentials: 'include', // Include credentials to send the session cookie
        });

        if (response.ok) {
          setIsLoggedIn(true); // User is logged in
        } else {
          setIsLoggedIn(false); // User is not logged in
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);

  // Function to handle logout
  const handleLogout = async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include', // Include credentials to send the session cookie
      });
      setIsLoggedIn(false); // Update login state
      navigate('/'); // Navigate to home page or any other page
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Generate the routing element tree
  const element = useRoutes([
    { 
      path: '/',
      element: <Learn />
    },
    {
      path: '/dashboard',
      element: <Dashboard />
    },
    {
      path: '/login',
      element: <Login onLogin={() => setIsLoggedIn(true)} /> // Update login state when user logs in
    },
    {
      path: '/register',
      element: <Register />
    }
  ]);

  return (
    <>
      <div className="App">
        <header className="App-header">
          <img src={logo} alt="DiscreteTutor Logo" className="logo" />
          <div className="nav">
            <Link to="/">
              <button className="HeaderButton">
                <i className="fas fa-book-open"></i> Learn
              </button>
            </Link>
            <Link to="/dashboard">
              <button className="HeaderButton">
                <i className="fas fa-tachometer-alt"></i> Dashboard
              </button>
            </Link>
            {!isLoggedIn ? (
              <>
                <Link to="/login">
                  <button className="HeaderButton">
                    <i className="fas fa-sign-in-alt"></i> Log in
                  </button>
                </Link>
                <Link to="/register">
                  <button className="HeaderButton">
                    <i className="fas fa-user-plus"></i> Register
                  </button>
                </Link>
              </>
            ) : (
              <button className="HeaderButton" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i> Log out
              </button>
            )}
          </div>
        </header>
        {element}
      </div>
    </>
  );
}

export default App;
