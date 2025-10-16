import React, { useState, forwardRef, useImperativeHandle} from "react";

// Layout Components
import DashboardHeader from "../layout/DashboardHeader";
import WelcomeSection from "../layout/WelcomeSection";
import LoadingState from "../layout/LoadingState";

// Nutrition Components
import NutritionSnapshot from "../nutrition/NutritionSnapshot";
import AIInsightCard from "../nutrition/AIInsightCard";

// Meal Components
import TodaysMealPlan from "../meals/TodaysMealPlan";
import MealDetailModal from "../meals/MealDetailModal";

// Modal Components
import GroceryListModal from "../modals/GroceryListModal";
import RestaurantModal from "../modals/RestaurantModal";
import RecipeCard from "../modals/RecipeCard";

// Shared Components
import ErrorState from "../shared/ErrorState";

// Pages
import GroceryList from "../../pages/GroceryList";

// Root components (MealCustomizationPage is in root components folder)
import MealCustomizationPage from "../MealCustomizationPage";

// Hooks
import { useMealPlan } from "../../hooks/useMealPlan";
import { useModals } from "../../hooks/useModals";
import { useRestaurants } from "../../hooks/useRestaurants";
import { useGrocery } from "../../hooks/useGrocery";
import InsightsCard from "../nutrition/InsightsCard";

const MealPlanDashboard = ({
  user,
  onLogout,
  onNavigateToSettings,
  onNavigateToMealJournal,
  onNavigateToCustomization
}, ref) => {
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
    refetchMeals,
    refetchMealsWithNewPreferences
  } = useMealPlan(user, onLogout);

  useImperativeHandle(ref, () => ({
    refetchMealsWithNewPreferences
  }));
  
  const {
    selectedMeal,
    selectedDay,
    selectedMealType,
    selectedRecipe,
    showRecipeCard,
    showGroceryModal,
    showRestaurantModal,
    openMealDetail,
    openRecipeCard,
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

              <InsightsCard/>

              <TodaysMealPlan 
                currentMeals={currentMeals}
                onMealClick={openMealDetail}
                onRecipeClick={openRecipeCard} 
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
          onViewRecipe={(meal) => {               // 🔥 ADD THIS
            closeMealDetail();                     // Close meal detail
            openRecipeCard(meal);                  // Open recipe card
          }}
        />
      )}

      {showRestaurantModal && (
        <RestaurantModal
          restaurants={restaurants}
          userLocation={userLocation}
          onClose={() => {
            console.log('🔒 Closing restaurant modal');
            setShowRestaurantModal(false);
          }}
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