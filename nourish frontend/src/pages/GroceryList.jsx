import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, ShoppingCart, Sparkles, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const GroceryList = ({ ingredients, onBack }) => {
  const [checkedItems, setCheckedItems] = useState(new Set());
  const { toast } = useToast();

  // Categorize ingredients
  const categorizedIngredients = ingredients.reduce((acc, ingredient) => {
    const category = ingredient.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(ingredient);
    return acc;
  }, {});

  const handleItemToggle = (itemId) => {
    setCheckedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handleFinalizeOrder = () => {
    toast({
      title: "Shopping list ready!",
      description: "Your smart grocery list has been prepared. Time to shop!",
    });
  };

  const totalItems = ingredients.length;
  const checkedItemsCount = checkedItems.size;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Recipe
          </Button>
          
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">AI-Generated</span>
          </div>
        </div>

        {/* Title Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <ShoppingCart className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Your Smart Shopping List</h1>
          </div>
          <p className="text-muted-foreground">
            Organized by category • {totalItems} items total
          </p>
          
          {checkedItemsCount > 0 && (
            <div className="mt-4">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                <Check className="w-3 h-3 mr-1" />
                {checkedItemsCount} of {totalItems} items checked
              </Badge>
            </div>
          )}
        </div>

        {/* Grocery Categories */}
        <div className="space-y-6 mb-8">
          {Object.entries(categorizedIngredients).map(([category, items]) => (
            <Card key={category} className="shadow-card border-0 bg-card">
              <CardHeader className="pb-3">
                <h2 className="text-xl font-semibold text-foreground flex items-center justify-between">
                  {category}
                  <Badge variant="outline" className="ml-2">
                    {items.length} items
                  </Badge>
                </h2>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {items.map((ingredient) => (
                    <div 
                      key={ingredient.id} 
                      className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                        checkedItems.has(ingredient.id) 
                          ? 'bg-primary/5 opacity-60' 
                          : 'hover:bg-accent/50'
                      }`}
                    >
                      <Checkbox
                        id={ingredient.id}
                        checked={checkedItems.has(ingredient.id)}
                        onCheckedChange={() => handleItemToggle(ingredient.id)}
                        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <label 
                        htmlFor={ingredient.id}
                        className={`flex-1 cursor-pointer ${
                          checkedItems.has(ingredient.id) 
                            ? 'line-through text-muted-foreground' 
                            : 'text-foreground'
                        }`}
                      >
                        <span className="font-medium text-primary mr-2">{ingredient.amount}</span>
                        <span>{ingredient.name}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Button */}
        <div className="text-center">
          <Button
            onClick={handleFinalizeOrder}
            className="w-full max-w-md h-12 bg-gradient-primary hover:opacity-90 text-primary-foreground font-medium text-lg transition-all duration-300"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Finalize Shopping List
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            Ready to shop? Your smart list is organized for efficient shopping!
          </p>
        </div>
      </div>
    </div>
  );
};

export default GroceryList;