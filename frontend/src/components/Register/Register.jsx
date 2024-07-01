import React, { useState } from 'react';
import Navbar from '../Navbar/Navbar';
import './register.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    try {
      const response = await axios.post('http://localhost:7000/register', {
        username,
        email,
        password,
      });

      if (response.status === 200) {
        navigate('/login');
      } else {
        setErrorMessage(`Error registering user: ${response.data.message}`);
      }
    } catch (error) {
      setErrorMessage(`Error registering user: ${error.response ? error.response.data.message : error.message}`);
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

  return (
    <div className='register'>
      <div className="regcontainer">
        <div className="nav">
          <Navbar />
        </div>
        <div className="Box">
          <div className="regHeader">
            <label className='registerLbl'>Register Your Account</label>
          </div>
          <form className='Signup' onSubmit={handleRegister}>

            <div className="User">
              <input
                type="text"
                id='name'
                className='username'
                placeholder='Username'
                value={username}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
              <input
                type="email"
                id='email'
                className='textbox'
                placeholder='Email'
                value={email}
                required
                onChange={handleEmailChange}
              />
              {emailError && <p className="error">{emailError}</p>}
              <input
                type="password"
                id='password'
                className='textbox'
                placeholder='Enter Password'
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
              {errorMessage && <p className="error">{errorMessage}</p>}
            </div>
            
            <div className="Signin">
              <p>Already have an account?<a href="/login"><b>Signin</b></a></p>
              <button id='register' className='button' type="submit">Register</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
