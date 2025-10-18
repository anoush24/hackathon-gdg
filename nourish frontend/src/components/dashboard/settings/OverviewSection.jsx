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
  Calendar 
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
      {/* Settings Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Profile Info Card */}
        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <User className="w-6 h-6 text-green-600" />
              <h3 className="font-semibold">Profile Information</h3>
            </div>
            <Button
              onClick={() => onNavigateToSection('profile')}
              size="sm"
              variant="ghost"
              className="text-green-600 hover:bg-green-100"
            >
              <Edit className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Name:</span>
              <span className="font-medium">{formData.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium">{formData.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Member since:</span>
              <span className="font-medium">
                {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
              </span>
            </div>
          </div>
        </Card>

        {/* Budget & Location */}
        <Card className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <DollarSign className="w-6 h-6 text-emerald-600" />
              <h3 className="font-semibold">Budget & Location</h3>
            </div>
            <Button
              onClick={() => onNavigateToSection('budget')}
              size="sm"
              variant="ghost"
              className="text-emerald-600 hover:bg-emerald-100"
            >
              <Edit className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Weekly Budget:</span>
              <span className="font-medium">₹{formData.budget}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">City:</span>
              <span className="font-medium">{formData.city || 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">State:</span>
              <span className="font-medium">{formData.state || 'Not set'}</span>
            </div>
          </div>
        </Card>

        {/* Food Preferences */}
        <Card className="p-6 bg-gradient-to-br from-teal-50 to-green-50 border-teal-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Heart className="w-6 h-6 text-teal-600" />
              <h3 className="font-semibold">Food Preferences</h3>
            </div>
            <Button
              onClick={() => onNavigateToSection('preferences')}
              size="sm"
              variant="ghost"
              className="text-teal-600 hover:bg-teal-100"
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
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-green-600" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button 
            onClick={onBackToMealPlan}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 h-16 justify-start"
          >
            <ChefHat className="w-5 h-5 mr-3" />
            <div className="text-left">
              <p className="font-medium">Back to Meal Plan</p>
              <p className="text-xs opacity-90">Continue planning</p>
            </div>
          </Button>
          
          <Button 
            onClick={() => onNavigateToSection('history')}
            variant="outline" 
            className="h-16 justify-start border-green-200 hover:bg-green-50"
          >
            <History className="w-5 h-5 mr-3 text-green-600" />
            <div className="text-left">
              <p className="font-medium text-green-700">View History</p>
              <p className="text-xs text-green-600">Past meal plans</p>
            </div>
          </Button>
          
          <Button 
            onClick={() => onNavigateToSection('notifications')}
            variant="outline" 
            className="h-16 justify-start border-emerald-200 hover:bg-emerald-50 relative"
          >
            <Bell className="w-5 h-5 mr-3 text-emerald-600" />
            <div className="text-left">
              <p className="font-medium text-emerald-700">Notifications</p>
              <p className="text-xs text-emerald-600">
                {notifications.filter(n => !n.read).length} unread
              </p>
            </div>
            {notifications.filter(n => !n.read).length > 0 && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            )}
          </Button>
          
          <Button 
            onClick={() => onNavigateToSection('advanced')}
            variant="outline" 
            className="h-16 justify-start border-teal-200 hover:bg-teal-50"
          >
            <Settings className="w-5 h-5 mr-3 text-teal-600" />
            <div className="text-left">
              <p className="font-medium text-teal-700">Advanced</p>
              <p className="text-xs text-teal-600">More settings</p>
            </div>
          </Button>
        </div>
      </Card>

      {/* Account Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 text-center bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <Calendar className="w-8 h-8 text-green-600 mx-auto mb-3" />
          <h4 className="font-semibold text-gray-900 mb-1">Days Active</h4>
          <p className="text-2xl font-bold text-green-600">
            {Math.floor((new Date() - new Date(user?.createdAt || Date.now())) / (1000 * 60 * 60 * 24)) || 7}
          </p>
          <p className="text-sm text-green-500">Since joining</p>
        </Card>

        <Card className="p-6 text-center bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <Heart className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
          <h4 className="font-semibold text-gray-900 mb-1">Preferences Set</h4>
          <p className="text-2xl font-bold text-emerald-600">
            {formData.cuisines.length + formData.goals.length}
          </p>
          <p className="text-sm text-emerald-500">Total selections</p>
        </Card>

        <Card className="p-6 text-center bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200">
          <DollarSign className="w-8 h-8 text-teal-600 mx-auto mb-3" />
          <h4 className="font-semibold text-gray-900 mb-1">Weekly Budget</h4>
          <p className="text-2xl font-bold text-teal-600">₹{formData.budget}</p>
          <p className="text-sm text-teal-500">For meal planning</p>
        </Card>
      </div>
    </>
  );
};

export default OverviewSection;