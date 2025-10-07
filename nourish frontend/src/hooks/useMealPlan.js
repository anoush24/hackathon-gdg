import { useState, useEffect } from 'react';
import axios from 'axios';
import heroBreakfast from "../assets/hero-breakfast.png";
import { authService } from '../authBridge';


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

      // Check if user is still authenticated
      if (!authService.isAuthenticated()) {
        throw new Error("Authentication required");
      }

      const headers = getAuthHeaders();
      console.log('📤 Fetching today\'s meals with headers:', { 
        ...headers, 
        Authorization: headers.Authorization.substring(0, 20) + '...' 
      });

      const response = await axios.get(
        "http://localhost:5000/api/meal-plans/today",
        { headers }
      );

      console.log('✅ Today\'s meals response:', response.data);
      setMealPlanContext(response.data.data);

      if (response.data.success) {
        const { meals, nutritionStats: stats, weekInfo: info } = response.data.data;

        const transformedMeals = [];
        const initialConsumed = { calories: 0, protein: 0, carbs: 0, fat: 0 };

        ['breakfast', 'lunch', 'dinner'].forEach((mealType) => {
          if (meals[mealType]) {
            const mealData = meals[mealType];
            const mealId = mealType;
            
            transformedMeals.push({
              id: mealId,
              title: mealData.name,
              image: mealData.image_url || heroBreakfast,
              category: mealType.charAt(0).toUpperCase() + mealType.slice(1),
              cookTime: mealData.cookTime || "20 min",
              servings: mealType === 'breakfast' ? 1 : 2,
              calories: mealData.calories,
              isAiGenerated: true,
              prepTime: "10 min",
              difficulty: "Easy",
              description: `${mealType === 'breakfast' ? 'Start your day' : mealType === 'lunch' ? 'Enjoy' : 'Savor'} ${mealData.name}`,
              ingredients: mealData.ingredients?.map((ing, idx) => ({
                id: `${mealId}-${idx}`,
                name: ing,
                amount: "",
                selected: true,
                category: "Pantry"
              })) || [],
              instructions: [],
              protein: mealData.protein,
              carbs: mealData.carbs,
              fat: mealData.fat,
              youtube_link: mealData.youtube_link,
              isCompleted: mealData.isCompleted || false,
              _rawData: mealData
            });

            if (mealData.isCompleted) {
              initialConsumed.calories += mealData.calories || 0;
              initialConsumed.protein += mealData.protein || 0;
              initialConsumed.carbs += mealData.carbs || 0;
              initialConsumed.fat += mealData.fat || 0;
            }
          }
        });

        setCurrentMeals(transformedMeals);
        setNutritionStats(stats);
        setWeekInfo(info);
        setConsumedNutrition(initialConsumed);
      }
    } catch (err) {
      console.error("❌ Error fetching today's meals:", err);

      if (err.response?.status === 404 && err.response?.data?.needsGeneration) {
        setMealsError("noplan");
      } else if (err.response?.status === 401 || err.message === "Authentication required") {
        console.log("🔓 Authentication failed, logging out user");
        authService.logout();
        onLogout?.();
      } else {
        setMealsError(err.response?.data?.message || err.message || "Failed to load meals");
      }
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
        `http://localhost:5000/api/meal-plans/today/${mealId}/complete`,
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