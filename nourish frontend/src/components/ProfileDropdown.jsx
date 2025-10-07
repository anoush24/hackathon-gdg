import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronDown, Edit, Settings, LogOut } from "lucide-react";

const ProfileDropdown = ({ 
  user, 
  onNavigateToMealJournal, 
  onNavigateToSettings, 
  onLogout 
}) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleProfileClick = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const handleMealJournal = () => {
    setShowProfileDropdown(false);
    onNavigateToMealJournal();
  };

  const handleSettings = () => {
    setShowProfileDropdown(false);
    onNavigateToSettings();
  };

  const handleLogout = () => {
    setShowProfileDropdown(false);
    onLogout();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        onClick={handleProfileClick}
        variant="ghost"
        className="flex items-center gap-2 hover:bg-primary-foreground/10 text-primary-foreground"
      >
        <div className="w-10 h-10 bg-primary-foreground/20 rounded-full flex items-center justify-center text-primary-foreground font-medium border-2 border-primary-foreground/30">
          {user?.name?.charAt(0).toUpperCase() || "U"}
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium">
            {user?.name || "User"}
          </p>
          <p className="text-xs opacity-75">
            {user?.email || "user@example.com"}
          </p>
        </div>
        <ChevronDown className="w-4 h-4 opacity-75" />
      </Button>

      {showProfileDropdown && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-medium">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {user?.name || "User"}
                </p>
                <p className="text-sm text-gray-500">
                  {user?.email || "user@example.com"}
                </p>
              </div>
            </div>
          </div>

          <div className="px-4 py-3 border-b border-gray-100">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <p className="font-semibold text-primary">
                  ₹{user?.budget || 200}
                </p>
                <p className="text-xs text-gray-500">Weekly Budget</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-green-600">
                  {user?.preferences?.cuisines?.length || 0}
                </p>
                <p className="text-xs text-gray-500">Cuisines</p>
              </div>
            </div>
          </div>

          <div className="py-2">
            <button
              onClick={handleMealJournal}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Meal Journal
            </button>
            <button
              onClick={handleSettings}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Settings className="w-4 h-4" />
              Settings & Preferences
            </button>
            <div className="border-t border-gray-100 my-2"></div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;