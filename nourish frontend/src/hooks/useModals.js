import { useState } from 'react';

export const useModals = () => {
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedMealType, setSelectedMealType] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showRecipeCard, setShowRecipeCard] = useState(false);
  const [showGroceryModal, setShowGroceryModal] = useState(false);
  const [showRestaurantModal, setShowRestaurantModal] = useState(false);

  const openMealDetail = (meal) => {
    if (meal._rawData) {
      setSelectedMeal(meal._rawData);
      setSelectedDay(new Date().toLocaleDateString('en-US', { weekday: 'long' }));
      setSelectedMealType(meal.category);
    } else {
      setSelectedRecipe(meal);
      setShowRecipeCard(true);
    }
  };

  const closeMealDetail = () => {
    setSelectedMeal(null);
    setSelectedDay(null);
    setSelectedMealType(null);
  };

  const closeRecipeCard = () => {
    setShowRecipeCard(false);
    setSelectedRecipe(null);
  };

  const closeGroceryModal = () => {
    setShowGroceryModal(false);
  };

  const closeRestaurantModal = () => {
    setShowRestaurantModal(false);
  };

  return {
    // State
    selectedMeal,
    selectedDay,
    selectedMealType,
    selectedRecipe,
    showRecipeCard,
    showGroceryModal,
    showRestaurantModal,
    
    // Actions
    openMealDetail,
    closeMealDetail,
    closeRecipeCard,
    setShowGroceryModal,
    setShowRestaurantModal,
    closeGroceryModal,
    closeRestaurantModal
  };
};