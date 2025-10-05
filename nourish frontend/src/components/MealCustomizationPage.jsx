import React, { useState, useRef, useEffect } from "react";
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  ChefHat,
  Calendar,
  ArrowRight,
  Settings,
  LogOut,
  ChevronDown,
  Edit,
  MapPin,
  Loader2,
  X,
  ShoppingCart,
  Clock,
  Users
} from "lucide-react";

// --- Helper Component: MealCard ---
// This replaces the import for "./MealCard"
const MealCard = ({ title, image, category, cookTime, servings, calories, isAiGenerated, onRecipeClick }) => {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group">
      <div className="relative">
        <img src={image} alt={title} className="w-full h-48 object-cover" />
        {isAiGenerated && (
          <Badge className="absolute top-2 right-2 bg-gradient-primary text-primary-foreground border-0 gap-1">
            <Sparkles className="h-3 w-3" /> AI
          </Badge>
        )}
      </div>
      <div className="p-4">
        <Badge variant="secondary" className="mb-2">{category}</Badge>
        <h3 className="font-bold text-lg text-foreground truncate">{title}</h3>
        <div className="text-sm text-warm mt-2 flex justify-between items-center">
          <div className="flex items-center gap-1"><Clock className="w-4 h-4" /> {cookTime}</div>
          <div className="flex items-center gap-1"><Users className="w-4 h-4" /> {servings} servings</div>
          <span className="font-semibold">{calories} kcal</span>
        </div>
        <Button onClick={onRecipeClick} variant="outline" className="w-full mt-4">
          View Recipe
        </Button>
      </div>
    </Card>
  );
};

