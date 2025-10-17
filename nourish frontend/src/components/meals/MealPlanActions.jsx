import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  ShoppingCart, 
  ChefHat, 
  Calendar, 
  Loader2,
  Sparkles
} from "lucide-react";

const MealPlanActions = ({
  onGetGroceryList,
  onFindRestaurants,
  onNavigateToMealJournal,
  onCustomize,
  isLoadingGrocery,
  isLoadingRestaurants,
  mealPlanContext
}) => {
  return (
    <div className="flex flex-wrap gap-4 justify-center lg:justify-end">
      {/* Grocery List - Main Feature */}
      <Button
        onClick={onGetGroceryList}
        variant="default"
        size="lg"
        disabled={isLoadingGrocery}
        className="h-16 px-8 bg-gradient-primary text-primary-foreground shadow-warm hover:shadow-glow transition-all duration-300 transform hover:scale-105 border-0 min-w-[200px] font-medium"
      >
        {isLoadingGrocery ? (
          <>
            <Loader2 className="w-6 h-6 mr-3 animate-spin" />
            <div className="text-left">
              <div className="text-lg font-bold">Generating...</div>
              <div className="text-sm opacity-90 font-medium">Smart Grocery List</div>
            </div>
          </>
        ) : (
          <>
            <ShoppingCart className="w-6 h-6 mr-3" />
            <div className="text-left">
              <div className="text-lg font-bold">Smart Grocery List</div>
              <div className="text-sm opacity-90 font-medium">AI-powered shopping</div>
            </div>
          </>
        )}
      </Button>

      {/* Dine Out - Secondary Feature */}
      <Button
        onClick={onFindRestaurants}
        variant="outline"
        size="lg"
        disabled={isLoadingRestaurants || !mealPlanContext}
        className="h-16 px-8 bg-gradient-primary text-primary-foreground shadow-warm hover:shadow-glow transition-all duration-300 transform hover:scale-105 border-0 min-w-[180px] font-medium"
      >
        {isLoadingRestaurants ? (
          <>
            <Loader2 className="w-6 h-6 mr-3 animate-spin" />
            <div className="text-left">
              <div className="text-lg font-bold">Finding...</div>
              <div className="text-sm opacity-90 font-medium">Nearby restaurants</div>
            </div>
          </>
        ) : (
          <>
            <ChefHat className="w-6 h-6 mr-3" />
            <div className="text-left">
              <div className="text-lg font-bold">Dine Out</div>
              <div className="text-sm opacity-90 font-medium">Find restaurants</div>
            </div>
          </>
        )}
      </Button>

      {/* View Weekly Plan - Secondary Feature */}
      <Button
        onClick={onNavigateToMealJournal}
        variant="outline"
        size="lg"
        className="h-16 px-8 bg-gradient-primary text-primary-foreground shadow-warm hover:shadow-glow transition-all duration-300 transform hover:scale-105 border-0 min-w-[180px] font-medium"
      >
        <Calendar className="w-6 h-6 mr-3" />
        <div className="text-left">
          <div className="text-lg font-bold">Weekly Plan</div>
          <div className="text-sm opacity-90 font-medium">View full schedule</div>
        </div>
      </Button>

      {/* Customize - Tertiary Feature */}
      {/* <Button
        onClick={onCustomize}
        variant="ghost"
        size="lg"
        className="h-16 px-8 bg-gradient-primary text-primary-foreground shadow-warm hover:shadow-glow transition-all duration-300 transform hover:scale-105 border-0 min-w-[160px] font-medium"
      >
        <Sparkles className="w-6 h-6 mr-3" />
        <div className="text-left">
          <div className="text-lg font-bold">Customize</div>
          <div className="text-sm opacity-90 font-medium">Personalize meals</div>
        </div>
      </Button> */}
    </div>
  );
};

export default MealPlanActions;