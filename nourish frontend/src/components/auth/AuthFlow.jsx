import { useState, useEffect } from "react";
import LoginForm from "./LoginForm";
import OnboardingFlow from "./OnBoardingFlow";
import { authService } from "../../authBridge";

const AuthFlow = ({ onAuthSuccess }) => {
  const [authMode, setAuthMode] = useState("login"); // "login" or "signup"
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check if user is already authenticated
  useEffect(() => {
  const checkExistingAuth = async () => {
    try {
      console.log('🔍 Checking existing authentication...');
      
      // First check if we have valid auth
      if (authService.isAuthenticated()) {
        const user = authService.getStoredUser();
        if (user) {
          console.log('✅ User already authenticated:', user.email);
          onAuthSuccess(user);
          return;
        }
      }
      
      // If no valid auth, clear any stale data
      console.log('❌ No valid authentication found');
      authService.clearAuth();
    } catch (error) {
      console.log('❌ Auth check failed:', error);
      authService.clearAuth();
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