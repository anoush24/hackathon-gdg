import React from "react";
import { Sparkles, MapPin } from "lucide-react";
import ProfileDropdown from "../dashboard/ProfileDropdown";

const DashboardHeader = ({ 
  user, 
  onNavigateToMealJournal, 
  onNavigateToSettings, 
  onLogout 
}) => {
  return (
    <div className="bg-gradient-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-6 h-6" />
              <span className="text-sm font-medium opacity-90">
                Nourish AI
              </span>
            </div>
            <h1 className="heading-hero text-primary-foreground">
              Your Daily Dish
            </h1>
            <p className="text-lg opacity-90 mt-2">
              Personalized meals crafted just for you
            </p>
          </div>

          <div className="flex items-center gap-6">
            {/* Date Display */}
            <div className="text-right">
              <div className="text-sm opacity-90">Today</div>
              <div className="text-2xl font-bold">
                {new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </div>

            {/* Quick Info */}
            <div className="hidden md:flex flex-col items-center gap-1 text-sm opacity-90 border-l border-primary-foreground/20 pl-4">
              <div className="flex items-center gap-1">
                <span>₹{user?.budget || 75}/week</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{user?.location?.city || "City"}</span>
              </div>
            </div>

            <ProfileDropdown 
              user={user}
              onNavigateToMealJournal={onNavigateToMealJournal}
              onNavigateToSettings={onNavigateToSettings}
              onLogout={onLogout}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;