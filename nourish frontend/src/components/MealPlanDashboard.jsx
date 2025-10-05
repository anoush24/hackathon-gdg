import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MealCard from "./MealCard";
import MealCustomizationPage from "./MealCustomizationPage"; // Assuming this is a valid component
import RecipeCard from "./RecipeCard"; // Assuming this is a valid component
import GroceryList from "@/pages/GroceryList"; // Assuming this is a valid component
import {
  Sparkles,
  ChefHat,
  Calendar,
  ArrowRight,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Edit,
  Bell,
  DollarSign,
  MapPin,
  Plus,
  Clock,
  Trash2,
  Save,
  RefreshCw,
} from "lucide-react";
import heroBreakfast from "@/assets/hero-breakfast.png";
import mediterraneanLunch from "@/assets/velvetpaneer-lunch.png";
import salmonDinner from "@/assets/littichokha.png";

// Sample Data - This will be replaced by your backend API calls
const sampleMeals = [
  {
    id: 1,
    title: "Veggie Oats Upma",
    image: heroBreakfast,
    category: "Breakfast",
    cookTime: "15 min",
    servings: 1,
    calories: 380,
    isAiGenerated: true,
    prepTime: "10 min",
    difficulty: "Easy",
    description: "A nutritious and energizing start to your day with superfoods and fresh ingredients.",
    ingredients: [
      { id: "1", name: "Quinoa", amount: "1/2 cup", selected: true, category: "Pantry" },
      { id: "2", name: "Blueberries", amount: "1/2 cup", selected: true, category: "Produce" },
      { id: "3", name: "Almond milk", amount: "1 cup", selected: true, category: "Dairy" },
      { id: "4", name: "Chia seeds", amount: "1 tbsp", selected: true, category: "Pantry" },
      { id: "5", name: "Honey", amount: "1 tbsp", selected: true, category: "Pantry" }
    ],
    instructions: [
      "Cook quinoa according to package directions.",
      "Let quinoa cool slightly.",
      "Mix with almond milk and honey.",
      "Top with blueberries and chia seeds.",
      "Serve immediately."
    ]
  },
  {
    id: 2,
    title: "Velvet Paneer Wraps with Dahi",
    image: mediterraneanLunch,
    category: "Lunch",
    cookTime: "25 min",
    servings: 2,
    calories: 420,
    isAiGenerated: true,
    prepTime: "15 min",
    difficulty: "Medium",
    description: "A vibrant Mediterranean-inspired bowl packed with fresh vegetables and healthy fats.",
    ingredients: [
      { id: "6", name: "Chickpeas", amount: "1 can", selected: true, category: "Pantry" },
      { id: "7", name: "Cherry tomatoes", amount: "1 cup", selected: true, category: "Produce" },
      { id: "8", name: "Cucumber", amount: "1 medium", selected: true, category: "Produce" },
      { id: "9", name: "Feta cheese", amount: "1/2 cup", selected: true, category: "Dairy" },
      { id: "10", name: "Olive oil", amount: "3 tbsp", selected: true, category: "Pantry" }
    ],
    instructions: [
      "Drain and rinse chickpeas.",
      "Dice cucumber and halve tomatoes.",
      "Combine all vegetables in a bowl.",
      "Crumble feta on top.",
      "Drizzle with olive oil and serve."
    ]
  },
  {
    id: 3,
    title: "Rustic Sattu-Stuffed Wheat Balls with Spiced Mash",
    image: salmonDinner,
    category: "Dinner",
    cookTime: "30 min",
    servings: 2,
    calories: 485,
    isAiGenerated: true,
    prepTime: "15 min",
    difficulty: "Medium",
    description: "Perfectly seasoned salmon with a fresh herb crust and roasted seasonal vegetables.",
    ingredients: [
      { id: "11", name: "Salmon fillets", amount: "2 (6 oz each)", selected: true, category: "Seafood" },
      { id: "12", name: "Fresh herbs", amount: "1/4 cup", selected: true, category: "Produce" },
      { id: "13", name: "Asparagus", amount: "1 lb", selected: true, category: "Produce" },
      { id: "14", name: "Olive oil", amount: "2 tbsp", selected: true, category: "Pantry" },
      { id: "15", name: "Garlic", amount: "3 cloves", selected: true, category: "Produce" }
    ],
    instructions: [
      "Preheat oven to 400°F.",
      "Mix herbs with minced garlic and olive oil.",
      "Coat salmon with herb mixture.",
      "Roast salmon and asparagus for 15-20 minutes.",
      "Serve immediately."
    ]
  },
];

