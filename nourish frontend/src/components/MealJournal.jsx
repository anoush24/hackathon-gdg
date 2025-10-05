import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, ArrowLeft, LogOut, BookOpen, Clock } from 'lucide-react';

const MealJournal = ({ user, onLogout, onBackToMealPlan }) => {
  const [weeklyPlan, setWeeklyPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFullMealPlan = async () => {
      if (!user?.preferences) {
        setError("User profile with preferences is not available.");
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("Authentication token not found. Please log in again.");

        const config = {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        };

        // IMPORTANT: Point axios to your backend server
        const response = await axios.post(
          "http://localhost:8000/meal-plan",
          { name: user.name, preferences: user.preferences },
          config
        );

        const mealOptions = response.data?.data?.meal_plans?.meal_plan_options;
        if (!mealOptions || mealOptions.length === 0) {
          throw new Error("No meal plans were returned from the AI agent.");
        }

        // Normalize array -> { Monday: {...}, ... }
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
        console.error("Error fetching weekly meal plan:", err);
        setError(err.message || "An unknown error occurred while fetching the weekly plan.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFullMealPlan();
  }, [user]);

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
        <h2 className="text-xl font-semibold">Building Your Weekly Plan...</h2>
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
        <p className="bg-red-100 border border-red-200 p-4 rounded-md">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
          <div className="flex items-center gap-4">
            <Button onClick={onBackToMealPlan} variant="ghost" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-primary">Weekly Meal Planner</h1>
                <p className="text-sm text-gray-600">Your AI-powered plan for the week</p>
              </div>
            </div>
          </div>
          <Button onClick={onLogout} variant="outline" size="sm" className="flex items-center gap-2">
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-2">
            {days.map((day) => (
              <div key={day} className="border rounded-lg bg-white">
                <div className="bg-gray-50 p-3 text-center border-b">
                  <h3 className="font-semibold text-sm">{day}</h3>
                </div>
                <div className="p-2 space-y-2">
                  {mealTypes.map(mealTypeInfo => {
                    const meal = weeklyPlan?.[day]?.[mealTypeInfo.key];
                    return (
                      <div key={mealTypeInfo.key}>
                        {meal ? (
                          <div className={`p-2 rounded-md border ${mealTypeInfo.color}`}>
                            <h4 className="font-medium text-xs truncate" title={meal.name}>{meal.name}</h4>
                            <div className="text-xs flex justify-between mt-1">
                              <span>{meal.calories} cal</span>
                              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{meal.cookTime}</span>
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
  );
};

export default MealJournal;
