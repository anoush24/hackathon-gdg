import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Slider } from "./ui/slider";
import { Checkbox } from "./ui/checkbox";
import { ChefHat, Target, Shield, DollarSign, MapPin, ArrowRight, Sparkles } from "lucide-react";
import freshIngredients from "../assets/fresh-ingredients.jpg";

const OnboardingFlow = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState({
    cuisines: [],
    goals: [],
    allergies: [],
    budget: [75],
    location: ""
  });

  const totalSteps = 5;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const cuisineOptions = [
    "Mediterranean", "Asian", "Mexican", "Italian", "Indian", 
    "Plant-Based", "Keto", "Paleo", "American", "Middle Eastern"
  ];

  const goalOptions = [
    "Lose Weight", "Build Muscle", "Eat More Plants", "Save Time", 
    "Try New Foods", "Eat Healthier", "Family Meals", "Meal Prep"
  ];

  const allergyOptions = [
    "Nuts", "Dairy", "Gluten", "Shellfish", "Eggs", 
    "Soy", "Fish", "Sesame", "None"
  ];

  const handleCuisineToggle = (cuisine) => {
    setPreferences(prev => ({
      ...prev,
      cuisines: prev.cuisines.includes(cuisine)
        ? prev.cuisines.filter(c => c !== cuisine)
        : [...prev.cuisines, cuisine]
    }));
  };

  const handleGoalToggle = (goal) => {
    setPreferences(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  const handleAllergyToggle = (allergy) => {
    setPreferences(prev => ({
      ...prev,
      allergies: allergy === "None" 
        ? ["None"]
        : prev.allergies.includes(allergy)
          ? prev.allergies.filter(a => a !== allergy)
          : prev.allergies.filter(a => a !== "None").concat(allergy)
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="text-center space-y-6">
            <div className="mb-8">
              <img 
                src={freshIngredients} 
                alt="Fresh ingredients"
                className="w-full h-64 object-cover rounded-lg shadow-card"
              />
            </div>
            <ChefHat className="w-16 h-16 text-primary mx-auto" />
            <h2 className="heading-section">What's Your Flavor?</h2>
            <p className="text-warm">Select the cuisines that make your taste buds dance</p>
            
            <div className="grid grid-cols-2 gap-3">
              {cuisineOptions.map((cuisine) => (
                <Badge
                  key={cuisine}
                  variant={preferences.cuisines.includes(cuisine) ? "default" : "outline"}
                  className={`cursor-pointer p-3 text-sm transition-smooth ${
                    preferences.cuisines.includes(cuisine) 
                      ? "bg-gradient-primary text-primary-foreground border-0" 
                      : "hover:border-primary"
                  }`}
                  onClick={() => handleCuisineToggle(cuisine)}
                >
                  {cuisine}
                </Badge>
              ))}
            </div>
          </div>
        );

      case 1:
        return (
          <div className="text-center space-y-6">
            <Target className="w-16 h-16 text-secondary mx-auto" />
            <h2 className="heading-section">Goal-Getter</h2>
            <p className="text-warm">What brings you to your culinary journey?</p>
            
            <div className="grid grid-cols-2 gap-3">
              {goalOptions.map((goal) => (
                <Badge
                  key={goal}
                  variant={preferences.goals.includes(goal) ? "default" : "outline"}
                  className={`cursor-pointer p-3 text-sm transition-smooth ${
                    preferences.goals.includes(goal) 
                      ? "bg-gradient-warm text-accent-foreground border-0" 
                      : "hover:border-secondary"
                  }`}
                  onClick={() => handleGoalToggle(goal)}
                >
                  {goal}
                </Badge>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="text-center space-y-6">
            <Shield className="w-16 h-16 text-accent mx-auto" />
            <h2 className="heading-section">The Allergy Avoider</h2>
            <p className="text-warm">Help us keep you safe and satisfied</p>
            
            <div className="grid grid-cols-2 gap-3">
              {allergyOptions.map((allergy) => (
                <div key={allergy} className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:border-accent transition-smooth">
                  <Checkbox
                    id={allergy}
                    checked={preferences.allergies.includes(allergy)}
                    onCheckedChange={() => handleAllergyToggle(allergy)}
                  />
                  <label
                    htmlFor={allergy}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    onClick={() => handleAllergyToggle(allergy)}
                  >
                    {allergy}
                  </label>
                </div>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="text-center space-y-6">
            <DollarSign className="w-16 h-16 text-primary mx-auto" />
            <h2 className="heading-section">Budget Bites</h2>
            <p className="text-warm">What's your weekly grocery budget?</p>
            
            <div className="space-y-6">
              <div className="text-4xl font-bold text-primary">
                ${preferences.budget[0]}
              </div>
              <Slider
                value={preferences.budget}
                onValueChange={(value) => setPreferences(prev => ({ ...prev, budget: value }))}
                max={200}
                min={25}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-warm">
                <span>$25</span>
                <span>$200+</span>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="text-center space-y-6">
            <MapPin className="w-16 h-16 text-secondary mx-auto" />
            <h2 className="heading-section">Home Sweet Feast</h2>
            <p className="text-warm">Where should we deliver your culinary inspiration?</p>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter your zip code or city"
                value={preferences.location}
                onChange={(e) => setPreferences(prev => ({ ...prev, location: e.target.value }))}
                className="w-full p-3 border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-smooth"
              />
            </div>

            <Card className="p-6 bg-gradient-primary text-primary-foreground border-0 shadow-glow">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-6 h-6" />
                <h3 className="font-semibold">Ready for Your Culinary Journey!</h3>
              </div>
              <p className="text-sm opacity-90">
                Nourish AI is preparing personalized meal plans based on your preferences. 
                Get ready for a delicious adventure!
              </p>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8 shadow-warm border-0">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-warm mb-2">
            <span>Step {currentStep + 1} of {totalSteps}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <div className="mb-8">
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          <Button
            onClick={nextStep}
            className="bg-gradient-primary text-primary-foreground border-0 shadow-warm hover:shadow-glow"
          >
            {currentStep === totalSteps - 1 ? "Start Cooking!" : "Next"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default OnboardingFlow;
