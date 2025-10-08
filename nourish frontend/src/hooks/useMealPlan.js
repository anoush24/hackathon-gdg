import { useState, useEffect } from 'react';
import axios from 'axios';
import heroBreakfast from "../assets/hero-breakfast.png";
import { authService } from '../authBridge';

const API_BASE_URL = 'http://localhost:5000/api';

export const useMealPlan = (user, onLogout) => {
  const [currentMeals, setCurrentMeals] = useState([]);
  const [isLoadingMeals, setIsLoadingMeals] = useState(true);
  const [mealsError, setMealsError] = useState(null);
  const [nutritionStats, setNutritionStats] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });
  const [weekInfo, setWeekInfo] = useState(null);
  const [consumedNutrition, setConsumedNutrition] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });
  const [mealPlanContext, setMealPlanContext] = useState(null);

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    const token = authService.getValidToken();
    if (!token) {
      throw new Error("No valid authentication token found");
    }

    return {
      'Authorization': token, // Already includes Bearer prefix
      'Content-Type': 'application/json'
    };
  };

  const fetchTodaysMeals = async () => {
  try {
    setIsLoadingMeals(true);
    setMealsError(null);

    const token = authService.getValidToken();
    if (!token) {
      console.log('🔓 No valid token, logging out');
      onLogout();
      return;
    }

    const response = await axios.get(`${API_BASE_URL}/meal-plans/today`, {
      headers: {
        'Authorization': token
      }
    });

    console.log('📥 Backend response:', response.data); // Add this for debugging

    if (response.data && response.data.success) {
      // Handle successful response - Updated data path
      const meals = response.data.mealPlan?.meals || []; 
      console.log('🍽️ Parsed meals:', meals); // Add this for debugging
      
      setCurrentMeals(meals);

      // Calculate nutrition stats
      const totalNutrition = meals.reduce((totals, meal) => ({
        calories: totals.calories + (meal.calories || 0),
        protein: totals.protein + (meal.protein || 0),
        carbs: totals.carbs + (meal.carbs || 0),
        fat: totals.fat + (meal.fat || 0),
      }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

      setNutritionStats(totalNutrition);

      // Calculate consumed nutrition (completed meals only)
      const consumedTotals = meals.reduce((totals, meal) => {
        if (meal.isCompleted) {
          return {
            calories: totals.calories + (meal.calories || 0),
            protein: totals.protein + (meal.protein || 0),
            carbs: totals.carbs + (meal.carbs || 0),
            fat: totals.fat + (meal.fat || 0),
          };
        }
        return totals;
      }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

      setConsumedNutrition(consumedTotals);

      // Set week info
      if (response.data.weekInfo) {
        setWeekInfo(response.data.weekInfo);
      }

      // Set meal plan context
      if (response.data.mealPlan) {
        setMealPlanContext(response.data.mealPlan);
      }
    }
  } catch (error) {
    console.error('❌ Error fetching today\'s meals:', error);

    if (error.response?.status === 401) {
      console.log('🔓 Authentication failed, logging out user');
      authService.clearAuth();
      onLogout();
      return;
    }

    setMealsError('Failed to fetch meal plan');
  } finally {
    setIsLoadingMeals(false);
  }
};

  const toggleMealComplete = async (mealId) => {
    const mealToUpdate = currentMeals.find(meal => meal.id === mealId);
    if (!mealToUpdate) return;

    const newCompletedStatus = !mealToUpdate.isCompleted;

    // Optimistic update
    const updatedMeals = currentMeals.map(meal =>
      meal.id === mealId ? { ...meal, isCompleted: newCompletedStatus } : meal
    );

    const newTotals = { calories: 0, protein: 0, carbs: 0, fat: 0 };
    updatedMeals.forEach(meal => {
      if (meal.isCompleted) {
        newTotals.calories += meal.calories || 0;
        newTotals.protein += meal.protein || 0;
        newTotals.carbs += meal.carbs || 0;
        newTotals.fat += meal.fat || 0;
      }
    });

    setCurrentMeals(updatedMeals);
    setConsumedNutrition(newTotals);

    try {
      // Check authentication before making request
      if (!authService.isAuthenticated()) {
        throw new Error("Authentication required");
      }

      const headers = getAuthHeaders();
      console.log('📤 Updating meal completion status:', { mealId, isCompleted: newCompletedStatus });

      await axios.patch(
        `${API_BASE_URL}/meal-plans/today/${mealId}/complete`, // Fixed: use API_BASE_URL constant
        { isCompleted: newCompletedStatus },
        { headers }
      );

      console.log('✅ Meal status updated successfully');
    } catch (error) {
      console.error("❌ Failed to save meal status:", error);

      // Revert optimistic update on failure
      setCurrentMeals(currentMeals);
      setConsumedNutrition(consumedNutrition);

      if (error.response?.status === 401 || error.message === "Authentication required") {
        console.log("🔓 Authentication failed during meal update, logging out user");
        authService.logout();
        onLogout?.();
        alert("Your session has expired. Please log in again.");
      } else {
        alert("Failed to save your progress. Please try again.");
      }
    }
  };

  useEffect(() => {
    if (user && authService.isAuthenticated()) {
      fetchTodaysMeals();
    }
  }, [user]);

  return {
    currentMeals,
    isLoadingMeals,
    mealsError,
    nutritionStats,
    weekInfo,
    consumedNutrition,
    mealPlanContext,
    toggleMealComplete,
    refetchMeals: fetchTodaysMeals
  };
};