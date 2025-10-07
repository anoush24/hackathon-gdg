import { useState } from 'react';
import axios from 'axios';

export const useRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [isLoadingRestaurants, setIsLoadingRestaurants] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [error, setError] = useState(null);

  const findRestaurants = async (mealPlanContext, user) => {
    if (!mealPlanContext) {
      alert("Please generate a meal plan first.");
      return { success: false, error: "No meal plan context" };
    }

    setIsLoadingRestaurants(true);
    setError(null);

    try {
      // Get user location
      const location = await getCurrentLocation();
      setUserLocation(location);

      const requestBody = {
        context: mealPlanContext,
        location: location,
        cuisines: user?.preferences?.cuisines || [],
      };

      console.log('🍴 Fetching restaurants with:', requestBody);

      const response = await axios.post(
        "http://localhost:8000/restaurants",
        requestBody,
        {
          timeout: 10000, // 10 second timeout
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ Restaurant response:', response.data);

      if (response.data && response.data.restaurants) {
        setRestaurants(response.data.restaurants);
        return { success: true, restaurants: response.data.restaurants };
      } else {
        throw new Error("No restaurants found in response");
      }
    } catch (err) {
      console.error("❌ Error fetching restaurants:", err);
      const errorMessage = err.response?.data?.message || err.message || "Could not fetch restaurant recommendations.";
      setError(errorMessage);
      alert(errorMessage);
      return { success: false, error: err };
    } finally {
      setIsLoadingRestaurants(false);
    }
  };

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser."));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          console.log('📍 Got user location:', location);
          resolve(location);
        },
        (error) => {
          console.error("Geolocation error:", error);
          let errorMessage = "Could not get your location. ";
          
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += "Please enable location services in your browser.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage += "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage += "Location request timed out.";
              break;
            default:
              errorMessage += "An unknown error occurred.";
              break;
          }
          
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    });
  };

  return {
    restaurants,
    isLoadingRestaurants,
    userLocation,
    error,
    findRestaurants
  };
};