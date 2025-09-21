import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MealCard from "./MealCard";
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
import heroBreakfast from "@/assets/hero-breakfast.jpg";
import mediterraneanLunch from "@/assets/mediterranean-lunch.jpg";
import salmonDinner from "@/assets/salmon-dinner.jpg";

const MealPlanDashboard = ({
  user,
  onLogout,
  onNavigateToSettings,
  onNavigateToMealJournal,
  onNavigateToCustomization, // Add this new prop
}) => {
  const [currentDay] = useState("Today");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Weekly Planner State
  const [weeklyPlan, setWeeklyPlan] = useState({
    monday: { breakfast: null, lunch: null, dinner: null },
    tuesday: { breakfast: null, lunch: null, dinner: null },
    wednesday: { breakfast: null, lunch: null, dinner: null },
    thursday: { breakfast: null, lunch: null, dinner: null },
    friday: { breakfast: null, lunch: null, dinner: null },
    saturday: { breakfast: null, lunch: null, dinner: null },
    sunday: { breakfast: null, lunch: null, dinner: null },
  });

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

  // Add customize handler
  const handleCustomize = () => {
    console.log('🎨 Opening meal customization');
    onNavigateToCustomization();
  };

  // Weekly Planner Functions
  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  const dayLabels = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const mealTypes = [
    {
      key: "breakfast",
      label: "Breakfast",
      color:
        "bg-yellow-50 border-yellow-200 text-yellow-800 hover:bg-yellow-100",
    },
    {
      key: "lunch",
      label: "Lunch",
      color: "bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100",
    },
    {
      key: "dinner",
      label: "Dinner",
      color: "bg-green-50 border-green-200 text-green-800 hover:bg-green-100",
    },
  ];

  const mealSuggestions = {
    breakfast: [
      {
        name: "Avocado Toast with Eggs",
        calories: 320,
        time: "10 min",
        cost: 4,
      },
      { name: "Greek Yogurt Parfait", calories: 280, time: "5 min", cost: 3 },
      { name: "Overnight Oats", calories: 350, time: "5 min", cost: 2 },
      { name: "Smoothie Bowl", calories: 290, time: "8 min", cost: 5 },
    ],
    lunch: [
      {
        name: "Mediterranean Quinoa Bowl",
        calories: 420,
        time: "25 min",
        cost: 8,
      },
      { name: "Chicken Caesar Salad", calories: 380, time: "15 min", cost: 9 },
      { name: "Vegetable Wrap", calories: 340, time: "10 min", cost: 6 },
      { name: "Lentil Soup", calories: 310, time: "30 min", cost: 4 },
    ],
    dinner: [
      { name: "Herb-Crusted Salmon", calories: 485, time: "30 min", cost: 15 },
      { name: "Pasta Primavera", calories: 450, time: "25 min", cost: 8 },
      {
        name: "Grilled Chicken & Vegetables",
        calories: 410,
        time: "35 min",
        cost: 10,
      },
      { name: "Vegetarian Stir Fry", calories: 380, time: "20 min", cost: 7 },
    ],
  };

  const handleAddMeal = (day, mealType) => {
    const suggestions = mealSuggestions[mealType];
    const randomMeal =
      suggestions[Math.floor(Math.random() * suggestions.length)];

    setWeeklyPlan((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [mealType]: randomMeal,
      },
    }));
  };

  const handleRemoveMeal = (day, mealType) => {
    setWeeklyPlan((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [mealType]: null,
      },
    }));
  };

  const calculateWeeklyStats = () => {
    let totalCalories = 0;
    let totalCost = 0;
    let mealCount = 0;

    Object.values(weeklyPlan).forEach((day) => {
      Object.values(day).forEach((meal) => {
        if (meal) {
          totalCalories += meal.calories;
          totalCost += meal.cost;
          mealCount++;
        }
      });
    });

    return { totalCalories, totalCost, mealCount };
  };

  const generateAIPlan = () => {
    const newPlan = { ...weeklyPlan };

    days.forEach((day) => {
      mealTypes.forEach((mealType) => {
        const suggestions = mealSuggestions[mealType.key];
        const randomMeal =
          suggestions[Math.floor(Math.random() * suggestions.length)];
        newPlan[day][mealType.key] = randomMeal;
      });
    });

    setWeeklyPlan(newPlan);
  };

  const clearAllMeals = () => {
    setWeeklyPlan({
      monday: { breakfast: null, lunch: null, dinner: null },
      tuesday: { breakfast: null, lunch: null, dinner: null },
      wednesday: { breakfast: null, lunch: null, dinner: null },
      thursday: { breakfast: null, lunch: null, dinner: null },
      friday: { breakfast: null, lunch: null, dinner: null },
      saturday: { breakfast: null, lunch: null, dinner: null },
      sunday: { breakfast: null, lunch: null, dinner: null },
    });
  };

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
    },
  ];

  const nutritionStats = {
    calories: 1285,
    protein: 85,
    carbs: 120,
    fat: 45,
  };

  const weeklyStats = calculateWeeklyStats();

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header - Your existing header code */}
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
                  <span>${user?.budget || 75}/week</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{user?.location?.city || "City"}</span>
                </div>
              </div>

              {/* Profile Dropdown - Your existing dropdown code */}
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

                {/* Dropdown Menu - Your existing dropdown */}
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
                            ${user?.budget || 75}
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

                      {/* Favorite Cuisines */}
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
                      {/* <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <Bell className="w-4 h-4" />
                        Notifications
                      </button> */}
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
        {/* Welcome Message - Your existing content */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Good{" "}
            {new Date().getHours() < 12
              ? "Morning"
              : new Date().getHours() < 17
              ? "Afternoon"
              : "Evening"}
            , {user?.name || "Chef"}! 👋
          </h2>
          <p className="text-gray-600">
            Ready to nourish your body with today's personalized meal plan?
          </p>
        </div>

        {/* Nutritional Snapshot - Your existing content */}
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

        {/* Meal Plans - Updated with working customize button */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="heading-section">Today's Meal Plan</h2>
            <div className="flex gap-2">
              <Button
                onClick={handleCustomize} // Connect to customize handler
                className="bg-gradient-warm text-accent-foreground border-0"
                size="sm"
              >
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

        {/* AI Insights - Your existing content */}
        <Card className="p-6 bg-gradient-primary text-primary-foreground border-0 shadow-glow mb-8">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-primary-foreground/10 rounded-lg">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">Nourish AI Insight</h3>
              <p className="opacity-90 mb-4">
                Hey {user?.name || "Chef"}! You've been loving{" "}
                {user?.preferences?.cuisines?.[0] || "Mediterranean"} flavors
                lately! Your protein intake is perfectly balanced. How about
                trying our AI-suggested quinoa tabbouleh for tomorrow's lunch?
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
