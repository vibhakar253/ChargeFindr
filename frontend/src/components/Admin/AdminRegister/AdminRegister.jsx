import React, { useState } from 'react';
import Navbar from '../../Navbar/Navbar';
import './adminregister.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminRegister = () => {
  const navigate = useNavigate();
  const [adminID, setadminID] = useState('');
  const [adminemail, setadminemail] = useState('');
  const [adminpassword, setadminpassword] = useState('');
  const [adminerrorMessage, setadminErrorMessage] = useState('');
  const [adminemailError, setadminemailError] = useState('');

  const handleAdminRegister = async (e) => {
    e.preventDefault();

    if (!validateadminemail(adminemail)) {
      setadminemailError('Please enter a valid adminemail address');
      return;
    }

    try {
      const response = await axios.post('http://localhost:7000/adminregister', {
        adminID,
        adminemail,
        adminpassword,
      });

      if (response.status === 200) {
        navigate('/admin');
      } else {
        setadminErrorMessage(`Error registering user: ${response.data.message}`);
      }
    } catch (error) {
      setadminErrorMessage(`Error registering user: ${error.response ? error.response.data.message : error.message}`);
    }
  };

  const validateadminemail = (adminemail) => {
    const adminemailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return adminemailRegex.test(adminemail);
  };

  const handleadminemailChange = (e) => {
    setadminemail(e.target.value);
    if (!validateadminemail(e.target.value)) {
      setadminemailError('Please enter a valid adminemail address');
    } else {
      setadminemailError('');
    }
  };

  return (
    <div className='adminregister'>
      <div className="regcontainer">
        <div className="nav">
          <Navbar />
        </div>
        <div className="Box">
          <div className="regHeader">
            <label className='registerLbl'>Register</label>
          </div>
          <form className='Signup' onSubmit={handleAdminRegister}>

            <div className="User">
              <input
                type="text"
                id='name'
                className='adminID'
                placeholder='AdminID'
                value={adminID}
                onChange={(e) => setadminID(e.target.value)}
                required
              />
              <input
                type="adminemail"
                id='adminemail'
                className='textbox'
                placeholder='Admin Email'
                value={adminemail}
                required
                onChange={handleadminemailChange}
              />
              {adminemailError && <p className="error">{adminemailError}</p>}
              <input
                type="adminpassword"
                id='adminpassword'
                className='textbox'
                placeholder='Enter password'
                value={adminpassword}
                required
                onChange={(e) => setadminpassword(e.target.value)}
              />
              {adminerrorMessage && <p className="error">{adminerrorMessage}</p>}
            </div>
            
            <div className="Signin">
              <button id='register' className='button' type="submit">Register</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;
