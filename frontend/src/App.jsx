import './App.css';
import React from 'react';
import { useRoutes, Link } from 'react-router-dom';
import Learn from './pages/learn.jsx';
import Dashboard from './pages/dashboard.jsx';
import Login from './pages/login.jsx';
import Register from './pages/register.jsx';
import logo from './assets/logo.jpg';
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
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
      element: <Login />
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
          </div>
        </header>
        {element}
      </div>
    </>
  );
}

export default App;

