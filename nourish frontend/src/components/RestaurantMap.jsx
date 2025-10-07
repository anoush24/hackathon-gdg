import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';



delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetinaUrl,
  iconUrl: iconUrl,
  shadowUrl: shadowUrl,
});

const RestaurantMap = ({ restaurants, userLocation }) => {
  // Use user's location as the center, or the first restaurant's location as a fallback
  const mapCenter = userLocation
    ? [userLocation.lat, userLocation.lng]
    : (restaurants.length > 0 ? [restaurants[0].lat, restaurants[0].lng] : [19.15, 72.99]); // Fallback to a default location

  return (
    <div className="h-64 w-full rounded-md overflow-hidden border">
      <MapContainer center={mapCenter} zoom={14} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Marker for the user's location */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]}>
            <Popup>Your Location</Popup>
          </Marker>
        )}

        {/* Markers for each restaurant */}
        {restaurants.map(restaurant => (
          <Marker key={restaurant.id} position={[restaurant.lat, restaurant.lng]}>
            <Popup>
              <b>{restaurant.name}</b><br />
              {restaurant.address}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default RestaurantMap;
