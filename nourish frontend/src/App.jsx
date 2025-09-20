import { useState, useEffect } from 'react';
import AuthFlow from './components/AuthFlow';
import MealPlanDashboard from './components/MealPlanDashboard';
import Dashboard from './components/Dashboard';
import MealJournal from './components/MealJournal';
import MealCustomizationPage from './components/MealCustomizationPage'; // Import customization page
import { authService } from './authBridge';

function App() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState('meal-plan'); // Add 'meal-customization'
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing authentication on app load
  useEffect(() => {
    const checkAuth = () => {
      try {
        if (authService.isAuthenticated()) {
          const storedUser = authService.getStoredUser();
          if (storedUser) {
            setUser(storedUser);
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleAuthSuccess = (userData) => {
    console.log('🔐 Authentication successful:', userData);
    setUser(userData);
    setIsAuthenticated(true);
    setCurrentView('meal-plan');
  };

  const handleLogout = () => {
    console.log('👋 User logging out');
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setCurrentView('meal-plan');
  };

  const handleNavigateToSettings = () => {
    console.log('🔧 Navigating to settings');
    setCurrentView('settings');
  };

  const handleNavigateToMealJournal = () => {
    console.log('📖 Navigating to meal journal');
    setCurrentView('meal-journal');
  };

  const handleNavigateToCustomization = () => {
    console.log('🎨 Navigating to meal customization');
    setCurrentView('meal-customization');
  };

  const handleBackToMealPlan = () => {
    console.log('🍽️ Navigating back to meal plan');
    setCurrentView('meal-plan');
  };

  const handleSaveCustomization = (customizedMeals) => {
    console.log('💾 Saving customized meals:', customizedMeals);
    // Here you could save the customized meals to your backend
    // For now, just go back to meal plan
    setCurrentView('meal-plan');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-warm mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'meal-plan':
        return (
          <MealPlanDashboard 
            user={user} 
            onLogout={handleLogout}
            onNavigateToSettings={handleNavigateToSettings}
            onNavigateToMealJournal={handleNavigateToMealJournal}
            onNavigateToCustomization={handleNavigateToCustomization}
          />
        );
      case 'settings':
        return (
          <Dashboard 
            user={user} 
            onLogout={handleLogout}
            onBackToMealPlan={handleBackToMealPlan}
          />
        );
      case 'meal-journal':
        return (
          <MealJournal 
            user={user} 
            onLogout={handleLogout}
            onBackToMealPlan={handleBackToMealPlan}
          />
        );
      case 'meal-customization':
        return (
          <MealCustomizationPage 
            user={user}
            onBack={handleBackToMealPlan}
            onSave={handleSaveCustomization}
          />
        );
      default:
        return (
          <MealPlanDashboard 
            user={user} 
            onLogout={handleLogout}
            onNavigateToSettings={handleNavigateToSettings}
            onNavigateToMealJournal={handleNavigateToMealJournal}
            onNavigateToCustomization={handleNavigateToCustomization}
          />
        );
    }
  };

  return (
    <div className="App">
      {isAuthenticated && user ? (
        renderCurrentView()
      ) : (
        <AuthFlow onAuthSuccess={handleAuthSuccess} />
      )}
    </div>
  );
}

export default App;
