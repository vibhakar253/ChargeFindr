
//LandingPage.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import './landingPage.css';
import Navbar from '../Navbar/Navbar';

function LandingPage() {
  return (
    <div className='landing'>
      <div className="nav">
        <Navbar />
      </div>
      <div className="content">
        <p>Your Search for Ev Charging Stations made easy.</p>
        <div className="buttons">
          <Link to="/login" className="button login-button">Login</Link>
          <Link to="/register" className="button register-button">Register</Link>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;