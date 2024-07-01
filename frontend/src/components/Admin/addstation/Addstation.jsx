import React, { useEffect, useState } from 'react';
import Navbar from '../../Navbar/Navbar';
import './addstation.css';
import { FaUserCog, FaTrash, FaEdit } from "react-icons/fa";
import axios from 'axios';

const Addstation = () => {
  const [stations, setStations] = useState([]);
  const [formData, setFormData] = useState({
    area: '',
    name: '',
    address: '',
    contact: '',
    capacity: '',
    connectorsType: [],
    location: {
      type: 'Point',
      coordinates: [0, 0], // Initial coordinates set to (0, 0)
    },
    timeSlots: [] // State to manage time slots
  });
  const [showFormPopup, setShowFormPopup] = useState(false); // State for showing form as popup
  const [selectedConnectors, setSelectedConnectors] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingStationId, setEditingStationId] = useState(null);

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      const response = await axios.get('http://localhost:7000/stations');
      setStations(response.data);
    } catch (error) {
      console.error('Error fetching stations:', error);
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      // Update location coordinates with parseFloat to ensure they are saved as numbers
      const updatedFormData = {
        ...formData,
        location: {
          ...formData.location,
          coordinates: [
            parseFloat(formData.location.coordinates[0]),
            parseFloat(formData.location.coordinates[1])
          ]
        }
      };
      if (isEditing) {
        await axios.put(`http://localhost:7000/stations/${editingStationId}`, updatedFormData);
      } else {
        await axios.post('http://localhost:7000/stations', updatedFormData);
      }
      setFormData({
        area: '',
        name: '',
        address: '',
        contact: '',
        capacity: '',
        connectorsType: [],
        location: {
          type: 'Point',
          coordinates: [0, 0]
        },
        timeSlots: [] // Reset time slots after submission
      });
      fetchStations();
      setShowFormPopup(false); // Close the form popup after submission
      setIsEditing(false);
      setEditingStationId(null);
    } catch (error) {
      console.error('Error creating/updating station:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    if (name === 'connectorsType') {
      const updatedConnectorsType = checked
        ? [...formData.connectorsType, value]
        : formData.connectorsType.filter(conn => conn !== value);
      setFormData({ ...formData, connectorsType: updatedConnectorsType });
    } else if (name === 'latitude' || name === 'longitude') {
      // Handle latitude and longitude separately
      const updatedCoordinates = [...formData.location.coordinates];
      if (name === 'latitude') {
        updatedCoordinates[1] = parseFloat(value); // Latitude at index 1
      } else {
        updatedCoordinates[0] = parseFloat(value); // Longitude at index 0
      }
      setFormData({ ...formData, location: { ...formData.location, coordinates: updatedCoordinates } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleDeleteStation = async (id) => {
    try {
      await axios.delete(`http://localhost:7000/stations/${id}`);
      fetchStations();
    } catch (error) {
      console.error('Error deleting station:', error);
    }
  };

  const handleToggleFormPopup = (station = null) => {
    setShowFormPopup(!showFormPopup);
    if (station) {
      setFormData({
        area: station.area,
        name: station.name,
        address: station.address,
        contact: station.contact,
        capacity: station.capacity,
        connectorsType: station.connectorsType,
        location: station.location,
        timeSlots: station.timeSlots || []
      });
      setIsEditing(true);
      setEditingStationId(station._id);
    } else {
      setFormData({
        area: '',
        name: '',
        address: '',
        contact: '',
        capacity: '',
        connectorsType: [],
        location: {
          type: 'Point',
          coordinates: [0, 0]
        },
        timeSlots: []
      });
      setIsEditing(false);
      setEditingStationId(null);
    }
  };

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedConnectors([...selectedConnectors, value]);
    } else {
      setSelectedConnectors(selectedConnectors.filter(connector => connector !== value));
    }
  };

  const filteredStations = selectedConnectors.length > 0
    ? stations.filter(station => selectedConnectors.some(connector => station.connectorsType.includes(connector)))
    : stations;

  // Function to add a new time slot to formData
  const handleAddTimeSlot = () => {
    const newSlot = {
      date: '',
      startTime: '',
      endTime: ''
    };
    setFormData(prevState => ({
      ...prevState,
      timeSlots: [...prevState.timeSlots, newSlot]
    }));
  };

  // Function to update time slot data in formData
  const handleTimeSlotChange = (index, field, value) => {
    const updatedSlots = [...formData.timeSlots];
    updatedSlots[index][field] = value;

    // Ensure end time is always 1 hour after start time
    if (field === 'startTime') {
      const startHour = parseInt(value.split(':')[0], 10);
      const endHour = (startHour + 1) % 24; // Wrap around for next day
      const endTime = `${endHour.toString().padStart(2, '0')}:00`;
      updatedSlots[index]['endTime'] = endTime;
    }

    setFormData(prevState => ({
      ...prevState,
      timeSlots: updatedSlots
    }));
  };

  // Function to remove a time slot from formData
  const handleRemoveTimeSlot = (index) => {
    const updatedSlots = [...formData.timeSlots];
    updatedSlots.splice(index, 1);
    setFormData(prevState => ({
      ...prevState,
      timeSlots: updatedSlots
    }));
  };

  // Predefined 1-hour time slots
  const timeSlotOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
  });

  return (
    <div className='admin'>
      <div className="adcontainer">
        <div className="nav">
          <Navbar />
        </div>
        <div className="adbox">
          
          <button onClick={() => handleToggleFormPopup()} className='new-station' id='newstation'>New Station</button>
          <div className='stations_container'>
            {filteredStations.map((station) => (
              <div key={station._id} className='station_card'>
                <p><strong>Name:</strong> {station.name}</p>
                <p><strong>Area:</strong> {station.area}</p>
                <p><strong>Contact:</strong> {station.contact}</p>
                <p><strong>Address:</strong> {station.address}</p>
                <p><strong>Capacity:</strong> {station.capacity} KW</p>
                <p><strong>Connectors:</strong> {station.connectorsType.join(', ')}</p>
                <button onClick={() => handleDeleteStation(station._id)} id='delete'>Delete</button>
                <button onClick={() => handleToggleFormPopup(station)} id='edit'>Edit</button>
              </div>
            ))}
          </div>

          {showFormPopup && (
            <div className="form-popup">
              <form className='fadmin' onSubmit={handleFormSubmit}>
                <div className="aduser">
                  <div className="addr">
                    <input type="text" id='name' name='name' className='name' placeholder='Name' value={formData.name} onChange={handleInputChange} required />
                    <input type="text" id='area' name='area' className='area' placeholder='Area' value={formData.area} onChange={handleInputChange} required />
                  </div>
                  <textarea name="address" id="address" placeholder='Address' rows={4} cols={40} value={formData.address} onChange={handleInputChange} required></textarea>
                  <div className="field">
                    <input type="tel" id='contact' name='contact' className='contact' placeholder='Contact' value={formData.contact} onChange={handleInputChange} required />
                    <input type="number" id='capacity' name='capacity' className='capacity' placeholder='Capacity (kW)' value={formData.capacity} onChange={handleInputChange} required />
                  </div>
                  <div className="connectors">
                    <label className='CCS'>CCS
                      <input className='ccs' type='checkbox' name='connectorsType' value='CCS' onChange={handleInputChange} checked={formData.connectorsType.includes('CCS')} />
                    </label>
                    <label className='CCS-II'>CCS-II
                      <input className='ccs2' type='checkbox' name='connectorsType' value='CCS-II' onChange={handleInputChange} checked={formData.connectorsType.includes('CCS-II')} />
                    </label>
                    <label className='GB/T'>GB/T
                      <input className='gbt' type='checkbox' name='connectorsType' value='GB/T' onChange={handleInputChange} checked={formData.connectorsType.includes('GB/T')} />
                    </label>
                    <label className='BHARAT DC001'>Bharat DC001
                      <input className='bharatdc001' type='checkbox' name='connectorsType' value='Bharat DC001' onChange={handleInputChange} checked={formData.connectorsType.includes('Bharat DC001')} />
                    </label>
                    <label className='CHAdeMO'>CHAdeMO
                      <input className='chademo' type='checkbox' name='connectorsType' value='CHAdeMO' onChange={handleInputChange} checked={formData.connectorsType.includes('CHAdeMO')} />
                    </label>
                  </div>

                  {/* Time Slots Section */}
                  <div className="time-slots">
                    <h3>Add Time Slots</h3>
                    {formData.timeSlots.map((slot, index) => (
                      <div key={index} className="time-slot">
                        <label>Date:</label>
                        <input
                          type="date"
                          value={slot.date}
                          onChange={(e) => handleTimeSlotChange(index, 'date', e.target.value)}
                          required
                        />
                        <label>Start Time:</label>
                        <select
                          value={slot.startTime}
                          onChange={(e) => handleTimeSlotChange(index, 'startTime', e.target.value)}
                          required
                        >
                          <option value="" disabled>Select Start Time</option>
                          {timeSlotOptions.map((timeSlot) => (
                            <option key={timeSlot} value={timeSlot}>{timeSlot}</option>
                          ))}
                        </select>
                        <label>End Time:</label>
                        <select
                          value={slot.endTime}
                          onChange={(e) => handleTimeSlotChange(index, 'endTime', e.target.value)}
                          required
                        >
                          <option value="" disabled>Select End Time</option>
                          {timeSlotOptions.map((timeSlot) => (
                            <option key={timeSlot} value={timeSlot}>{timeSlot}</option>
                          ))}
                        </select>
                        <button 
                          type="icon" id="bin"
                          onClick={() => handleRemoveTimeSlot(index)}
                          className='remove-timeslot'
                        >
                          <FaTrash size={16} color="red" />
                        </button>
                      </div>
                    ))}
                    <button type="button" onClick={handleAddTimeSlot} className='add-timeslot'>Add Time Slot</button>
                  </div>

                  <div className="coordinates">
                    <label className='latitude-label'>Latitude
                      <input
                        type="number"
                        step="0.000001"
                        id='latitude'
                        name='latitude'
                        className='latitude'
                        placeholder='Latitude'
                        value={formData.location.coordinates[1]}
                        onChange={handleInputChange}
                        required
                      />
                    </label>
                    <label className='longitude-label'>Longitude
                      <input
                        type="number"
                        step="0.000001"
                        id='longitude'
                        name='longitude'
                        className='longitude'
                        placeholder='Longitude'
                        value={formData.location.coordinates[0]}
                        onChange={handleInputChange}
                        required
                      />
                    </label>
                  </div>
                  <div className="buttons" id='buttons'>
                    <button type="submit" className='addstation'>{isEditing ? 'Update Station' : 'Add Station'}</button>
                    <button type="button" className='close' onClick={handleToggleFormPopup}>Cancel</button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Addstation;