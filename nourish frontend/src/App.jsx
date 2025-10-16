import { useState, useRef, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import AuthFlow from './components/auth/AuthFlow';
import MealPlanDashboard from './components/dashboard/MealPlanDashboard';
import Dashboard from './components/dashboard/Dashboard';
import MealJournal from './components/MealJournal';
import MealCustomizationPage from './components/MealCustomizationPage'; 
import { authService } from './authBridge';
import axios from 'axios';

axios.interceptors.request.use(
  (config) => {
    const token = authService.getValidToken();
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return children(user, setUser);
};

// Main App Component
function App() {
  const navigate = useNavigate();
  const dashboardRef = useRef(null);

  const handleAuthSuccess = (userData) => {
    console.log('🔐 Authentication successful:', userData);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    console.log('👋 User logging out');
    authService.logout();
    navigate('/login');
  };

  const handlePreferencesUpdated = async (newPreferences, setUser) => {
    console.log('🔄 Preferences updated, refreshing user data...');
    
    // Update user object with new preferences
    setUser(prevUser => ({
      ...prevUser,
      preferences: newPreferences
    }));

    // Wait a moment for backend to complete operations
    setTimeout(() => {
      console.log('🔄 Triggering meal plan refresh...');
      // Trigger meal plan refresh in dashboard
      if (dashboardRef.current?.refetchMealsWithNewPreferences) {
        dashboardRef.current.refetchMealsWithNewPreferences();
      }
    }, 2000);
  };

  return (
    <div className="App">
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={
            authService.isAuthenticated() ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <AuthFlow onAuthSuccess={handleAuthSuccess} />
            )
          } 
        />

        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              {(user, setUser) => (
                <MealPlanDashboard 
                  ref={dashboardRef}
                  user={user} 
                  onLogout={handleLogout}
                  onNavigateToSettings={() => navigate('/settings')}
                  onNavigateToMealJournal={() => navigate('/journal')}
                  onNavigateToCustomization={() => navigate('/customize')}
                />
              )}
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              {(user, setUser) => (
                <Dashboard 
                  user={user} 
                  onLogout={handleLogout}
                  onBackToMealPlan={() => navigate('/dashboard')}
                  onPreferencesUpdated={(newPrefs) => handlePreferencesUpdated(newPrefs, setUser)}
                />
              )}
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/journal" 
          element={
            <ProtectedRoute>
              {(user, setUser) => (
                <MealJournal 
                  user={user} 
                  onLogout={handleLogout}
                  onBackToMealPlan={() => navigate('/dashboard')}
                />
              )}
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/customize" 
          element={
            <ProtectedRoute>
              {(user, setUser) => (
                <MealCustomizationPage 
                  user={user}
                  onBack={() => navigate('/dashboard')}
                  onSave={() => navigate('/dashboard')}
                />
              )}
            </ProtectedRoute>
          } 
        />

        {/* Redirect Routes */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
}

export default App;