import React from 'react';
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { DollarSign, X, Save, Loader2 } from "lucide-react";

const BudgetSection = ({ 
  formData, 
  onInputChange, 
  onSave, 
  onBack, 
  isSaving, 
  saveMessage 
}) => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-emerald-600" />
          Budget & Location Settings
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
            onChange={(e) => onInputChange('budget', parseInt(e.target.value) || 0)}
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
              onChange={(e) => onInputChange('city', e.target.value)}
              placeholder="Enter your city"
              className="mt-1"
              disabled={isSaving}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">State</label>
            <Input
              value={formData.state}
              onChange={(e) => onInputChange('state', e.target.value)}
              placeholder="Enter your state"
              className="mt-1"
              disabled={isSaving}
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button 
            onClick={() => onSave('budget')} 
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

export default BudgetSection;