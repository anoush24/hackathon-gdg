import React from 'react';
import { Button } from "../../ui/button";
import { ArrowLeft, ChefHat, LogOut } from "lucide-react";

const DashboardHeader = ({ user, onBackToMealPlan, onLogout }) => {
  return (
    <header className="bg-white border-b border-green-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={onBackToMealPlan}
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 text-green-600 hover:bg-green-50"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Meal Plan
            </Button>
            <div className="border-l border-green-300 h-6"></div>
            <div className="flex items-center gap-3">
              <ChefHat className="w-8 h-8 text-green-600" />
              <h1 className="text-2xl font-bold text-green-700">Settings & Preferences</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-medium">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="hidden sm:inline">{user?.name || 'User'}</span>
            </div>
            
            <Button
              onClick={onLogout}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 border-green-200 text-green-600 hover:bg-green-50"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;