import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, ChefHat } from "lucide-react";

const ErrorState = ({ error, onRetry, onGeneratePlan }) => {
  if (error === "noplan") {
    return (
      <Card className="p-8 text-center border-2 border-dashed border-gray-300">
        <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Meal Plan Found</h3>
        <p className="text-gray-600 mb-4">
          You don't have a meal plan for this week yet. Generate one to get started!
        </p>
        <Button onClick={onGeneratePlan} className="bg-primary">
          <ChefHat className="w-4 h-4 mr-2" />
          Generate Weekly Meal Plan
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-8 text-center border-2 border-red-200 bg-red-50">
      <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-red-700 mb-2">Error Loading Meals</h3>
      <p className="text-gray-600 mb-4">{error}</p>
      <Button onClick={onRetry} variant="outline">
        Try Again
      </Button>
    </Card>
  );
};

export default ErrorState;