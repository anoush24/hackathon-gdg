import { useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Loader2, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { authService } from "../../authBridge";
import HeroBackground from '../../assets/herobgveg5.png';

const LoginForm = ({ onLoginSuccess, onSwitchToSignup }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (field, value) => {
    setError("");
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      return "Please enter your email address";
    }
    if (!formData.password) {
      return "Please enter your password";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      console.log('🔑 Attempting login for:', formData.email);
      
      const response = await authService.login({
        email: formData.email.toLowerCase().trim(),
        password: formData.password
      });

      if (response.success) {
        console.log('✅ Login successful');
        onLoginSuccess(response.user);
      } else {
        setError(response.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      setError(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white/10 flex items-center justify-center p-4 relative">
      <div 
        className="absolute inset-0 z-0 pointer-events-none" 
        style={{
          backgroundImage: `url(${HeroBackground})`,
          backgroundRepeat: 'repeat', 
          opacity: 1,
        }}
      />
      
      <Card className="w-full max-w-md p-8 shadow-lg hover:shadow-xl border-2 border-green-500 bg-white rounded-xl relative z-10 transition-all duration-300">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-nunito font-bold text-gray-900 mb-2">Welcome Back! 👋</h1>
          <p className="text-lg font-nunito text-green-700 opacity-90">Sign in to continue your culinary journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold block text-gray-900">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-6 w-6 text-green-700" />
              <input
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full pl-10 p-3 border-2 border-green-500 rounded-xl focus:border-green-700 focus:ring-2 focus:ring-green-500/20 outline-none transition-all duration-300 bg-white text-gray-900 font-nunito hover:bg-green-50"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold block text-gray-900">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-6 w-6 text-green-700" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="w-full pl-10 pr-10 p-3 border-2 border-green-500 rounded-xl focus:border-green-700 focus:ring-2 focus:ring-green-500/20 outline-none transition-all duration-300 bg-white text-gray-900 font-nunito hover:bg-green-50"
                disabled={isSubmitting}
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-green-700 hover:text-green-900 transition-transform hover:rotate-12"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isSubmitting}
              >
                {showPassword ? (
                  <EyeOff className="h-6 w-6" />
                ) : (
                  <Eye className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border-2 border-red-200 rounded-xl shadow-lg">
              <p className="text-red-700 text-sm font-semibold">❌ {error}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-green-500 text-green-700 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 hover:bg-green-50 transition-all duration-300 font-bold text-lg group"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin group-hover:rotate-12 transition-transform" />
                Signing In...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm font-nunito text-gray-900 opacity-80">
            Don't have an account?{" "}
            <button
              onClick={onSwitchToSignup}
              className="text-green-700 hover:text-green-900 font-bold transition-all duration-300"
              disabled={isSubmitting}
            >
              Sign up here
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default LoginForm;
