import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { User, Utensils } from 'lucide-react';
import './ui/RestaurantMap.css';

// Custom User Icon
const userIcon = L.divIcon({
  html: renderToStaticMarkup(
    <div className="p-1.5 bg-green-500 rounded-full shadow-md">
      <User className="w-4 h-4 text-white" />
    </div>
  ),
  className: '',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, -15],
});

// Custom Restaurant Icon
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
  // Filter out restaurants with invalid coordinates
  const validRestaurants = restaurants.filter(r => {
    const hasValidCoords = r.lat && r.lng && 
                          !isNaN(r.lat) && !isNaN(r.lng) &&
                          Math.abs(r.lat) <= 90 && Math.abs(r.lng) <= 180;
    
    if (!hasValidCoords) {
      console.warn('Invalid restaurant coordinates:', r.name, r.lat, r.lng);
    }
    return hasValidCoords;
  });

  console.log('🗺️ Map Debug:', {
    totalRestaurants: restaurants.length,
    validRestaurants: validRestaurants.length,
    userLocation,
    sampleRestaurant: validRestaurants[0]
  });

  const mapCenter = userLocation
    ? [userLocation.lat, userLocation.lng]
    : (validRestaurants.length > 0 
        ? [validRestaurants[0].lat, validRestaurants[0].lng] 
        : [19.15, 72.99]);

  return (
    <div className="h-64 md:h-80 w-full rounded-lg overflow-hidden border-2 border-green-100 shadow-sm">
      <MapContainer 
        center={mapCenter} 
        zoom={13} 
        scrollWheelZoom={false} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* User location marker */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
            <Popup className="themed-popup">
              <div className="font-sans">
                <b className="text-green-700">Your Location</b>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Restaurant markers */}
        {validRestaurants.map((restaurant, index) => (
          <Marker 
            key={restaurant.id || index} 
            position={[parseFloat(restaurant.lat), parseFloat(restaurant.lng)]} 
            icon={restaurantIcon}
          >
            <Popup className="themed-popup">
              <div className="font-sans">
                <b className="text-orange-800">{restaurant.name}</b><br />
                <span className="text-xs text-gray-600">{restaurant.address}</span><br />
                <span className="text-xs">⭐ {restaurant.rating}/5</span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Debug info */}
      {validRestaurants.length === 0 && restaurants.length > 0 && (
        <div className="absolute bottom-2 left-2 bg-yellow-100 text-yellow-800 text-xs p-2 rounded">
          ⚠️ No valid coordinates found for restaurants
        </div>
      )}
    </div>
  );
};

export default RestaurantMap;
