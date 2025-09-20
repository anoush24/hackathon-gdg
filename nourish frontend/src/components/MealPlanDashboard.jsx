import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MealCard from "./MealCard";
import { Sparkles, ChefHat, Calendar, ArrowRight } from "lucide-react";
import heroBreakfast from "@/assets/hero-breakfast.jpg";
import mediterraneanLunch from "@/assets/mediterranean-lunch.jpg";
import salmonDinner from "@/assets/salmon-dinner.jpg";

const MealPlanDashboard = () => {
  const [currentDay] = useState("Today");

  const todaysMeals = [
    {
      id: 1,
      title: "Superfood Quinoa Breakfast Bowl",
      image: heroBreakfast,
      category: "Breakfast",
      cookTime: "15 min",
      servings: 1,
      calories: 380,
      isAiGenerated: true,
    },
    {
      id: 2,
      title: "Mediterranean Veggie Power Bowl",
      image: mediterraneanLunch,
      category: "Lunch", 
      cookTime: "25 min",
      servings: 2,
      calories: 420,
      isAiGenerated: true,
    },
    {
      id: 3,
      title: "Herb-Crusted Salmon & Vegetables",
      image: salmonDinner,
      category: "Dinner",
      cookTime: "30 min", 
      servings: 2,
      calories: 485,
      isAiGenerated: true,
    }
  ];

  const nutritionStats = {
    calories: 1285,
    protein: 85,
    carbs: 120,
    fat: 45,
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="bg-gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-6 h-6" />
                <span className="text-sm font-medium opacity-90">Nourish AI</span>
              </div>
              <h1 className="heading-hero text-primary-foreground">Your Daily Dish</h1>
              <p className="text-lg opacity-90 mt-2">Personalized meals crafted just for you</p>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-90">Today</div>
              <div className="text-2xl font-bold">{new Date().toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Nutritional Snapshot */}
        <Card className="mb-8 p-6 shadow-card border-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">Today's Nutrition</h2>
            <Badge className="bg-primary/10 text-primary border-primary/20">
              On Track
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{nutritionStats.calories}</div>
              <div className="text-sm text-warm">Calories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">{nutritionStats.protein}g</div>
              <div className="text-sm text-warm">Protein</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">{nutritionStats.carbs}g</div>
              <div className="text-sm text-warm">Carbs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-muted-foreground">{nutritionStats.fat}g</div>
              <div className="text-sm text-warm">Fat</div>
            </div>
          </div>
        </Card>

        {/* Meal Plans */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="heading-section">Today's Meal Plan</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                Next Day
              </Button>
              <Button className="bg-gradient-warm text-accent-foreground border-0" size="sm">
                <ChefHat className="w-4 h-4 mr-2" />
                Customize
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {todaysMeals.map((meal) => (
              <MealCard
                key={meal.id}
                title={meal.title}
                image={meal.image}
                category={meal.category}
                cookTime={meal.cookTime}
                servings={meal.servings}
                calories={meal.calories}
                isAiGenerated={meal.isAiGenerated}
                onClick={() => console.log(`Viewing ${meal.title}`)}
              />
            ))}
          </div>
        </div>

        {/* AI Insights */}
        <Card className="p-6 bg-gradient-primary text-primary-foreground border-0 shadow-glow">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-primary-foreground/10 rounded-lg">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">Nourish AI Insight</h3>
              <p className="opacity-90 mb-4">
                You've been loving Mediterranean flavors lately! Your protein intake is perfectly balanced. 
                How about trying our AI-suggested quinoa tabbouleh for tomorrow's lunch?
              </p>
              <Button 
                variant="secondary" 
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              >
                Explore Suggestion
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MealPlanDashboard;