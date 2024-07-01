
import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../Navbar/Navbar';
import './findpage.css';
import axios from 'axios';
import { CiSearch } from "react-icons/ci";
import Map from './Map';
import { useNavigate } from 'react-router-dom';

const Findpage = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchArea, setSearchArea] = useState('');
  const [expandedStationId, setExpandedStationId] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const mapRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:7000/stations")
      .then(response => {
        setData(response.data);
        setFilteredData(response.data);
      })
      .catch(error => console.log(error));
  }, []);

  useEffect(() => {
    // Zoom map to selected card's coordinates when selectedCard changes
    if (selectedCard && mapRef.current) {
      const { coordinates } = selectedCard.location;
      const center = {
        lat: coordinates[1],
        lng: coordinates[0],
      };
      mapRef.current.panTo(center);
      mapRef.current.setZoom(15);
    }
  }, [selectedCard]);

  const handleCardClick = (station) => {
    setSelectedCard(station);
    setExpandedStationId(expandedStationId === station._id ? null : station._id);
  };

  const handleBookClick = (stationId) => {
    navigate(`/book/${stationId}`);
  };
  

  const handleSearchChange = (event) => {
    setSearchArea(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const filtered = data.filter(station =>
      station.area.toLowerCase().includes(searchArea.toLowerCase()) ||
      station.name.toLowerCase().includes(searchArea.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleGetDirections = (station) => {
    const { coordinates } = station.location;
    const lat = coordinates[1];
    const lng = coordinates[0];
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
  };

  const uniqueAreaNames = [...new Set(data.map(station => station.area))];

  return (
    <div className='find'>
      <div className="findcontainer">
        <div className="nav">
          <Navbar />
        </div>
        <div className="map">
            <Map stations={data} mapRef={mapRef} />
          </div>
        <div className="content">
          <div className="search">
            <form onSubmit={handleSearchSubmit}>
              <input
                type="text"
                className='search'
                placeholder='Enter Location'
                value={searchArea}
                onChange={handleSearchChange}
                list='areaOptions'
              />
              <datalist id='areaOptions'>
                {uniqueAreaNames.map((area, idx) => (
                  <option key={idx} value={area} />
                ))}
              </datalist>
              <button type="submit"><CiSearch /></button>
            </form>
            <div className="searchcontent">
              {filteredData.map((station) => (
                <div key={station._id} className={`findstation_card ${expandedStationId === station._id ? 'expanded' : ''}`}>
                  <div className="card-header" onClick={() => handleCardClick(station)}>
                    <h2>{station.name}</h2>
                    <div className="area">
                      <p>{station.area}</p>
                    </div>
                    <div className="connectors">
                      {station.connectorsType.join(', ')}
                    </div>
                  </div>
                  {expandedStationId === station._id && (
                    <div className="card-details">
                      <p>{station.address}</p>
                      <p>Contact: {station.contact}</p>
                      <div className="navi">
                      <a className="getdir" onClick={() => handleGetDirections(station)}>Get Directions</a>
                      <a onClick={() => handleBookClick(station._id)} id='statbook'>Book</a>

                    </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Findpage;