// --- Helper Component: RecipeCard (Modal) ---
// This replaces the import for "./RecipeCard"
const RecipeCard = ({ isOpen, onClose, recipe, onGenerateGroceryList }) => {
  if (!isOpen || !recipe) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-2xl font-bold text-primary">{recipe.title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-6 h-6" />
          </Button>
        </div>
        <div className="overflow-y-auto p-6 space-y-6">
          <img src={recipe.image || 'https://placehold.co/600x400'} alt={recipe.title} className="w-full h-64 object-cover rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Ingredients</h3>
              <ul className="space-y-1 list-disc list-inside text-gray-700">
                {recipe.ingredients?.map((ing, i) => <li key={i}>{ing.amount} {ing.name}</li>) || <li>Not available</li>}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Instructions</h3>
              <ol className="space-y-2 list-decimal list-inside text-gray-700">
                {recipe.instructions?.map((step, i) => <li key={i}>{step}</li>) || <li>Not available</li>}
              </ol>
            </div>
          </div>
        </div>
        <div className="p-4 border-t mt-auto bg-gray-50">
          <Button onClick={() => onGenerateGroceryList(recipe.ingredients)} className="w-full bg-gradient-primary">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Generate Grocery List
          </Button>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---
const MealPlanDashboard = ({
  user,
  onLogout,
  onNavigateToSettings,
  onNavigateToMealJournal,
  onNavigateToCustomization,
}) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);
  
  const [currentMeals, setCurrentMeals] = useState(null);
  const [fullMealPlan, setFullMealPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showRecipeCard, setShowRecipeCard] = useState(false);

  useEffect(() => {
    const fetchMealPlan = async () => {
      if (!user?.preferences) {
        setError("User profile is not available to generate a meal plan.");
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const response = await axios.post('/api/meal-plans/generate-from-agent', {
          name: user.name,
          preferences: user.preferences,
        });
        const mealOptions = response.data?.data?.meal_plans?.options;

        if (!mealOptions || mealOptions.length === 0) {
          throw new Error("No meal plans returned from the AI.");
        }
        
        const plan = mealOptions[0];
        setFullMealPlan(plan);

        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        const todayMealsData = plan[today] || plan.Monday; // Fallback to Monday

        if (todayMealsData) {
          setCurrentMeals([todayMealsData.breakfast, todayMealsData.lunch, todayMealsData.dinner].filter(Boolean));
        } else {
          throw new Error("Could not find meal data for today or Monday.");
        }

      } catch (err) {
        console.error("Error fetching meal plan:", err);
        setError(err.message || "Failed to fetch meal plan.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMealPlan();
  }, [user]);

  const nutritionStats = currentMeals ? {
      calories: currentMeals.reduce((sum, meal) => sum + (meal?.calories || 0), 0),
      protein: currentMeals.reduce((sum, meal) => sum + (meal?.protein || 0), 0),
      carbs: currentMeals.reduce((sum, meal) => sum + (meal?.carbs || 0), 0),
      fat: currentMeals.reduce((sum, meal) => sum + (meal?.fat || 0), 0),
    } : { calories: 0, protein: 0, carbs: 0, fat: 0 };

  const handleRecipeClick = (meal) => {
    setSelectedRecipe(meal);
    setShowRecipeCard(true);
  };
  
  const handleGenerateGroceryList = (ingredients) => {
    // This logic would navigate to a grocery list page
    console.log("Generating grocery list with:", ingredients);
    setShowRecipeCard(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCustomize = () => {
    onNavigateToCustomization();
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <h2 className="text-xl font-semibold text-foreground">Generating Your AI Meal Plan...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-xl font-semibold text-red-600 mb-2">Could Not Generate Plan</h2>
        <p className="text-warm bg-red-100 p-4 rounded-md">{error}</p>
      </div>
    );
  }
  
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
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-sm opacity-90">Today</div>
                <div className="text-2xl font-bold">{new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
              </div>
              <div className="relative" ref={dropdownRef}>
                <Button onClick={() => setShowProfileDropdown(!showProfileDropdown)} variant="ghost" className="flex items-center gap-2 hover:bg-primary-foreground/10 text-primary-foreground">
                  <div className="w-10 h-10 bg-primary-foreground/20 rounded-full flex items-center justify-center font-medium border-2 border-primary-foreground/30">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <ChevronDown className="w-4 h-4 opacity-75" />
                </Button>
                {showProfileDropdown && (
                   <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border z-50">
                     <div className="p-2">
                       <button onClick={() => { onNavigateToMealJournal(); setShowProfileDropdown(false); }} className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                         <Edit className="w-4 h-4" /> Meal Journal
                       </button>
                       <button onClick={() => { onNavigateToSettings(); setShowProfileDropdown(false); }} className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                         <Settings className="w-4 h-4" /> Settings
                       </button>
                       <div className="border-t my-1"></div>
                       <button onClick={onLogout} className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md">
                         <LogOut className="w-4 h-4" /> Sign Out
                       </button>
                     </div>
                   </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8 p-6 shadow-card border-0">
          <h2 className="text-xl font-semibold text-foreground mb-4">Today's Nutrition</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center"><div className="text-2xl font-bold text-primary">{nutritionStats.calories}</div><div className="text-sm text-warm">Calories</div></div>
            <div className="text-center"><div className="text-2xl font-bold text-secondary">{nutritionStats.protein}g</div><div className="text-sm text-warm">Protein</div></div>
            <div className="text-center"><div className="text-2xl font-bold text-accent">{nutritionStats.carbs}g</div><div className="text-sm text-warm">Carbs</div></div>
            <div className="text-center"><div className="text-2xl font-bold text-muted-foreground">{nutritionStats.fat}g</div><div className="text-sm text-warm">Fat</div></div>
          </div>
        </Card>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="heading-section">Today's Meal Plan</h2>
            <Button onClick={handleCustomize} className="bg-gradient-warm text-accent-foreground border-0" size="sm">
              <ChefHat className="w-4 h-4 mr-2" /> Customize
            </Button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {currentMeals && currentMeals.map((meal, index) => (
              <MealCard
                key={index}
                title={meal.title}
                image={meal.image || `https://placehold.co/400x300/f5f5f5/333?text=${encodeURIComponent(meal.title)}`}
                category={meal.category}
                cookTime={meal.cookTime}
                servings={meal.servings}
                calories={meal.calories}
                isAiGenerated={true}
                onRecipeClick={() => handleRecipeClick(meal)}
              />
            ))}
          </div>
        </div>
      </div>

      <RecipeCard
        isOpen={showRecipeCard}
        onClose={() => setShowRecipeCard(false)}
        onGenerateGroceryList={handleGenerateGroceryList}
        recipe={selectedRecipe}
      />
    </div>
  );
};

export default MealPlanDashboard;

