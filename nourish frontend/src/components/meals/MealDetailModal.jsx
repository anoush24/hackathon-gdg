import React from 'react';
import { X, Clock, Flame, Dumbbell, Cookie, Droplet, ExternalLink, PlayCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const MealDetailModal = ({ meal, mealType, day, onClose, onViewRecipe }) => {
  if (!meal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-start z-10">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{meal.title}</h2>
              <p className="text-sm text-gray-600 mt-1">
                {day} • {mealType || meal.category}
              </p>
            </div>
            {meal.isAiGenerated && (
              <Badge className="bg-gradient-primary text-primary-foreground border-0">
                <Sparkles className="w-3 h-3 mr-1" />
                AI-Generated
              </Badge>
            )}
          </div>
          <Button 
            onClick={onClose} 
            variant="ghost" 
            size="sm"
            className="rounded-full p-2"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Image */}
        {meal.image && (
          <div className="w-full h-64 overflow-hidden">
            <img 
              src={meal.image} 
              alt={meal.title}
              className="w-full h-full object-cover"
              onError={(e) => { 
                e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'; 
              }}
            />
          </div>
        )}

        <div className="p-6 space-y-6">
          {/* Nutrition Info */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              Nutritional Information
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center">
                <Flame className="w-6 h-6 text-orange-500 mx-auto mb-1" />
                <p className="text-2xl font-bold text-orange-700">{meal.calories}</p>
                <p className="text-xs text-gray-600">Calories</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                <Dumbbell className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                <p className="text-2xl font-bold text-blue-700">{meal.protein}g</p>
                <p className="text-xs text-gray-600">Protein</p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
                <Cookie className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
                <p className="text-2xl font-bold text-yellow-700">{meal.carbs}g</p>
                <p className="text-xs text-gray-600">Carbs</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                <Droplet className="w-6 h-6 text-green-500 mx-auto mb-1" />
                <p className="text-2xl font-bold text-green-700">{meal.fat}g</p>
                <p className="text-xs text-gray-600">Fat</p>
              </div>
            </div>
          </div>

          {/* Cook Time and Servings */}
          <div className="grid grid-cols-2 gap-4">
            {meal.cookTime && (
              <div className="flex items-center gap-2 text-gray-600 bg-gray-50 rounded-lg p-3">
                <Clock className="w-5 h-5" />
                <div>
                  <span className="font-medium">Cook Time:</span>
                  <p className="text-sm">{meal.cookTime}</p>
                </div>
              </div>
            )}
            {meal.servings && (
              <div className="flex items-center gap-2 text-gray-600 bg-gray-50 rounded-lg p-3">
                <Dumbbell className="w-5 h-5" />
                <div>
                  <span className="font-medium">Servings:</span>
                  <p className="text-sm">{meal.servings}</p>
                </div>
              </div>
            )}
          </div>

          {/* Ingredients */}
          {meal.ingredients && meal.ingredients.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                📋 Ingredients
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <ul className="space-y-2">
                  {meal.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span className="text-gray-700">{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* YouTube Link */}
          {meal.youtubeLink && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <PlayCircle className="w-5 h-5 text-red-500" />
                Video Tutorial
              </h3>
              <a
                href={meal.youtubeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 hover:bg-red-100 transition-colors group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-red-500 text-white p-2 rounded-lg">
                        <PlayCircle className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Watch Recipe Video</p>
                        <p className="text-sm text-gray-600">Step-by-step cooking instructions</p>
                      </div>
                    </div>
                    <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
                  </div>
                </div>
              </a>
            </div>
          )}

          {/* Meal Status */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Meal Status</h3>
                <p className="text-sm text-gray-600">
                  {meal.isCompleted ? 'You have completed this meal!' : 'Mark as completed when finished'}
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                meal.isCompleted 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {meal.isCompleted ? 'Completed ✅' : 'Pending ⏳'}
              </div>
            </div>
          </div>

          {/* Macros Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
            <h4 className="font-semibold text-gray-900 mb-2">Macro Breakdown</h4>
            <div className="flex gap-4 text-sm">
              <div>
                <span className="text-gray-600">Protein:</span>
                <span className="font-semibold ml-1">{Math.round((meal.protein * 4 / meal.calories) * 100)}%</span>
              </div>
              <div>
                <span className="text-gray-600">Carbs:</span>
                <span className="font-semibold ml-1">{Math.round((meal.carbs * 4 / meal.calories) * 100)}%</span>
              </div>
              <div>
                <span className="text-gray-600">Fat:</span>
                <span className="font-semibold ml-1">{Math.round((meal.fat * 9 / meal.calories) * 100)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t p-4 flex justify-between">
          <Button 
            onClick={() => onViewRecipe && onViewRecipe(meal)} 
            variant="outline"
            className="flex items-center gap-2"
          >
            <PlayCircle className="w-4 h-4" />
            View Recipe & Generate Grocery List
          </Button>
          <Button onClick={onClose} variant="default">
            Close
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default MealDetailModal;