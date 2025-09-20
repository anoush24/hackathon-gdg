import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Clock, Users, Zap, Sparkles } from "lucide-react";

const MealCard = ({ title, image, category, cookTime, servings, calories, isAiGenerated, onClick }) => {
  return (
    <Card className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105" onClick={onClick}>
      <div className="relative">
        <img src={image} alt={title} className="w-full h-48 object-cover" />
        {isAiGenerated && (
          <Badge className="absolute top-3 right-3 bg-primary/90 text-primary-foreground">
            <Sparkles className="w-3 h-3 mr-1" />
            AI
          </Badge>
        )}
        <Badge variant="secondary" className="absolute top-3 left-3">
          {category}
        </Badge>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-3 line-clamp-2">{title}</h3>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{cookTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{servings}</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="w-4 h-4" />
            <span>{calories} cal</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MealCard;
