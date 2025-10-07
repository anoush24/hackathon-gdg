import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Zap, Sparkles } from "lucide-react";

const MealCard = ({
  title,
  image,
  category,
  cookTime,
  servings,
  calories,
  isAiGenerated = false,
  onClick,
  onRecipeClick,
  isCompleted,
  onToggleComplete
}) => {
  return (
    <Card
      className="food-card cursor-pointer overflow-hidden border-0 shadow-card bg-card transition-all duration-300 hover:shadow-lg hover:scale-105"
      
    >
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover"
          onClick={onClick}
        />
        {isAiGenerated && (
          <Badge className="absolute top-3 left-3 bg-gradient-primary text-primary-foreground border-0">
            <Sparkles className="w-3 h-3 mr-1" />
            AI-Generated
          </Badge>
        )}
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-card/90 text-card-foreground border-0">
            {category}
          </Badge>
        </div>
      </div>

      {/* <div className="absolute bottom-3 right-3 flex items-center bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-md z-10 transition-opacity opacity-0 group-hover:opacity-100">
            <label htmlFor={`meal-${title}`} className="text-sm font-medium text-gray-700 mr-2 select-none">Eaten</label>
            <input
              id={`meal-${title}`}
              type="checkbox"
              checked={isCompleted}
              onChange={onToggleComplete}
              className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
            />
        </div> */}
      
      <div className="p-4">
        <h3
          className="font-semibold text-lg text-foreground mb-2 line-clamp-2 cursor-pointer hover:text-primary transition-colors"
          onClick={onRecipeClick}
        >
          {title}
        </h3>
        
        <div className="flex items-center justify-between text-sm text-warm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{cookTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{servings}</span>
            </div>
          </div>

          {/* <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isCompleted}
              onChange={onToggleComplete}
              onClick={(e) => e.stopPropagation()} // Prevents the card's main onClick from firing
              className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
            />
            <div className="text-primary font-medium flex items-center gap-1">
            </div>
          </div> */}

        {/* REPLACE IT WITH THIS CODE BLOCK */}
<div className="flex items-center">
  <label htmlFor={`meal-${title}`} className="flex items-center cursor-pointer">
    <span className="text-sm font-medium text-gray-700 mr-2 select-none">
      Mark as Eaten
    </span>
    <div className="relative">
      {/* The hidden, functional checkbox */}
      <input
        id={`meal-${title}`}
        type="checkbox"
        checked={isCompleted}
        onChange={onToggleComplete}
        className="sr-only peer"
      />
      {/* The custom-styled checkbox box */}
      <div className="w-5 h-5 bg-white border-2 border-gray-300 rounded peer-checked:bg-green-600 peer-checked:border-green-600 transition-colors"></div>
      {/* The checkmark icon */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden peer-checked:block">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
    </div>
  </label>
</div>




          <div className="text-primary font-medium flex items-center gap-1">
            <Zap className="w-4 h-4" />
            <span>{calories} cal</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MealCard;