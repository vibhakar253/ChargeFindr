import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../Navbar/Navbar';
import { IoIosArrowBack } from "react-icons/io";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './booking.css';
import bgImage from './FindJuice.png';

const Booking = () => {
  const { stationId } = useParams();
  const [stationDetails, setStationDetails] = useState(null);
  const [selectedConnector, setSelectedConnector] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [filteredTimeSlots, setFilteredTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');

  const [showPopup, setShowPopup] = useState(false);
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:7000/stations/${stationId}`)
      .then(response => {
        setStationDetails(response.data);
      })
      .catch(error => {
        console.error('Error fetching station details:', error);
      });
  }, [stationId]);

  useEffect(() => {
    if (stationDetails && selectedDate) {
      const slots = stationDetails.timeSlots.filter(slot => slot.date === selectedDate);
      setFilteredTimeSlots(slots);
      setSelectedTimeSlot('');
    }
  }, [stationDetails, selectedDate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      selectedConnector,
      selectedDate,
      selectedTimeSlot,
    });
    setShowPopup(true);
  };

  const handleBackButtonClick = () => {
    window.location.href = '/find';
  };

  const handlePopupConfirm = async () => {
    try {
      const bookingData = {
        stationName: stationDetails.name,
        timeSlot: selectedTimeSlot,
        connectorType: selectedConnector,
        
      };

      const response = await axios.post('http://localhost:7000/bookings', bookingData);
      console.log(response.data.message);
      setShowPopup(false);
      setShowConfirmationPopup(true);
    } catch (error) {
      console.error('Error confirming booking:', error);
    }
  };

  const handlePopupCancel = () => {
    console.log('Booking canceled');
    setShowPopup(false);
  };

  const handleConfirmationClose = () => {
    setShowConfirmationPopup(false);
  };

  

  if (!stationDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className='booking' style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="bookingcontainer">
        <div className="nav">
          <Navbar />
        </div>
        <div className="bookingbox">
          <div className="content">
            <div className="display">
              <div className="station">
                <h1>{stationDetails.name}</h1>
                <div className="stationarea">
                  <p>Area : {stationDetails.area}</p>
                </div>
                <div className="stationaddress">
                  <p>Address : {stationDetails.address}</p>
                  <p>Contact: {stationDetails.contact}</p>
                </div>
                <div className="connection">
                  <p>Connection Type : {stationDetails.connectorsType.join(', ')}</p>
                  <p></p>
                  <p>Capacity {stationDetails.capacity} KW</p>
                </div>
              </div>
            </div>
            <div className="bookingdetails">
              <div className="bookheader">
                <label className='bheader'>Book Your Slot</label>
                <button><IoIosArrowBack size={32} onClick={handleBackButtonClick} /></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="connectorSelect">
                  <label htmlFor="connectorType">Select Connector Type</label>
                  <select
                    id="connectorType"
                    value={selectedConnector}
                    onChange={(e) => setSelectedConnector(e.target.value)}
                    required
                  >
                    <option value="">Select Connector</option>
                    {stationDetails.connectorsType.map((connector, index) => (
                      <option key={index} value={connector}>{connector}</option>
                    ))}
                  </select>
                </div>
                <div className="dateTime">
                  <label className='date'>Select Date</label>
                  <input
                    type="date"
                    className='date'
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    required
                  />
                </div>
                <div className="dateTime">
                  <label className='timeSlot'>Available Time Slots</label>
                  <div className="timeSlotsContainer">
                    {filteredTimeSlots.map((slot, index) => (
                      <button
                        key={index}
                        type="button"
                        className={`timeSlotButton ${selectedTimeSlot === `${slot.startTime} - ${slot.endTime}` ? 'selected' : ''}`}
                        onClick={() => setSelectedTimeSlot(`${slot.startTime} - ${slot.endTime}`)}
                      >
                        {slot.startTime} - {slot.endTime}
                      </button>
                    ))}
                  </div>
                </div>
                <button type='submit' className='continue' id='continue'>Continue</button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Confirm Your Booking</h2>
            <p>Station: {stationDetails.name}</p>
            <p>Connector Type: {selectedConnector}</p>
            <p>Time Slot: {selectedTimeSlot}</p>
            <div className="popup-buttons">
              <button onClick={handlePopupConfirm}>Confirm</button>
              <button onClick={handlePopupCancel}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showConfirmationPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Booking Confirmed</h2>
            <p>Your booking has been successfully confirmed!</p>
            <div className="popup-buttons">
              <button onClick={handleConfirmationClose}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;
