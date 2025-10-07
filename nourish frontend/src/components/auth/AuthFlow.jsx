import { useState, useEffect } from "react";
import LoginForm from "./LoginForm";
import OnboardingFlow from "./OnBoardingFlow";
import { authService } from "../../authBridge"; // Updated import path

const AuthFlow = ({ onAuthSuccess }) => {
  const [authMode, setAuthMode] = useState("login"); // "login" or "signup"
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check if user is already authenticated
  useEffect(() => {
    const checkExistingAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const user = authService.getStoredUser();
          if (user) {
            console.log('✅ User already authenticated:', user.email);
            onAuthSuccess(user);
            return;
          }
        }
      } catch (error) {
        console.log('❌ Auth check failed:', error);
        // Clear invalid data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkExistingAuth();
  }, [onAuthSuccess]);

  const handleLoginSuccess = (user) => {
    console.log('🎉 Login successful, user:', user);
    onAuthSuccess(user);
  };

  const handleSignupComplete = (data) => {
    console.log('🎉 Signup complete, data:', data);
    if (data.success && data.user) {
      onAuthSuccess(data.user);
    }
  };

  const switchToSignup = () => {
    setAuthMode("signup");
  };

  const switchToLogin = () => {
    setAuthMode("login");
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-warm mt-4">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {authMode === "login" ? (
        <LoginForm
          onLoginSuccess={handleLoginSuccess}
          onSwitchToSignup={switchToSignup}
        />
      ) : (
        <OnboardingFlow
          onComplete={handleSignupComplete}
          onSwitchToLogin={switchToLogin}
        />
      )}
    </>
  );
};

export default AuthFlow;
