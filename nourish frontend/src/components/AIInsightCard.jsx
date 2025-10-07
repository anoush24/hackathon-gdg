import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";

const AIInsightCard = ({ user, nutritionStats, onNavigateToMealJournal }) => {
  return (
    <Card className="p-6 bg-white border-2 border-primary text-foreground shadow-md mb-8">
      <div className="flex items-start gap-4">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Sparkles className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-2 text-primary">Nourish AI Insight</h3>
          <p className="text-gray-600 mb-4">
            Hey {user?.name || "Chef"}! You've been loving{" "}
            {user?.preferences?.cuisines?.[0] || "Mediterranean"} flavors
            lately! Your protein intake is perfectly balanced at {nutritionStats.protein}g today. Keep up the great work!
          </p>
          <Button
            onClick={onNavigateToMealJournal}
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            View Full Week Plan
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default AIInsightCard;