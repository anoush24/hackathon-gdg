import React, { useState, useMemo } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Slider } from "../ui/slider";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Progress } from "../ui/progress";
import { 
  ArrowRight, 
  ArrowLeft, 
  MapPin, 
  IndianRupee, 
  Utensils, 
  Heart, 
  AlertTriangle, 
  Sparkles, 
  Check,
  ChefHat,
  Target,
  Shield,
  UserCircle,
  Loader2
} from "lucide-react";
import { authService } from "../../authBridge";
import freshIngredients from "../../assets/fresh-ingredients.jpg";
import HeroBackground from "../../assets/herobgveg5.png";

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

const initialState = {
  name: "",
  email: "",
  password: "",
  budget: 75,
  location: { city: "", state: "", country: "India" },
  preferences: {
    cuisines: [],
    goals: [],
    allergies: [],
    dietaryRestrictions: [],
  },
};

const OnboardingFlow = ({ onComplete, onSwitchToLogin }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [state, setState] = useState(initialState);

  const totalSteps = 6;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const budgetArray = useMemo(() => [state.budget], [state.budget]);

  const setField = (path, value) => {
    setError("");
    setState((prev) => {
      const next = { ...prev };
      if (path.startsWith("location.")) {
        const key = path.split(".")[1];
        next.location = { ...prev.location, [key]: value };
      } else if (path.startsWith("preferences.")) {
        const key = path.split(".")[1];
        next.preferences = { ...prev.preferences, [key]: value };
      } else {
        next[path] = value;
      }
      return next;
    });
  };

  const toggleArrayItem = (arr, val) =>
    arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];

  const handleCuisineToggle = (cuisine) => {
    const updated = toggleArrayItem(state.preferences.cuisines, cuisine);
    setField("preferences.cuisines", updated);
  };

  const handleGoalToggle = (goal) => {
    const updated = toggleArrayItem(state.preferences.goals, goal);
    setField("preferences.goals", updated);
  };

  const handleAllergyToggle = (allergy) => {
    let updated = state.preferences.allergies;
    if (allergy === "None") {
      updated = ["None"];
    } else {
      updated = toggleArrayItem(
        updated.filter((a) => a !== "None"),
        allergy
      );
    }
    setField("preferences.allergies", updated);
  };

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 0:
        if (state.preferences.cuisines.length === 0)
          return "Please select at least one cuisine.";
        break;
      case 1:
        if (state.preferences.goals.length === 0)
          return "Please select at least one goal.";
        break;
      case 2:
        if (state.preferences.allergies.length === 0)
          return "Please select at least one allergy option.";
        break;
      case 3:
        if (state.budget < 0) return "Budget cannot be negative.";
        break;
      case 4:
        if (!state.location.city.trim()) return "Please enter your city.";
        if (!state.location.state.trim()) return "Please enter your state.";
        if (!state.location.country.trim()) return "Please enter your country.";
        if (state.location.city.trim().length < 2)
          return "Please enter a valid city.";
        break;
      case 5:
        if (!state.name?.trim()) return "Please enter your full name.";
        if (state.name.trim().length < 2)
          return "Name must be at least 2 characters long.";
        if (!state.email?.trim()) return "Please enter your email address.";
        if (!validateEmail(state.email))
          return "Please enter a valid email address.";
        if (!state.password?.trim()) return "Please enter a password.";
        if (state.password.length < 6)
          return "Password must be at least 6 characters long.";
        break;
      default:
        break;
    }
    return "";
  };

  const buildPayload = () => {
    const dietary =
      state.preferences.dietaryRestrictions.length > 0
        ? state.preferences.dietaryRestrictions
        : state.preferences.allergies.filter((a) => a !== "None");

    return {
      name: state.name.trim(),
      email: state.email.toLowerCase().trim(),
      password: state.password,
      budget: Number.isFinite(state.budget) ? state.budget : 75,
      location: {
        city: state.location.city?.trim() || "Unknown",
        state: state.location.state?.trim() || "Unknown",
        country: state.location.country?.trim() || "India",
      },
      preferences: {
        cuisines: state.preferences.cuisines,
        goals: state.preferences.goals,
        allergies: state.preferences.allergies,
        dietaryRestrictions: dietary,
      },
      isActive: true,
      lastLogin: new Date(),
    };
  };

  const handleRegistration = async () => {
    setIsSubmitting(true);
    setError("");

    try {
      const userData = buildPayload();

      console.log("📝 Final user data being sent:", {
        ...userData,
        password: "[HIDDEN]",
      });

      const response = await authService.register(userData);

      if (response?.success) {
        onComplete?.({
          user: response.user,
          preferences: state,
          success: true,
        });
      } else {
        setError(response?.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      const message =
        err?.message ||
        (err?.errors && err.errors[0]) ||
        "Registration failed. Please try again.";
      setError(message);
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
      setCurrentStep((s) => s + 1);
    } else {
      handleRegistration();
    }
  };

  const prevStep = () => {
    setError("");
    setCurrentStep((s) => Math.max(0, s - 1));
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
                className="w-full h-64 object-cover rounded-lg shadow-card mx-auto"
              />
            </div>
            <ChefHat className="w-16 h-16 text-green-700 mx-auto" />
            <h2 className="text-5xl font-nunito font-extrabold text-green-700 mb-6 tracking-tight">What's Your Flavor?</h2>
            <p className="text-lg font-nunito text-gray-900 opacity-90">
              Select the cuisines that make your taste buds dance
            </p>
            <div className="grid grid-cols-2 gap-4">
              {cuisineOptions.map((cuisine) => (
                <Badge
                  key={cuisine}
                  className={`cursor-pointer p-4 text-lg font-semibold transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 ${
                    state.preferences.cuisines.includes(cuisine)
                      ? "bg-green-700 text-white border-2 border-green-700"
                      : "bg-white border-2 border-green-500 text-green-700 hover:bg-green-50"
                  }`}
                  onClick={() => handleCuisineToggle(cuisine)}
                >
                  {state.preferences.cuisines.includes(cuisine) && (
                    <Check className="w-5 h-5 inline-block mr-2" />
                  )}
                  {cuisine}
                </Badge>
              ))}
            </div>
          </div>
        );
      case 1:
        return (
          <div className="text-center space-y-6">
            <Target className="w-16 h-16 text-green-700 mx-auto" />
            <h2 className="text-5xl font-nunito font-extrabold text-green-700 mb-6 tracking-tight">Goal-Getter</h2>
            <p className="text-lg font-nunito text-gray-900 opacity-90">
              What brings you to your culinary journey?
            </p>
            <div className="grid grid-cols-2 gap-4">
              {goalOptions.map((goal) => (
                <Badge
                  key={goal}
                  className={`cursor-pointer p-4 text-lg font-semibold transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 ${
                    state.preferences.goals.includes(goal)
                      ? "bg-green-700 text-white border-2 border-green-700"
                      : "bg-white border-2 border-green-500 text-green-700 hover:bg-green-50"
                  }`}
                  onClick={() => handleGoalToggle(goal)}
                >
                  {state.preferences.goals.includes(goal) && (
                    <Check className="w-5 h-5 inline-block mr-2" />
                  )}
                  {goal}
                </Badge>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="text-center space-y-6">
            <Shield className="w-16 h-16 text-green-700 mx-auto" />
            <h2 className="text-5xl font-nunito font-extrabold text-green-700 mb-6 tracking-tight">The Allergy Avoider</h2>
            <p className="text-lg font-nunito text-gray-900 opacity-90">Help us keep you safe and satisfied</p>
            <div className="grid grid-cols-2 gap-4">
              {allergyOptions.map((allergy) => (
                <div
                  key={allergy}
                  className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl hover:scale-105 ${
                    state.preferences.allergies.includes(allergy)
                      ? "bg-green-700 text-white border-green-700"
                      : "bg-white border-green-500 hover:bg-green-50"
                  }`}
                  onClick={() => handleAllergyToggle(allergy)}
                >
                  <Checkbox
                    id={allergy}
                    checked={state.preferences.allergies.includes(allergy)}
                    className="pointer-events-none"
                  />
                  <label
                    htmlFor={allergy}
                    className={`text-lg font-semibold font-nunito leading-none cursor-pointer flex-1 text-left ${
                      state.preferences.allergies.includes(allergy)
                        ? "text-white"
                        : "text-green-700"
                    }`}
                  >
                    {allergy}
                  </label>
                  {state.preferences.allergies.includes(allergy) && (
                    <Check className="w-5 h-5" />
                  )}
                </div>
              ))}
            </div>

            <div className="text-left space-y-3 mt-4">
              <p className="text-sm font-nunito text-gray-900 opacity-80">
                Any other dietary restrictions? (optional)
              </p>
              <input
                type="text"
                placeholder="e.g., vegan, halal, low-sodium"
                className="w-full p-3 border-2 border-green-500 rounded-xl focus:border-green-700 focus:ring-2 focus:ring-green-500/20 outline-none transition-all duration-300 bg-white text-gray-900 font-nunito hover:bg-green-50"
                value={state.preferences.dietaryRestrictions.join(", ")}
                onChange={(e) => {
                  const vals = e.target.value
                    .split(",")
                    .map((v) => v.trim())
                    .filter(Boolean);
                  setField("preferences.dietaryRestrictions", vals);
                }}
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="text-center space-y-6">
            <IndianRupee className="w-16 h-16 text-green-700 mx-auto" />
            <h2 className="text-5xl font-nunito font-extrabold text-green-700 mb-6 tracking-tight">Budget Bites</h2>
            <p className="text-lg font-nunito text-gray-900 opacity-90">What's your weekly grocery budget?</p>
            <div className="space-y-6">
              <div className="text-5xl font-nunito font-extrabold text-green-700 tracking-tight">
                ₹{state.budget}
              </div>
              <Slider
                value={budgetArray}
                onValueChange={(value) => setField("budget", value?.[0] ?? 75)}
                max={5000}
                min={1000}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-sm font-nunito text-gray-900 opacity-80">
                <span>₹1000</span>
                <span>₹5000+</span>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="text-center space-y-6">
            <MapPin className="w-16 h-16 text-green-700 mx-auto" />
            <h2 className="text-5xl font-nunito font-extrabold text-green-700 mb-6 tracking-tight">Home Sweet Feast</h2>
            <p className="text-lg font-nunito text-gray-900 opacity-90">
              Where should we deliver your culinary inspiration?
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="City"
                value={state.location.city}
                onChange={(e) => setField("location.city", e.target.value)}
                className="w-full p-3 border-2 border-green-500 rounded-xl focus:border-green-700 focus:ring-2 focus:ring-green-500/20 outline-none transition-all duration-300 bg-white text-gray-900 font-nunito hover:bg-green-50"
                disabled={isSubmitting}
              />
              <input
                type="text"
                placeholder="State"
                value={state.location.state}
                onChange={(e) => setField("location.state", e.target.value)}
                className="w-full p-3 border-2 border-green-500 rounded-xl focus:border-green-700 focus:ring-2 focus:ring-green-500/20 outline-none transition-all duration-300 bg-white text-gray-900 font-nunito hover:bg-green-50"
                disabled={isSubmitting}
              />
              <input
                type="text"
                placeholder="Country"
                value={state.location.country}
                onChange={(e) => setField("location.country", e.target.value)}
                className="w-full p-3 border-2 border-green-500 rounded-xl focus:border-green-700 focus:ring-2 focus:ring-green-500/20 outline-none transition-all duration-300 bg-white text-gray-900 font-nunito hover:bg-green-50"
                disabled={isSubmitting}
              />
            </div>

            <Card className="p-6 bg-white border-2 border-green-500 text-green-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-6 h-6" />
                <h3 className="font-bold text-xl font-nunito">
                  Ready for Your Culinary Journey!
                </h3>
              </div>
              <p className="text-sm font-nunito opacity-90">
                Nourish AI is preparing personalized meal plans based on your
                preferences. Get ready for a delicious adventure!
              </p>
            </Card>
          </div>
        );
      case 5:
        return (
          <div className="text-center space-y-6">
            <UserCircle className="w-16 h-16 text-green-700 mx-auto" />
            <h2 className="text-5xl font-nunito font-extrabold text-green-700 mb-6 tracking-tight">Create Your Profile</h2>
            <p className="text-lg font-nunito text-gray-900 opacity-90">
              Almost there! Create your account to save your preferences.
            </p>

            <div className="space-y-4 text-left">
              <div>
                <label className="text-sm font-bold font-nunito block mb-1 text-gray-900">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={state.name}
                  onChange={(e) => setField("name", e.target.value)}
                  className="w-full p-3 border-2 border-green-500 rounded-xl focus:border-green-700 focus:ring-2 focus:ring-green-500/20 outline-none transition-all duration-300 bg-white text-gray-900 font-nunito hover:bg-green-50"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="text-sm font-bold font-nunito block mb-1 text-gray-900">
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={state.email}
                  onChange={(e) => setField("email", e.target.value)}
                  className="w-full p-3 border-2 border-green-500 rounded-xl focus:border-green-700 focus:ring-2 focus:ring-green-500/20 outline-none transition-all duration-300 bg-white text-gray-900 font-nunito hover:bg-green-50"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="text-sm font-bold font-nunito block mb-1 text-gray-900">
                  Password *
                </label>
                <input
                  type="password"
                  placeholder="Enter a strong password (min. 6 characters)"
                  value={state.password}
                  onChange={(e) => setField("password", e.target.value)}
                  className="w-full p-3 border-2 border-green-500 rounded-xl focus:border-green-700 focus:ring-2 focus:ring-green-500/20 outline-none transition-all duration-300 bg-white text-gray-900 font-nunito hover:bg-green-50"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 text-sm text-green-800 font-nunito shadow-lg">
              <p className="font-bold mb-1">🔒 Your Privacy Matters</p>
              <p className="opacity-90">
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
    <div className="min-h-screen bg-white/10 flex items-center justify-center p-4 relative">
      <div 
        className="fixed inset-0 z-0 pointer-events-none" 
        style={{
          backgroundImage: `url(${HeroBackground})`,
          backgroundRepeat: 'repeat',
          backgroundAttachment: 'fixed',
          backgroundSize: 'auto',
          opacity: 1,
        }}
      />
      
      <Card className="w-full max-w-2xl p-8 shadow-lg border-2 border-green-500 bg-white rounded-xl relative z-10">
        <div className="mb-8">
          <div className="flex justify-between text-sm font-nunito text-gray-900 opacity-80 mb-2">
            <span>
              Step {currentStep + 1} of {totalSteps}
            </span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="mb-8">{renderStep()}</div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl shadow-lg">
            <p className="text-red-700 text-sm font-bold font-nunito">❌ {error}</p>
            <p className="text-red-600 text-xs mt-1 font-nunito">
              Check browser console and server logs for more details.
            </p>
          </div>
        )}

        <div className="flex justify-between items-center gap-4">
  <Button
    variant="outline"
    onClick={prevStep}
    disabled={currentStep === 0 || isSubmitting}
   className="flex items-center gap-3 px-6 py-4 bg-green-700 border-2 border-green-700 text-white rounded-xl shadow-lg 
    hover:shadow-xl hover:scale-105 hover:bg-green-800 hover:border-green-800
    active:scale-100 active:shadow-md active:bg-green-900
    focus:outline-none focus:ring-4 focus:ring-green-300
    transition-all duration-300 font-bold group 
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-green-700"
  >
    <ArrowLeft className="w-6 h-6 group-hover:group-enabled:translate-x-1 transition-transform" />
    Previous
  </Button>

  <Button
    onClick={nextStep}
    disabled={isSubmitting}
    className="flex items-center gap-3 px-6 py-4 bg-green-700 border-2 border-green-700 text-white rounded-xl shadow-lg 
    hover:shadow-xl hover:scale-105 hover:bg-green-800 hover:border-green-800
    active:scale-100 active:shadow-md active:bg-green-900
    focus:outline-none focus:ring-4 focus:ring-green-300
    transition-all duration-300 font-bold group 
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-green-700"
  >
    {isSubmitting ? (
      <>
        <Loader2 className="w-6 h-6 animate-spin" />
        Creating Account...
      </>
    ) : currentStep === totalSteps - 1 ? (
      <>
        Start Cooking!
        <ArrowRight className="w-6 h-6 group-hover:group-enabled:translate-x-1 transition-transform" />
      </>
    ) : (
      <>
        Next
        <ArrowRight className="w-6 h-6 group-hover:group-enabled:translate-x-1 transition-transform" />
      </>
    )}
  </Button>
</div>


        {onSwitchToLogin && (
          <div className="mt-6 text-center">
            <p className="text-sm font-nunito text-gray-900 opacity-80">
              Already have an account?{" "}
              <button
                onClick={onSwitchToLogin}
                className="text-green-700 hover:text-green-900 font-bold transition-all duration-300"
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
