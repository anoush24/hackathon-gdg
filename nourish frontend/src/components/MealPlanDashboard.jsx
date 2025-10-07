import React, { useState } from "react";
import DashboardHeader from "./DashboardHeader";
import WelcomeSection from "./WelcomeSection";
import NutritionSnapshot from "./NutritionSnapshot";
import AIInsightCard from "./AIInsightCard";
import TodaysMealPlan from "./TodaysMealPlan";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import MealDetailModal from "./MealDetailModal";
import GroceryListModal from "./GroceryListModal";
import RestaurantModal from './RestaurantModal';
import RecipeCard from "./RecipeCard";
import GroceryList from "@/pages/GroceryList";
import MealCustomizationPage from "./MealCustomizationPage";

import { useMealPlan } from "@/hooks/useMealPlan";
import { useModals } from "@/hooks/useModals";
import { useRestaurants } from "@/hooks/useRestaurants";
import { useGrocery } from "@/hooks/useGrocery";

const MealPlanDashboard = ({
  user,
  onLogout,
  onNavigateToSettings,
  onNavigateToMealJournal,
  onNavigateToCustomization
}) => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [groceryIngredients, setGroceryIngredients] = useState([]);
  const [showCustomization, setShowCustomization] = useState(false);

  // Custom hooks
  const {
    currentMeals,
    isLoadingMeals,
    mealsError,
    nutritionStats,
    weekInfo,
    consumedNutrition,
    mealPlanContext,
    toggleMealComplete,
    refetchMeals
  } = useMealPlan(user, onLogout);

  const {
    selectedMeal,
    selectedDay,
    selectedMealType,
    selectedRecipe,
    showRecipeCard,
    showGroceryModal,
    showRestaurantModal,
    openMealDetail,
    closeMealDetail,
    closeRecipeCard,
    setShowGroceryModal,
    setShowRestaurantModal
  } = useModals();

  const {
    restaurants,
    isLoadingRestaurants,
    userLocation,
    error: restaurantError,
    findRestaurants
  } = useRestaurants();

  const {
    groceryData,
    isLoadingGrocery,
    fetchGroceryList
  } = useGrocery();

  // Handlers
  const handleCustomize = () => {
    console.log('🎨 Opening meal customization');
    onNavigateToCustomization();
  };

  const handleGetGroceryList = async () => {
    const result = await fetchGroceryList();
    if (result.success) {
      setShowGroceryModal(true);
    }
  };

  const handleFindRestaurants = async () => {
    if (!mealPlanContext) {
      alert("Please wait for your meal plan to load first.");
      return;
    }

    console.log('🍴 Finding restaurants with context:', mealPlanContext);
    
    try {
      const result = await findRestaurants(mealPlanContext, user);
      if (result.success) {
        console.log('✅ Restaurants found, opening modal');
        setShowRestaurantModal(true);
      } else {
        console.error('❌ Failed to find restaurants:', result.error);
      }
    } catch (error) {
      console.error('❌ Error in handleFindRestaurants:', error);
    }
  };

  const handleGenerateGroceryList = (ingredients) => {
    setGroceryIngredients(ingredients);
    setCurrentView('grocery');
    closeRecipeCard();
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setGroceryIngredients([]);
  };

  // View rendering
  if (showCustomization) {
    return (
      <MealCustomizationPage
        onBack={() => setShowCustomization(false)}
        onSave={(meals) => {
          console.log('Saved meals:', meals);
          setShowCustomization(false);
        }}
      />
    );
  }

  if (currentView === 'grocery') {
    return (
      <GroceryList
        ingredients={groceryIngredients}
        onBack={handleBackToDashboard}
      />
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-subtle">
        <DashboardHeader 
          user={user}
          onNavigateToMealJournal={onNavigateToMealJournal}
          onNavigateToSettings={onNavigateToSettings}
          onLogout={onLogout}
        />

        <div className="container mx-auto px-4 py-8">
          <WelcomeSection user={user} weekInfo={weekInfo} />

          {isLoadingMeals && <LoadingState message="Loading today's meals..." />}

          {mealsError && !isLoadingMeals && (
            <ErrorState 
              error={mealsError}
              onRetry={() => window.location.reload()}
              onGeneratePlan={onNavigateToMealJournal}
            />
          )}

          {!isLoadingMeals && !mealsError && currentMeals.length > 0 && (
            <>
              <NutritionSnapshot 
                consumedNutrition={consumedNutrition}
                nutritionStats={nutritionStats}
              />

              <AIInsightCard 
                user={user}
                nutritionStats={nutritionStats}
                onNavigateToMealJournal={onNavigateToMealJournal}
              />

              <TodaysMealPlan 
                currentMeals={currentMeals}
                onMealClick={openMealDetail}
                onToggleMealComplete={toggleMealComplete}
                onGetGroceryList={handleGetGroceryList}
                onFindRestaurants={handleFindRestaurants}
                onNavigateToMealJournal={onNavigateToMealJournal}
                onCustomize={handleCustomize}
                isLoadingGrocery={isLoadingGrocery}
                isLoadingRestaurants={isLoadingRestaurants}
                mealPlanContext={mealPlanContext}
              />
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      {selectedRecipe && (
        <RecipeCard
          isOpen={showRecipeCard}
          onClose={closeRecipeCard}
          onGenerateGroceryList={handleGenerateGroceryList}
          recipe={selectedRecipe}
        />
      )}

      {selectedMeal && (
        <MealDetailModal
          meal={selectedMeal}
          mealType={selectedMealType}
          day={selectedDay}
          onClose={closeMealDetail}
        />
      )}

      {showRestaurantModal && (
        <RestaurantModal
          restaurants={restaurants}
          userLocation={userLocation}
          onClose={() => setShowRestaurantModal(false)}
        />
      )}

      {showGroceryModal && groceryData && (
        <GroceryListModal 
          groceryData={groceryData}
          onClose={() => setShowGroceryModal(false)}
        />
      )}
    </>
  );
};

export default MealPlanDashboard;