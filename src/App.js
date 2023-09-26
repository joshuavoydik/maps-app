import React, { useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

function UpdateView({ center }) {
    const map = useMap();
    map.setView(center, 13);
    return null;
}

function App() {
    const [position, setPosition] = useState([51.505, -0.09]); // Default to London
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = async () => {
        try {
            console.log("Searching for:", searchTerm);
            const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${searchTerm}&limit=1`);
            console.log("API Response:", response.data);
            if (response.data.length > 0) {
                const { lat, lon } = response.data[0];
                setPosition([parseFloat(lat), parseFloat(lon)]);
            } else {
                alert('Location not found.');
            }
        } catch (error) {
            console.error("Error fetching location:", error);
            alert('Error fetching location. Please try again.');
        }
    };

    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
          handleSearch();
      }
  };

  return (
        <div className="app">
            <h1>Location Finder</h1>
            <div className="search-bar">
                <input 
                    type="text" 
                    placeholder="Search for a location..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    onKeyUp={handleKeyPress}
                />
                <button onClick={handleSearch}>Search</button>
            </div>
            <MapContainer center={position} zoom={13} style={{ height: "80vh", width: "100%" }}>
                <UpdateView center={position} />
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={position}>
                    <Popup>
                        Searched Location
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}

export default App;



