import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Slider } from "./ui/slider";
import { Checkbox } from "./ui/checkbox";
import {
  ChefHat,
  Target,
  Shield,
  DollarSign,
  MapPin,
  ArrowRight,
  Sparkles,
  UserCircle,
  Loader2,
} from "lucide-react";
import freshIngredients from "../assets/fresh-ingredients.jpg";
import { authService } from "../authBridge";

// Remove the duplicate authService definition - use the imported one only

const OnboardingFlow = ({ onComplete, onSwitchToLogin }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [preferences, setPreferences] = useState({
    cuisines: [],
    goals: [],
    allergies: [],
    budget: [75],
    location: "",
    name: "",
    email: "",
    password: "",
  });

  const totalSteps = 6;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const cuisineOptions = [
    "Mediterranean",
    "Asian",
    "Mexican",
    "Italian",
    "Indian",
    "Plant-Based",
    "Keto",
    "Paleo",
    "American",
    "Middle Eastern",
  ];

  const goalOptions = [
    "Lose Weight",
    "Build Muscle",
    "Eat More Plants",
    "Save Time",
    "Try New Foods",
    "Eat Healthier",
    "Family Meals",
    "Meal Prep",
  ];

  const allergyOptions = [
    "Nuts",
    "Dairy",
    "Gluten",
    "Shellfish",
    "Eggs",
    "Soy",
    "Fish",
    "Sesame",
    "None",
  ];

  const handleCuisineToggle = (cuisine) => {
    setError("");
    setPreferences((prev) => ({
      ...prev,
      cuisines: prev.cuisines.includes(cuisine)
        ? prev.cuisines.filter((c) => c !== cuisine)
        : [...prev.cuisines, cuisine],
    }));
  };

  const handleGoalToggle = (goal) => {
    setError("");
    setPreferences((prev) => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter((g) => g !== goal)
        : [...prev.goals, goal],
    }));
  };

  const handleAllergyToggle = (allergy) => {
    setError("");
    setPreferences((prev) => ({
      ...prev,
      allergies:
        allergy === "None"
          ? ["None"]
          : prev.allergies.includes(allergy)
          ? prev.allergies.filter((a) => a !== allergy)
          : prev.allergies.filter((a) => a !== "None").concat(allergy),
    }));
  };

  const handleInputChange = (field, value) => {
    setError("");
    setPreferences((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateCurrentStep = () => {
    let newError = "";

    switch (currentStep) {
      case 0:
        if (preferences.cuisines.length === 0) {
          newError = "Please select at least one cuisine.";
        }
        break;
      case 1:
        if (preferences.goals.length === 0) {
          newError = "Please select at least one goal.";
        }
        break;
      case 2:
        if (preferences.allergies.length === 0) {
          newError = "Please select at least one allergy option.";
        }
        break;
      case 3:
        break;
      case 4:
        if (!preferences.location.trim()) {
          newError = "Please enter your location.";
        } else if (preferences.location.trim().length < 2) {
          newError = "Please enter a valid location.";
        }
        break;
      case 5:
        if (!preferences.name?.trim()) {
          newError = "Please enter your full name.";
        } else if (!preferences.email?.trim()) {
          newError = "Please enter your email address.";
        } else if (!validateEmail(preferences.email)) {
          newError = "Please enter a valid email address.";
        } else if (!preferences.password?.trim()) {
          newError = "Please enter a password.";
        } else if (preferences.password.length < 6) {
          newError = "Password must be at least 6 characters long.";
        } else if (preferences.name.trim().length < 2) {
          newError = "Name must be at least 2 characters long.";
        }
        break;
      default:
        break;
    }

    return newError;
  };

  const handleRegistration = async (formData) => {
    setIsSubmitting(true);
    setError("");

    try {
      console.log("🚀 Starting registration process...");

      const locationParts = formData.location.split(",").map((part) => part.trim());
      const locationObj = {
        city: locationParts[0] || "Unknown",
        state: locationParts[1] || "Unknown",
        country: locationParts[2] || "India",
      };

      const userData = {
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        budget: formData.budget[0],
        location: locationObj,
        preferences: {
          cuisines: formData.cuisines,
          goals: formData.goals,
          allergies: formData.allergies,
          dietaryRestrictions: formData.allergies.filter((a) => a !== "None"),
        },
      };

      console.log("📝 Final user data being sent:", {
        ...userData,
        password: "[HIDDEN]",
      });

      const response = await authService.register(userData);

      if (response.success) {
        console.log("✅ Registration completed successfully");
        onComplete({
          user: response.user,
          preferences: formData,
          success: true,
        });
      } else {
        console.error("❌ Registration response not successful:", response);
        setError(response.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("❌ Registration error caught:", error);

      let errorMessage = "Registration failed. Please try again.";

      if (error.message) {
        errorMessage = error.message;
      } else if (error.errors && error.errors.length > 0) {
        errorMessage = error.errors[0];
      }

      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    const validationError = validateCurrentStep();

    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");

    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log("🎯 Final step reached, starting registration...");
      handleRegistration(preferences);
    }
  };

  const prevStep = () => {
    setError("");
    setCurrentStep(Math.max(0, currentStep - 1));
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
            <p className="text-warm">
              Select the cuisines that make your taste buds dance
            </p>

            <div className="grid grid-cols-2 gap-3">
              {cuisineOptions.map((cuisine) => (
                <Badge
                  key={cuisine}
                  variant={
                    preferences.cuisines.includes(cuisine)
                      ? "default"
                      : "outline"
                  }
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
            <p className="text-warm">
              What brings you to your culinary journey?
            </p>

            <div className="grid grid-cols-2 gap-3">
              {goalOptions.map((goal) => (
                <Badge
                  key={goal}
                  variant={
                    preferences.goals.includes(goal) ? "default" : "outline"
                  }
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
                <div
                  key={allergy}
                  className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:border-accent transition-smooth cursor-pointer"
                  onClick={() => handleAllergyToggle(allergy)}
                >
                  <Checkbox
                    id={allergy}
                    checked={preferences.allergies.includes(allergy)}
                    onChange={() => handleAllergyToggle(allergy)}
                  />
                  <label
                    htmlFor={allergy}
                    className="text-sm font-medium leading-none cursor-pointer flex-1 text-left"
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
                ₹{preferences.budget[0]}
              </div>
              <Slider
                value={preferences.budget}
                onValueChange={(value) =>
                  setPreferences((prev) => ({ ...prev, budget: value }))
                }
                max={5000}
                min={1000}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-warm">
                <span>₹1000</span>
                <span>₹5000+</span>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="text-center space-y-6">
            <MapPin className="w-16 h-16 text-secondary mx-auto" />
            <h2 className="heading-section">Home Sweet Feast</h2>
            <p className="text-warm">
              Where should we deliver your culinary inspiration?
            </p>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter your city, state (e.g., Mumbai, Maharashtra)"
                value={preferences.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className="w-full p-3 border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-smooth"
                disabled={isSubmitting}
              />
            </div>

            <Card className="p-6 bg-gradient-primary text-primary-foreground border-0 shadow-glow">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-6 h-6" />
                <h3 className="font-semibold">
                  Ready for Your Culinary Journey!
                </h3>
              </div>
              <p className="text-sm opacity-90">
                Nourish AI is preparing personalized meal plans based on your
                preferences. Get ready for a delicious adventure!
              </p>
            </Card>
          </div>
        );

      case 5:
        return (
          <div className="text-center space-y-6">
            <UserCircle className="w-16 h-16 text-primary mx-auto" />
            <h2 className="text-2xl font-bold">Create Your Profile</h2>
            <p className="text-muted-foreground">
              Almost there! Create your account to save your preferences.
            </p>

            <div className="space-y-4 text-left">
              <div>
                <label className="text-sm font-medium block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={preferences.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full p-3 border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-smooth"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={preferences.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full p-3 border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-smooth"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  placeholder="Enter a strong password (min. 6 characters)"
                  value={preferences.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  className="w-full p-3 border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-smooth"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
              <p className="font-medium mb-1">🔒 Your Privacy Matters</p>
              <p>
                We'll use this information to personalize your meal
                recommendations and keep your account secure.
              </p>
            </div>
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
            <span>
              Step {currentStep + 1} of {totalSteps}
            </span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <div className="mb-8">{renderStep()}</div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm font-medium">❌ {error}</p>
            <p className="text-red-600 text-xs mt-1">
              Check browser console and server logs for more details.
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0 || isSubmitting}
            className="flex items-center gap-2"
          >
            Previous
          </Button>

          <Button
            onClick={nextStep}
            disabled={isSubmitting}
            className="bg-gradient-primary text-primary-foreground border-0 shadow-warm hover:shadow-glow flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating Account...
              </>
            ) : currentStep === totalSteps - 1 ? (
              <>
                Start Cooking!
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>

        {/* Login Switch - Only show if onSwitchToLogin prop is provided */}
        {onSwitchToLogin && (
          <div className="mt-6 text-center">
            <p className="text-sm text-warm">
              Already have an account?{" "}
              <button
                onClick={onSwitchToLogin}
                className="text-primary hover:text-primary/80 font-medium"
                disabled={isSubmitting}
              >
                Sign in here
              </button>
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default OnboardingFlow;
