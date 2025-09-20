import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import MealPlanDashboard from "./components/MealPlanDashboard";
import NotFound from "./pages/NotFound";
import OnboardingFlow from "./components/OnboardingFlow";

function App() {
  const [showOnboarding, setShowOnboarding] = useState(true);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          showOnboarding ? (
            <OnboardingFlow onComplete={handleOnboardingComplete} />
          ) : (
            <MealPlanDashboard />
          )
        } 
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
