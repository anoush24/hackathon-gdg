import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const NutritionSnapshot = ({ consumedNutrition, nutritionStats }) => {
  return (
    <Card className="mb-8 p-6 shadow-card border-0">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground">
          Today's Nutrition
        </h2>
        <Badge className="bg-primary/10 text-primary border-primary/20">
          On Track
        </Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">
            {Math.round(consumedNutrition.calories)}g
            <span className="text-lg text-gray-400 font-normal"> / {nutritionStats.calories}g</span>
          </div>
          <div className="text-sm text-warm">Calories</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-secondary">
            {Math.round(consumedNutrition.protein)}g
            <span className="text-lg text-gray-400 font-normal"> / {nutritionStats.protein}g</span>
          </div>
          <div className="text-sm text-warm">Protein</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-accent">
            {Math.round(consumedNutrition.carbs)}g
            <span className="text-lg text-gray-400 font-normal"> / {nutritionStats.carbs}g</span>
          </div>
          <div className="text-sm text-warm">Carbs</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-muted-foreground">
             {Math.round(consumedNutrition.fat)}g
            <span className="text-lg text-gray-400 font-normal"> / {nutritionStats.fat}g</span>
          </div>
          <div className="text-sm text-warm">Fat</div>
        </div>
      </div>
    </Card>
  );
};

export default NutritionSnapshot;