const MealPlanDashboard = ({
  user,
  onLogout,
  onNavigateToSettings,
  onNavigateToMealJournal,
  onNavigateToCustomization,
}) => {
  const [currentDay] = useState("Today");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [currentMeals, setCurrentMeals] = useState(sampleMeals);

  // States from the first version of the component
  const [showCustomization, setShowCustomization] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showRecipeCard, setShowRecipeCard] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [groceryIngredients, setGroceryIngredients] = useState([]);

  const nutritionStats = {
    calories: 1285,
    protein: 85,
    carbs: 120,
    fat: 45,
  };

  // Handlers for the first version's logic
  const handleRecipeClick = (meal) => {
    setSelectedRecipe(meal);
    setShowRecipeCard(true);
  };

  const handleGenerateGroceryList = (ingredients) => {
    setGroceryIngredients(ingredients);
    setCurrentView('grocery');
    setShowRecipeCard(false);
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setShowRecipeCard(false);
    setSelectedRecipe(null);
    setGroceryIngredients([]);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleProfileClick = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const handleMealJournal = () => {
    setShowProfileDropdown(false);
    onNavigateToMealJournal();
  };

  const handleSettings = () => {
    setShowProfileDropdown(false);
    onNavigateToSettings();
  };

  const handleLogout = () => {
    setShowProfileDropdown(false);
    onLogout();
  };

  const handleCustomize = () => {
    console.log('🎨 Opening meal customization');
    onNavigateToCustomization();
  };

  if (showCustomization) {
    return (
      <MealCustomizationPage
        onBack={() => setShowCustomization(false)}
        onSave={(meals) => {
          console.log('Saved meals:', meals);
          setShowCustomization(false);
        }}
      />
    );
  }

  if (currentView === 'grocery') {
    return (
      <GroceryList
        ingredients={groceryIngredients}
        onBack={handleBackToDashboard}
      />
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
                <span className="text-sm font-medium opacity-90">
                  Nourish AI
                </span>
              </div>
              <h1 className="heading-hero text-primary-foreground">
                Your Daily Dish
              </h1>
              <p className="text-lg opacity-90 mt-2">
                Personalized meals crafted just for you
              </p>
            </div>

            {/* Right Side - Date + Profile */}
            <div className="flex items-center gap-6">
              {/* Date Display */}
              <div className="text-right">
                <div className="text-sm opacity-90">Today</div>
                <div className="text-2xl font-bold">
                  {new Date().toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>

              {/* Quick Info (Hidden on mobile) */}
              <div className="hidden md:flex flex-col items-center gap-1 text-sm opacity-90 border-l border-primary-foreground/20 pl-4">
                <div className="flex items-center gap-1">
                  <span>₹{user?.budget || 75}/week</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{user?.location?.city || "City"}</span>
                </div>
              </div>

              {/* Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <Button
                  onClick={handleProfileClick}
                  variant="ghost"
                  className="flex items-center gap-2 hover:bg-primary-foreground/10 text-primary-foreground"
                >
                  <div className="w-10 h-10 bg-primary-foreground/20 rounded-full flex items-center justify-center text-primary-foreground font-medium border-2 border-primary-foreground/30">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium">
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs opacity-75">
                      {user?.email || "user@example.com"}
                    </p>
                  </div>
                  <ChevronDown className="w-4 h-4 opacity-75" />
                </Button>

                {/* Dropdown Menu */}
                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-medium">
                          {user?.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {user?.name || "User"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {user?.email || "user@example.com"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="text-center">
                          <p className="font-semibold text-primary">
                            ₹{user?.budget || 200}
                          </p>
                          <p className="text-xs text-gray-500">Weekly Budget</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-green-600">
                            {user?.preferences?.cuisines?.length || 0}
                          </p>
                          <p className="text-xs text-gray-500">Cuisines</p>
                        </div>
                      </div>

                      {/* Favorite Cuisines - This was commented out in the original code */}
                      {/* {user?.preferences?.cuisines &&
                          user.preferences.cuisines.length > 0 && (
                            <div className="mt-3">
                              <p className="text-xs text-gray-500 mb-1">
                                Favorite Cuisines:
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {user.preferences.cuisines
                                  .slice(0, 3)
                                  .map((cuisine) => (
                                    <Badge
                                      key={cuisine}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {cuisine}
                                    </Badge>
                                  ))}
                                {user.preferences.cuisines.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{user.preferences.cuisines.length - 3}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )} */}
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <button
                        onClick={handleMealJournal}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        Meal Journal
                      </button>
                      <button
                        onClick={handleSettings}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        Settings & Preferences
                      </button>
                      <div className="border-t border-gray-100 my-2"></div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
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
        {/* Welcome Message */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Good
            {new Date().getHours() < 12
              ? " Morning"
              : new Date().getHours() < 17
                ? " Afternoon"
                : " Evening"}
            , {user?.name || "Chef"}! 👋
          </h2>
          <p className="text-gray-600">
            Ready to nourish your body with today's personalized meal plan?
          </p>
        </div>

        {/* Nutritional Snapshot */}
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
                {nutritionStats.calories}
              </div>
              <div className="text-sm text-warm">Calories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">
                {nutritionStats.protein}g
              </div>
              <div className="text-sm text-warm">Protein</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">
                {nutritionStats.carbs}g
              </div>
              <div className="text-sm text-warm">Carbs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-muted-foreground">
                {nutritionStats.fat}g
              </div>
              <div className="text-sm text-warm">Fat</div>
            </div>
          </div>
        </Card>
        {/* AI Insights */}
        <Card className="p-6 bg-white border-2 border-primary text-foreground shadow-md mb-8">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2 text-primary">Nourish AI Insight</h3>
              <p className="text-gray-600 mb-4">
                Hey {user?.name || "Chef"}! You've been loving
                {user?.preferences?.cuisines?.[0] || " Mediterranean"} flavors
                lately! Your protein intake is perfectly balanced. How about
                trying our AI-suggested quinoa pulao for tomorrow's lunch?
              </p>
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                Explore Suggestion
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Meal Plans - Updated with working customize button */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="heading-section">Today's Meal Plan</h2>
            <div className="flex gap-2">
              <Button
                onClick={() => handleBackToDashboard}
                variant="outline"
                size="sm"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Next Day
              </Button>
              <Button
                onClick={handleCustomize}
                className="bg-gradient-warm text-accent-foreground border-0"
                size="sm"
              >
                <ChefHat className="w-4 h-4 mr-2" />
                Customize
              </Button>
            </div>
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
                onClick={() => console.log(`Viewing ${meal.title}`)}
                onRecipeClick={() => handleRecipeClick(meal)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Recipe Card Modal */}
      {selectedRecipe && (
        <RecipeCard
          isOpen={showRecipeCard}
          onClose={() => setShowRecipeCard(false)}
          onGenerateGroceryList={handleGenerateGroceryList}
          recipe={selectedRecipe}
        />
      )}
    </div>
  );
};

export default MealPlanDashboard;