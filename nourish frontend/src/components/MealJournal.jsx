import React, { useState, useEffect, use } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, ArrowLeft, LogOut, BookOpen, Clock, RefreshCw, Calendar } from "lucide-react";
import MealDetailModal from "./meals/MealDetailModal";
import NutritionSnapshot from "./nutrition/NutritionSnapshot";
import { authService } from "../authBridge";
import axios from "axios";
import { useMealPlan } from "../hooks/useMealPlan";

const MealJournal = ({ user, onLogout, onBackToMealPlan }) => {
  const [weeklyPlan, setWeeklyPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCached, setIsCached] = useState(false);
  const [weekInfo, setWeekInfo] = useState(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  
  // Modal state
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedMealType, setSelectedMealType] = useState(null);

  const {consumedNutrition, nutritionStats,isLoadingMeals,mealsError,currentMeals} = useMealPlan(user, onLogout);

  const fetchFullMealPlan = async (forceRegenerate = false) => {
    if (!user?.preferences) {
      setError("User profile with preferences is not available.");
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('❌ No token found in localStorage');
        throw new Error("Authentication token not found. Please log in again.");
      }

      console.log('🔑 Using token:', token.substring(0, 20) + '...');

      const config = {
        headers: {
          'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      console.log('📤 Sending request to:', "http://localhost:5000/api/meal-plans/generate-from-agent");
      console.log('📦 Request body:', { name: user.name, preferences: user.preferences, forceRegenerate });

      const response = await axios.post(
        "http://localhost:5000/api/meal-plans/generate-from-agent",
        { 
          name: user.name, 
          preferences: user.preferences,
          forceRegenerate 
        },
        config
      );

      console.log('✅ Meal plan response:', response.data);
      
      const mealOptions = response.data?.data?.meal_plans?.meal_plan_options;
      if (!mealOptions || mealOptions.length === 0) {
        throw new Error("No meal plans were returned from the AI agent.");
      }

      setIsCached(response.data.cached || false);
      setWeekInfo(response.data.data.weekInfo);

      const option = mealOptions[0];
      const week = {};
      option.days.forEach(d => {
        week[d.day] = {
          breakfast: d.breakfast,
          lunch: d.lunch,
          dinner: d.dinner
        };
      });
      setWeeklyPlan(week);

    } catch (err) {
      console.error("❌ Error fetching weekly meal plan:", err);
      
      if (err.response?.status === 401) {
        console.error('❌ 401 Unauthorized - Token may be invalid or expired');
        localStorage.removeItem('token');
        setError("Your session has expired. Please log in again.");
        setTimeout(() => onLogout?.(), 2000);
        return;
      }
      
      const errorMessage = err.response?.data?.message || err.message || "An unknown error occurred while fetching the weekly plan.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      setIsRegenerating(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFullMealPlan();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [user]);

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    await fetchFullMealPlan(true);
  };

  // Handle meal card click
  const handleMealClick = (meal, day, mealType) => {
    setSelectedMeal(meal);
    setSelectedDay(day);
    setSelectedMealType(mealType);
  };

  // Close modal
  const closeModal = () => {
    setSelectedMeal(null);
    setSelectedDay(null);
    setSelectedMealType(null);
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const mealTypes = [
    { key: 'breakfast', label: 'Breakfast', color: 'bg-yellow-50 border-yellow-200 text-yellow-800' },
    { key: 'lunch', label: 'Lunch', color: 'bg-blue-50 border-blue-200 text-blue-800' },
    { key: 'dinner', label: 'Dinner', color: 'bg-green-50 border-green-200 text-green-800' }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <h2 className="text-xl font-semibold">
          {isRegenerating ? 'Regenerating Your Weekly Plan...' : 'Loading Your Weekly Plan...'}
        </h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <Button onClick={onBackToMealPlan} variant="ghost" className="absolute top-4 left-4 flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Button>

        <h2 className="text-xl font-semibold text-red-600 mb-2">Failed to Load Plan</h2>
        <p className="bg-red-100 border border-red-200 p-4 rounded-md mb-4">{error}</p>
        <div className="flex gap-2">
          <Button onClick={() => fetchFullMealPlan()} variant="outline">
            Try Again
          </Button>
          {error.includes('session has expired') && (
            <Button onClick={onLogout} variant="default">
              Log In Again
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <Button onClick={onBackToMealPlan} variant="ghost" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
              <div className="flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-primary" />
                <div>
                  <h1 className="text-2xl font-bold text-primary">Weekly Meal Planner</h1>
                  <p className="text-sm text-gray-600">
                    {isCached ? '✓ Loaded from cache' : '✨ Freshly generated'} 
                    {weekInfo && ` • Week ${weekInfo.weekOfMonth} of ${new Date(weekInfo.startDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                onClick={handleRegenerate} 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2"
                disabled={isRegenerating}
              >
                <RefreshCw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} /> 
                Regenerate
              </Button>
              <Button onClick={onLogout} variant="outline" size="sm" className="flex items-center gap-2">
                <LogOut className="w-4 h-4" /> Logout
              </Button>
            </div>
          </div>
        </header>

        {!isLoadingMeals && !mealsError && currentMeals.length > 0 && (
            <>
              <NutritionSnapshot 
                consumedNutrition={consumedNutrition}
                nutritionStats={nutritionStats}
              />
             
            </>
          )}  
        
       


        {weekInfo && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            <Card className="p-4 mb-4 bg-blue-50 border-blue-200">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-blue-600" />
                <div className="text-sm">
                  <span className="font-semibold">Week Period:</span> {new Date(weekInfo.startDate).toLocaleDateString()} - {new Date(weekInfo.endDate).toLocaleDateString()}
                </div>
              </div>
            </Card>
          </div>
        )}

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Card className="p-6 shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-2">
              {days.map((day) => (
                <div key={day} className="border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-gradient-to-r from-gray-100 to-gray-50 p-3 text-center border-b">
                    <h3 className="font-semibold text-sm">{day}</h3>
                  </div>
                  <div className="p-2 space-y-2">
                    {mealTypes.map(mealTypeInfo => {
                      const meal = weeklyPlan?.[day]?.[mealTypeInfo.key];
                      return (
                        <div key={mealTypeInfo.key}>
                          {meal ? (
                            <div 
                              className={`p-2 rounded-md border ${mealTypeInfo.color} hover:opacity-90 transition-opacity cursor-pointer hover:shadow-lg`}
                              onClick={() => handleMealClick(meal, day, mealTypeInfo.label)}
                            >
                              {meal.image_url && (
                                <img 
                                  src={meal.image_url} 
                                  alt={meal.name}
                                  className="w-full h-20 object-cover rounded mb-2"
                                  loading="lazy"
                                  onError={(e) => { e.target.style.display = 'none'; }}
                                />
                              )}
                              <h4 className="font-medium text-xs truncate" title={meal.name}>{meal.name}</h4>
                              <div className="text-xs flex justify-between mt-1">
                                <span>{meal.calories} cal</span>
                                {meal.cookTime && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{meal.cookTime}</span>}
                              </div>
                              <div className="text-xs mt-1 text-gray-600">
                                <span>P: {meal.protein}g • C: {meal.carbs}g • F: {meal.fat}g</span>
                              </div>
                            </div>
                          ) : (
                            <div className={`p-2 rounded-md border-2 border-dashed ${mealTypeInfo.color} opacity-60`}>
                              <div className="text-xs font-medium text-center text-gray-400 py-2">{mealTypeInfo.label}</div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </main>
      </div>

      {/* Meal Detail Modal */}
      {selectedMeal && (
        <MealDetailModal 
          meal={selectedMeal}
          mealType={selectedMealType}
          day={selectedDay}
          onClose={closeModal}
        />
      )}
    </>
  );
};

export default MealJournal;
