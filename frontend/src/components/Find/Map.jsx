import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker, Circle, useJsApiLoader } from '@react-google-maps/api';
import { gsap } from 'gsap';
import './Map.css';
import { FaLocationArrow } from 'react-icons/fa';
import dotenv from 'dotenv';

const containerStyle = {
  height: '100vh', // Full viewport height
  width: '100vw', // Full viewport width
  position: 'absolute',
  top: '-60px',
  right: '-60px',
};

const mapStyle = {
  height: '100%', // Use 100% height to fill parent container
  width: '100%', // Use 100% width to fill parent container
};

const mapOptions = {
  mapId: 'f4b8d499673b689b', // Replace with your actual map style ID
};

const Map = ({ stations, selectedCard, mapRef }) => {
  const [markers, setMarkers] = useState([]);
  const [center, setCenter] = useState({ lat: 17.448796, lng: 78.407816 }); // Default center
  const [userLocation, setUserLocation] = useState(null); // State for user location

  useEffect(() => {
    if (stations.length > 0) {
      const updatedMarkers = stations.map((station) => ({
        id: station._id,
        position: {
          lat: station.location.coordinates[1],
          lng: station.location.coordinates[0],
        },
        title: station.name,
      }));
      setMarkers(updatedMarkers);
    }
  }, [stations]);

  useEffect(() => {
    if (selectedCard && mapRef.current) {
      const { coordinates } = selectedCard.location;
      const newCenter = {
        lat: coordinates[1],
        lng: coordinates[0],
      };

      // Use gsap for smooth animation
      gsap.to(mapRef.current, {
        duration: 1, // Animation duration in seconds
        ease: 'power3.inOut', // Easing function for smoothness
        zoom: 10, // Zoom level to animate to
        center: newCenter, // Center coordinates to animate to
      });
    }
  }, [selectedCard, mapRef]);

  // Function to handle location request
  const handleLocationAccess = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(userLocation); // Update user location state
          setCenter(userLocation); // Optionally, update map center to user location
          if (mapRef.current) {
            mapRef.current.panTo(userLocation);
            mapRef.current.setZoom(15); // Optional: Set zoom level after centering
          }
        },
        (error) => {
          console.error('Error getting user location:', error);
          alert('Unable to retrieve your location.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  // Function to handle marker click
  const handleMarkerClick = (position) => {
    // Construct the Google Maps URL for directions
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${position.lat},${position.lng}`;

    // Open the URL in a new tab
    window.open(googleMapsUrl, '_blank');
  };

  const apikey= import .meta.env.VITE_REACT_GOOGLE_API;
  return (
    <LoadScript googleMapsApiKey={apikey}>
      <div style={{ position: 'relative' }}>
        <button
          id="nearby"
          style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 10 }}
          onClick={handleLocationAccess}
        >
          <FaLocationArrow id='locicon' /> Find Near You
        </button>
        <div style={containerStyle}>
          <GoogleMap
            mapContainerStyle={mapStyle}
            center={center}
            zoom={11} // Initial zoom level
            options={mapOptions}
            onLoad={(map) => {
              mapRef.current = map;
            }}
          >
            {markers.map((marker) => (
              <Marker
                key={marker.id}
                position={marker.position}
                title={marker.title}
                onClick={() => handleMarkerClick(marker.position)} // Attach onClick handler
              />
            ))}
            {userLocation && (
              <>
                <Marker
                  position={userLocation}
                  title="Your Location"
                  icon={{
                    url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png', // Use the default blue dot icon
                    scaledSize: new window.google.maps.Size(40, 40), // Adjust size as needed
                  }}
                />
                <Circle
                  center={userLocation}
                  radius={100} // Radius in meters, adjust as needed
                  options={{
                    strokeColor: '#4285F4',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: '#4285F4',
                    fillOpacity: 0.35,
                  }}
                />
              </>
            )}
          </GoogleMap>
        </div>
      </div>
    </LoadScript>
  );
};

export default Map;
