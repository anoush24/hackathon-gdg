// src/components/Dashboard/Dashboard.jsx
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { 
  ArrowLeft, 
  User, 
  DollarSign, 
  Heart, 
  Save, 
  Loader2, 
  ChefHat, 
  LogOut, 
  Edit, 
  Settings, 
  Bell, 
  Calendar,
  X,
  History,
  Check,
  Trash2,
  AlertCircle
} from "lucide-react";
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const Dashboard = ({ user, onLogout, onBackToMealPlan, onPreferencesUpdated }) => {
  // State management
  const [activeSection, setActiveSection] = useState('overview');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ type: '', text: '' });
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    budget: user?.budget || 75,
    city: user?.location?.city || '',
    state: user?.location?.state || '',
    cuisines: user?.preferences?.cuisines || [],
    goals: user?.preferences?.goals || [],
    allergies: user?.preferences?.allergies || [],
    dietaryRestrictions: user?.preferences?.dietaryRestrictions || []
  });

  const [notifications, setNotifications] = useState([
    { id: 1, type: 'meal', message: 'New AI meal suggestion available!', time: '2 hours ago', read: false },
    { id: 2, type: 'budget', message: 'Weekly budget reminder: ₹25 remaining', time: '1 day ago', read: false },
    { id: 3, type: 'plan', message: 'Meal plan generated successfully', time: '2 days ago', read: true }
  ]);

  const [mealHistory, setMealHistory] = useState([
    { id: 1, date: '2025-09-20', meals: 3, calories: 1285, cost: 22, rating: 4.5 },
    { id: 2, date: '2025-09-19', meals: 3, calories: 1420, cost: 28, rating: 4.8 },
    { id: 3, date: '2025-09-18', meals: 2, calories: 980, cost: 18, rating: 4.2 }
  ]);

  // Available options (matching backend enum)
  const availableCuisines = [
    'Mediterranean', 'Asian', 'Mexican', 'Italian', 'Indian', 
    'Plant-Based', 'Keto', 'Paleo', 'American', 'Middle Eastern'
  ];

  const availableGoals = [
    'Lose Weight', 'Build Muscle', 'Eat More Plants', 'Save Time',
    'Try New Foods', 'Eat Healthier', 'Family Meals', 'Meal Prep'
  ];

  const commonAllergies = [
    'None', 'Nuts', 'Dairy', 'Gluten', 'Shellfish', 'Eggs', 'Soy', 'Fish', 'Sesame'
  ];

  // Get auth token
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  // Show save message
  const showSaveMessage = (type, text) => {
    setSaveMessage({ type, text });
    setTimeout(() => setSaveMessage({ type: '', text: '' }), 3000);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayToggle = (field, item) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(item) 
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item]
    }));
  };

  // Save profile (name, email, location, budget)
  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const token = getAuthToken();
      
      const profileData = {
        name: formData.name,
        email: formData.email,
        budget: formData.budget,
        location: {
          city: formData.city,
          state: formData.state,
          country: 'India'
        }
      };

      const response = await axios.put(
        `${API_URL}/users/profile`,
        profileData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('✅ Profile updated:', response.data);
      showSaveMessage('success', 'Profile updated successfully!');
      setActiveSection('overview');
      
    } catch (error) {
      console.error('❌ Save profile error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      showSaveMessage('error', errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  // Save budget & location
  const handleSaveBudget = async () => {
    setIsSaving(true);
    try {
      const token = getAuthToken();
      
      const updateData = {
        budget: formData.budget,
        location: {
          city: formData.city,
          state: formData.state,
          country: 'India'
        }
      };

      const response = await axios.put(
        `${API_URL}/users/profile`,
        updateData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('✅ Budget & location updated:', response.data);
      showSaveMessage('success', 'Budget and location updated successfully!');
      setActiveSection('overview');
      
    } catch (error) {
      console.error('❌ Save budget error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update budget';
      showSaveMessage('error', errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  // Save preferences
  // Save preferences with proper async handling
const handleSavePreferences = async () => {
  setIsSaving(true);
  try {
    const token = getAuthToken();
    
    const preferencesData = {
      cuisines: formData.cuisines,
      goals: formData.goals,
      allergies: formData.allergies,
      dietaryRestrictions: formData.dietaryRestrictions
    };

    // 1. Update user preferences first
    const response = await axios.put(
      `${API_URL}/users/preferences`,
      preferencesData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Preferences updated:', response.data);

    // 2. Force regenerate meal plan with new preferences
    showSaveMessage('info', 'Preferences saved! Regenerating meal plan...');
    
    try {
      console.log('🔄 Regenerating meal plan with new preferences...');
      
      const mealPlanResponse = await axios.post(
        `${API_URL}/meal-plans/generate-from-agent`,
        {
          name: user.name,
          preferences: preferencesData,
          forceRegenerate: true // Force regeneration
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ Meal plan regenerated:', mealPlanResponse.data);
      
      // 3. Update success message
      showSaveMessage('success', 'Preferences updated and new meal plan generated!');
      
      // 4. IMPORTANT: Notify parent component AFTER regeneration completes
      if (onPreferencesUpdated) {
        onPreferencesUpdated(preferencesData);
      }
      
      // 5. Small delay to ensure backend operation completes
      setTimeout(() => {
        setActiveSection('overview');
      }, 1000);
      
    } catch (mealPlanError) {
      console.warn('⚠️ Preferences saved but meal plan regeneration failed:', mealPlanError);
      showSaveMessage('warning', 'Preferences updated! Please go back to dashboard to see changes.');
      
      // Still notify parent even if regeneration failed
      if (onPreferencesUpdated) {
        onPreferencesUpdated(preferencesData);
      }
    }
      
  } catch (error) {
    console.error('❌ Save preferences error:', error);
    const errorMessage = error.response?.data?.message || 'Failed to update preferences';
    showSaveMessage('error', errorMessage);
  } finally {
    setIsSaving(false);
  }
};

  // Generic save handler
  const handleSave = (section) => {
    switch(section) {
      case 'profile':
        return handleSaveProfile();
      case 'budget':
        return handleSaveBudget();
      case 'preferences':
        return handleSavePreferences();
      default:
        console.warn('Unknown section:', section);
    }
  };

  const handleNotificationRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const handleNotificationDelete = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const handleDeactivateAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to deactivate your account? This action can be reversed by contacting support.'
    );
    
    if (!confirmed) return;

    setIsSaving(true);
    try {
      const token = getAuthToken();
      
      await axios.delete(
        `${API_URL}/users/account`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      showSaveMessage('success', 'Account deactivated successfully');
      setTimeout(() => {
        onLogout();
      }, 2000);
    } catch (error) {
      console.error('❌ Deactivate error:', error);
      showSaveMessage('error', 'Failed to deactivate account');
    } finally {
      setIsSaving(false);
    }
  };

  const renderOverview = () => (
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
              onClick={() => setActiveSection('profile')}
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
              onClick={() => setActiveSection('budget')}
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
              onClick={() => setActiveSection('preferences')}
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
            onClick={() => setActiveSection('history')}
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
            onClick={() => setActiveSection('notifications')}
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
            onClick={() => setActiveSection('advanced')}
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

  const renderProfileEdit = () => (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <User className="w-5 h-5 text-green-600" />
          Edit Profile
        </h3>
        <Button
          onClick={() => setActiveSection('overview')}
          variant="ghost"
          size="sm"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {saveMessage.text && (
        <div className={`mb-4 p-3 rounded-lg ${
          saveMessage.type === 'success' 
            ? 'bg-green-100 text-green-800 border border-green-300' 
            : 'bg-red-100 text-red-800 border border-red-300'
        }`}>
          {saveMessage.text}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Full Name</label>
          <Input
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter your full name"
            className="mt-1"
            disabled={isSaving}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Email Address</label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="Enter your email"
            className="mt-1"
            disabled={isSaving}
          />
        </div>

        <div className="flex gap-4 pt-4">
          <Button 
            onClick={() => handleSave('profile')} 
            className="bg-green-600 hover:bg-green-700"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
          <Button 
            onClick={() => setActiveSection('overview')} 
            variant="outline"
            disabled={isSaving}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Card>
  );

  const renderBudgetEdit = () => (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-emerald-600" />
          Budget & Location Settings
        </h3>
        <Button
          onClick={() => setActiveSection('overview')}
          variant="ghost"
          size="sm"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {saveMessage.text && (
        <div className={`mb-4 p-3 rounded-lg ${
          saveMessage.type === 'success' 
            ? 'bg-green-100 text-green-800 border border-green-300' 
            : 'bg-red-100 text-red-800 border border-red-300'
        }`}>
          {saveMessage.text}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Weekly Budget (₹)</label>
          <Input
            type="number"
            value={formData.budget}
            onChange={(e) => handleInputChange('budget', parseInt(e.target.value) || 0)}
            placeholder="Enter weekly budget"
            className="mt-1"
            min="0"
            max="10000"
            disabled={isSaving}
          />
          <p className="text-xs text-gray-500 mt-1">Recommended: ₹1000-₹3000 per week</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">City</label>
            <Input
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              placeholder="Enter your city"
              className="mt-1"
              disabled={isSaving}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">State</label>
            <Input
              value={formData.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              placeholder="Enter your state"
              className="mt-1"
              disabled={isSaving}
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button 
            onClick={() => handleSave('budget')} 
            className="bg-emerald-600 hover:bg-emerald-700"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>
          <Button 
            onClick={() => setActiveSection('overview')} 
            variant="outline"
            disabled={isSaving}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Card>
  );

  const renderPreferences = () => (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Heart className="w-5 h-5 text-teal-600" />
          Food Preferences
        </h3>
        <Button
          onClick={() => setActiveSection('overview')}
          variant="ghost"
          size="sm"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {saveMessage.text && (
        <div className={`mb-4 p-3 rounded-lg ${
          saveMessage.type === 'success' 
            ? 'bg-green-100 text-green-800 border border-green-300' 
            : 'bg-red-100 text-red-800 border border-red-300'
        }`}>
          {saveMessage.text}
        </div>
      )}

      <div className="space-y-6">
        {/* Cuisines */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-3 block">
            Favorite Cuisines (Select multiple)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {availableCuisines.map((cuisine) => (
              <button
                key={cuisine}
                onClick={() => handleArrayToggle('cuisines', cuisine)}
                className={`p-2 text-sm rounded-md border transition-colors ${
                  formData.cuisines.includes(cuisine)
                    ? 'bg-teal-100 border-teal-300 text-teal-800'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
                disabled={isSaving}
              >
                {cuisine}
              </button>
            ))}
          </div>
        </div>

        {/* Goals */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-3 block">
            Health Goals (Select multiple)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {availableGoals.map((goal) => (
              <button
                key={goal}
                onClick={() => handleArrayToggle('goals', goal)}
                className={`p-2 text-sm rounded-md border transition-colors text-left ${
                  formData.goals.includes(goal)
                    ? 'bg-green-100 border-green-300 text-green-800'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
                disabled={isSaving}
              >
                {goal}
              </button>
            ))}
          </div>
        </div>

        {/* Allergies */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-3 block">
            Allergies & Dietary Restrictions
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {commonAllergies.map((allergy) => (
              <button
                key={allergy}
                onClick={() => handleArrayToggle('allergies', allergy)}
                className={`p-2 text-sm rounded-md border transition-colors ${
                  formData.allergies.includes(allergy)
                    ? 'bg-red-100 border-red-300 text-red-800'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
                disabled={isSaving}
              >
                {allergy}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button 
            onClick={() => handleSave('preferences')} 
            className="bg-teal-600 hover:bg-teal-700"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Preferences
              </>
            )}
          </Button>
          <Button 
            onClick={() => setActiveSection('overview')} 
            variant="outline"
            disabled={isSaving}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Card>
  );

  // Keep other render functions (renderHistory, renderNotifications, renderAdvanced)...
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-25 to-teal-50">
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            🌿 Profile & Settings
          </h2>
          <p className="text-gray-600">
            Manage your account, preferences, and meal planning settings.
          </p>
        </div>

        {activeSection === 'overview' && renderOverview()}
        {activeSection === 'profile' && renderProfileEdit()}
        {activeSection === 'budget' && renderBudgetEdit()}
        {activeSection === 'preferences' && renderPreferences()}
        {/* Add other sections as needed */}
      </main>
    </div>
  );
};

export default Dashboard;
