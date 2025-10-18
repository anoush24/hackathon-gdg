import React from 'react';
import DashboardHeader from './DashboardHeader';
import HeroBackground from '../../../assets/herobgveg5.png'; // Same background as WelcomeSection

const SettingsLayout = ({ user, onBackToMealPlan, onLogout, children }) => {
  return (
    <div className="min-h-screen bg-green-50 relative overflow-hidden">
      {/* Background Pattern - Same as MealPlanDashboard */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none" 
        style={{
          backgroundImage: `url(${HeroBackground})`,
          backgroundRepeat: 'repeat', 
          opacity: 0.1,
        }}
      />

      <DashboardHeader 
        user={user}
        onBackToMealPlan={onBackToMealPlan}
        onLogout={onLogout}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Hero Section - Similar to WelcomeSection style */}
        <div className="mb-12 relative">
          <div className="flex items-center justify-center text-center mb-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-green-200">
              <h2 className="text-4xl font-nunito font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
                Profile & Settings
              </h2>
              <p className="text-md text-gray-600 font-medium">
                Manage your account, preferences, and meal planning settings
              </p>
            </div>
          </div>
        </div>
        
        {children}
      </main>
    </div>
  );
};

export default SettingsLayout;