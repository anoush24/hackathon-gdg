import React from 'react';
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Heart, X, Save, Loader2 } from "lucide-react";

const PreferencesSection = ({ 
  formData, 
  onArrayToggle, 
  onSave, 
  onBack, 
  isSaving, 
  saveMessage,
  availableCuisines,
  availableGoals,
  commonAllergies 
}) => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Heart className="w-5 h-5 text-teal-600" />
          Food Preferences
        </h3>
        <Button
          onClick={onBack}
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
            : saveMessage.type === 'info'
            ? 'bg-blue-100 text-blue-800 border border-blue-300'
            : saveMessage.type === 'warning'
            ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
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
                onClick={() => onArrayToggle('cuisines', cuisine)}
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
                onClick={() => onArrayToggle('goals', goal)}
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
                onClick={() => onArrayToggle('allergies', allergy)}
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
            onClick={() => onSave('preferences')} 
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
            onClick={onBack} 
            variant="outline"
            disabled={isSaving}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default PreferencesSection;