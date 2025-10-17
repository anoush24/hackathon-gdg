import React from 'react';
import { UtensilsCrossed, ChefHat } from 'lucide-react';
import HeroBackground from '../../assets/herobgveg5.png';

const WelcomeSection = ({ user, weekInfo, onScrollToMeals, scrollToDineOut  }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Morning";
    if (hour < 17) return "Afternoon";
    return "Evening";
  };

  return (
   <div className="mb-12 relative h-[700px] bg-white/10">
      <div 
            className="absolute inset-0 z-0 pointer-events-none" 
            style={{
                backgroundImage: `url(${HeroBackground})`,
                backgroundRepeat: 'repeat', 
                opacity: 1, // Adjust this value (0.05 to 0.2 works well) for faintness
                
            }}
        />



      <div className="flex items-center justify-between gap-8 max-w-8xl mx-auto relative z-10">
        {/* Left Side - Bowl Image */}
        <div className="flex-shrink-0  w-1/3">
          <img
            src="/main_keto_bowl2.png"
            alt="Fresh salad bowl"
            className="w-full h-full ml-20 mb-1 mt-10 object-contain max-w-md drop-shadow-2xl animate-float"
          />
        </div>

        {/* Right Side - Welcome Text & Buttons */}
        <div className="flex-1">
          <h2 className="text-4xl font-nunito font-bold text-gray-900 mb-2">
            Good {getGreeting()}, {user?.name || "Chef"}! 👋
          </h2>
          <h3 className="text-5xl font-nunito font-extrabold text-green-700 mb-6 tracking-tight">
            YOUR FOOD IS WAITING FOR YOU
          </h3>

          {/* Action Buttons */}
          <div className="flex gap-4">
            {/* Meal Plan Button */}
            <button
              onClick={onScrollToMeals}
              className="flex items-center gap-3 px-6 py-4 bg-white border-2 border-green-500 text-green-700 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 hover:bg-green-50 transition-all duration-300 font-semibold group"
            >
              <UtensilsCrossed className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              <div className="text-left">
                <div className="text-lg font-bold">Today's Feast</div>
                <div className="text-sm opacity-90">Let's cook something amazing</div>
              </div>
            </button>

            {/* Dine Out Button */}
            <button
              onClick={scrollToDineOut}
              className="flex items-center gap-3 px-6 py-4 bg-white border-2 border-green-500 text-green-700 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 hover:bg-green-50 transition-all duration-300 font-semibold group"
            >
              <ChefHat className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              <div className="text-left">
                <div className="text-lg font-bold">Dine Out Tonight?</div>
                <div className="text-sm opacity-80">Find perfect spots nearby</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;
