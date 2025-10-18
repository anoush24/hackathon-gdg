import React from 'react';
import DashboardHeader from './DashboardHeader';

const SettingsLayout = ({ user, onBackToMealPlan, onLogout, children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-25 to-teal-50">
      <DashboardHeader 
        user={user}
        onBackToMealPlan={onBackToMealPlan}
        onLogout={onLogout}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            🌿 Profile & Settings
          </h2>
          <p className="text-gray-600">
            Manage your account, preferences, and meal planning settings.
          </p>
        </div>
        
        {children}
      </main>
    </div>
  );
};

export default SettingsLayout;