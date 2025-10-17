import React from 'react';
import MealCard from './MealCard';
import MealPlanActions from './MealPlanActions';

const TodaysMealPlan = ({
  currentMeals,
  onMealClick,
  onRecipeClick,
  onToggleMealComplete,
  onGetGroceryList,
  onFindRestaurants,
  onNavigateToMealJournal,
  onCustomize,
  isLoadingGrocery,
  isLoadingRestaurants,
  mealPlanContext,
  weekInfo
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex-col items-center justify-between mb-6">
          <h2 className="text-3xl font-semibold">Today's Meal Plan</h2>
          {weekInfo && (
            <p className="text-sm text-gray-500">
              Week {weekInfo.weekOfMonth} of {new Date(weekInfo.startDate).toLocaleDateString('en-US', { month: 'long' })} • {weekInfo.optionName}
            </p>

          )}
        </div>
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
            isCompleted={meal.isCompleted}
            onClick={() => onMealClick(meal, meal.type, 'Today')}    // 🔥 Opens MealDetailModal
            onRecipeClick={() => onRecipeClick(meal)}                // 🔥 Opens RecipeCard
            onToggleComplete={() => onToggleMealComplete(meal.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default TodaysMealPlan;