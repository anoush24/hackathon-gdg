import React from 'react';
import { Card } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { 
  User, 
  DollarSign, 
  Heart, 
  Edit, 
  Settings, 
  ChefHat, 
  History, 
  Bell, 
  Calendar,
  Sparkles,
  ArrowRight
} from "lucide-react";

const OverviewSection = ({ 
  user, 
  formData, 
  notifications, 
  onNavigateToSection, 
  onBackToMealPlan 
}) => {
  return (
    <>
      {/* Hero Action Card - Similar to WelcomeSection style */}
      <div className="mb-12">
        <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
          
          {/* <div className="relative p-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">Welcome back, {formData.name}! 👋</h3>
                <p className="text-green-100 mb-6 max-w-lg">
                  Your personalized nutrition journey continues. Manage your preferences, 
                  track your progress, and fine-tune your meal planning experience.
                </p>
                
                <Button 
                  onClick={onBackToMealPlan}
                  className="bg-white text-green-600 hover:bg-green-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <ChefHat className="w-5 h-5 mr-2" />
                  Back to Today's Meals
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
              
              <div className="hidden lg:block">
                <Sparkles className="w-24 h-24 text-white/20" />
              </div>
            </div>
          </div> */}
        </Card>
      </div>

      {/* Settings Cards Grid - Matching MealCard style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {/* Profile Info Card */}
        <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-500 rounded-xl shadow-md">
                  <User className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-lg">Profile</h3>
              </div>
              <Button
                onClick={() => onNavigateToSection('profile')}
                size="sm"
                variant="ghost"
                className="text-green-600 hover:bg-green-100 group-hover:scale-110 transition-transform"
              >
                <Edit className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Name:</span>
                <span className="font-semibold text-right">{formData.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Email:</span>
                <span className="font-semibold text-right truncate ml-2">{formData.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Member since:</span>
                <span className="font-semibold text-right">
                  {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                </span>
              </div>
            </div>
            
            <div className="mt-6">
              <Button
                onClick={() => onNavigateToSection('profile')}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                size="sm"
              >
                Edit Profile
              </Button>
            </div>
          </div>
        </Card>

        {/* Budget & Location Card */}
        <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-500 rounded-xl shadow-md">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-lg">Budget</h3>
              </div>
              <Button
                onClick={() => onNavigateToSection('budget')}
                size="sm"
                variant="ghost"
                className="text-emerald-600 hover:bg-emerald-100 group-hover:scale-110 transition-transform"
              >
                <Edit className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Weekly Budget:</span>
                <span className="font-bold text-emerald-600 text-lg">₹{formData.budget}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">City:</span>
                <span className="font-semibold">{formData.city || 'Not set'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">State:</span>
                <span className="font-semibold">{formData.state || 'Not set'}</span>
              </div>
            </div>
            
            <div className="mt-6">
              <Button
                onClick={() => onNavigateToSection('budget')}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                size="sm"
              >
                Update Budget
              </Button>
            </div>
          </div>
        </Card>

        {/* Food Preferences Card */}
        <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-br from-teal-50 to-green-50 p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-teal-500 rounded-xl shadow-md">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-lg">Preferences</h3>
              </div>
              <Button
                onClick={() => onNavigateToSection('preferences')}
                size="sm"
                variant="ghost"
                className="text-teal-600 hover:bg-teal-100 group-hover:scale-110 transition-transform"
              >
                <Edit className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Cuisines:</label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {formData.cuisines.slice(0, 3).map((cuisine) => (
                    <Badge key={cuisine} variant="outline" className="text-xs bg-teal-50 text-teal-700 border-teal-200">
                      {cuisine}
                    </Badge>
                  ))}
                  {formData.cuisines.length > 3 && (
                    <Badge variant="outline" className="text-xs bg-teal-50 text-teal-700 border-teal-200">
                      +{formData.cuisines.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Goals:</label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {formData.goals.slice(0, 2).map((goal) => (
                    <Badge key={goal} variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                      {goal}
                    </Badge>
                  ))}
                  {formData.goals.length > 2 && (
                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                      +{formData.goals.length - 2}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <Button
                onClick={() => onNavigateToSection('preferences')}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                size="sm"
              >
                Update Preferences
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions - Similar to MealPlanActions style */}
      {/* <Card className="mb-8 border-0 shadow-xl">
        <div className="bg-gradient-to-r from-gray-50 to-green-50 p-8">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Settings className="w-6 h-6 text-green-600" />
            Quick Actions
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              onClick={onBackToMealPlan}
              className="h-16 px-6 bg-gradient-primary text-primary-foreground shadow-warm hover:shadow-glow transition-all duration-300 transform hover:scale-105 border-0 justify-start"
            >
              <ChefHat className="w-6 h-6 mr-3" />
              <div className="text-left">
                <p className="font-bold text-lg">Meal Dashboard</p>
                <p className="text-sm opacity-90">Back to today's plan</p>
              </div>
            </Button>
            
            <Button 
              onClick={() => onNavigateToSection('history')}
              className="h-16 px-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-warm hover:shadow-glow transition-all duration-300 transform hover:scale-105 border-0 justify-start"
            >
              <History className="w-6 h-6 mr-3" />
              <div className="text-left">
                <p className="font-bold text-lg">View History</p>
                <p className="text-sm opacity-90">Past meal plans</p>
              </div>
            </Button>
            
            <Button 
              onClick={() => onNavigateToSection('notifications')}
              className="h-16 px-6 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-warm hover:shadow-glow transition-all duration-300 transform hover:scale-105 border-0 justify-start relative"
            >
              <Bell className="w-6 h-6 mr-3" />
              <div className="text-left">
                <p className="font-bold text-lg">Notifications</p>
                <p className="text-sm opacity-90">
                  {notifications.filter(n => !n.read).length} unread
                </p>
              </div>
              {notifications.filter(n => !n.read).length > 0 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
              )}
            </Button>
            
            <Button 
              onClick={() => onNavigateToSection('advanced')}
              className="h-16 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-warm hover:shadow-glow transition-all duration-300 transform hover:scale-105 border-0 justify-start"
            >
              <Settings className="w-6 h-6 mr-3" />
              <div className="text-left">
                <p className="font-bold text-lg">Advanced</p>
                <p className="text-sm opacity-90">More options</p>
              </div>
            </Button>
          </div>
        </div>
      </Card> */}

      {/* Account Stats - Like nutrition cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 text-center bg-gradient-to-br from-green-100 to-green-200 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="p-3 bg-green-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <h4 className="font-bold text-gray-900 mb-2">Days Active</h4>
          <p className="text-3xl font-bold text-green-600 mb-1">
            {Math.floor((new Date() - new Date(user?.createdAt || Date.now())) / (1000 * 60 * 60 * 24)) || 7}
          </p>
          <p className="text-sm text-green-700">Since joining Nourish</p>
        </Card>

        <Card className="p-6 text-center bg-gradient-to-br from-emerald-100 to-emerald-200 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="p-3 bg-emerald-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h4 className="font-bold text-gray-900 mb-2">Preferences Set</h4>
          <p className="text-3xl font-bold text-emerald-600 mb-1">
            {formData.cuisines.length + formData.goals.length}
          </p>
          <p className="text-sm text-emerald-700">Total selections</p>
        </Card>

        <Card className="p-6 text-center bg-gradient-to-br from-teal-100 to-teal-200 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="p-3 bg-teal-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <DollarSign className="w-8 h-8 text-white" />
          </div>
          <h4 className="font-bold text-gray-900 mb-2">Weekly Budget</h4>
          <p className="text-3xl font-bold text-teal-600 mb-1">₹{formData.budget}</p>
          <p className="text-sm text-teal-700">For meal planning</p>
        </Card>
      </div>
    </>
  );
};

export default OverviewSection;