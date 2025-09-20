import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SwipeableMealCard from "./SwipeableMealCard";
import FilterBar from "./FilterBar";
import AllergyBanner from "./AllergyBanner";
import { ArrowLeft, Sparkles } from "lucide-react";

const MealCustomizationPage = ({ user, onBack, onSave }) => {
  const [selectedMeals, setSelectedMeals] = useState({
    breakfast: {
      id: "1",
      title: "Avocado Toast Supreme",
      image: "/src/assets/hero-breakfast.jpg",
      category: "Breakfast",
      cookTime: "10 min",
      servings: 1,
      calories: 320,
      isAiGenerated: true,
      allergens: ["gluten"],
      cuisine: "modern",
      isVegetarian: true
    },
    lunch: {
      id: "2", 
      title: "Mediterranean Buddha Bowl",
      image: "/src/assets/mediterranean-lunch.jpg",
      category: "Lunch",
      cookTime: "25 min",
      servings: 1,
      calories: 450,
      allergens: [],
      cuisine: "mediterranean",
      isVegetarian: true
    },
    dinner: {
      id: "3",
      title: "Herb-Crusted Salmon",
      image: "/src/assets/salmon-dinner.jpg", 
      category: "Dinner",
      cookTime: "30 min",
      servings: 1,
      calories: 520,
      allergens: [],
      cuisine: "modern"
    }
  });

  const [activeFilters, setActiveFilters] = useState([]);
  const [allergyStatus, setAllergyStatus] = useState('clear');

  // Get user's allergies from their profile
  const userAllergies = user?.preferences?.allergies || [];
  
  // Remove "None" from allergies if it exists
  const actualAllergies = userAllergies.filter(allergy => 
    allergy.toLowerCase() !== 'none'
  ).map(allergy => allergy.toLowerCase());

  // Check allergies instantly when component mounts or meals change
  useEffect(() => {
    checkAllergiesInstantly();
  }, [selectedMeals, actualAllergies]);

  const checkAllergiesInstantly = () => {
    // If user has no allergies, status is clear
    if (actualAllergies.length === 0) {
      setAllergyStatus('clear');
      return;
    }

    // Check if any selected meal contains user's allergens
    const conflictingAllergens = [];
    
    Object.values(selectedMeals).forEach(meal => {
      if (meal.allergens) {
        meal.allergens.forEach(mealAllergen => {
          const mealAllergenLower = mealAllergen.toLowerCase();
          if (actualAllergies.includes(mealAllergenLower) && 
              !conflictingAllergens.includes(mealAllergenLower)) {
            conflictingAllergens.push(mealAllergenLower);
          }
        });
      }
    });

    // Set status based on findings
    if (conflictingAllergens.length > 0) {
      setAllergyStatus('warning');
    } else {
      setAllergyStatus('clear');
    }
  };

  // Get the actual conflicting allergens for display
  const getConflictingAllergens = () => {
    const conflicting = [];
    Object.values(selectedMeals).forEach(meal => {
      if (meal.allergens) {
        meal.allergens.forEach(mealAllergen => {
          const mealAllergenLower = mealAllergen.toLowerCase();
          if (actualAllergies.includes(mealAllergenLower) && 
              !conflicting.includes(mealAllergenLower)) {
            conflicting.push(mealAllergenLower);
          }
        });
      }
    });
    return conflicting;
  };

  const sampleAlternatives = [
    {
      id: "alt1",
      title: "Greek Yogurt Parfait",
      image: "/src/assets/fresh-ingredients.jpg",
      category: "Breakfast", 
      cookTime: "5 min",
      servings: 1,
      calories: 280,
      allergens: [], // No allergens
      cuisine: "modern",
      isVegetarian: true
    },
    {
      id: "alt2",
      title: "Quinoa Power Bowl",
      image: "/src/assets/mediterranean-lunch.jpg",
      category: "Lunch",
      cookTime: "20 min", 
      servings: 1,
      calories: 380,
      allergens: [], // No allergens
      cuisine: "healthy",
      isVegetarian: true
    },
    {
      id: "alt3",
      title: "Grilled Chicken Thighs",
      image: "/src/assets/salmon-dinner.jpg",
      category: "Dinner",
      cookTime: "35 min",
      servings: 1,
      calories: 490,
      allergens: [], // No allergens
      cuisine: "modern"
    },
    {
      id: "alt4",
      title: "Gluten-Free Oatmeal",
      image: "/src/assets/hero-breakfast.jpg",
      category: "Breakfast",
      cookTime: "8 min",
      servings: 1,
      calories: 300,
      allergens: [], // Gluten-free alternative
      cuisine: "healthy",
      isVegetarian: true
    }
  ];

  const handleMealSwap = (mealType, newMeal) => {
    setSelectedMeals(prev => ({
      ...prev,
      [mealType]: newMeal
    }));
    // Allergy check will happen automatically via useEffect
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onBack}
              className="text-foreground hover:bg-muted"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="heading-section mb-0">Mix & Match</h1>
              <p className="text-warm text-sm">Customize your perfect meal plan</p>
            </div>
          </div>
          <Badge className="bg-gradient-primary text-primary-foreground border-0 gap-2">
            <Sparkles className="h-3 w-3" />
            AI Powered
          </Badge>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Allergy Banner - Now shows instant results */}
        <AllergyBanner 
          status={allergyStatus} 
          allergens={getConflictingAllergens()}
        />

        {/* User Allergy Info Display */}
        {actualAllergies.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-900 mb-2">Your Allergies:</h3>
            <div className="flex flex-wrap gap-2">
              {actualAllergies.map((allergy) => (
                <Badge key={allergy} variant="outline" className="bg-white text-blue-800 border-blue-300 text-xs">
                  {allergy.charAt(0).toUpperCase() + allergy.slice(1)}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Filter Bar */}
        <FilterBar 
          activeFilters={activeFilters}
          onFiltersChange={setActiveFilters}
        />

        {/* Meal Cards */}
        <div className="space-y-8">
          <SwipeableMealCard
            meal={selectedMeals.breakfast}
            alternatives={sampleAlternatives.filter(m => m.category === 'Breakfast')}
            onSwap={(newMeal) => handleMealSwap('breakfast', newMeal)}
            mealType="breakfast"
            activeFilters={activeFilters}
            userAllergies={actualAllergies} // Pass user allergies
          />
          
          <SwipeableMealCard
            meal={selectedMeals.lunch}
            alternatives={sampleAlternatives.filter(m => m.category === 'Lunch')}
            onSwap={(newMeal) => handleMealSwap('lunch', newMeal)}
            mealType="lunch"
            activeFilters={activeFilters}
            userAllergies={actualAllergies} // Pass user allergies
          />
          
          <SwipeableMealCard
            meal={selectedMeals.dinner}
            alternatives={sampleAlternatives.filter(m => m.category === 'Dinner')}
            onSwap={(newMeal) => handleMealSwap('dinner', newMeal)}
            mealType="dinner"
            activeFilters={activeFilters}
            userAllergies={actualAllergies} // Pass user allergies
          />
        </div>

        {/* Nutrition Summary */}
        <div className="bg-white rounded-lg border p-4">
          <h3 className="font-semibold mb-3">Today's Nutrition Summary</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">
                {Object.values(selectedMeals).reduce((sum, meal) => sum + meal.calories, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Calories</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">3</div>
              <div className="text-sm text-gray-600">Meals</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {allergyStatus === 'clear' ? '✓' : '⚠️'}
              </div>
              <div className="text-sm text-gray-600">
                {allergyStatus === 'clear' ? 'Allergy Safe' : 'Check Allergies'}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-6">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={onBack}
          >
            Back to Plan
          </Button>
          <Button 
            className="flex-1 btn-hero"
            onClick={() => onSave?.(selectedMeals)}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MealCustomizationPage;
