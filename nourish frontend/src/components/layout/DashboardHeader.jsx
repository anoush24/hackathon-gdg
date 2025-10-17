import React from "react";
import { Sparkles, MapPin, Calendar, IndianRupee } from "lucide-react";
import ProfileDropdown from "../dashboard/ProfileDropdown";

const DashboardHeader = ({ 
  user, 
  onNavigateToMealJournal, 
  onNavigateToSettings, 
  onLogout 
}) => {
  return (
    <header className="text-black shadow-lg border-b border-primary-foreground/10 sticky top-0 z-50 bg-white ">
      <div className="container mx-auto px-6 ">
        <div className="flex space-between items-center justify-between h-16">
          {/* Left Section - Brand */}
          <div className="flex items-center gap-6">
            {/* Brand Logo */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-foreground/15 rounded-xl backdrop-blur-sm">
                <Sparkles className="w-5 h-5 text-green-800" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl text-green-800 font-bold tracking-tight">
                  Nourish
                </span>
                <span className="text-xs font-semibold px-2 py-1 bg-primary-foreground/20 rounded-full uppercase tracking-wider">
                  AI
                </span>
              </div>
            </div>

          </div>

          <div className="hidden lg:flex items-center gap-2">
              {/* Date */}
              <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-primary-foreground/15">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 opacity-75" />
                  <div className="text-right">
                    <div className="text-xs opacity-75 font-medium">Today</div>
                    <div className="text-sm font-bold">
                      {new Date().toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Budget */}
              <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-primary-foreground/15">
                <div className="flex items-center gap-2">
                  <IndianRupee className="w-4 h-4 opacity-75" />
                  <div>
                    <div className="text-xs opacity-75 font-medium">Budget</div>
                    <div className="text-sm font-bold">
                      ₹{user?.budget || 75}/week
                    </div>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-primary-foreground/15">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 opacity-75" />
                  <div>
                    <div className="text-xs opacity-75 font-medium">Location</div>
                    <div className="text-sm font-bold">
                      {user?.location?.city || "Mumbai"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          {/* Right Section - Info & Profile */}
          <div className="flex items-center gap-3">
            {/* Quick Info Cards - Desktop */}
            

            {/* Mobile Quick Info */}
            <div className="lg:hidden bg-primary-foreground/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-primary-foreground/15">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 opacity-75" />
                <div className="text-center">
                  <div className="text-xs opacity-75 font-medium">Today</div>
                  <div className="text-sm font-bold">
                    {new Date().toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Separator */}
            <div className="w-px h-8 bg-primary-foreground/20"></div>

            {/* Profile Dropdown */}
            <ProfileDropdown 
              user={user}
              onNavigateToMealJournal={onNavigateToMealJournal}
              onNavigateToSettings={onNavigateToSettings}
              onLogout={onLogout}
            />
          </div>
        </div>

        {/* Mobile/Tablet Title Bar */}
        <div className="xl:hidden pb-3 border-t border-primary-foreground/15">
          <div className="pt-3">
            <h1 className="text-lg font-semibold mb-1">
              Your Daily Dish
            </h1>
            <p className="text-sm opacity-75 font-medium">
              Personalized meals crafted just for you
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;