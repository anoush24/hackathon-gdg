import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  ShoppingCart, 
  ChefHat, 
  Calendar, 
  Loader2 
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
    <div className="flex gap-2">
      <Button
        onClick={onGetGroceryList}
        variant="outline"
        size="sm"
        disabled={isLoadingGrocery}
      >
        {isLoadingGrocery ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <ShoppingCart className="w-4 h-4 mr-2" />
        )}
        Grocery List
      </Button>

      <Button
        onClick={onFindRestaurants}
        variant="outline"
        size="sm"
        disabled={isLoadingRestaurants || !mealPlanContext}
      >
        {isLoadingRestaurants ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <ChefHat className="w-4 h-4 mr-2" />
        )}
        Dine Out
      </Button>

      <Button
        onClick={onNavigateToMealJournal}
        variant="outline"
        size="sm"
      >
        <Calendar className="w-4 h-4 mr-2" />
        View Weekly Plan
      </Button>

      <Button
        onClick={onCustomize}
        className="bg-gradient-warm text-accent-foreground border-0"
        size="sm"
      >
        <ChefHat className="w-4 h-4 mr-2" />
        Customize
      </Button>
    </div>
  );
};

export default MealPlanActions;