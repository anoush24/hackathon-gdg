import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { User, Utensils } from 'lucide-react'; // Import icons you like
import './ui/RestaurantMap.css';

// --- NEW: Custom User Icon ---
// We create a custom SVG icon using your app's green theme color.
const userIcon = L.divIcon({
  html: renderToStaticMarkup(
    <div className="p-1.5 bg-green-500 rounded-full shadow-md">
      <User className="w-4 h-4 text-white" />
    </div>
  ),
  className: '', // We can leave this empty
  iconSize: [30, 30],
  iconAnchor: [15, 15], // Center the icon
  popupAnchor: [0, -15],
});


// --- NEW: Custom Restaurant Icon ---
// We do the same for restaurants, using a teal theme color.
const restaurantIcon = L.divIcon({
  html: renderToStaticMarkup(
    <div className="p-1.5 bg-orange-600 rounded-full shadow-md">
      <Utensils className="w-4 h-4 text-white" />
    </div>
  ),
  className: '',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, -15],
});


const RestaurantMap = ({ restaurants, userLocation }) => {
  const mapCenter = userLocation
    ? [userLocation.lat, userLocation.lng]
    : (restaurants.length > 0 ? [restaurants[0].lat, restaurants[0].lng] : [19.15, 72.99]);

  return (
    <div className="h-64 md:h-80 w-full rounded-lg overflow-hidden border-2 border-green-100 shadow-sm">
      <MapContainer center={mapCenter} zoom={14} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        {/* --- UPDATED: New TileLayer for a cleaner look --- */}
        <TileLayer
         attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'
         url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
        />
        
        {/* Marker for the user's location with the new custom icon */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
            <Popup className="themed-popup">Your Location</Popup>
          </Marker>
        )}

        {/* Markers for each restaurant with the new custom icon */}
        {restaurants.map(restaurant => (
          <Marker key={restaurant.id} position={[restaurant.lat, restaurant.lng]} icon={restaurantIcon}>
            {/* --- UPDATED: Added a className to the Popup for styling --- */}
            <Popup className="themed-popup">
              <div className="font-sans">
                <b className="text-orange-800">{restaurant.name}</b><br />
                {restaurant.address}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default RestaurantMap;