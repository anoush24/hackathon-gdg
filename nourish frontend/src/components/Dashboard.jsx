import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import {
  ChefHat,
  Settings,
  LogOut,
  User,
  Calendar,
  DollarSign,
  MapPin,
  Heart,
  Utensils,
  Search,
  Plus,
  Clock,
  ChevronDown,
  Edit,
  Bell,
  ArrowLeft
} from 'lucide-react';

const Dashboard = ({ user, onLogout, onBackToMealPlan }) => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header with Back Button */}
      <header className="bg-white border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo + Back Button */}
            <div className="flex items-center gap-4">
              <Button
                onClick={onBackToMealPlan}
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Meal Plan
              </Button>
              <div className="border-l border-gray-300 h-6"></div>
              <div className="flex items-center gap-3">
                <ChefHat className="w-8 h-8 text-primary" />
                <h1 className="text-2xl font-bold text-primary">Settings & Preferences</h1>
              </div>
            </div>
            
            {/* User Info + Logout */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white font-medium">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline">{user.name}</span>
              </div>
              
              <Button
                onClick={onLogout}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Profile & Settings
          </h2>
          <p className="text-gray-600">
            Manage your account, preferences, and meal planning settings.
          </p>
        </div>

        {/* Settings Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Profile Info Card */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-6 h-6 text-primary" />
              <h3 className="font-semibold">Profile Information</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">{user.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Member since:</span>
                <span className="font-medium">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </Card>

          {/* Budget & Location */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <DollarSign className="w-6 h-6 text-green-600" />
              <h3 className="font-semibold">Budget & Location</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Weekly Budget:</span>
                <span className="font-medium">${user.budget}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">City:</span>
                <span className="font-medium">{user.location?.city}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">State:</span>
                <span className="font-medium">{user.location?.state}</span>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4">
              <Settings className="w-4 h-4 mr-2" />
              Update Settings
            </Button>
          </Card>

          {/* Food Preferences */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-6 h-6 text-red-500" />
              <h3 className="font-semibold">Food Preferences</h3>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Cuisines:</label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {user.preferences?.cuisines?.map((cuisine) => (
                    <Badge key={cuisine} variant="outline" className="text-xs">
                      {cuisine}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Goals:</label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {user.preferences?.goals?.map((goal) => (
                    <Badge key={goal} variant="outline" className="text-xs">
                      {goal}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Allergies:</label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {user.preferences?.allergies?.map((allergy) => (
                    <Badge key={allergy} variant="outline" className="text-xs">
                      {allergy}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4">
              <Settings className="w-4 h-4 mr-2" />
              Update Preferences
            </Button>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              onClick={onBackToMealPlan}
              className="bg-gradient-primary h-16 justify-start"
            >
              <ChefHat className="w-5 h-5 mr-3" />
              <div className="text-left">
                <p className="font-medium">Back to Meal Plan</p>
                <p className="text-xs opacity-90">Continue planning</p>
              </div>
            </Button>
            
            <Button variant="outline" className="h-16 justify-start">
              <Calendar className="w-5 h-5 mr-3" />
              <div className="text-left">
                <p className="font-medium">View History</p>
                <p className="text-xs text-gray-500">Past meal plans</p>
              </div>
            </Button>
            
            <Button variant="outline" className="h-16 justify-start">
              <Bell className="w-5 h-5 mr-3" />
              <div className="text-left">
                <p className="font-medium">Notifications</p>
                <p className="text-xs text-gray-500">Manage alerts</p>
              </div>
            </Button>
            
            <Button variant="outline" className="h-16 justify-start">
              <Settings className="w-5 h-5 mr-3" />
              <div className="text-left">
                <p className="font-medium">Advanced</p>
                <p className="text-xs text-gray-500">More settings</p>
              </div>
            </Button>
          </div>
        </Card>

        {/* Account Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="p-6 text-center">
            <Calendar className="w-8 h-8 text-primary mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 mb-1">Days Active</h4>
            <p className="text-2xl font-bold text-primary">
              {Math.floor((new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24))}
            </p>
            <p className="text-sm text-gray-500">Since joining</p>
          </Card>

          <Card className="p-6 text-center">
            <Heart className="w-8 h-8 text-red-500 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 mb-1">Preferences Set</h4>
            <p className="text-2xl font-bold text-red-500">
              {(user.preferences?.cuisines?.length || 0) + (user.preferences?.goals?.length || 0)}
            </p>
            <p className="text-sm text-gray-500">Total selections</p>
          </Card>

          <Card className="p-6 text-center">
            <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 mb-1">Weekly Budget</h4>
            <p className="text-2xl font-bold text-green-600">${user.budget}</p>
            <p className="text-sm text-gray-500">For meal planning</p>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
