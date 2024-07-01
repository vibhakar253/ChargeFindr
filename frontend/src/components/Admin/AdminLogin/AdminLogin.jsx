import React, { useState } from 'react'
import Navbar from '../../Navbar/Navbar'
import './adminlogin.css';
import Addstation from '../addstation/Addstation.jsx';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const AdminLogin=()=> {
    const navigate=useNavigate();
    const [adminemail,setadminemail]=useState('');
    const [adminpassword, setadminpassword]=useState('');
    const [adminerror,setadminerror]=useState('');
    const [adminemailerror,setadminemailerror]=useState('');
    const [adminpassworderror, setadminpassworderror]=useState('');

    const handleadminlogin =async (e)=>{
        e.preventDefault();

        if(!adminvalidateemail(adminemail)){
            setadminemailerror('Please enter a valid email address');
            return;
        }

        if(!adminpassword){
            setadminpassword('Password cannot be empty');
            return;

        }

        try{
            const response =await axios.post('http://localhost:7000/admin',{
                adminemail,adminpassword,
            });

            if(response.status===200){
                localStorage.setItem('isLoggedIn',true);
                navigate('/addstation');
            }else{
                setadminerror('Invalid email or password');
            }
        }catch(adminerror){
            setadminerror('Error logging in');
        }
    };
    const adminvalidateemail = (adminemail) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(adminemail);
      };

    const adminhandleemailchange=(e)=>{
        setadminemail(e.target.value);
        if(!adminvalidateemail(e.target.value)){
            setadminemailerror('Please enter a valid email address');
        }else{
            setadminemailerror('');
        }
    };


    const adminhandlepasswordchange=(e)=>{
        setadminpassword(e.target.value);
        if(!e.target.value){
            setadminpassworderror('Password cannot be empty');
        }else{
            setadminpassworderror('');
        }
    }
    
  return (
    <div className='adminLogin'>
        <div className="admcontainer">
            <div className="nav">
                <Navbar/>
            </div>
            <div className="admbox">
                <div className="admheader">
                    <label className='admLogin-lbl'>Admin Login</label>
                </div>
                <form className='admLogin' onSubmit={handleadminlogin}>
                    <div className="admuser">
                        <input type="email" id='username' className='textbox' placeholder='Admin Email' value={adminemail} onChange={adminhandleemailchange} required/>
                        {adminemailerror && <p className="error">{adminemailerror}</p>}
                        <input type="password" id='password' className='textbox' placeholder='Password'  value={adminpassword} onChange={adminhandlepasswordchange} required/>
                        {adminpassworderror && <p className="error">{adminpassworderror}</p>}
                        <a href="/adminregister" id='admin'>Register</a>
                        <button id='adminlogin' className='button'  type='submit'>Login</button>
                       
            
                    </div>
                    {adminerror && <div className="error">{adminerror}</div>}
                </form>
            </div>
        </div>
      
    </div>
  )
}

export default AdminLogin
