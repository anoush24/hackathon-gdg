import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Zap, Sparkles } from "lucide-react";
// Assuming you renamed your pattern file to heroBg.png
import HeroBackgroundPattern from '../../assets/heroBg.png'; 

const MealCard = ({
  title,
  image,
  category,
  cookTime,
  servings,
  calories,
  isAiGenerated = false,
  onClick,           // This should open MealDetailModal
  onRecipeClick,     // This should open RecipeCard
  isCompleted,
  onToggleComplete
}) => {
  return (
    <Card
      className="food-card cursor-pointer overflow-hidden rounded-2xl border-2 border-green-700
 shadow-lg bg-white/50 relative transition-all duration-300
             hover:scale-[1.02] 

            hover:ring-2 
            hover:ring-green-300
            
            /* OUTER GLOW */
            hover:shadow-2xl 
            hover:shadow-green-500/50 "
    >
      <div className="absolute inset-0 z-0 pointer-events-none"
            style={{
            backgroundImage: `url(${HeroBackgroundPattern})`,
            backgroundRepeat: 'repeat', 
            opacity: 0.8, 
            }}
      >
      </div> 
      <div className="relative z-10">
        <div className="px-10 py-10 p-10 rounded-2xl mb-4">
     <div className="relative">
          <img
            src={image}
            alt={title}
            className="w-full rounded h-72 object-cover"
            onClick={onClick}
          />
          {isAiGenerated && (
            <Badge className="absolute top-3 left-3 bg-gradient-primary text-primary-foreground border-0">
              <Sparkles className="w-3 h-3 mr-1" />
              AI-Generated
            </Badge>
          )}<div className="absolute bottom left-1/2 -translate-x-1/2 translate-y-full z-20">
            <Badge variant="secondary" className="bg-card/90 text-card-foreground font-bold border border-orange-500">
              {category}
            </Badge>
          </div>
        </div>
      </div>
        <div className="p-4 items-center text-center">
          <h3
            className="font-bold text-lg text-foreground mb-2 line-clamp-2 cursor-pointer hover:text-orange-500 transition-colors"
            onClick={onRecipeClick}
          >
            {title}
          </h3>
        
          <div className="flex items-center justify-center text-sm text-warm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
               | <Clock className="w-4 h-4" />
                <span>{cookTime} |</span>
              </div>
              <div className="flex items-center gap-1">
                 <Users className="w-4 h-4" />
                <span>{servings}</span>
              </div>
              
                <span 
                className="flex items-center gap-1">
               | <Zap className="w-4 h-4" />
              <span>{calories} cal  |</span>
         </span> </div>
            </div>

            

{/* ⭐ NEW: Full-width container for the Mark as Eaten button (Pushing the calorie pill out) ⭐ */}
<div className="relative flex justify-center w-full my-4"> 
    
    {/* ⭐ Mark as Eaten Element (Centered Pill) ⭐ */}
    <label htmlFor={`meal-${title}`} 
        className={`
            flex items-center cursor-pointer w-full  
            px-6 py-2 rounded-full  font-semibold shadow-md 
            transition-all duration-300 justify-center border border-green-700
            ${isCompleted 
                ? 'bg-green-700 text-white hover:bg-green-800' 
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }
        `}
    >
        {/* Text */}
        <span className="text-sm  font-medium mr-2 select-none">
            {isCompleted ? 'Eaten!' : 'Mark as Eaten'}
        </span>
        
        {/* Checkbox and Icon Visuals (Your existing code, slightly modified for the pill look) */}
        <div className="relative">
            <input
                id={`meal-${title}`}
                type="checkbox"
                checked={isCompleted}
                onChange={onToggleComplete}
                className="sr-only peer"
            />
            {/* Visual Box (Styled for White/Green contrast) */}
            <div className="
                w-5 h-5 
                rounded-full 
                border-2 transition-colors 
                bg-white border-white                 /* White background for the circle */
                peer-checked:bg-white peer-checked:border-white
            "></div>
            {/* Checkmark */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden peer-checked:block">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="green" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            </div>
        </div>
    </label>
    </div>
    
</div>
  
        
      </div>
    </Card>
  );
};

export default MealCard;