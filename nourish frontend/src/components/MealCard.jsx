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
  onRecipeClick
}) => {
  return (
    <Card
      className="food-card cursor-pointer overflow-hidden border-0 shadow-card bg-card transition-all duration-300 hover:shadow-lg hover:scale-105"
      onClick={onClick}
    >
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover"
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