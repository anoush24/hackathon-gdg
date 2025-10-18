import React from 'react';
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { User, X, Save, Loader2 } from "lucide-react";

const ProfileSection = ({ 
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
          <User className="w-5 h-5 text-green-600" />
          Edit Profile
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
          <label className="text-sm font-medium text-gray-700">Full Name</label>
          <Input
            value={formData.name}
            onChange={(e) => onInputChange('name', e.target.value)}
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
            onChange={(e) => onInputChange('email', e.target.value)}
            placeholder="Enter your email"
            className="mt-1"
            disabled={isSaving}
          />
        </div>

        <div className="flex gap-4 pt-4">
          <Button 
            onClick={() => onSave('profile')} 
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

export default ProfileSection;