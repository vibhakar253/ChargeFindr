// src/components/Login/Login.jsx

import React, { useState, useContext } from 'react';
import Navbar from '../Navbar/Navbar';
import './login.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../../contexts/usercontext.jsx';

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleSignin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    if (!password) {
      setPasswordError('Password cannot be empty');
      return;
    }

    try {
      const response = await axios.post('http://localhost:7000/login', {
        email,
        password,
      });

      if (response.status === 200) {
        const { user } = response.data;
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        navigate('/find');
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      setError('Error logging in');
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (!validateEmail(e.target.value)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (!e.target.value) {
      setPasswordError('Password cannot be empty');
    } else {
      setPasswordError('');
    }
  };

  return (
    <div className='login'>
      <div className="lgcontainer">
        <div className="nav">
          <Navbar />
        </div>
        <div className="lgbox">
          <div className="lgheader">
            <label className='login-lbl'>Login with your credentials</label>
          </div>
          <form className='signin' onSubmit={handleSignin}>
            <div className="user">
              <input
                type="email"
                id='email'
                className='textbox'
                placeholder='Email'
                value={email}
                onChange={handleEmailChange}
                required
              />
              {emailError && <p className="error">{emailError}</p>}
              <input
                type="password"
                id='password'
                className='textbox'
                placeholder='Password'
                value={password}
                onChange={handlePasswordChange}
                required
              />
              {passwordError && <p className="error">{passwordError}</p>}
            </div>
            <div className="signup">
              <p>Don't have an account? <a href="/register"><b>Signup</b></a></p>
              <button id='signin' className='button' type='submit'>Login</button>
            </div>
            {error && <div className="error">{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
