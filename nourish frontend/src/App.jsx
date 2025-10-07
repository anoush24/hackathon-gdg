import { useState, useRef, useEffect } from 'react';
import AuthFlow from './components/auth/AuthFlow';
import MealPlanDashboard from './components/dashboard/MealPlanDashboard';
import Dashboard from './components/dashboard/Dashboard';
import MealJournal from './components/MealJournal';
import MealCustomizationPage from './components/MealCustomizationPage'; 
import { authService } from './authBridge';

function App() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState('meal-plan');
  const [isLoading, setIsLoading] = useState(true);
  const dashboardRef = useRef(null); 

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
        } else {
          authService.logout();
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        authService.logout();
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

  const handleCustomizationSave = (updatedMeals) => {
    setCurrentView('dashboard');
    dashboardRef.current?.handleMealPlanUpdate(updatedMeals);
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
             ref={dashboardRef}
            user={user} 
            onLogout={handleLogout}
            onNavigateToSettings={handleNavigateToSettings}
            onNavigateToMealJournal={handleNavigateToMealJournal}
            onNavigateToCustomization={handleNavigateToCustomization}
          />
        );
      case 'meal-customization':
        return (
          <MealCustomizationPage 
            user={user}
            onBack={() => setCurrentView('meal-plan')}
            onSave={() => {
              setCurrentView('meal-plan');
            }}
          />
        );
      case 'settings':
        return (
          <Dashboard 
            user={user} 
            onLogout={handleLogout}
            onBackToMealPlan={() => setCurrentView('meal-plan')}
          />
        );
         case 'meal-journal':
        return (
          <MealJournal 
            user={user} 
            onLogout={handleLogout}
            onBackToMealPlan={() => setCurrentView('meal-plan')}
          />
        );
      default:
        return (
          <MealPlanDashboard 
            ref={dashboardRef}
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