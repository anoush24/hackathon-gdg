import React from 'react';
import MealCard from './MealCard';
import MealPlanActions from './MealPlanActions';

const TodaysMealPlan = ({ 
  currentMeals, 
  onMealClick, 
  onToggleMealComplete,
  onGetGroceryList,
  onFindRestaurants,
  onNavigateToMealJournal,
  onCustomize,
  isLoadingGrocery,
  isLoadingRestaurants,
  mealPlanContext
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="heading-section">Today's Meal Plan</h2>
        <MealPlanActions
          onGetGroceryList={onGetGroceryList}
          onFindRestaurants={onFindRestaurants}
          onNavigateToMealJournal={onNavigateToMealJournal}
          onCustomize={onCustomize}
          isLoadingGrocery={isLoadingGrocery}
          isLoadingRestaurants={isLoadingRestaurants}
          mealPlanContext={mealPlanContext}
        />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {currentMeals.map((meal) => (
          <MealCard
            key={meal.id}
            title={meal.title}
            image={meal.image}
            category={meal.category}
            cookTime={meal.cookTime}
            servings={meal.servings}
            calories={meal.calories}
            isAiGenerated={meal.isAiGenerated}
            onClick={() => onMealClick(meal)}
            onRecipeClick={() => onMealClick(meal)}
            isCompleted={meal.isCompleted}
            onToggleComplete={() => onToggleMealComplete(meal.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default TodaysMealPlan;