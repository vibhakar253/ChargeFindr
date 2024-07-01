import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage/LandingPage';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import AdminLogin from './components/Admin/AdminLogin/AdminLogin';
import Addstation from './components/Admin/addstation/Addstation';
import Findpage from './components/Find/Findpage';
import Booking from './components/Booking/Booking';
import Map from './components/Find/Map';
import AdminRegister from './components/Admin/AdminRegister/AdminRegister';
import { UserProvider } from './contexts/usercontext.jsx'; // Import the UserProvider

const App = () => {
  return (
    <UserProvider> {/* Wrap the entire app in the UserProvider */}
      <Router>
        <div className="page">
          <Routes>
            <Route path='/' element={<LandingPage />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/admin' element={<AdminLogin />} />
            <Route path='/addstation' element={<Addstation />} />
            <Route path='/find' element={<Findpage />} />
            <Route path="/book/:stationId" element={<Booking />} />
            <Route path='/map' element={<Map />} />
            <Route path='/adminregister' element={<AdminRegister />} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
