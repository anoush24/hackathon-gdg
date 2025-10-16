import { useState } from 'react';

export const useModals = () => {
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedMealType, setSelectedMealType] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showRecipeCard, setShowRecipeCard] = useState(false);
  const [showGroceryModal, setShowGroceryModal] = useState(false);
  const [showRestaurantModal, setShowRestaurantModal] = useState(false);


  const openMealDetail = (meal, mealType, day) => {
    setSelectedMeal(meal);        // 🔥 For MealDetailModal
    setSelectedMealType(mealType);
    setSelectedDay(day);
    // Don't set recipe state here!
  };

  const openRecipeCard = (recipe) => {
    setSelectedRecipe(recipe);    // 🔥 For RecipeCard
    setShowRecipeCard(true);
    // Don't set meal state here!
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
    openRecipeCard,
    closeMealDetail,
    closeRecipeCard,
    setShowGroceryModal,
    setShowRestaurantModal,
    closeGroceryModal,
    closeRestaurantModal
  };
};