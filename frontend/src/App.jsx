import './App.css';
import React from 'react';
import { useRoutes, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Learn from './pages/learn.jsx';
import Dashboard from './pages/dashboard.jsx';
import Login from './pages/login.jsx';
import Register from './pages/register.jsx';
import logo from './assets/logo.jpg';

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
            <Link to="/"><button className="HeaderButton">Learn</button></Link>
            <Link to="/dashboard"><button className="HeaderButton">Dashboard</button></Link>
            <Link to="/login"><button className="HeaderButton">Log in</button></Link>
            <Link to="/register"><button className="HeaderButton">Register</button></Link>
          </div>
        </header>
        {element}
      </div>
    </>
  );
}

export default App;
