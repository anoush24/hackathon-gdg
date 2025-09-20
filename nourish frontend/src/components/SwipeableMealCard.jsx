import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Shuffle, ChevronLeft, ChevronRight, X, Heart } from "lucide-react";

const SwipeableMealCard = ({ 
  meal, 
  alternatives, 
  onSwap, 
  mealType, 
  activeFilters 
}) => {
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [currentAlternativeIndex, setCurrentAlternativeIndex] = useState(0);
  const [swipeAnimation, setSwipeAnimation] = useState(null);
  const filteredAlternatives = alternatives.filter(alt => {
    if (activeFilters.length === 0) return true;
    return activeFilters.every(filter => {
      switch (filter) {
        case 'vegetarian':
          return alt.isVegetarian;
        case 'quick':
          return parseInt(alt.cookTime) <= 15;
        case 'spicy':
          return alt.spiceLevel && alt.spiceLevel !== 'mild';
        case 'mediterranean':
          return alt.cuisine === 'mediterranean';
        case 'modern':
          return alt.cuisine === 'modern';
        default:
          return true;
      }
    });
  });

  const handleSwipeLeft = () => {
    setSwipeAnimation('left');
    setTimeout(() => {
      setCurrentAlternativeIndex((prev) => 
        prev < filteredAlternatives.length - 1 ? prev + 1 : 0
      );
      setSwipeAnimation(null);
    }, 200);
  };

  const handleSwipeRight = () => {
    const currentAlternative = filteredAlternatives[currentAlternativeIndex];
    setSwipeAnimation('right');
    setTimeout(() => {
      onSwap(currentAlternative);
      setShowAlternatives(false);
      setSwipeAnimation(null);
    }, 200);
  };

  const currentAlternative = filteredAlternatives[currentAlternativeIndex];

  if (showAlternatives && filteredAlternatives.length > 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold capitalize text-foreground">
            Alternative {mealType}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAlternatives(false)}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
            Close
          </Button>
        </div>
        
        <div className="relative">
          <Card className={`overflow-hidden border-0 shadow-card transition-transform duration-200 ${
            swipeAnimation === 'left' ? '-translate-x-4 opacity-75' : 
            swipeAnimation === 'right' ? 'translate-x-4 opacity-75 scale-105' : ''
          }`}>
            <div className="relative">
              <img 
                src={currentAlternative.image} 
                alt={currentAlternative.title}
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end">
                <div className="p-4 w-full text-white">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="flex items-center gap-2 text-sm opacity-75">
                      <ChevronLeft className="h-4 w-4" />
                      <span>Swipe left to skip</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm opacity-75">
                      <span>Swipe right to select</span>
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>
              {currentAlternative.isAiGenerated && (
                <Badge className="absolute top-3 left-3 bg-gradient-primary text-primary-foreground border-0">
                  AI-Generated
                </Badge>
              )}
              <div className="absolute top-3 right-3">
                <Badge variant="secondary" className="bg-card/90 text-card-foreground border-0">
                  {currentAlternative.category}
                </Badge>
              </div>
            </div>
            
            <div className="p-4">
              <h4 className="font-semibold text-lg text-foreground mb-2">
                {currentAlternative.title}
              </h4>
              <div className="flex items-center justify-between text-sm text-warm">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{currentAlternative.cookTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{currentAlternative.servings}</span>
                  </div>
                </div>
                <div className="text-primary font-medium">
                  {currentAlternative.calories} cal
                </div>
              </div>
            </div>
          </Card>
          <div className="flex justify-center gap-4 mt-4">
            <Button
              size="lg"
              variant="outline"
              onClick={handleSwipeLeft}
              className="flex-1 max-w-32 h-12 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              <X className="h-5 w-5" />
            </Button>
            <Button
              size="lg"
              onClick={handleSwipeRight}
              className="flex-1 max-w-32 h-12 bg-gradient-primary text-primary-foreground hover:shadow-glow"
            >
              <Heart className="h-5 w-5" />
            </Button>
          </div>
          <div className="text-center mt-2 text-sm text-muted-foreground">
            {currentAlternativeIndex + 1} of {filteredAlternatives.length}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold capitalize text-foreground">
          {mealType}
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAlternatives(true)}
          className="gap-2 text-primary border-primary hover:bg-primary hover:text-primary-foreground"
          disabled={filteredAlternatives.length === 0}
        >
          <Shuffle className="h-4 w-4" />
          Swap
        </Button>
      </div>
      <Card className="food-card overflow-hidden border-0 shadow-card bg-card">
        <div className="relative">
          <img 
            src={meal.image} 
            alt={meal.title}
            className="w-full h-48 object-cover"
          />
          {meal.isAiGenerated && (
            <Badge className="absolute top-3 left-3 bg-gradient-primary text-primary-foreground border-0">
              AI-Generated
            </Badge>
          )}
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-card/90 text-card-foreground border-0">
              {meal.category}
            </Badge>
          </div>
        </div>
        <div className="p-4">
          <h4 className="font-semibold text-lg text-foreground mb-2 line-clamp-2">
            {meal.title}
          </h4>
          <div className="flex items-center justify-between text-sm text-warm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{meal.cookTime}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{meal.servings}</span>
              </div>
            </div>
            <div className="text-primary font-medium">
              {meal.calories} cal
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SwipeableMealCard;