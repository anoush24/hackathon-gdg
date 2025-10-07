import { useState } from 'react';
import axios from 'axios';

export const useGrocery = () => {
  const [groceryData, setGroceryData] = useState(null);
  const [isLoadingGrocery, setIsLoadingGrocery] = useState(false);

  const fetchGroceryList = async () => {
    try {
      setIsLoadingGrocery(true);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const config = {
        headers: {
          'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      console.log('🛒 Fetching grocery list...');

      const response = await axios.get(
        "http://localhost:5000/api/meal-plans/today/grocery",
        config
      );

      console.log('✅ Grocery list response:', response.data);

      if (response.data.success) {
        setGroceryData(response.data.data);
        return { success: true, data: response.data.data };
      }
    } catch (err) {
      console.error("❌ Error fetching grocery list:", err);
      alert(err.response?.data?.message || "Failed to load grocery list");
      return { success: false, error: err };
    } finally {
      setIsLoadingGrocery(false);
    }
  };

  return {
    groceryData,
    isLoadingGrocery,
    fetchGroceryList
  };
};