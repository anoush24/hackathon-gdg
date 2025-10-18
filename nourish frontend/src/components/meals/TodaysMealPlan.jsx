import React from 'react';
import MealCard from './MealCard';
import MealPlanActions from './MealPlanActions';
import Mealplanbg from '../../assets/mealplanbg.png';

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
    <div className="mb-8 min-h-[650px]">
      <div className="flex items-center justify-between mb-20 relative"
       style={{
                  backgroundImage: `url(${Mealplanbg})`,
                  backgroundRepeat: 'repeat', 
                  opacity: 0.8, 
                  }}>
       <div className="flex-1 flex flex-col items-center justify-center text-center text-green-700">
        {/* flex flex-col items-center justify-center text-center text-green-700 */}
          <h2 className="text-3xl font-bold 
        bg-green-700           
        text-white            
        px-4 py-2             
        rounded-full          
        mb-2                  
        shadow-md">Today's Meal Plan</h2>
          {weekInfo && (
            <p className="text-sm text-gray-500">
              Week {weekInfo.weekOfMonth} of {new Date(weekInfo.startDate).toLocaleDateString('en-US', { month: 'long' })} • {weekInfo.optionName}
            </p>

          )}
        </div>
        <div className="absolute right-0 top-10 z-20">
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
      </div>

      <div className="grid md:grid-cols-3 gap-6 min-h-[550px] ">
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