import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Layout
import SettingsLayout from './settings/SettingsLayout';

// Section Components
import OverviewSection from './settings/OverviewSection';
import ProfileSection from './settings/ProfileSection';
import BudgetSection from './settings/BudgetSection';
import PreferencesSection from './settings/PreferencesSection';
import { authService } from "../../authBridge";

const API_URL = 'http://localhost:5000/api';

const Dashboard = ({ user, onLogout, onBackToMealPlan, onPreferencesUpdated }) => {
  const navigate = useNavigate();
  
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

  // Handlers
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

  const handleNavigateToSection = (section) => {
    setActiveSection(section);
  };

  const handleBackToOverview = () => {
    setActiveSection('overview');
  };

  const updateUserData = (updatedData) => {
  // Update local storage without triggering meal plan refresh
  const updatedUser = authService.updateStoredUser(updatedData);
  
  // Don't call onPreferencesUpdated here for non-preference updates
  console.log('📝 User data updated locally (no meal plan refresh needed)');
  
  return updatedUser;
};

  // Save handlers
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
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Profile updated:', response.data);
    
    // Update local user data
    if (response.data.user) {
      updateUserData(response.data.user);
    }
    
    showSaveMessage('success', 'Profile updated successfully!');
    setActiveSection('overview');
    
  } catch (error) {
    console.error('❌ Save profile error:', error);
    
    if (error.response?.status === 401) {
      console.log('🔓 Authentication failed, logging out');
      authService.clearAuth();
      onLogout();
      return;
    }
    
    const errorMessage = error.response?.data?.message || 'Failed to update profile';
    showSaveMessage('error', errorMessage);
  } finally {
    setIsSaving(false);
  }
};

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
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Budget & location updated:', response.data);
    
    // Update local user data
    if (response.data.user) {
      updateUserData(response.data.user);
    }
    
    showSaveMessage('success', 'Budget and location updated successfully!');
    setActiveSection('overview');
    
  } catch (error) {
    console.error('❌ Save budget error:', error);
    
    if (error.response?.status === 401) {
      console.log('🔓 Authentication failed, logging out');
      authService.clearAuth();
      onLogout();
      return;
    }
    
    const errorMessage = error.response?.data?.message || 'Failed to update budget';
    showSaveMessage('error', errorMessage);
  } finally {
    setIsSaving(false);
  }
};


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

      const currentUser = authService.getStoredUser();
      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          preferences: response.data.preferences || preferencesData
        };
        authService.updateStoredUser(updatedUser);
      }

      showSaveMessage('info', 'Preferences saved! Regenerating meal plan...');
      
      try {
        console.log('🔄 Regenerating meal plan with new preferences...');
        
        const mealPlanResponse = await axios.post(
          `${API_URL}/meal-plans/generate-from-agent`,
          {
            name: user.name,
            preferences: preferencesData,
            forceRegenerate: true
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        console.log('✅ Meal plan regenerated:', mealPlanResponse.data);
        
        showSaveMessage('success', 'Preferences updated and new meal plan generated!');
        
        if (onPreferencesUpdated) {
          onPreferencesUpdated(preferencesData);
        }
        
        setTimeout(() => {
          setActiveSection('overview');
        }, 1000);
        
      } catch (mealPlanError) {
        console.warn('⚠️ Preferences saved but meal plan regeneration failed:', mealPlanError);
        showSaveMessage('warning', 'Preferences updated! Please go back to dashboard to see changes.');
        
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

  // Render section based on activeSection
  const renderCurrentSection = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <OverviewSection
            user={user}
            formData={formData}
            notifications={notifications}
            onNavigateToSection={handleNavigateToSection}
            onBackToMealPlan={onBackToMealPlan}
          />
        );
      
      case 'profile':
        return (
          <ProfileSection
            formData={formData}
            onInputChange={handleInputChange}
            onSave={handleSave}
            onBack={handleBackToOverview}
            isSaving={isSaving}
            saveMessage={saveMessage}
          />
        );
      
      case 'budget':
        return (
          <BudgetSection
            formData={formData}
            onInputChange={handleInputChange}
            onSave={handleSave}
            onBack={handleBackToOverview}
            isSaving={isSaving}
            saveMessage={saveMessage}
          />
        );
      
      case 'preferences':
        return (
          <PreferencesSection
            formData={formData}
            onArrayToggle={handleArrayToggle}
            onSave={handleSave}
            onBack={handleBackToOverview}
            isSaving={isSaving}
            saveMessage={saveMessage}
            availableCuisines={availableCuisines}
            availableGoals={availableGoals}
            commonAllergies={commonAllergies}
          />
        );
      
      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-500">Section not found</p>
            <button 
              onClick={handleBackToOverview}
              className="text-green-600 hover:underline mt-2"
            >
              Back to Overview
            </button>
          </div>
        );
    }
  };

  return (
    <SettingsLayout
      user={user}
      onBackToMealPlan={onBackToMealPlan}
      onLogout={onLogout}
    >
      {renderCurrentSection()}
    </SettingsLayout>
  );
};

export default Dashboard;