import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Clock, Users, X, Loader2 } from "lucide-react";

const RecipeCard = ({ isOpen, onClose, onGenerateGroceryList, recipe }) => {
  const [ingredients, setIngredients] = useState(recipe.ingredients);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleIngredientToggle = (ingredientId) => {
    setIngredients(prev =>
      prev.map(ingredient =>
        ingredient.id === ingredientId
          ? { ...ingredient, selected: !ingredient.selected }
          : ingredient
      )
    );
  };

  const handleGenerateGroceryList = async () => {
    setIsGenerating(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const selectedIngredients = ingredients.filter(ingredient => ingredient.selected);
    onGenerateGroceryList(selectedIngredients);
    setIsGenerating(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden bg-background border-0 shadow-elegant">
        <div className="relative">
          {/* Hero Image */}
          <div className="relative h-80 w-full overflow-hidden">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 bg-background/80 hover:bg-background/90 text-foreground"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="absolute top-4 left-4">
              <Badge className="bg-gradient-primary text-primary-foreground border-0">
                {recipe.category}
              </Badge>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-320px)]">
            <DialogHeader className="mb-6">
              <h1 className="text-3xl font-bold text-foreground mb-2">{recipe.title}</h1>
              <p className="text-muted-foreground text-lg mb-4">{recipe.description}</p>

              {/* Recipe Stats */}
              <div className="flex items-center gap-6 text-sm text-warm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Prep: {recipe.prepTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Cook: {recipe.cookTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>Serves {recipe.servings}</span>
                </div>
                <div className="text-primary font-medium">
                  {recipe.calories} cal/serving
                </div>
              </div>
            </DialogHeader>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Ingredients */}
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">Ingredients</h2>
                <div className="space-y-3">
                  {ingredients.map((ingredient) => (
                    <div key={ingredient.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-accent/50 transition-colors">
                      <Checkbox
                        id={ingredient.id}
                        checked={ingredient.selected}
                        onCheckedChange={() => handleIngredientToggle(ingredient.id)}
                        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <label
                        htmlFor={ingredient.id}
                        className="flex-1 text-sm cursor-pointer"
                      >
                        <span className="font-medium text-primary">{ingredient.amount}</span>
                        <span className="ml-2 text-foreground">{ingredient.name}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">Instructions</h2>
                <div className="space-y-4">
                  {recipe.instructions.map((instruction, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <p className="text-sm text-foreground leading-relaxed">{instruction}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Generate Grocery List Button */}
            <div className="mt-8 pt-6 border-t border-border">
              <Button
                onClick={handleGenerateGroceryList}
                disabled={isGenerating || ingredients.filter(i => i.selected).length === 0}
                className="w-full h-12 bg-gradient-primary hover:opacity-90 text-primary-foreground font-medium text-lg transition-all duration-300"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating Your Smart List...
                  </>
                ) : (
                  `Generate Grocery List (${ingredients.filter(i => i.selected).length} items)`
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeCard;