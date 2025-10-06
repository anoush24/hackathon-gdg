import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MealCard from "./MealCard";
import MealCustomizationPage from "./MealCustomizationPage";
import RecipeCard from "./RecipeCard";
import GroceryList from "@/pages/GroceryList";
import MealDetailModal from "./MealDetailModal";
import GroceryListModal from "./GroceryListModal";
import RestaurantModal from './RestaurantModal';

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
  AlertCircle,
  ShoppingCart
} from "lucide-react";
import heroBreakfast from "@/assets/hero-breakfast.png";

const MealPlanDashboard = ({
  user,
  onLogout,
  onNavigateToSettings,
  onNavigateToMealJournal,
  onNavigateToCustomization,
}) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Meals state - now fetched from backend
  const [currentMeals, setCurrentMeals] = useState([]);
  const [isLoadingMeals, setIsLoadingMeals] = useState(true);
  const [mealsError, setMealsError] = useState(null);
  const [nutritionStats, setNutritionStats] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });
  const [weekInfo, setWeekInfo] = useState(null);

  // Modal states
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedMealType, setSelectedMealType] = useState(null);

  // Other states
  const [showCustomization, setShowCustomization] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showRecipeCard, setShowRecipeCard] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [groceryIngredients, setGroceryIngredients] = useState([]);

  const [showGroceryModal, setShowGroceryModal] = useState(false);
  const [groceryData, setGroceryData] = useState(null);
  const [isLoadingGrocery, setIsLoadingGrocery] = useState(false);

  const [showRestaurantModal, setShowRestaurantModal] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [isLoadingRestaurants, setIsLoadingRestaurants] = useState(false);
  
  const [mealPlanContext, setMealPlanContext] = useState(null);


  // Fetch today's meals from backend
  useEffect(() => {
    const fetchTodaysMeals = async () => {
      try {
        setIsLoadingMeals(true);
        setMealsError(null);

        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error("Authentication token not found");
        }

        const config = {
          headers: {
            'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        };

        console.log('📤 Fetching today\'s meals...');

        const response = await axios.get(
          "http://localhost:5000/api/meal-plans/today",
          config
        );

        console.log('✅ Today\'s meals response:', response.data);
        setMealPlanContext(response.data.data);

        if (response.data.success) {
          const { meals, nutritionStats: stats, weekInfo: info } = response.data.data;

          // Transform meals to match MealCard format
          const transformedMeals = [];

          if (meals.breakfast) {
            transformedMeals.push({
              id: 'breakfast',
              title: meals.breakfast.name,
              image: meals.breakfast.image_url || heroBreakfast,
              category: "Breakfast",
              cookTime: meals.breakfast.cookTime || "20 min",
              servings: 1,
              calories: meals.breakfast.calories,
              isAiGenerated: true,
              prepTime: "10 min",
              difficulty: "Easy",
              description: `Start your day with ${meals.breakfast.name}`,
              ingredients: meals.breakfast.ingredients?.map((ing, idx) => ({
                id: `b-${idx}`,
                name: ing,
                amount: "",
                selected: true,
                category: "Pantry"
              })) || [],
              instructions: [],
              protein: meals.breakfast.protein,
              carbs: meals.breakfast.carbs,
              fat: meals.breakfast.fat,
              youtube_link: meals.breakfast.youtube_link,
              _rawData: meals.breakfast
            });
          }

          if (meals.lunch) {
            transformedMeals.push({
              id: 'lunch',
              title: meals.lunch.name,
              image: meals.lunch.image_url || heroBreakfast,
              category: "Lunch",
              cookTime: meals.lunch.cookTime || "30 min",
              servings: 2,
              calories: meals.lunch.calories,
              isAiGenerated: true,
              prepTime: "15 min",
              difficulty: "Medium",
              description: `Enjoy ${meals.lunch.name} for lunch`,
              ingredients: meals.lunch.ingredients?.map((ing, idx) => ({
                id: `l-${idx}`,
                name: ing,
                amount: "",
                selected: true,
                category: "Pantry"
              })) || [],
              instructions: [],
              protein: meals.lunch.protein,
              carbs: meals.lunch.carbs,
              fat: meals.lunch.fat,
              youtube_link: meals.lunch.youtube_link,
              _rawData: meals.lunch
            });
          }

          if (meals.dinner) {
            transformedMeals.push({
              id: 'dinner',
              title: meals.dinner.name,
              image: meals.dinner.image_url || heroBreakfast,
              category: "Dinner",
              cookTime: meals.dinner.cookTime || "35 min",
              servings: 2,
              calories: meals.dinner.calories,
              isAiGenerated: true,
              prepTime: "15 min",
              difficulty: "Medium",
              description: `Savor ${meals.dinner.name} for dinner`,
              ingredients: meals.dinner.ingredients?.map((ing, idx) => ({
                id: `d-${idx}`,
                name: ing,
                amount: "",
                selected: true,
                category: "Pantry"
              })) || [],
              instructions: [],
              protein: meals.dinner.protein,
              carbs: meals.dinner.carbs,
              fat: meals.dinner.fat,
              youtube_link: meals.dinner.youtube_link,
              _rawData: meals.dinner
            });
          }

          setCurrentMeals(transformedMeals);
          setNutritionStats(stats);
          setWeekInfo(info);
        }
      } catch (err) {
        console.error("❌ Error fetching today's meals:", err);

        if (err.response?.status === 404 && err.response?.data?.needsGeneration) {
          setMealsError("noplan");
        } else if (err.response?.status === 401) {
          localStorage.removeItem('token');
          onLogout?.();
        } else {
          setMealsError(err.response?.data?.message || err.message || "Failed to load meals");
        }
      } finally {
        setIsLoadingMeals(false);
      }
    };

    if (user) {
      fetchTodaysMeals();
    }
  }, [user, onLogout]);

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

  const handleRecipeClick = (meal) => {
    // Use raw data if available for modal
    if (meal._rawData) {
      setSelectedMeal(meal._rawData);
      setSelectedDay(new Date().toLocaleDateString('en-US', { weekday: 'long' }));
      setSelectedMealType(meal.category);
    } else {
      setSelectedRecipe(meal);
      setShowRecipeCard(true);
    }
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

  const closeModal = () => {
    setSelectedMeal(null);
    setSelectedDay(null);
    setSelectedMealType(null);
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

  // Add this function to fetch grocery list
const handleGetGroceryList = async () => {
  try {
    setIsLoadingGrocery(true);

    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const config = {
      headers: {
        'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    console.log('🛒 Fetching grocery list...');

    const response = await axios.get(
      "http://localhost:5000/api/meal-plans/today/grocery",
      config
    );

    console.log('✅ Grocery list response:', response.data);

    if (response.data.success) {
      setGroceryData(response.data.data);
      setShowGroceryModal(true);
    }
  } catch (err) {
    console.error("❌ Error fetching grocery list:", err);
    alert(err.response?.data?.message || "Failed to load grocery list");
  } finally {
    setIsLoadingGrocery(false);
  }
};

 const handleFindRestaurants = () => {
  if (!mealPlanContext) {
    alert("Please generate a meal plan first.");
    return;
  }

  setIsLoadingRestaurants(true);

  // Get user's location from the browser
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      const requestBody = {
        context: mealPlanContext, // Use the saved context
        location: location,
        cuisines: user?.preferences?.cuisines || [],
      };

      try {
        const response = await axios.post(
          "http://localhost:8000/restaurants", // Your FastAPI endpoint
          requestBody
        );
        setRestaurants(response.data.restaurants || []);
        setShowRestaurantModal(true);
      } catch (err) {
        console.error("❌ Error fetching restaurants:", err);
        alert("Could not fetch restaurant recommendations.");
      } finally {
        setIsLoadingRestaurants(false);
      }
    },
    (error) => {
      // Handle errors if user denies location access
      console.error("Geolocation error:", error);
      alert("Could not get your location. Please enable location services.");
      setIsLoadingRestaurants(false);
    }
  );
};

  return (
    <>
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

                {/* Quick Info */}
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
                      </div>

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
            {weekInfo && (
              <p className="text-sm text-gray-500 mt-1">
                Week {weekInfo.weekOfMonth} of {new Date(weekInfo.startDate).toLocaleDateString('en-US', { month: 'long' })} • {weekInfo.optionName}
              </p>
            )}
          </div>

          {/* Loading State */}
          {isLoadingMeals && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-gray-600">Loading today's meals...</p>
            </div>
          )}

          {/* Error State - No Plan */}
          {mealsError === "noplan" && !isLoadingMeals && (
            <Card className="p-8 text-center border-2 border-dashed border-gray-300">
              <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Meal Plan Found</h3>
              <p className="text-gray-600 mb-4">
                You don't have a meal plan for this week yet. Generate one to get started!
              </p>
              <Button onClick={handleMealJournal} className="bg-primary">
                <ChefHat className="w-4 h-4 mr-2" />
                Generate Weekly Meal Plan
              </Button>
            </Card>
          )}

          {/* Error State - Other Errors */}
          {mealsError && mealsError !== "noplan" && !isLoadingMeals && (
            <Card className="p-8 text-center border-2 border-red-200 bg-red-50">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-red-700 mb-2">Error Loading Meals</h3>
              <p className="text-gray-600 mb-4">{mealsError}</p>
              <Button onClick={() => window.location.reload()} variant="outline">
                Try Again
              </Button>
            </Card>
          )}

          {/* Nutritional Snapshot */}
          {!isLoadingMeals && !mealsError && currentMeals.length > 0 && (
            <>
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
                      Hey {user?.name || "Chef"}! You've been loving{" "}
                      {user?.preferences?.cuisines?.[0] || "Mediterranean"} flavors
                      lately! Your protein intake is perfectly balanced at {nutritionStats.protein}g today. Keep up the great work!
                    </p>
                    <Button
                      onClick={handleMealJournal}
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      View Full Week Plan
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Meal Plans */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="heading-section">Today's Meal Plan</h2>
                  <div className="flex gap-2">
  <Button
    onClick={handleGetGroceryList}
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
    onClick={handleFindRestaurants}
    variant="outline"
    size="sm"
    disabled={isLoadingRestaurants || !mealPlanContext}
  >
    {isLoadingRestaurants ? (
      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
    ) : (
      <ChefHat className="w-4 h-4 mr-2" /> // Or another icon
    )}
    Dine Out
  </Button>



  <Button
    onClick={handleMealJournal}
    variant="outline"
    size="sm"
  >
    <Calendar className="w-4 h-4 mr-2" />
    View Weekly Plan
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
                      onClick={() => handleRecipeClick(meal)}
                      onRecipeClick={() => handleRecipeClick(meal)}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
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

      {/* Meal Detail Modal */}
      {selectedMeal && (
        <MealDetailModal
          meal={selectedMeal}
          mealType={selectedMealType}
          day={selectedDay}
          onClose={closeModal}
        />
      )}

      {/*Restaurant Modal */}
      {showRestaurantModal && (
      <RestaurantModal
        restaurants={restaurants}
        onClose={() => setShowRestaurantModal(false)}
      />
    )}




      {/* Grocery List Modal */}
{showGroceryModal && groceryData && (
  <GroceryListModal 
    groceryData={groceryData}
    onClose={() => setShowGroceryModal(false)}
  />
)}

    </>
  );


};

export default MealPlanDashboard;
