
import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
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
  ArrowLeft,
  Save,
  X,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  Trash2,
  History
} from 'lucide-react';

const Dashboard = ({ user, onLogout, onBackToMealPlan }) => {
  // State management for different sections
  const [activeSection, setActiveSection] = useState('overview');
  const [isEditing, setIsEditing] = useState({});
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    budget: user?.budget || 75,
    city: user?.location?.city || '',
    state: user?.location?.state || '',
    cuisines: user?.preferences?.cuisines || [],
    goals: user?.preferences?.goals || [],
    allergies: user?.preferences?.allergies || []
  });
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'meal', message: 'New AI meal suggestion available!', time: '2 hours ago', read: false },
    { id: 2, type: 'budget', message: 'Weekly budget reminder: $25 remaining', time: '1 day ago', read: false },
    { id: 3, type: 'plan', message: 'Meal plan generated successfully', time: '2 days ago', read: true }
  ]);
  const [mealHistory, setMealHistory] = useState([
    { id: 1, date: '2025-09-20', meals: 3, calories: 1285, cost: 22, rating: 4.5 },
    { id: 2, date: '2025-09-19', meals: 3, calories: 1420, cost: 28, rating: 4.8 },
    { id: 3, date: '2025-09-18', meals: 2, calories: 980, cost: 18, rating: 4.2 }
  ]);

  // Available options
  const availableCuisines = [
    'Italian', 'Mediterranean', 'Asian', 'Mexican', 'Indian', 'Japanese', 
    'Thai', 'French', 'American', 'Chinese', 'Greek', 'Middle Eastern'
  ];
  const availableGoals = [
    'Weight Loss', 'Muscle Gain', 'Eat Healthier', 'Save Money', 
    'Try New Cuisines', 'Meal Prep', 'Family Meals', 'Quick Meals'
  ];
  const commonAllergies = [
    'None', 'Gluten', 'Dairy', 'Nuts', 'Shellfish', 'Eggs', 'Soy', 'Fish'
  ];

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

  const handleSave = (section) => {
    // Here you would typically send data to your backend
    console.log(`Saving ${section}:`, formData);
    setIsEditing(prev => ({ ...prev, [section]: false }));
    // Show success message or update user state
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
              <span className="font-medium">${formData.budget}</span>
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
          <p className="text-2xl font-bold text-teal-600">${formData.budget}</p>
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

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Full Name</label>
          <Input
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter your full name"
            className="mt-1"
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
          />
        </div>

        <div className="flex gap-4 pt-4">
          <Button onClick={() => handleSave('profile')} className="bg-green-600 hover:bg-green-700">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
          <Button 
            onClick={() => setActiveSection('overview')} 
            variant="outline"
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

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Weekly Budget ($)</label>
          <Input
            type="number"
            value={formData.budget}
            onChange={(e) => handleInputChange('budget', parseInt(e.target.value) || 0)}
            placeholder="Enter weekly budget"
            className="mt-1"
            min="0"
            max="1000"
          />
          <p className="text-xs text-gray-500 mt-1">Recommended: $50-$150 per week</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">City</label>
            <Input
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              placeholder="Enter your city"
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">State</label>
            <Input
              value={formData.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              placeholder="Enter your state"
              className="mt-1"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button onClick={() => handleSave('budget')} className="bg-emerald-600 hover:bg-emerald-700">
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
          <Button 
            onClick={() => setActiveSection('overview')} 
            variant="outline"
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
              >
                {allergy}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button onClick={() => handleSave('preferences')} className="bg-teal-600 hover:bg-teal-700">
            <Save className="w-4 h-4 mr-2" />
            Save Preferences
          </Button>
          <Button 
            onClick={() => setActiveSection('overview')} 
            variant="outline"
          >
            Cancel
          </Button>
        </div>
      </div>
    </Card>
  );

  const renderHistory = () => (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <History className="w-5 h-5 text-green-600" />
          Meal Plan History
        </h3>
        <Button
          onClick={() => setActiveSection('overview')}
          variant="ghost"
          size="sm"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-4">
        {mealHistory.map((entry) => (
          <Card key={entry.id} className="p-4 border-l-4 border-green-400">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-gray-900">
                  {new Date(entry.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h4>
                <div className="flex gap-4 mt-2 text-sm text-gray-600">
                  <span>🍽️ {entry.meals} meals</span>
                  <span>🔥 {entry.calories} calories</span>
                  <span>💰 ${entry.cost}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-sm ${
                        i < Math.floor(entry.rating) ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      ⭐
                    </span>
                  ))}
                </div>
                <span className="text-xs text-gray-500">{entry.rating}/5</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );

  const renderNotifications = () => (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Bell className="w-5 h-5 text-emerald-600" />
          Notifications
        </h3>
        <Button
          onClick={() => setActiveSection('overview')}
          variant="ghost"
          size="sm"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-3">
        {notifications.map((notification) => (
          <Card 
            key={notification.id} 
            className={`p-4 border-l-4 ${
              notification.read 
                ? 'border-gray-300 bg-gray-50' 
                : 'border-emerald-400 bg-emerald-50'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {notification.type === 'meal' && <Utensils className="w-4 h-4 text-green-600" />}
                  {notification.type === 'budget' && <DollarSign className="w-4 h-4 text-yellow-600" />}
                  {notification.type === 'plan' && <Calendar className="w-4 h-4 text-blue-600" />}
                  <span className={`font-medium ${notification.read ? 'text-gray-600' : 'text-gray-900'}`}>
                    {notification.message}
                  </span>
                </div>
                <span className="text-xs text-gray-500">{notification.time}</span>
              </div>
              <div className="flex gap-1">
                {!notification.read && (
                  <Button
                    onClick={() => handleNotificationRead(notification.id)}
                    size="sm"
                    variant="ghost"
                    className="text-emerald-600 hover:bg-emerald-100"
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  onClick={() => handleNotificationDelete(notification.id)}
                  size="sm"
                  variant="ghost"
                  className="text-red-600 hover:bg-red-100"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );

  const renderAdvanced = () => (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Settings className="w-5 h-5 text-teal-600" />
          Advanced Settings
        </h3>
        <Button
          onClick={() => setActiveSection('overview')}
          variant="ghost"
          size="sm"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-4">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Bell className="w-4 h-4 text-teal-600" />
              Notification Settings
            </h4>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-sm">Email notifications</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-sm">Meal reminders</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Budget alerts</span>
              </label>
            </div>
          </Card>

          <Card className="p-4">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Eye className="w-4 h-4 text-teal-600" />
              Privacy Settings
            </h4>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-sm">Share anonymous data</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Public meal history</span>
              </label>
            </div>
          </Card>
        </div>

        <Card className="p-4 border-red-200">
          <h4 className="font-medium text-red-700 mb-2 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Danger Zone
          </h4>
          <p className="text-sm text-gray-600 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Account
          </Button>
        </Card>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-25 to-teal-50">
      {/* Header with Back Button */}
      <header className="bg-white border-b border-green-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo + Back Button */}
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
            
            {/* User Info + Logout */}
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

      {/* Main Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            🌿 Profile & Settings
          </h2>
          <p className="text-gray-600">
            Manage your account, preferences, and meal planning settings.
          </p>
        </div>

        {/* Dynamic Content Based on Active Section */}
        {activeSection === 'overview' && renderOverview()}
        {activeSection === 'profile' && renderProfileEdit()}
        {activeSection === 'budget' && renderBudgetEdit()}
        {activeSection === 'preferences' && renderPreferences()}
        {activeSection === 'history' && renderHistory()}
        {activeSection === 'notifications' && renderNotifications()}
        {activeSection === 'advanced' && renderAdvanced()}
      </main>
    </div>
  );
};

export default Dashboard;

