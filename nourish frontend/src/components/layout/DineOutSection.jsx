import React from 'react';
import { ChefHat, Loader2, Sparkles } from 'lucide-react';

const DineOutSection = ({ id, onFindRestaurants, isLoading }) => {
  return (
    <div id={id} className="mb-8 scroll-mt-24">
      <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl shadow-lg p-8 border border-orange-200">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-orange-500 rounded-xl shadow-md">
            <ChefHat className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Dine Out Options</h2>
            <p className="text-gray-600">Restaurants that match your dietary preferences</p>
          </div>
        </div>

        {/* Content with Button */}
        <div className="bg-white rounded-xl p-8 border border-orange-200 shadow-sm">
          <div className="flex items-center justify-center flex-col gap-6 py-8">
            <Sparkles className="w-20 h-20 text-orange-400" />
            <div className="text-center max-w-md">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Ready to Explore?
              </h3>
              <p className="text-gray-600 mb-6">
                Discover amazing restaurants near you that match your meal preferences and dietary goals!
              </p>
              
              {/* Dine Out Button */}
              <button
                onClick={onFindRestaurants}
                disabled={isLoading}
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-3 mx-auto"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span className="text-lg">Finding Best Spots...</span>
                  </>
                ) : (
                  <>
                    <ChefHat className="w-6 h-6" />
                    <span className="text-lg">Find Restaurants Now</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DineOutSection;
